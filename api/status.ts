import { aiProviders } from './_lib/ai';
import { getStore } from './_lib/db';
import { json } from './_lib/util';

/** Setup diagnostics: which database and AI providers are active, and how many questions each topic has. */
export async function GET(): Promise<Response> {
  const store = getStore();
  let counts: Record<string, number> = {};
  let dbError: string | undefined;
  try {
    counts = await store.counts();
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }
  return json({
    database: store.kind,
    dbError,
    ai: aiProviders().map((p) => ({ provider: p.name, model: p.model })),
    totalQuestions: Object.values(counts).reduce((a, b) => a + b, 0),
    questionsByTopic: counts,
  });
}
