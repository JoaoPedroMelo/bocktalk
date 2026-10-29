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
    delete process.env.GROQ_API_KEY;
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

  it('falls back to the bank when the AI fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('rate limited', { status: 429 })));
    const { POST } = await import('../match');
    const data = (await (await POST(post({ topic: 'hotel', exclude: [] }))).json()) as MatchResponse;
    expect(data.questions).toHaveLength(10);
  });
});
