import { describe, expect, it } from 'vitest';
import { IRREGULAR_VERBS, REGULAR_IN_US, REGULAR_VERBS, WRONG_PAST } from './irregular-verbs';
import { normalizeOption } from './normalize';
import { irregularMultiQuestions, proceduralQuestions } from './procedural';
import { IRREGULAR_TOPIC } from './topics';

const BASES = new Set(IRREGULAR_VERBS.map((v) => v[0]));
const PASTS = new Set(IRREGULAR_VERBS.flatMap((v) => v[1].split('/')));
const PARTICIPLES = new Set(IRREGULAR_VERBS.map((v) => v[2]));
const verb = (base: string) => IRREGULAR_VERBS.find((v) => v[0] === base)!;

describe('irregular verb data', () => {
  it('keeps regular verbs and made-up forms apart from the real table', () => {
    for (const [base] of [...REGULAR_VERBS, ...REGULAR_IN_US]) expect(BASES.has(base), base).toBe(false);
    for (const [base, wrong] of Object.entries(WRONG_PAST)) {
      expect(BASES.has(base), base).toBe(true);
      expect(PASTS.has(wrong) || PARTICIPLES.has(wrong), wrong).toBe(false);
    }
  });
});

describe('irregular verb drill: pick every correct option', () => {
  // Many rounds, since every question is drawn at random.
  const rounds = Array.from({ length: 150 }, () => irregularMultiQuestions(3, new Set())).flat();

  it('always yields three distinct questions with 6 options and 2 to 4 correct ones', () => {
    expect(rounds).toHaveLength(450);
    for (const q of rounds) {
      expect(q.type).toBe('multi');
      expect(q.topic).toBe(IRREGULAR_TOPIC);
      expect(new Set(q.options!.map(normalizeOption)).size, q.prompt).toBe(6);
      expect(q.accepted.length).toBeGreaterThanOrEqual(2);
      expect(q.accepted.length).toBeLessThanOrEqual(4);
      expect(q.answer).toBe(q.options!.filter((o) => q.accepted.includes(o)).join(', '));
      // The prompt names the options exactly as shown, like "Dentre os verbos a, b, c, d, e e f, ...".
      for (const o of q.options!) expect(q.prompt).toContain(o);
    }
  });

  it('marks exactly the right options, checked against the verb table', () => {
    for (const q of rounds) {
      const isRight = (o: string) => q.accepted.includes(o);
      for (const o of q.options!) {
        if (q.prompt.includes('quais são irregulares')) expect(BASES.has(o), `${q.prompt} ${o}`).toBe(isRight(o));
        else if (q.prompt.includes('passado simples corretos')) expect(PASTS.has(o), `${q.prompt} ${o}`).toBe(isRight(o));
        else if (q.prompt.includes('particípios passados corretos')) expect(PARTICIPLES.has(o), `${q.prompt} ${o}`).toBe(isRight(o));
        else if (q.prompt.includes('passado igual ao particípio')) expect(verb(o)[1] === verb(o)[2], `${q.prompt} ${o}`).toBe(isRight(o));
        else throw new Error(`unknown kind: ${q.prompt}`);
      }
    }
  });

  it('adds single-answer questions for the rest of the match', () => {
    const qs = proceduralQuestions([IRREGULAR_TOPIC], 30, new Set());
    expect(qs.length).toBeGreaterThan(20);
    for (const q of qs) expect(q.type === 'choice' || q.type === 'writing').toBe(true);
  });
});
