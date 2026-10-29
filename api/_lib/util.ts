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

export function intEnv(name: string, fallback: number): number {
  const v = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}
