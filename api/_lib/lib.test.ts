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
    const q = data.questions.find((x) => x.type === 'multi')!;
    const grade = async (answer: string) => ((await (await check(post({ questionId: q.id, answer }))).json()) as CheckResult).correct;
    expect(await grade([...q.accepted].reverse().join(', '))).toBe(true);
    expect(await grade(q.accepted.slice(1).join(', '))).toBe(false);
    expect(await grade(q.options!.join(', '))).toBe(false);
  });

  it('rejects unknown topics', async () => {
    const { POST } = await import('../match');
    expect((await POST(post({ topic: 'nope' }))).status).toBe(400);
  });

  it('grades written answers against accepted variants', async () => {
    const { POST: match } = await import('../match');
    const { POST: check } = await import('../check');
    const data = (await (await match(post({ topic: 'saudacoes' }))).json()) as MatchResponse;
    const q = data.questions.find((x) => x.type === 'writing')!;
    const right = (await (await check(post({ questionId: q.id, answer: q.accepted[q.accepted.length - 1].toUpperCase() }))).json()) as CheckResult;
    expect(right.correct).toBe(true);
    const wrong = (await (await check(post({ questionId: q.id, answer: 'banana banana' }))).json()) as CheckResult;
    expect(wrong.correct).toBe(false);
    expect(wrong.gradedBy).toBe('fallback');
    expect(wrong.reference).toBe(q.answer);
  });
});
