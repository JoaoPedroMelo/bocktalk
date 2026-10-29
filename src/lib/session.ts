import type { MatchResponse, PublicQuestion } from '../../api/_lib/types';

export interface AnswerRecord {
  questionId: string;
  given: string;
  correct: boolean;
  /** Corrected version of the given answer (writing) or the right option (choice). */
  corrected: string;
  reference: string;
  /** Multi questions: the options that had to be picked (sent by the server after answering). */
  accepted?: string[];
  explanation: string;
  skipped?: boolean;
}

export interface Match {
  topic: string;
  questions: PublicQuestion[];
  /** Signed by the server; required to grade this match's questions. */
  token: string;
  answers: AnswerRecord[];
  index: number;
  stats: MatchResponse['stats'];
}

export interface SessionState {
  match: Match | null;
  /** Question ids already played in this browser session, so new matches avoid repeats. */
  seen: string[];
}

// v2: questions no longer carry their answers and a match needs its token, so v1 matches can't be resumed.
const KEY = 'bocktalk-session-v2';

export function loadSession(): SessionState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SessionState;
  } catch {
    // Storage unavailable (private mode, blocked): start fresh.
  }
  return { match: null, seen: [] };
}

export function saveSession(state: SessionState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Not critical: the session just won't survive a reload.
  }
}
