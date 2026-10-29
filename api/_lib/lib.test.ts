import { beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizeAnswer, normalizeOption, matchesAccepted } from './normalize';
import { SEED_QUESTIONS } from './seed';
import { KNOWLEDGE } from './knowledge';
import { IRREGULAR_TOPIC, MIXED_TOPIC, TOPICS, TOPIC_IDS } from './topics';
import { proceduralQuestions } from './procedural';
import type { CheckResult, MatchResponse } from './types';

describe('normalizeAnswer', () => {
  it('ignores case, punctuation, accents and contractions', () => {
    expect(normalizeAnswer("I'm fine, thanks. And you?")).toBe(normalizeAnswer('i am fine thanks and you'));
    expect(normalizeAnswer('She doesn’t work.')).toBe('she does not work');
    expect(normalizeAnswer('I won’t go by bus')).toBe('i will not go by bus');
    expect(normalizeAnswer('Mr. Jones will drive to Florianópolis')).toBe(normalizeAnswer('mr jones will drive to florianopolis'));
    expect(normalizeAnswer('twenty-five')).toBe('twenty five');
  });

  it('keeps possessive apostrophes', () => {
    expect(normalizeAnswer("My brother's car.")).toBe("my brother's car");
    expect(matchesAccepted('My brothers car', ["My brother's car."])).toBe(false);
  });

  it('matches against any accepted answer', () => {
    expect(matchesAccepted('how much does this t-shirt cost', ['How much is this T-shirt?', 'How much does this T-shirt cost?'])).toBe(true);
    expect(matchesAccepted('', ['x'])).toBe(false);
  });
});

