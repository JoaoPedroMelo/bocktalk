import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckResult, MatchResponse } from './types';

function chatResponse(content: unknown): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(content) } }] }), { status: 200 });
}

const generated = {
  questions: [
    { topic: 'clima', type: 'choice', instruction: 'Escolha a alternativa correta', prompt: 'It ___ snowing in Denver right now.', options: ['is', 'are', 'was', 'be'], answer: 'is', explanation: 'It + is + -ing.' },
    { topic: 'clima', type: 'writing', instruction: 'Traduza para o inglês', prompt: 'Está ventando muito hoje.', answer: 'It is very windy today.', accepted: ['It’s really windy today.'], explanation: 'Windy = com vento.' },
    // Invalid: the answer is not one of the options, so it must be discarded.
    { topic: 'clima', type: 'choice', instruction: 'Escolha', prompt: 'Broken question', options: ['a', 'b', 'c', 'd'], answer: 'e', explanation: 'x' },
  ],
};

const post = (body: unknown) => new Request('http://local/api', { method: 'POST', body: JSON.stringify(body) });

describe('AI path (mocked Groq)', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.DATABASE_URL;
    delete process.env.GEMINI_API_KEY;
    process.env.GROQ_API_KEY = 'test-key';
    process.env.NEW_QUESTIONS_PER_MATCH = '4';
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    delete process.env.GROQ_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  it('generates, validates and stores new questions when the bank runs short', async () => {
    const fetchMock = vi.fn(async () => chatResponse(generated));
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await import('../match');
    // Exclude every starter question of the topic, forcing synchronous generation.
    const { getStore } = await import('./db');
    const all = await getStore().pick(['clima'], 500, []);
    const data = (await (await POST(post({ topic: 'clima', exclude: all.map((q) => q.id) }))).json()) as MatchResponse;

    expect(fetchMock).toHaveBeenCalled();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(JSON.parse(String(init.body)).messages[1].content).toContain('Clima');
    expect(data.stats.fromAi).toBe(2);
    expect(data.questions).toHaveLength(10);
    expect(data.questions.filter((q) => q.source === 'ai').map((q) => q.prompt)).toEqual(
      expect.arrayContaining(['It ___ snowing in Denver right now.', 'Está ventando muito hoje.']),
    );
    expect(data.questions.some((q) => q.prompt === 'Broken question')).toBe(false);
  });

  it('uses AI grading for unknown variants and learns accepted answers', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => chatResponse({ correct: true, corrected: 'I adore sunny days!', explanation: 'Correto: adore também funciona.' })));
    const { getStore } = await import('./db');
    const { POST: check } = await import('../check');
    const q = (await getStore().pick(['clima'], 500, [])).find((x) => x.prompt === 'Eu adoro dias ensolarados!')!;

    const first = (await (await check(post({ questionId: q.id, answer: 'I adore sunny days!' }))).json()) as CheckResult;
    expect(first).toMatchObject({ correct: true, gradedBy: 'ai' });
    expect((await getStore().get(q.id))!.accepted).toContain('I adore sunny days!');

    const second = (await (await check(post({ questionId: q.id, answer: 'i adore sunny days' }))).json()) as CheckResult;
    expect(second.gradedBy).toBe('exact');
  });

  it('pauses a provider after a 429 for the time it asks, then calls it again', async () => {
    const limited = vi.fn(async () => new Response('{"error":"rate limited"}', { status: 429, headers: { 'retry-after': '120' } }));
    vi.stubGlobal('fetch', limited);
    const { POST } = await import('../match');
    const { GET: status } = await import('../status');
    const { getStore } = await import('./db');
    const excludeAll = async (topic: string) => (await getStore().pick([topic], 500, [])).map((q) => q.id);

    // Bank exhausted on purpose, so the match has to ask the AI right away.
    const first = (await (await POST(post({ topic: 'clima', exclude: await excludeAll('clima') }))).json()) as MatchResponse;
    expect(limited).toHaveBeenCalledTimes(1);
    expect(first.questions).toHaveLength(10);

    const s = (await (await status()).json()) as { ai: { provider: string; pausedUntil?: string }[] };
    const until = Date.parse(s.ai[0].pausedUntil!);
    expect(until - Date.now()).toBeGreaterThan(110_000);
    expect(until - Date.now()).toBeLessThanOrEqual(120_000);

    // While paused: no request at all, and the match still comes back complete.
    const second = (await (await POST(post({ topic: 'hotel', exclude: await excludeAll('hotel') }))).json()) as MatchResponse;
    expect(limited).toHaveBeenCalledTimes(1);
    expect(second.questions).toHaveLength(10);
    expect(second.stats.aiError).toBeUndefined();

    // Once the pause is over the provider is tried again.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(until + 1000);
    const ok = vi.fn(async () => chatResponse(generated));
    vi.stubGlobal('fetch', ok);
    await POST(post({ topic: 'clima', exclude: await excludeAll('clima') }));
    expect(ok).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('keeps using Gemini while Groq is paused, and skips AI grading when every provider is paused', async () => {
    process.env.GEMINI_API_KEY = 'gemini-key';
    const fetchMock = vi.fn(async (url: string) =>
      url.includes('groq') ? new Response('limit', { status: 429 }) : chatResponse(generated),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await import('../match');
    const { POST: check } = await import('../check');
    const { getStore } = await import('./db');
    const excludeAll = async (topic: string) => (await getStore().pick([topic], 500, [])).map((q) => q.id);

    await POST(post({ topic: 'clima', exclude: await excludeAll('clima') }));
    expect(fetchMock.mock.calls.map(([url]) => (String(url).includes('groq') ? 'groq' : 'gemini'))).toEqual(['groq', 'gemini']);
    fetchMock.mockClear();
    await POST(post({ topic: 'hotel', exclude: await excludeAll('hotel') }));
    expect(fetchMock.mock.calls.map(([url]) => (String(url).includes('groq') ? 'groq' : 'gemini'))).toEqual(['gemini']);

    // Gemini hits its limit too (no Retry-After: default pause); grading then compares with the bank only.
    await getStore().pauseAi('gemini', Date.now() + 60_000);
    fetchMock.mockClear();
    const q = (await getStore().pick(['clima'], 500, [])).find((x) => x.type === 'writing')!;
    const r = (await (await check(post({ questionId: q.id, answer: 'something unexpected here' }))).json()) as CheckResult;
    expect(fetchMock).not.toHaveBeenCalled();
    expect(r.gradedBy).toBe('fallback');
  });

  it('falls back to the bank when the AI fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('rate limited', { status: 429 })));
    const { POST } = await import('../match');
    const data = (await (await POST(post({ topic: 'hotel', exclude: [] }))).json()) as MatchResponse;
    expect(data.questions).toHaveLength(10);
  });
});
