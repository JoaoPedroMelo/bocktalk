import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { findTopic } from '../api/_lib/topics';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';
import { startMatch } from './lib/api';
import { loadSession, saveSession, type AnswerRecord, type SessionState } from './lib/session';

type View = { name: 'home' } | { name: 'loading'; topic: string } | { name: 'error'; topic: string; message: string } | { name: 'match' };

export default function App() {
  const [session, setSession] = useState<SessionState>(loadSession);
  const [view, setView] = useState<View>(() => (session.match ? { name: 'match' } : { name: 'home' }));

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const start = useCallback(
    async (topic: string) => {
      setView({ name: 'loading', topic });
      try {
        const data = await startMatch(topic, session.seen);
        setSession((s) => ({
          seen: [...s.seen, ...data.questions.map((q) => q.id)],
          match: { topic, questions: data.questions, answers: [], index: 0, stats: data.stats },
        }));
        setView({ name: 'match' });
      } catch (e) {
        setView({ name: 'error', topic, message: e instanceof Error ? e.message : 'Erro desconhecido' });
      }
    },
    [session.seen],
  );

  const answer = useCallback((record: AnswerRecord) => {
    setSession((s) => {
      if (!s.match || s.match.answers[s.match.index]) return s;
      const answers = [...s.match.answers];
      answers[s.match.index] = record;
      return { ...s, match: { ...s.match, answers } };
    });
  }, []);

  const next = useCallback(() => {
    setSession((s) => (s.match ? { ...s, match: { ...s.match, index: s.match.index + 1 } } : s));
  }, []);

  const goHome = useCallback(() => {
    setSession((s) => ({ ...s, match: null }));
    setView({ name: 'home' });
    window.scrollTo({ top: 0 });
  }, []);

  if (view.name === 'loading') {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" aria-hidden="true" />
        <p className="text-lg">Preparando a partida de {findTopic(view.topic)?.title}</p>
      </main>
    );
  }

  if (view.name === 'error') {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-4 px-4">
        <h1 className="text-xl font-extrabold">A partida não carregou</h1>
        <p className="text-muted">{view.message}. Verifique sua conexão e tente de novo.</p>
        <div className="flex gap-2">
          <button type="button" className="btn-primary" onClick={() => void start(view.topic)}>
            Tentar de novo
          </button>
          <button type="button" className="btn-quiet" onClick={goHome}>
            Voltar ao início
          </button>
        </div>
      </main>
    );
  }

  const match = session.match;
  if (view.name === 'match' && match) {
    if (match.index >= match.questions.length) {
      return <Result match={match} onReplay={() => void start(match.topic)} onHome={goHome} />;
    }
    return <Quiz match={match} onAnswer={answer} onNext={next} onQuit={goHome} />;
  }

  return <Home onStart={(t) => void start(t)} />;
}
