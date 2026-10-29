/**
 * Minimal OpenAI-compatible chat client for free-tier providers (Groq first, Gemini as fallback).
 * A provider that answers 429 (free-tier limit reached) is paused, so no request is wasted on it until it resets.
 */
import { getStore } from './db';

interface Provider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

export function aiProviders(): Provider[] {
  const list: Provider[] = [];
  if (process.env.GROQ_API_KEY) {
    list.push({
      name: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    });
  }
  if (process.env.GEMINI_API_KEY) {
    list.push({
      name: 'gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });
  }
  return list;
}

export function hasAi(): boolean {
  return aiProviders().length > 0;
}

const PAUSE_DEFAULT_MS = 10 * 60_000;
const PAUSE_MIN_MS = 30_000;
const PAUSE_MAX_MS = 24 * 60 * 60_000;

class ProviderError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryAfterMs?: number,
  ) {
    super(message);
  }
}

/** How long the provider asked us to wait: Retry-After (Groq) or "retryDelay" in the body (Gemini). */
function retryAfterMs(res: Response, body: string): number | undefined {
  const header = res.headers.get('retry-after');
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds)) return seconds * 1000;
    const date = Date.parse(header);
    if (!Number.isNaN(date)) return date - Date.now();
  }
  const delay = body.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
  return delay ? Number(delay[1]) * 1000 : undefined;
}

/** Provider name → paused until (epoch ms), for display in /api/status. */
export async function aiPauses(): Promise<Record<string, number>> {
  try {
    const now = Date.now();
    return Object.fromEntries(Object.entries(await getStore().aiPauses()).filter(([, until]) => until > now));
  } catch {
    // A database hiccup must not switch the AI off.
    return {};
  }
}

/** Configured providers that are not paused. */
async function readyProviders(): Promise<Provider[]> {
  const paused = await aiPauses();
  return aiProviders().filter((p) => !paused[p.name]);
}

/** Whether at least one provider can be called right now (configured and not paused). */
export async function aiReady(): Promise<boolean> {
  return (await readyProviders()).length > 0;
}

async function pause(provider: string, requestedMs: number | undefined): Promise<void> {
  const ms = Math.min(PAUSE_MAX_MS, Math.max(PAUSE_MIN_MS, requestedMs ?? PAUSE_DEFAULT_MS));
  console.warn(`[ai] ${provider} hit its rate limit; paused for ${Math.round(ms / 1000)}s`);
  await getStore()
    .pauseAi(provider, Date.now() + ms)
    .catch((err) => console.error('[ai] could not save the pause:', err));
}

function parseJson(content: string): unknown {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  return JSON.parse(start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed);
}

async function callProvider(p: Provider, messages: ChatMessage[], maxTokens: number, timeoutMs: number): Promise<unknown> {
  const base: Record<string, unknown> = { model: p.model, messages, temperature: 0.7, max_tokens: maxTokens };
  const extras: Record<string, unknown> = { response_format: { type: 'json_object' }, reasoning_effort: 'low' };

  // Some models reject optional parameters (JSON mode, reasoning effort); retry once without them.
  for (const body of [{ ...base, ...extras }, base]) {
    const res = await fetch(`${p.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${p.apiKey}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 400 && body !== base) continue;
    if (!res.ok) {
      const text = await res.text();
      throw new ProviderError(`${p.name} HTTP ${res.status}: ${text.slice(0, 300)}`, res.status, retryAfterMs(res, text));
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error(`${p.name}: resposta vazia`);
    return parseJson(content);
  }
  throw new Error(`${p.name}: requisição rejeitada`);
}

/** Asks each ready provider in turn for a JSON object; throws with every provider's error if all fail. */
export async function chatJson(messages: ChatMessage[], opts: { maxTokens: number; timeoutMs: number }): Promise<{ data: unknown; provider: string }> {
  const providers = await readyProviders();
  if (providers.length === 0) throw new Error(hasAi() ? 'IA em pausa: limite gratuito atingido' : 'Nenhuma IA configurada');
  const errors: string[] = [];
  for (const p of providers) {
    try {
      return { data: await callProvider(p, messages, opts.maxTokens, opts.timeoutMs), provider: p.name };
    } catch (err) {
      if (err instanceof ProviderError && err.status === 429) await pause(p.name, err.retryAfterMs);
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  throw new Error(errors.join(' | '));
}
