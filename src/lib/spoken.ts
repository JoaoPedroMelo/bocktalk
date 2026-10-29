import type { PublicQuestion } from '../../api/_lib/types';

/** The read-aloud helpers only look at the wording, so they work with or without the answer key. */
type Question = Pick<PublicQuestion, 'prompt' | 'instruction' | 'type'>;

/** Pure text helpers for read-aloud. Kept free of browser APIs so every bank question can be checked in tests. */

const BLANK = /_+/g;
const PT_PROMPT = /^(traduza|escreva em inglês|como se diz)/i;
// Words that only show up in the Portuguese parts of prompts ("Nos EUA, ...", "Agora:", "— passado: chose").
// Ambiguous ones (de, do, da, a, o, e, no, as) are left out so names like "Rio de Janeiro" stay English.
const PT_WORDS =
  /(^|[^\p{L}])(é|à|às|ao|aos|não|você|nos|nas|na|os|das|dos|um|uma|em|para|com|que|se|ou|seu|sua|escolha|frase|correta|agora|neste|momento|chama|qual|como|diz|aviso|bordo|equivalem|aproximadamente|plural|comparativo|superlativo|passado|particípio|artigo|indefinido|resposta|curta|negativa|afirmativa|plano|forma|formas|ordem|verbo|verbos|significa|meio|meia|dentre|quais|corretos|corretas|particípios|igual|têm)(?=$|[^\p{L}])/iu;

// Accents alone prove nothing: "São Paulo" and "café" show up in English sentences.
const isPortuguese = (text: string) => PT_WORDS.test(text);

function tidy(text: string): string {
  return text
    .replace(/→/g, ' ')
    .replace(/^complete:\s*/i, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/[,;:]+([.!?])/g, '$1')
    .replace(/([.,!?;:])\1+/g, '$1')
    .replace(/^[\s.,;:!?—-]+/, '')
    .replace(/[\s,;:—-]+$/, '')
    .trim();
}

function dropParentheses(text: string): string {
  let out = text;
  for (let prev = ''; prev !== out; ) {
    prev = out;
    out = out.replace(/\s*\([^()]*\)/g, '');
  }
  return out;
}

/** Keeps only the English sentences/segments of a prompt. */
function englishOnly(text: string): string {
  return tidy(
    text
      .split(/(?<=[.!?:])\s+|\s+—\s+/)
      .filter((part) => !isPortuguese(part))
      .join(' '),
  );
}

/** Makes any text safe to hand to the speech engine: blanks are never read ("blank", "underscore"). */
export function speakable(text: string): string {
  return tidy(text.replace(BLANK, ' '));
}

export function blankCount(q: Question): number {
  return (q.prompt.match(BLANK) ?? []).length;
}

/** The prompt as it should be read before answering: no blanks, no hints, no Portuguese. Empty when there is nothing English to read. */
export function spokenPrompt(q: Question): string {
  // Multi-select prompts are Portuguese questions about the options ("Dentre os verbos ..., quais ...?").
  if (PT_PROMPT.test(q.instruction) || q.type === 'multi') return '';
  const text = speakable(englishOnly(dropParentheses(q.prompt)));
  // Bare numbers and times ("72", "7:30") would be read out in English, which gives the answer away.
  return /\p{L}/u.test(text) ? text : '';
}

/** Whether the answer key is English (false for "what does it mean?" questions answered in Portuguese). */
export function answerIsEnglish(q: Question): boolean {
  return !/^o que significa/i.test(q.instruction);
}

const word = (s: string | undefined) => (s ?? '').toLowerCase().replace(/[^\p{L}’']/gu, '');

/**
 * The prompt with its blanks filled by `text` (an answer key, or a corrected answer), cleaned for display and speech.
 * Returns null when the prompt has no blank or the text does not fit it.
 */
export function filledSentence(q: Question, text: string): string | null {
  const count = blankCount(q);
  const insert = text.trim().replace(/[()]/g, '');
  if (!count || !insert) return null;
  const parts = count > 1 ? insert.split(/\s*\/\s*/) : [insert];
  if (parts.length !== count) return null;

  const pieces = dropParentheses(q.prompt).split(BLANK);
  if (count === 1) {
    // Someone typed the whole sentence instead of the missing words: it is already complete.
    const before = pieces[0].trim().split(/\s+/).pop();
    const after = pieces[1].trim().split(/\s+/)[0];
    const words = insert.split(/\s+/);
    if ((word(before) && word(words[0]) === word(before)) || (word(after) && word(words[words.length - 1]) === word(after))) return null;
  }

  let out = pieces[0];
  parts.forEach((part, i) => {
    const startsSentence = /(^|[.!?]\s+)$/.test(out);
    out += (startsSentence ? part.charAt(0).toUpperCase() + part.slice(1) : part) + pieces[i + 1];
  });
  const clean = speakable(englishOnly(dropParentheses(out)));
  return clean || null;
}

/** What to read aloud once the question is answered: the complete English sentence for `text`. */
export function spokenAnswer(q: Question, text: string): string {
  const filled = filledSentence(q, text);
  if (filled) return filled;
  // "What does it mean?": the answer is Portuguese, so the English word in the prompt is what gets read.
  if (!answerIsEnglish(q)) return spokenPrompt(q);
  // "meio-dia (noon)": Portuguese answer with the English in parentheses, so only that is read.
  const inner = text.match(/\(([^()]*)\)/)?.[1];
  if (isPortuguese(dropParentheses(text))) return inner && !isPortuguese(inner) ? speakable(inner) : spokenPrompt(q);
  // "check (a bag)": the note is English and part of the answer.
  return speakable(text.replace(/[()]/g, ''));
}
