import type { CheckResult, MatchResponse } from '../../api/_lib/types';

const TIMEOUT_MS = 60_000;

async function post<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    throw new Error(
      controller.signal.aborted ? 'O servidor demorou demais para responder. Tente de novo.' : 'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
    );
  } finally {
    window.clearTimeout(timer);
  }
  const data = await res.json().catch(() => ({}));
  // Server errors are full sentences ("Muitas partidas em pouco tempo. Tente de novo em 12 min.").
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `O servidor respondeu com erro ${res.status}. Tente de novo.`);
  return data as T;
}

export function startMatch(topic: string, exclude: string[]): Promise<MatchResponse> {
  return post('/api/match', { topic, exclude: exclude.slice(-400) });
}

export function checkAnswer(token: string, questionId: string, answer: string): Promise<CheckResult> {
  return post('/api/check', { token, questionId, answer });
}
