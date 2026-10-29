import { createHash } from 'node:crypto';
import { normalizeAnswer } from './normalize';

export function fingerprint(topic: string, type: string, prompt: string): string {
  return createHash('sha1').update(`${topic}|${type}|${normalizeAnswer(prompt)}`).digest('hex');
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(items: T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/** Largest request body the API reads. A match sends a few KB even with 500 seen ids. */
export const MAX_BODY_BYTES = 32 * 1024;
export const BODY_TOO_LARGE = Symbol('body too large');

/**
 * Parses a JSON body, reading it chunk by chunk and giving up past `maxBytes`, so an oversized request
 * never reaches the validator or fills memory. Returns null for a missing or malformed body.
 */
export async function readJson(request: Request, maxBytes = MAX_BODY_BYTES): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maxBytes) return BODY_TOO_LARGE;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return BODY_TOO_LARGE;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

export function intEnv(name: string, fallback: number): number {
  const v = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}
