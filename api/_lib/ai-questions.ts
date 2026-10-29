import { z } from 'zod';
import { chatJson } from './ai';
import type { NewQuestion } from './db';
import { IRREGULAR_VERBS, KNOWLEDGE, type TopicKnowledge } from './knowledge';
import { normalizeAnswer, normalizeOption } from './normalize';
import { TOPICS, findTopic } from './topics';
import { sample } from './util';

const SYSTEM_RULES = `Você é um professor de inglês experiente criando exercícios para brasileiros adultos (nível A1 a B1) que estudam inglês para trabalhar com turismo.
Regras obrigatórias:
- Use SOMENTE inglês americano (ortografia, vocabulário e gramática dos EUA): color, center, traveled, canceled, favorite, gotten; vacation, subway, check (conta), restroom, soccer, apartment, fall, round-trip, "on the weekend". Nunca use formas britânicas.
- Todo texto em inglês deve ser gramaticalmente correto e natural. Revise cada gabarito duas vezes antes de responder.
- Instruções e explicações em português do Brasil, claras e curtas.
- Cada questão deve ter UMA única resposta correta (nas de múltipla escolha) e não pode depender de opinião.
- Responda apenas com JSON válido, sem comentários.`;

const generatedSchema = z.object({
  topic: z.string().optional(),
  type: z.enum(['choice', 'writing']),
  instruction: z.string().min(3).max(120),
  prompt: z.string().min(2).max(400),
  options: z.array(z.string().min(1).max(200)).optional(),
  answer: z.string().min(1).max(300),
  accepted: z.array(z.string().min(1).max(300)).optional(),
  explanation: z.string().min(3).max(500),
});

const generatedListSchema = z.object({ questions: z.array(z.unknown()) });

function knowledgeBlock(id: string, k: TopicKnowledge, vocabLimit: number): string {
  const meta = findTopic(id);
  const lines = [
    `### ${meta?.title ?? id} (${meta?.source ?? ''})`,
    `Resumo: ${k.summary}`,
  ];
  if (k.vocabulary.length) lines.push(`Vocabulário (EN = PT): ${sample(k.vocabulary, vocabLimit).map(([en, pt]) => `${en} = ${pt}`).join('; ')}`);
  if (k.phrases.length) lines.push(`Frases úteis: ${k.phrases.map(([en, pt]) => `"${en}" (${pt})`).join('; ')}`);
  if (k.grammar.length) lines.push(`Gramática:\n- ${k.grammar.join('\n- ')}`);
  if (k.usNotes?.length) lines.push(`Inglês americano:\n- ${k.usNotes.join('\n- ')}`);
  return lines.join('\n');
}

function grammarIndex(): string {
  return TOPICS.filter((t) => t.kind === 'grammar')
    .map((t) => `- ${t.title}: ${KNOWLEDGE[t.id]?.summary ?? t.subtitle}`)
    .join('\n');
}

function buildContext(topicIds: string[]): string {
  const blocks: string[] = [];
  const related = new Set<string>();
  for (const id of topicIds) {
    const k = KNOWLEDGE[id];
    if (!k) continue;
    blocks.push(knowledgeBlock(id, k, 70));
    for (const r of k.relatedGrammar ?? []) if (!topicIds.includes(r)) related.add(r);
  }
  for (const id of related) {
    const k = KNOWLEDGE[id];
    if (k) blocks.push(knowledgeBlock(id, { ...k, vocabulary: [] }, 0));
  }
  if (topicIds.some((id) => ['g-irregular', 'g-simple-past', 'esportes', 'g-present-perfect', 'g-past-perfect'].includes(id))) {
    blocks.push(`Verbos irregulares do curso (base, passado, particípio): ${sample(IRREGULAR_VERBS, 40).map((v) => `${v[0]}-${v[1]}-${v[2]}`).join(', ')}`);
  }
  return blocks.join('\n\n');
}

function validate(raw: unknown, topicIds: string[]): NewQuestion | null {
  const parsed = generatedSchema.safeParse(raw);
  if (!parsed.success) return null;
  const q = parsed.data;
  const topic = q.topic && topicIds.includes(q.topic) ? q.topic : topicIds[0];
  const answer = q.answer.trim();
  if (q.type === 'choice') {
    const options = (q.options ?? []).map((o) => o.trim());
    const distinct = new Set(options.map(normalizeOption));
    if (options.length !== 4 || distinct.size !== 4) return null;
    if (options.filter((o) => o === answer).length !== 1) return null;
    return { topic, type: 'choice', instruction: q.instruction.trim(), prompt: q.prompt.trim(), options, answer, accepted: [answer], explanation: q.explanation.trim(), source: 'ai' };
  }
  const accepted = [answer, ...(q.accepted ?? []).map((a) => a.trim())].filter((a, i, all) => a && all.findIndex((b) => normalizeAnswer(b) === normalizeAnswer(a)) === i);
  return { topic, type: 'writing', instruction: q.instruction.trim(), prompt: q.prompt.trim(), answer, accepted, explanation: q.explanation.trim(), source: 'ai' };
}

/**
 * Generates `count` new questions grounded in the knowledge base of `topicIds`.
 * The model tags each question with one of `topicIds`, so a mixed match spreads them across real topics.
 */
