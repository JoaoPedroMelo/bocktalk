import { Check, X } from 'lucide-react';
import { findTopic } from '../../api/_lib/topics';
import type { Match } from '../lib/session';
import { filledSentence, spokenAnswer } from '../lib/spoken';
import { SpeakButton } from './SpeakButton';

interface Props {
  match: Match;
  onReplay: () => void;
  onHome: () => void;
}

export function Result({ match, onReplay, onHome }: Props) {
  const right = match.answers.filter((a) => a.correct).length;
  const wrong = match.questions.length - right;
  const topic = findTopic(match.topic);
  const verdict = right === 10 ? 'Gabaritou!' : right >= 7 ? 'Boa viagem!' : right >= 4 ? 'No caminho certo.' : 'Vale revisar este tema.';

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <p className="text-muted">{topic?.title}</p>
      <h1 className="mt-1 text-2xl font-extrabold">{verdict}</h1>

      <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl bg-board text-board-text">
        <div className="border-r border-white/10 p-5">
          <dt className="text-sm text-board-muted">Acertos</dt>
          <dd className="font-flap text-[3rem] leading-none text-[rgb(110_220_160)]">{right}</dd>
        </div>
        <div className="p-5">
          <dt className="text-sm text-board-muted">Erros</dt>
          <dd className="font-flap text-[3rem] leading-none text-[rgb(255_140_120)]">{wrong}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn-primary" onClick={onReplay}>
          Jogar de novo este tema
        </button>
        <button type="button" className="btn-quiet" onClick={onHome}>
          Escolher outro tema
        </button>
      </div>

      <h2 className="mt-12 text-lg font-extrabold">Relatório da partida</h2>
      <ol className="mt-4 grid gap-3">
        {match.questions.map((q, i) => {
          const a = match.answers[i];
          const correctionDiffers = q.type === 'writing' && a && !a.correct && !a.skipped && a.corrected !== a.reference;
          const reference = a?.reference ?? q.answer;
          const full = filledSentence(q, reference);
          return (
            <li key={q.id} className={`rounded-xl border-l-4 bg-surface p-4 sm:p-5 ${a?.correct ? 'border-go' : 'border-stop'}`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-sm font-semibold text-muted">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted">{q.instruction}</p>
                  <p className="font-semibold">{q.prompt}</p>
                  <dl className="mt-3 grid gap-1.5 text-[0.95rem]">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-muted">Sua resposta:</dt>
                      <dd className={a?.correct ? 'text-go' : 'text-stop'}>{a?.skipped ? 'pulou' : a?.given || '—'}</dd>
                    </div>
                    {correctionDiffers && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted">Corrigida:</dt>
                        <dd className="flex flex-1 items-start gap-1 font-semibold">
                          <span className="flex-1 pt-0.5">{a.corrected}</span>
                          <SpeakButton text={spokenAnswer(q, a.corrected)} label="Ouvir sua resposta corrigida" />
                        </dd>
                      </div>
                    )}
                    {!a?.correct && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted">Gabarito:</dt>
                        <dd className="font-semibold">{reference}</dd>
                      </div>
                    )}
                    {full && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted">Frase completa:</dt>
                        <dd lang="en">{full}</dd>
                      </div>
                    )}
                  </dl>
                  {a?.explanation && <p className="mt-2 text-sm text-muted">{a.explanation}</p>}
                </div>
                <div className="-mt-1.5 flex shrink-0 flex-col items-center gap-1">
                  <span className="flex h-9 w-9 items-center justify-center">
                    {a?.correct ? <Check className="h-5 w-5 text-go" aria-label="Acertou" /> : <X className="h-5 w-5 text-stop" aria-label="Errou" />}
                  </span>
                  <SpeakButton text={spokenAnswer(q, reference)} label={`Ouvir a resposta da questão ${i + 1}`} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
