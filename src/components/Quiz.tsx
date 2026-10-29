import { Check, Loader2, Table2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Question } from '../../api/_lib/types';
import { IRREGULAR_TOPIC, findTopic } from '../../api/_lib/topics';
import { checkAnswer } from '../lib/api';
import { wordDiff } from '../lib/diff';
import type { AnswerRecord, Match } from '../lib/session';
import { answerIsEnglish, filledSentence, spokenAnswer, spokenPrompt } from '../lib/spoken';
import { SpeakButton } from './SpeakButton';
import { VerbTable } from './VerbTable';

interface Props {
  match: Match;
  onAnswer: (record: AnswerRecord) => void;
  onNext: () => void;
  onQuit: () => void;
}

function Progress({ match }: { match: Match }) {
  return (
    <ol className="flex gap-1" aria-label={`Questão ${match.index + 1} de ${match.questions.length}`}>
      {match.questions.map((q, i) => {
        const a = match.answers[i];
        const color = a ? (a.correct ? 'bg-go' : 'bg-stop') : i === match.index ? 'bg-signal' : 'bg-line';
        return <li key={q.id} className={`h-1.5 flex-1 rounded-full ${color}`} />;
      })}
    </ol>
  );
}

function Choice({ q, record, onPick }: { q: Question; record?: AnswerRecord; onPick: (option: string) => void }) {
  useEffect(() => {
    if (record) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= (q.options?.length ?? 0) && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) onPick(q.options![n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, record, onPick]);

  return (
    <ul className="grid gap-2.5">
      {q.options!.map((opt, i) => {
        const isAnswer = opt === q.answer;
        const isPicked = record?.given === opt;
        let tone = 'border-line bg-surface hover:border-muted';
        if (record && isAnswer) tone = 'border-go bg-go/10';
        else if (record && isPicked) tone = 'border-stop bg-stop/10';
        else if (record) tone = 'border-line bg-surface opacity-60';
        return (
          <li key={opt}>
            <button
              type="button"
              disabled={!!record}
              onClick={() => onPick(opt)}
              className={`flex min-h-[3.5rem] w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors disabled:cursor-default ${tone}`}
            >
              <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded border border-line text-sm font-semibold text-muted sm:flex">{i + 1}</span>
              <span className="flex-1">{opt}</span>
              {record && isAnswer && <Check className="h-5 w-5 shrink-0 text-go" aria-label="Resposta correta" />}
              {record && isPicked && !isAnswer && <X className="h-5 w-5 shrink-0 text-stop" aria-label="Sua escolha" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const isTyping = (t: EventTarget | null) => t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement;

/** Pick every correct option, then confirm. After answering, missed options are marked as well as wrong picks. */
function Multi({ q, record, onConfirm }: { q: Question; record?: AnswerRecord; onConfirm: (picked: string[]) => void }) {
  const options = q.options!;
  const [picked, setPicked] = useState<string[]>([]);
  const chosen = record ? record.given.split(', ') : picked;
  const toggle = (opt: string) => setPicked((p) => (p.includes(opt) ? p.filter((o) => o !== opt) : [...p, opt]));
  const confirm = () => picked.length > 0 && onConfirm(options.filter((o) => picked.includes(o)));

  useEffect(() => {
    setPicked([]);
  }, [q.id]);

  useEffect(() => {
    if (record) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) toggle(options[n - 1]);
      else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) confirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="grid gap-4">
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt, i) => {
          const isRight = q.accepted.includes(opt);
          const isPicked = chosen.includes(opt);
          let tone = isPicked ? 'border-signal bg-signal/10' : 'border-line bg-surface hover:border-muted';
          let note = '';
          if (record) {
            if (isRight && isPicked) tone = 'border-go bg-go/10';
            else if (isRight) [tone, note] = ['border-dashed border-go bg-surface', 'faltou marcar'];
            else if (isPicked) [tone, note] = ['border-stop bg-stop/10', 'não era'];
            else tone = 'border-line bg-surface opacity-60';
          }
          return (
            <li key={opt}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isPicked}
                disabled={!!record}
                onClick={() => toggle(opt)}
                className={`flex min-h-[3.5rem] w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors disabled:cursor-default ${tone}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 ${isPicked ? 'border-signal bg-signal text-signal-ink' : 'border-muted'} ${record && isRight ? (isPicked ? '!border-go !bg-go text-page' : '!border-go !bg-transparent') : ''} ${record && isPicked && !isRight ? '!border-stop !bg-stop text-page' : ''}`}
                  aria-hidden="true"
                >
                  {isPicked && (record && !isRight ? <X className="h-4 w-4" strokeWidth={3} /> : <Check className="h-4 w-4" strokeWidth={3} />)}
                </span>
                <span className="flex-1" lang="en">
                  {opt}
                </span>
                {note && <span className={`text-sm ${isRight ? 'text-go' : 'text-stop'}`}>{note}</span>}
                <span className="hidden text-sm text-muted sm:inline" aria-hidden="true">
                  {!record && i + 1}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!record && (
        <div className="flex items-center gap-3">
          <button type="button" className="btn-primary flex-1 sm:flex-none" disabled={picked.length === 0} onClick={confirm}>
            Confirmar
          </button>
          <span className="text-sm text-muted">{picked.length === 0 ? 'Marque uma ou mais' : `${picked.length} marcada${picked.length > 1 ? 's' : ''}`}</span>
        </div>
      )}
    </div>
  );
}

function Writing({ q, record, onSubmit }: { q: Question; record?: AnswerRecord; onSubmit: (text: string, skipped?: boolean) => Promise<void> }) {
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText('');
    setError(null);
    if (!record && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [q.id, record]);

  async function submit(skipped = false) {
    if (pending || (!skipped && !text.trim())) return;
    setPending(true);
    setError(null);
    try {
      await onSubmit(skipped ? '' : text, skipped);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível corrigir agora.');
    } finally {
      setPending(false);
    }
  }

  if (record) {
    return (
      <p className="rounded-lg border-2 border-line bg-surface px-4 py-3">
        {record.skipped ? <span className="text-muted">Você pulou esta questão.</span> : record.given}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="grid gap-3"
    >
      <label htmlFor="answer" className="sr-only">
        Sua resposta
      </label>
      <textarea
        id="answer"
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
        rows={2}
        lang="en"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="sentences"
        placeholder="Escreva sua resposta em inglês"
        className="w-full resize-none rounded-lg border-2 border-line bg-surface px-4 py-3 text-lg outline-none placeholder:text-muted focus:border-signal"
        disabled={pending}
      />
      {error && (
        <p className="text-sm text-stop" role="alert">
          {error} Tente de novo.
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={pending || !text.trim()}>
          {pending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Corrigindo
            </>
          ) : (
            'Corrigir'
          )}
        </button>
        <button type="button" className="btn-quiet" onClick={() => void submit(true)} disabled={pending}>
          Não sei
        </button>
      </div>
    </form>
  );
}

function Correction({ given, corrected }: { given: string; corrected: string }) {
  const parts = wordDiff(given, corrected);
  return (
    <p className="leading-8">
      {parts.map((p, i) => (
        <span key={i}>
          {p.kind === 'removed' && <del className="rounded bg-stop/15 px-0.5 text-stop decoration-2">{p.text}</del>}
          {p.kind === 'added' && <ins className="rounded bg-go/15 px-0.5 font-semibold text-go no-underline">{p.text}</ins>}
          {p.kind === 'same' && p.text}{' '}
        </span>
      ))}
    </p>
  );
}

function SpokenLine({ text, speech, label, strong }: { text: string; speech: string; label: string; strong?: boolean }) {
  return (
    <div className="flex items-start gap-1">
      <p className={`flex-1 text-lg ${strong ? 'font-semibold' : ''}`} lang="en">
        {text}
      </p>
      <SpeakButton text={speech} label={label} />
    </div>
  );
}

function Feedback({ q, record, isLast, onNext }: { q: Question; record: AnswerRecord; isLast: boolean; onNext: () => void }) {
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
    nextRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);

  const showCorrection = q.type === 'writing' && !record.correct && !record.skipped && record.corrected && record.corrected !== record.given;
  const showReference = !record.correct && (q.type !== 'writing' || record.reference !== record.corrected || record.skipped);
  // The sentence with the blank filled in: the learner's own words when right, the answer key otherwise.
  const keyText = record.correct ? record.given : record.reference;
  const full = filledSentence(q, keyText);

  return (
    <section className={`feedback-enter mt-6 rounded-xl border-l-4 bg-surface p-5 ${record.correct ? 'border-go' : 'border-stop'}`} aria-live="polite">
      <h3 className={`flex items-center gap-2 text-lg font-extrabold ${record.correct ? 'text-go' : 'text-stop'}`}>
        {record.correct ? <Check className="h-6 w-6" aria-hidden="true" /> : <X className="h-6 w-6" aria-hidden="true" />}
        {record.correct ? 'Correto!' : record.skipped ? 'Veja a resposta' : 'Não foi dessa vez'}
      </h3>

      {showCorrection && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-muted">Sua resposta corrigida</p>
          <div className="flex items-start gap-1">
            <div className="flex-1 text-lg">
              <Correction given={record.given} corrected={record.corrected} />
            </div>
            {spokenAnswer(q, record.corrected) !== full && <SpeakButton text={spokenAnswer(q, record.corrected)} label="Ouvir a correção" />}
          </div>
        </div>
      )}

      {showReference && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-muted">{q.type === 'writing' ? 'Gabarito' : 'Resposta correta'}</p>
          {full || !answerIsEnglish(q) ? (
            <p className="text-lg font-semibold">{record.reference}</p>
          ) : (
            <SpokenLine text={record.reference} speech={spokenAnswer(q, record.reference)} label="Ouvir o gabarito" strong />
          )}
        </div>
      )}

      {full && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-muted">Frase completa</p>
          <SpokenLine text={full} speech={full} label="Ouvir a frase completa" />
        </div>
      )}

      {record.correct && !full && answerIsEnglish(q) && (
        <div className="mt-3">
          <SpokenLine text={record.given} speech={spokenAnswer(q, record.given)} label="Ouvir a resposta" />
        </div>
      )}

      <p className="mt-4 text-muted">{record.explanation}</p>

      <button ref={nextRef} type="button" onClick={onNext} className="btn-primary mt-5 w-full sm:w-auto">
        {isLast ? 'Ver resultado' : 'Próxima questão'}
      </button>
    </section>
  );
}

export function Quiz({ match, onAnswer, onNext, onQuit }: Props) {
  const q = match.questions[match.index];
  const record = match.answers[match.index];
  const topic = findTopic(match.topic);
  const isLast = match.index === match.questions.length - 1;
  const promptSpeech = spokenPrompt(q);
  const filledPrompt = record ? filledSentence(q, record.correct ? record.given : record.reference) : null;
  const hasTable = match.topic === IRREGULAR_TOPIC;
  const [tableOpen, setTableOpen] = useState(false);

  useEffect(() => {
    if (!record) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement) && !isTyping(e.target)) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [record, onNext]);

  // Block body on purpose: newer Chrome returns a Promise from scrollTo, which React would take as a cleanup.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [match.index]);

  function pick(option: string) {
    const correct = option === q.answer;
    onAnswer({ questionId: q.id, given: option, correct, corrected: q.answer, reference: q.answer, explanation: q.explanation });
  }

  async function submitWriting(text: string, skipped?: boolean) {
    if (skipped) {
      onAnswer({ questionId: q.id, given: '', correct: false, corrected: q.answer, reference: q.answer, explanation: q.explanation, skipped: true });
      return;
    }
    const r = await checkAnswer(q.id, text);
    onAnswer({ questionId: q.id, given: text.trim(), correct: r.correct, corrected: r.corrected, reference: r.reference, explanation: r.explanation });
  }

  function pickMany(picked: string[]) {
    const correct = picked.length === q.accepted.length && q.accepted.every((o) => picked.includes(o));
    onAnswer({ questionId: q.id, given: picked.join(', '), correct, corrected: q.answer, reference: q.answer, explanation: q.explanation });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="flex flex-wrap gap-x-3 text-sm text-muted">
          <span className="font-semibold text-text">{topic?.title}</span>
          <span>
            Questão {match.index + 1} de {match.questions.length}
          </span>
        </p>
        {hasTable && (
          <button
            type="button"
            onClick={() => setTableOpen(true)}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-signal px-3 py-1 text-sm font-semibold hover:bg-signal/10"
          >
            <Table2 className="h-4 w-4" aria-hidden="true" />
            Tabela
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Sair da partida? As respostas desta partida serão descartadas.')) onQuit();
          }}
          className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-text"
        >
          Sair
        </button>
      </div>
      <Progress match={match} />

      <article className="mt-8">
        <p className="font-semibold text-muted">{q.instruction}</p>
        <div className="mt-2 flex items-start gap-2">
          <h2
            className={`flex-1 whitespace-pre-line text-xl font-semibold leading-snug ${q.type === 'multi' ? 'sm:text-[1.6rem] sm:leading-[2.2rem]' : 'sm:text-[2rem] sm:leading-[2.6rem]'}`}
            lang={promptSpeech ? 'en' : 'pt-BR'}
          >
            {q.prompt}
          </h2>
          {/* Before answering the blank is skipped; afterwards the same button reads the sentence with it filled in. */}
          {promptSpeech &&
            (filledPrompt ? <SpeakButton text={filledPrompt} label="Ouvir a frase completa" /> : <SpeakButton text={promptSpeech} label="Ouvir o enunciado" />)}
        </div>

        <div className="mt-6">
          {q.type === 'choice' && <Choice q={q} record={record} onPick={pick} />}
          {q.type === 'multi' && <Multi q={q} record={record} onConfirm={pickMany} />}
          {q.type === 'writing' && <Writing q={q} record={record} onSubmit={submitWriting} />}
        </div>

        {record && <Feedback key={q.id} q={q} record={record} isLast={isLast} onNext={onNext} />}
      </article>
      {hasTable && <VerbTable open={tableOpen} onClose={() => setTableOpen(false)} />}
    </main>
  );
}