describe('seed questions', () => {
  it('only use known topics and cover every topic', () => {
    const realTopics = TOPICS.filter((t) => t.id !== MIXED_TOPIC).map((t) => t.id);
    for (const q of SEED_QUESTIONS) expect(TOPIC_IDS, q.prompt).toContain(q.topic);
    for (const id of realTopics) expect(SEED_QUESTIONS.filter((q) => q.topic === id).length, id).toBeGreaterThanOrEqual(5);
  });

  it('are well formed', () => {
    for (const q of SEED_QUESTIONS) {
      expect(q.accepted, q.prompt).toContain(q.answer);
      expect(q.explanation.length, q.prompt).toBeGreaterThan(3);
      if (q.type === 'choice') {
        expect(q.options, q.prompt).toHaveLength(4);
        expect(new Set(q.options!.map(normalizeOption)).size, q.prompt).toBe(4);
        expect(q.options, q.prompt).toContain(q.answer);
      }
    }
  });

  it('have no duplicate prompts inside a topic', () => {
    const keys = SEED_QUESTIONS.map((q) => `${q.topic}|${q.type}|${normalizeAnswer(q.prompt)}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('do not use British forms in answers', () => {
    const british = /\b(colour|favourite|centre|theatre|travelled|cancelled|learnt|holiday maker|lorry|underground|boarding card|return ticket|autumn|trousers|jumper|chemist)\b/i;
    for (const q of SEED_QUESTIONS) for (const a of q.accepted) expect(british.test(a), a).toBe(false);
  });
});

describe('knowledge base', () => {
  it('has an entry for every non-mixed topic', () => {
    for (const t of TOPICS) if (t.kind !== 'mixed') expect(KNOWLEDGE[t.id], t.id).toBeDefined();
  });
});

describe('procedural generator', () => {
  it('creates valid, unique questions for every topic', () => {
    for (const t of TOPICS) {
      const topics = t.kind === 'mixed' ? TOPIC_IDS.filter((id) => id !== MIXED_TOPIC) : [t.id];
      const qs = proceduralQuestions(topics, 8, new Set());
      expect(qs.length, t.id).toBeGreaterThan(0);
      expect(new Set(qs.map((q) => normalizeAnswer(q.prompt))).size, t.id).toBe(qs.length);
      for (const q of qs) {
        expect(q.accepted).toContain(q.answer);
        if (q.type === 'choice') {
          expect(q.options, `${t.id}: ${q.prompt}`).toHaveLength(4);
          expect(new Set(q.options!.map(normalizeOption)).size, `${t.id}: ${q.prompt} ${q.options}`).toBe(4);
          expect(q.options).toContain(q.answer);
        }
      }
    }
  });
});

describe('API without database or AI (memory store)', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.DATABASE_URL;
    delete process.env.GROQ_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  const post = (body: unknown) => new Request('http://local/api', { method: 'POST', body: JSON.stringify(body) });

  it('serves 10 questions per match and avoids repeats within a session', async () => {
    const { POST } = await import('../match');
    const seen: string[] = [];
    for (let round = 0; round < 3; round++) {
      const res = await POST(post({ topic: 'clima', exclude: seen }));
      expect(res.status).toBe(200);
      const data = (await res.json()) as MatchResponse;
      expect(data.questions).toHaveLength(10);
      for (const q of data.questions) expect(seen).not.toContain(q.id);
      seen.push(...data.questions.map((q) => q.id));
    }
  });

  it('serves a mixed match', async () => {
    const { POST } = await import('../match');
    const data = (await (await POST(post({ topic: MIXED_TOPIC }))).json()) as MatchResponse;
    expect(data.questions).toHaveLength(10);
  });

  it('serves the irregular-verb drill with three "pick every correct option" questions and grades them in any order', async () => {
    const { POST: match } = await import('../match');
    const { POST: check } = await import('../check');
    const seen: string[] = [];
    for (let round = 0; round < 3; round++) {
      const data = (await (await match(post({ topic: IRREGULAR_TOPIC, exclude: seen }))).json()) as MatchResponse;
      expect(data.questions).toHaveLength(10);
      expect(data.questions.filter((q) => q.type === 'multi')).toHaveLength(3);
      for (const q of data.questions) expect(seen).not.toContain(q.id);
      seen.push(...data.questions.map((q) => q.id));
    }
    const data = (await (await match(post({ topic: IRREGULAR_TOPIC }))).json()) as MatchResponse;
    const { getStore } = await import('./db');
    const q = (await getStore().get(data.questions.find((x) => x.type === 'multi')!.id))!;
    const grade = async (answer: string) => ((await (await check(post({ token: data.token, questionId: q.id, answer }))).json()) as CheckResult).correct;
    expect(await grade([...q.accepted].reverse().join(', '))).toBe(true);
    expect(await grade(q.accepted.slice(1).join(', '))).toBe(false);
    expect(await grade(q.options!.join(', '))).toBe(false);
  });

  it('never sends the answer key to the browser', async () => {
    const { POST } = await import('../match');
    for (const topic of ['clima', IRREGULAR_TOPIC]) {
      const data = (await (await POST(post({ topic }))).json()) as MatchResponse;
      for (const q of data.questions) {
        expect(q).not.toHaveProperty('answer');
        expect(q).not.toHaveProperty('accepted');
        expect(q).not.toHaveProperty('explanation');
      }
    }
  });

  it('grades only the questions of the match the token was issued for', async () => {
    const { POST: match } = await import('../match');
    const { POST: check } = await import('../check');
    const a = (await (await match(post({ topic: 'clima' }))).json()) as MatchResponse;
    const b = (await (await match(post({ topic: 'hotel' }))).json()) as MatchResponse;
    const ask = (token: string, questionId: string) => check(post({ token, questionId, answer: 'x' }));

    expect((await ask(a.token, a.questions[0].id)).status).toBe(200);
    expect((await ask(a.token, b.questions[0].id)).status).toBe(403);
    // Tampering with the list of ids breaks the signature.
    const [payload, sig] = a.token.split('.');
    const ids = JSON.parse(Buffer.from(payload, 'base64url').toString());
    const forged = `${Buffer.from(JSON.stringify({ ...ids, ids: [...ids.ids, b.questions[0].id] })).toString('base64url')}.${sig}`;
    expect((await ask(forged, b.questions[0].id)).status).toBe(403);
    expect((await ask('nonsense', a.questions[0].id)).status).toBe(403);
    expect((await check(post({ questionId: a.questions[0].id, answer: 'x' }))).status).toBe(400);
  });

  it('limits matches per IP and per hour', async () => {
    process.env.MATCHES_PER_HOUR = '2';
    const { POST } = await import('../match');
    const from = (ip: string) => new Request('http://local/api', { method: 'POST', body: JSON.stringify({ topic: 'clima' }), headers: { 'x-forwarded-for': ip } });
    expect((await POST(from('1.1.1.1'))).status).toBe(200);
    expect((await POST(from('1.1.1.1'))).status).toBe(200);
    const blocked = await POST(from('1.1.1.1'));
    expect(blocked.status).toBe(429);
    expect(((await blocked.json()) as { error: string }).error).toMatch(/Muitas partidas em pouco tempo\. Tente de novo em \d+ min\./);
    // Another player is not affected.
    expect((await POST(from('2.2.2.2'))).status).toBe(200);
    delete process.env.MATCHES_PER_HOUR;
  });

  it('refuses oversized bodies before validating them, with or without content-length', async () => {
    const { POST: match } = await import('../match');
    const { POST: check } = await import('../check');
    const huge = JSON.stringify({ topic: 'clima', exclude: Array.from({ length: 50_000 }, (_, i) => String(i)) });
    expect((await match(new Request('http://local/api', { method: 'POST', body: huge, headers: { 'content-length': String(huge.length) } }))).status).toBe(413);
    // A streamed body has no content-length, so the cap has to hold while reading.
    const streamed = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(huge));
        controller.close();
      },
    });
    expect((await check(new Request('http://local/api', { method: 'POST', body: streamed, duplex: 'half' } as RequestInit))).status).toBe(413);
    // A normal match, with 500 seen ids, still fits.
    const seen = Array.from({ length: 500 }, (_, i) => String(100_000 + i));
    expect((await match(post({ topic: 'clima', exclude: seen }))).status).toBe(200);
  });

  it('rejects unknown topics', async () => {
    const { POST } = await import('../match');
    expect((await POST(post({ topic: 'nope' }))).status).toBe(400);
  });

  it('grades written answers against accepted variants', async () => {
    const { POST: match } = await import('../match');
    const { POST: check } = await import('../check');
    const data = (await (await match(post({ topic: 'saudacoes' }))).json()) as MatchResponse;
    const { getStore } = await import('./db');
    const q = (await getStore().get(data.questions.find((x) => x.type === 'writing')!.id))!;
    const right = (await (await check(post({ token: data.token, questionId: q.id, answer: q.accepted[q.accepted.length - 1].toUpperCase() }))).json()) as CheckResult;
    expect(right.correct).toBe(true);
    const wrong = (await (await check(post({ token: data.token, questionId: q.id, answer: 'banana banana' }))).json()) as CheckResult;
    expect(wrong.correct).toBe(false);
    expect(wrong.gradedBy).toBe('fallback');
    expect(wrong.reference).toBe(q.answer);
  });
});
