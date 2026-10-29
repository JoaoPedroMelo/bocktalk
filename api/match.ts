import { waitUntil } from '@vercel/functions';
import { z } from 'zod';
import { generateQuestions } from './_lib/ai-questions';
import { aiReady } from './_lib/ai';
import { getStore, type Store } from './_lib/db';
import { aiQuestionsLeft, rateLimit, recordAiQuestions, signMatch } from './_lib/guard';
import { irregularMultiQuestions, proceduralQuestions } from './_lib/procedural';
import { IRREGULAR_TOPIC, MIXED_TOPIC, TOPICS, findTopic } from './_lib/topics';
import type { MatchResponse, PublicQuestion, Question } from './_lib/types';
import { BODY_TOO_LARGE, intEnv, json, readJson, sample, shuffle } from './_lib/util';

const MATCH_SIZE = 10;
/** The irregular-verb drill always includes this many "pick every correct option" questions. */
const IRREGULAR_MULTI = 3;

const bodySchema = z.object({
  topic: z.string(),
  exclude: z.array(z.string().max(32)).max(500).optional(),
});

async function generateAndStore(store: Store, topics: string[], count: number): Promise<Question[]> {
  const avoid = await store.recentPrompts(topics, 40);
  const { questions } = await generateQuestions(topics, count, avoid);
  await recordAiQuestions(store, questions.length);
  return store.insert(questions);
}

/** Drops the answer key: the browser gets it from /api/check, one answered question at a time. */
function toPublic({ answer: _a, accepted: _c, explanation: _e, ...q }: Question): PublicQuestion {
  return q;
}

/**
 * Builds a 10-question match. Questions the player hasn't seen this session come from the bank;
 * the AI writes new ones in the background for upcoming matches, or right away when the bank runs
 * short. Rule-based questions fill any remaining gap so a match never comes back incomplete.
 */
export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body === BODY_TOO_LARGE) return json({ error: 'Requisição grande demais. Recarregue a página.' }, 413);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success || !findTopic(parsed.data.topic)) return json({ error: 'Tema inválido. Volte ao início e escolha outro.' }, 400);
  const { topic } = parsed.data;
  const exclude = parsed.data.exclude ?? [];

  const realTopics = TOPICS.filter((t) => t.kind !== 'mixed').map((t) => t.id);
  const bankTopics = topic === MIXED_TOPIC ? realTopics : [topic];
  // A mixed match asks the AI about a few random topics so the context stays focused.
  const aiTopics = topic === MIXED_TOPIC ? sample(realTopics, 3) : [topic];
  const perMatch = Math.min(MATCH_SIZE, intEnv('NEW_QUESTIONS_PER_MATCH', 4));

  const store = getStore();
  const limited = await rateLimit(store, request, 'match', 'Muitas partidas em pouco tempo.');
  if (limited) return limited;

  // Built from the verb table on every match, so the drill never runs out of them; they are stored like any other question.
  const fixed =
    topic === IRREGULAR_TOPIC ? await store.insert(irregularMultiQuestions(IRREGULAR_MULTI, new Set(await store.recentPrompts(bankTopics, 300)))) : [];
  const fromBank = await store.pick(bankTopics, fixed.length ? MATCH_SIZE * 3 : MATCH_SIZE, [...exclude, ...fixed.map((q) => q.id)]);
  // The drill takes only its fresh multi questions: stored ones pile up as the least served and would crowd out the rest.
  const chosen = [...fixed, ...(fixed.length ? fromBank.filter((q) => q.type !== 'multi') : fromBank).slice(0, MATCH_SIZE - fixed.length)];
  const stats: MatchResponse['stats'] = { fromBank: chosen.length - fixed.length, fromAi: 0, generated: fixed.length };

  // A paused provider is skipped without a request; with every provider paused, or today's cap reached, the match is built without AI.
  const aiLeft = perMatch > 0 ? await aiQuestionsLeft(store) : 0;
  if (aiLeft > 0 && (await aiReady())) {
    const missing = MATCH_SIZE - chosen.length;
    if (missing > 0) {
      try {
        const fresh = await generateAndStore(store, aiTopics, Math.min(aiLeft, Math.max(missing, perMatch)));
        chosen.push(...fresh.slice(0, missing));
        stats.fromAi = Math.min(fresh.length, missing);
      } catch (err) {
        stats.aiError = err instanceof Error ? err.message.slice(0, 300) : 'Falha na IA';
        console.error('[match] AI generation failed:', err);
      }
    } else {
      waitUntil(generateAndStore(store, aiTopics, Math.min(aiLeft, perMatch)).catch((err) => console.error('[match] background AI generation failed:', err)));
    }
  }

  if (chosen.length < MATCH_SIZE) {
    const avoid = new Set([...chosen.map((q) => q.prompt), ...(await store.recentPrompts(bankTopics, 300))]);
    const generated = await store.insert(proceduralQuestions(bankTopics, MATCH_SIZE - chosen.length, avoid));
    chosen.push(...generated);
    stats.generated += generated.length;
  }

  // Still short (everything was already played this session): repeat questions seen earlier.
  if (chosen.length < MATCH_SIZE) {
    const ids = new Set(chosen.map((q) => q.id));
    for (const q of await store.pick(bankTopics, MATCH_SIZE * 2, [])) {
      if (chosen.length < MATCH_SIZE && !ids.has(q.id)) {
        chosen.push(q);
        stats.fromBank++;
      }
    }
  }

  const questions = shuffle(chosen).slice(0, MATCH_SIZE);
  await store.markServed(questions.map((q) => q.id));
  const token = await signMatch(store, questions.map((q) => q.id));
  return json({ topic, questions: questions.map(toPublic), token, stats } satisfies MatchResponse);
}
