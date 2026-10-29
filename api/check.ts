import { z } from 'zod';
import { gradeWriting } from './_lib/ai-questions';
import { aiReady } from './_lib/ai';
import { getStore } from './_lib/db';
import { matchesAccepted, normalizeAnswer } from './_lib/normalize';
import type { CheckResult } from './_lib/types';
import { json } from './_lib/util';

const bodySchema = z.object({
  questionId: z.string().max(32),
  answer: z.string().max(400),
});

export async function POST(request: Request): Promise<Response> {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Requisição inválida' }, 400);
  const { questionId } = parsed.data;
  const answer = parsed.data.answer.trim();

  const store = getStore();
  const q = await store.get(questionId);
  if (!q) return json({ error: 'Questão não encontrada' }, 404);

  const reference = q.answer;
  const result = (r: Omit<CheckResult, 'reference'>) => json({ ...r, reference } satisfies CheckResult);

  if (q.type === 'choice') {
    return result({ correct: answer === q.answer, corrected: q.answer, explanation: q.explanation, gradedBy: 'exact' });
  }
  if (q.type === 'multi') {
    // The answer is the picked options joined by ", ", in any order.
    const picked = new Set(answer.split(/\s*,\s*/).filter(Boolean));
    const correct = picked.size === q.accepted.length && q.accepted.every((o) => picked.has(o));
    return result({ correct, corrected: q.answer, explanation: q.explanation, gradedBy: 'exact' });
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
