import { z } from 'zod';
import { gradeWriting } from './_lib/ai-questions';
import { aiReady } from './_lib/ai';
import { getStore } from './_lib/db';
import { rateLimit, tokenAllows } from './_lib/guard';
import { matchesAccepted, normalizeAnswer } from './_lib/normalize';
import type { CheckResult } from './_lib/types';
import { BODY_TOO_LARGE, json, readJson } from './_lib/util';

const bodySchema = z.object({
  token: z.string().max(4000),
  questionId: z.string().max(32),
  answer: z.string().max(400),
});

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (body === BODY_TOO_LARGE) return json({ error: 'Requisição grande demais. Recarregue a página.' }, 413);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return json({ error: 'Requisição inválida. Recarregue a página.' }, 400);
  const { questionId, token } = parsed.data;
  const answer = parsed.data.answer.trim();

  const store = getStore();
  const limited = await rateLimit(store, request, 'check', 'Muitas respostas em pouco tempo.');
  if (limited) return limited;
  // Only questions handed out in the player's own match can be graded, so the bank can't be swept for answers.
  if (!(await tokenAllows(store, token, questionId))) return json({ error: 'Esta questão não faz parte da sua partida. Comece uma nova partida.' }, 403);

  const q = await store.get(questionId);
  if (!q) return json({ error: 'Questão não encontrada. Comece uma nova partida.' }, 404);

  const reference = q.answer;
  const result = (r: Omit<CheckResult, 'reference'>) => json({ ...r, reference } satisfies CheckResult);

  if (q.type === 'choice') {
    return result({ correct: answer === q.answer, corrected: q.answer, explanation: q.explanation, gradedBy: 'exact' });
  }
  if (q.type === 'multi') {
    // The answer is the picked options joined by ", ", in any order.
    const picked = new Set(answer.split(/\s*,\s*/).filter(Boolean));
    const correct = picked.size === q.accepted.length && q.accepted.every((o) => picked.has(o));
    return result({ correct, corrected: q.answer, accepted: q.accepted, explanation: q.explanation, gradedBy: 'exact' });
  }
  if (!normalizeAnswer(answer)) {
    return result({ correct: false, corrected: reference, explanation: q.explanation, gradedBy: 'exact' });
  }
  if (matchesAccepted(answer, q.accepted)) {
    return result({ correct: true, corrected: answer, explanation: q.explanation, gradedBy: 'exact' });
  }

  if (await aiReady()) {
    try {
      const grade = await gradeWriting({ instruction: q.instruction, prompt: q.prompt, accepted: q.accepted, explanation: q.explanation, answer });
      // A correct alternative becomes an accepted answer, so the next time it is graded instantly.
      if (grade.correct) await store.addAccepted(q.id, answer).catch(() => undefined);
      return result({ correct: grade.correct, corrected: grade.correct ? answer : grade.corrected, explanation: grade.explanation, gradedBy: 'ai' });
    } catch (err) {
      console.error('[check] AI grading failed:', err);
    }
  }

  return result({
    correct: false,
    corrected: reference,
    explanation: `${q.explanation} (Comparada só com as respostas cadastradas.)`,
    gradedBy: 'fallback',
  });
}