export async function generateQuestions(topicIds: string[], count: number, avoidPrompts: string[]): Promise<{ questions: NewQuestion[]; provider: string }> {
  const titles = topicIds.map((id) => findTopic(id)?.title ?? id).join(', ');
  const user = `Crie ${count} questões NOVAS sobre: ${titles}.
Use o conhecimento do curso abaixo como base (vocabulário, frases e gramática). Você pode combinar o vocabulário do tema com qualquer ponto gramatical do curso, sempre no nível do aluno.

${buildContext(topicIds)}

Pontos gramaticais do curso (para combinar com o tema):
${grammarIndex()}

Distribuição:
- Cerca de metade "choice" (múltipla escolha) e metade "writing" (resposta escrita).
- Varie os formatos: completar lacuna (use "___"), traduzir do português para o inglês, passar para negativa/interrogativa, escrever a pergunta para uma resposta, escolher a frase correta, vocabulário em contexto, situações reais de turismo (hotel, aeroporto, restaurante, guia...).
- Para "choice": exatamente 4 opções diferentes, só UMA correta; distratores plausíveis com erros típicos de brasileiros; "answer" deve ser idêntico (caractere por caractere) a uma das opções.
- Para "writing": respostas curtas (até ~20 palavras). Em "accepted", liste todas as variações corretas e naturais (sinônimos, ordem alternativa). Não precisa repetir variações só de contração (I'm/I am) nem de maiúsculas/pontuação.
- Em lacunas: cada espaço é exatamente "___"; "answer" e "accepted" trazem só as palavras que preenchem a lacuna (com duas lacunas, separe por " / "); dicas (verbo base, "negativa"...) vão entre parênteses no fim. O app lê a frase em voz alta preenchendo a lacuna com a resposta, então ela precisa ficar correta e natural.
- Em traduções, o "prompt" é a frase em português; nos demais, o "prompt" é em inglês.
- "explanation": 1 ou 2 frases em português explicando a regra ou o vocabulário.
- "topic": o id do tema principal da questão, um destes: ${topicIds.join(', ')}.
${avoidPrompts.length ? `\nNão repita nem parafraseie estes enunciados já existentes:\n${avoidPrompts.map((p) => `- ${p}`).join('\n')}` : ''}

Formato da resposta:
{"questions":[{"topic":"${topicIds[0]}","type":"choice","instruction":"Escolha a alternativa correta","prompt":"...","options":["...","...","...","..."],"answer":"...","explanation":"..."},{"topic":"${topicIds[0]}","type":"writing","instruction":"Traduza para o inglês","prompt":"...","answer":"...","accepted":["..."],"explanation":"..."}]}`;

  const { data, provider } = await chatJson(
    [
      { role: 'system', content: SYSTEM_RULES },
      { role: 'user', content: user },
    ],
    { maxTokens: 8000, timeoutMs: 45_000 },
  );
  const list = generatedListSchema.safeParse(data);
  if (!list.success) throw new Error(`${provider}: JSON fora do formato esperado`);
  const seen = new Set(avoidPrompts.map(normalizeAnswer));
  const questions: NewQuestion[] = [];
  list.data.questions.forEach((raw) => {
    const q = validate(raw, topicIds);
    if (!q || seen.has(normalizeAnswer(q.prompt))) return;
    seen.add(normalizeAnswer(q.prompt));
    questions.push(q);
  });
  return { questions: questions.slice(0, count), provider };
}

const gradeSchema = z.object({
  correct: z.boolean(),
  corrected: z.string().min(1).max(400),
  explanation: z.string().min(1).max(800),
});

export interface Grade {
  correct: boolean;
  corrected: string;
  explanation: string;
}

export async function gradeWriting(input: { instruction: string; prompt: string; accepted: string[]; explanation: string; answer: string }): Promise<Grade> {
  const user = `Corrija a resposta de um aluno.
Tarefa: ${input.instruction}
Enunciado: ${input.prompt}
Respostas de referência (podem existir outras corretas): ${input.accepted.map((a) => `"${a}"`).join(' | ')}
Regra trabalhada: ${input.explanation}
Resposta do aluno: "${input.answer}"

Critérios:
- "correct" = true se a resposta cumpre a tarefa, mantém o sentido e é inglês americano gramaticalmente correto e natural, mesmo que diferente da referência.
- Ignore maiúsculas/minúsculas, pontuação final e contrações (I'm = I am).
- Erros de ortografia, de gramática, de tempo verbal, palavras britânicas (quando a forma americana é diferente) ou mudança de sentido tornam a resposta incorreta.
- "corrected": a resposta do aluno com o MÍNIMO de alterações para ficar correta (se já estiver correta, repita-a; se estiver totalmente fora, use a referência).
- "explanation": em português, 1 a 3 frases, apontando exatamente o que estava errado e por quê (ou confirmando o acerto com uma dica curta).

Formato: {"correct":true,"corrected":"...","explanation":"..."}`;

  const { data } = await chatJson(
    [
      { role: 'system', content: SYSTEM_RULES },
      { role: 'user', content: user },
    ],
    { maxTokens: 2000, timeoutMs: 25_000 },
  );
  const parsed = gradeSchema.safeParse(data);
  if (!parsed.success) throw new Error('Correção fora do formato esperado');
  return parsed.data;
}
