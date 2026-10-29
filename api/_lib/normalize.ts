const CONTRACTIONS: [RegExp, string][] = [
  [/\bwon't\b/g, 'will not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bcan not\b/g, 'cannot'],
  [/\bain't\b/g, 'is not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\bi'm\b/g, 'i am'],
  [/\b(\w+)'re\b/g, '$1 are'],
  [/\b(\w+)'ve\b/g, '$1 have'],
  [/\b(\w+)'ll\b/g, '$1 will'],
  [/\b(i|you|he|she|it|we|they)'d\b/g, '$1 would'],
  [/\b(he|she|it|that|what|where|who|there|here|how|when|why)'s\b/g, '$1 is'],
];

/**
 * Canonical form used to compare written answers: case, accents, curly quotes, contractions,
 * hyphens and punctuation are ignored; apostrophes of possessives are kept.
 */
export function normalizeAnswer(text: string): string {
  let s = text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"');
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  return s
    .replace(/[-–—_/]/g, ' ')
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+'|'\s+|^'|'$/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Lighter normalization for telling multiple-choice options apart: contractions stay distinct (I am ≠ I’m). */
export function normalizeOption(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/, '')
    .trim();
}

export function matchesAccepted(answer: string, accepted: string[]): boolean {
  const norm = normalizeAnswer(answer);
  if (!norm) return false;
  return accepted.some((a) => normalizeAnswer(a) === norm);
}
