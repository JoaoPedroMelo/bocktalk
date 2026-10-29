import { Table2 } from 'lucide-react';
import { useState } from 'react';
import { IRREGULAR_TOPIC, MIXED_TOPIC, TOPICS } from '../../api/_lib/topics';
import type { TopicMeta } from '../../api/_lib/types';
import { TopicIcon } from './TopicIcon';
import { VerbTable } from './VerbTable';

interface Props {
  onStart: (topic: string) => void;
}

function BoardRow({ topic, onStart, onTable }: { topic: TopicMeta; onStart: (id: string) => void; onTable?: () => void }) {
  const isGrammar = topic.kind === 'grammar';
  return (
    <li className="flex">
      <button
        type="button"
        onClick={() => onStart(topic.id)}
        className="group flex min-w-0 flex-1 items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] sm:px-5"
      >
        {isGrammar ? (
          <span className="flex h-11 w-[6.75rem] shrink-0 items-center justify-center rounded-md bg-signal px-1.5 text-center text-[0.8rem] font-extrabold leading-tight text-signal-ink">
            {topic.badge}
          </span>
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-signal text-signal-ink">
            <TopicIcon name={topic.badge} className="h-6 w-6" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-board-text">{topic.title}</span>
          <span className="block truncate text-sm text-board-muted">{topic.subtitle}</span>
        </span>
        <span className="hidden shrink-0 text-right text-sm text-board-muted sm:block">{topic.source}</span>
      </button>
      {onTable && (
        <button
          type="button"
          onClick={onTable}
          className="flex w-[4.25rem] shrink-0 flex-col items-center justify-center gap-0.5 border-l border-white/10 text-xs font-semibold text-board-muted transition-colors hover:bg-white/[0.06] hover:text-board-text"
          aria-label="Abrir a tabela de verbos irregulares"
        >
          <Table2 className="h-5 w-5 text-signal" aria-hidden="true" />
          Tabela
        </button>
      )}
    </li>
  );
}

function Board({ title, hint, topics, onStart, onTable }: { title: string; hint?: string; topics: TopicMeta[]; onStart: (id: string) => void; onTable?: () => void }) {
  return (
    <section className="overflow-hidden rounded-xl bg-board shadow-[0_1px_0_rgb(0_0_0/0.4)]">
      <header className="flex items-baseline justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-4 sm:px-5">
        <h2 className="text-lg font-extrabold text-board-text">{title}</h2>
        {hint && <span className="text-sm text-board-muted">{hint}</span>}
      </header>
      <ul className="divide-y divide-white/[0.07]">
        {topics.map((t) => (
          <BoardRow key={t.id} topic={t} onStart={onStart} onTable={t.id === IRREGULAR_TOPIC ? onTable : undefined} />
        ))}
      </ul>
    </section>
  );
}

export function Home({ onStart }: Props) {
  const themes = TOPICS.filter((t) => t.kind === 'theme');
  const grammar = TOPICS.filter((t) => t.kind === 'grammar');
  const [tableOpen, setTableOpen] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-8">
      {/* Dark panel on purpose: the logo is white, so it needs the board color behind it in the light theme too. */}
      <header className="mb-6 flex flex-col items-center gap-5 rounded-xl bg-board px-6 py-7 text-center sm:flex-row sm:justify-center sm:gap-8 sm:px-8 sm:text-left">
        <h1 className="shrink-0">
          <img src="/logo-bocktalk.png" alt="BockTalk" width={720} height={371} className="h-auto w-[13.5rem] sm:w-[15rem] lg:w-[17rem]" />
        </h1>
        <p className="max-w-md text-lg leading-snug text-board-text sm:border-l sm:border-white/15 sm:py-2 sm:pl-8 sm:text-xl">
          Revisão e treino das lições básicas aprendidas com Fernando Bockmann.
        </p>
      </header>

      <button
        type="button"
        onClick={() => onStart(MIXED_TOPIC)}
        className="mb-6 flex w-full items-center gap-4 rounded-xl bg-signal px-4 py-4 text-left text-signal-ink transition hover:brightness-95 sm:px-5"
      >
        <TopicIcon name="shuffle" className="h-7 w-7 shrink-0" />
        <span className="flex-1">
          <span className="block text-lg font-extrabold">Misturado</span>
          <span className="block text-sm">Questões de todos os temas e pontos de gramática, sorteadas a cada partida.</span>
        </span>
      </button>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Board title="Temas" hint="15 lições" topics={themes} onStart={onStart} />
        <Board title="Gramática" topics={grammar} onStart={onStart} onTable={() => setTableOpen(true)} />
      </div>

      <VerbTable open={tableOpen} onClose={() => setTableOpen(false)} />
    </main>
  );
}
