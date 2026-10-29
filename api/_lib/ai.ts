/**
 * Minimal OpenAI-compatible chat client for free-tier providers (Groq first, Gemini as fallback).
 */
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
    if (!res.ok) throw new Error(`${p.name} HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error(`${p.name}: resposta vazia`);
    return parseJson(content);
  }
  throw new Error(`${p.name}: requisição rejeitada`);
}

/** Asks each configured provider in turn for a JSON object; throws with every provider's error if all fail. */
export async function chatJson(messages: ChatMessage[], opts: { maxTokens: number; timeoutMs: number }): Promise<{ data: unknown; provider: string }> {
  const errors: string[] = [];
  for (const p of aiProviders()) {
    try {
      return { data: await callProvider(p, messages, opts.maxTokens, opts.timeoutMs), provider: p.name };
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  throw new Error(errors.length ? errors.join(' | ') : 'Nenhuma IA configurada');
}
