import type { MatchResponse, Question } from '../../api/_lib/types';

export interface AnswerRecord {
  questionId: string;
  given: string;
  correct: boolean;
  /** Corrected version of the given answer (writing) or the right option (choice). */
  corrected: string;
  reference: string;
  explanation: string;
  skipped?: boolean;
}

export interface Match {
  topic: string;
  questions: Question[];
  answers: AnswerRecord[];
  index: number;
  stats: MatchResponse['stats'];
}

export interface SessionState {
  match: Match | null;
  /** Question ids already played in this browser session, so new matches avoid repeats. */
  seen: string[];
}

const KEY = 'embarque-session-v1';

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
