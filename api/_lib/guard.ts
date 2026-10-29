/**
 * Abuse protection for the open API: per-IP limits, a daily cap on AI-generated questions, and
 * signed match tokens so /api/check only grades the questions a player actually received.
 * Every check fails open: a database hiccup must not lock players out of the game.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { Store } from './db';
import { intEnv, json } from './util';

const HOUR = 60 * 60_000;
const DAY = 24 * HOUR;
const TOKEN_TTL = 12 * HOUR;

/** The caller's IP, hashed: enough to count requests without storing addresses. Vercel sets x-forwarded-for itself. */
function clientKey(request: Request): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

/** Counts this request against the caller's hourly limit; returns a 429 response when it is over. */
export async function rateLimit(store: Store, request: Request, name: 'match' | 'check', message: string): Promise<Response | null> {
  const perHour = name === 'match' ? intEnv('MATCHES_PER_HOUR', 20) : intEnv('CHECKS_PER_HOUR', 300);
  try {
    const count = await store.bump(`${name}:${clientKey(request)}`, HOUR);
    if (count <= perHour) return null;
  } catch (err) {
    console.error('[guard] rate limit unavailable:', err);
    return null;
  }
  const minutes = Math.max(1, Math.ceil((HOUR - (Date.now() % HOUR)) / 60_000));
  return json({ error: `${message} Tente de novo em ${minutes} min.` }, 429);
}

// ------------------------------------------------------------------ daily cap on AI-generated questions

const aiDayKey = 'ai-questions';

/** How many more questions the AI may generate today (UTC), across every player. */
export async function aiQuestionsLeft(store: Store): Promise<number> {
  try {
    return Math.max(0, intEnv('AI_QUESTIONS_PER_DAY', 200) - (await store.bump(aiDayKey, DAY, 0)));
  } catch {
    return intEnv('AI_QUESTIONS_PER_DAY', 200);
  }
}

export async function recordAiQuestions(store: Store, count: number): Promise<void> {
  if (count > 0) await store.bump(aiDayKey, DAY, count).catch((err) => console.error('[guard] could not record AI usage:', err));
}

export async function aiQuestionsToday(store: Store): Promise<number> {
  return store.bump(aiDayKey, DAY, 0).catch(() => 0);
}

// ------------------------------------------------------------------ match tokens

let cachedSecret: Promise<string> | undefined;

function secret(store: Store): Promise<string> {
  cachedSecret ??= store.secret().catch((err) => {
    cachedSecret = undefined;
    throw err;
  });
  return cachedSecret;
}

const sign = (key: string, payload: string) => createHmac('sha256', key).update(payload).digest('base64url');

/** A token listing the match's question ids, signed with the server secret. */
export async function signMatch(store: Store, questionIds: string[]): Promise<string> {
  const payload = Buffer.from(JSON.stringify({ ids: questionIds, exp: Date.now() + TOKEN_TTL })).toString('base64url');
  return `${payload}.${sign(await secret(store), payload)}`;
}

/** Whether `token` was issued by this server, has not expired and includes `questionId`. */
export async function tokenAllows(store: Store, token: string, questionId: string): Promise<boolean> {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(await secret(store), payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { ids, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { ids: string[]; exp: number };
    return exp > Date.now() && Array.isArray(ids) && ids.includes(questionId);
  } catch {
    return false;
  }
}
