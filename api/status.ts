import { aiPauses, aiProviders } from './_lib/ai';
import { getStore } from './_lib/db';
import { aiQuestionsToday } from './_lib/guard';
import { intEnv, json } from './_lib/util';

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
  const pauses = await aiPauses();
  return json({
    database: store.kind,
    dbError,
    // pausedUntil: set while the provider is skipped after hitting its free-tier limit.
    ai: aiProviders().map((p) => ({ provider: p.name, model: p.model, pausedUntil: pauses[p.name] ? new Date(pauses[p.name]).toISOString() : undefined })),
    aiQuestionsToday: await aiQuestionsToday(store),
    aiQuestionsPerDay: intEnv('AI_QUESTIONS_PER_DAY', 200),
    totalQuestions: Object.values(counts).reduce((a, b) => a + b, 0),
    questionsByTopic: counts,
  });
}
