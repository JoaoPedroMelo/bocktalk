export type TopicKind = 'theme' | 'grammar' | 'mixed';

export interface TopicMeta {
  id: string;
  title: string;
  subtitle: string;
  kind: TopicKind;
  /** Theme topics: lucide icon key. Grammar topics: short formula shown on the card. */
  badge: string;
  source?: string;
}

/** 'multi': pick every correct option (one or more). */
export type QuestionType = 'choice' | 'writing' | 'multi';
export type QuestionSource = 'book' | 'ai' | 'generated';

export interface Question {
  id: string;
  topic: string;
  type: QuestionType;
  /** Instruction in Portuguese, e.g. "Traduza para o inglês". */
  instruction: string;
  prompt: string;
  /** Choice: always 4 items, `answer` is one of them. Multi: 6 items, the correct ones are `accepted`. */
  options?: string[];
  answer: string;
  /** Writing: every accepted variant (always includes `answer`). Multi: every option that must be picked; `answer` lists them for display. */
  accepted: string[];
  /** Short explanation in Portuguese shown with the answer key. */
  explanation: string;
  source: QuestionSource;
}

export interface MatchResponse {
  topic: string;
  questions: Question[];
  stats: { fromBank: number; fromAi: number; generated: number; aiError?: string };
}

export interface CheckRequest {
  questionId: string;
  answer: string;
}

export interface CheckResult {
  correct: boolean;
  /** The student's answer, corrected (equals the reference when the answer is unusable). */
  corrected: string;
  reference: string;
  explanation: string;
  gradedBy: 'exact' | 'ai' | 'fallback';
}
