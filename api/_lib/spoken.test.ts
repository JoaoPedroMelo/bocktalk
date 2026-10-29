import { describe, expect, it } from 'vitest';
import { blankCount, filledSentence, speakable, spokenAnswer, spokenPrompt } from '../../src/lib/spoken';
import { irregularMultiQuestions, proceduralQuestions } from './procedural';
import { SEED_QUESTIONS } from './seed';
import { TOPIC_IDS } from './topics';
import type { Question } from './types';

const q = (prompt: string, answer: string, instruction = 'Escolha a alternativa correta'): Question => ({
  id: 'x', topic: 'g-to-be', type: 'choice', instruction, prompt, answer, accepted: [answer], explanation: '', source: 'book',
});

const ALL: Question[] = [
  ...SEED_QUESTIONS,
  ...TOPIC_IDS.flatMap((t) => proceduralQuestions([t], 40, new Set())),
  ...Array.from({ length: 20 }, () => irregularMultiQuestions(3, new Set())).flat(),
].map((x, i) => ({ ...x, id: String(i) }));

describe('read-aloud text', () => {
  it('never reads a blank, a hint in parentheses or an empty string, for every bank question', () => {
    for (const x of ALL) {
      for (const text of [spokenPrompt(x), spokenAnswer(x, x.answer)]) {
        expect(text, x.prompt).not.toMatch(/_|\(|\)/);
      }
      expect(spokenAnswer(x, x.answer), x.prompt).not.toBe('');
    }
  });

  it('fills every blank with the answer key', () => {
    for (const x of ALL.filter((x) => blankCount(x) > 0 && !/^o que significa/i.test(x.instruction))) {
      const full = filledSentence(x, x.answer);
      expect(full, x.prompt).toBeTruthy();
      expect(full).not.toMatch(/_/);
    }
  });

  it('skips the blank before answering and reads the complete sentence after', () => {
    const x = q('He ___ coffee. (negativa)', 'doesn’t drink');
    expect(spokenPrompt(x)).toBe('He coffee.');
    expect(spokenAnswer(x, x.answer)).toBe('He doesn’t drink coffee.');
    expect(spokenAnswer(q('___ your parents speak English?', 'do'), 'do')).toBe('Do your parents speak English?');
    expect(spokenAnswer(q('Hey, these are ___ seats! Excuse me, Sir, these seats are ___.', 'our / ours'), 'our / ours')).toBe(
      'Hey, these are our seats! Excuse me, Sir, these seats are ours.',
    );
  });

  it('keeps a whole typed sentence instead of filling it into the blank', () => {
    const x = q('She ___ (watch) TV every night.', 'watches', 'Complete a frase');
    expect(spokenAnswer(x, 'She watches TV every night.')).toBe('She watches TV every night.');
    expect(spokenAnswer(q('I think it ___ (rain) later.', 'is going to rain'), 'is going to rain')).toBe('I think it is going to rain later.');
  });

  it('drops Portuguese and bare numbers from prompts', () => {
    expect(spokenPrompt(q('Jake works every day. Agora (neste momento):', 'Jake is working now.'))).toBe('Jake works every day.');
    expect(spokenPrompt(q('Nos EUA, o futebol (o nosso) se chama:', 'soccer'))).toBe('');
    expect(spokenPrompt(q('72', 'seventy-two', 'Escreva o número por extenso'))).toBe('');
    expect(spokenPrompt(q('Dentre as formas ridden, wore e ate, quais são particípios passados corretos?', 'ridden'))).toBe('');
    expect(spokenPrompt(q('São Paulo is the ___ city in Brazil.', 'biggest'))).toBe('São Paulo is the city in Brazil.');
    expect(spokenAnswer(q('12:00 p.m. é:', 'meio-dia (noon)'), 'meio-dia (noon)')).toBe('noon');
  });

  it('strips underscores from anything handed to the speech engine', () => {
    expect(speakable('I ____ a student.')).toBe('I a student.');
  });
});
