import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IRREGULAR_VERBS } from '../../api/_lib/irregular-verbs';
import { SpeakButton } from './SpeakButton';

const fold = (s: string) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
const show = (form: string) => form.replace('/', ' / ');

/** Side panel (full screen on phones) with every verb from the spreadsheet. Used on the home screen and during a match. */
export function VerbTable({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
    if (!open && dialog.open) dialog.close();
    if (!open) document.body.style.overflow = '';
  }, [open]);

  const rows = useMemo(() => {
    const q = fold(query.trim());
    return q ? IRREGULAR_VERBS.filter((v) => v.some((cell) => fold(cell).includes(q))) : IRREGULAR_VERBS;
  }, [query]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="verb-table-title"
      className="m-0 ml-auto h-[100dvh] max-h-none w-full max-w-xl bg-page p-0 text-text backdrop:bg-black/55 sm:border-l sm:border-line"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-3 bg-board px-4 pb-4 pt-5 text-board-text sm:px-6">
          <div>
            <h2 id="verb-table-title" className="text-lg font-extrabold">
              Verbos irregulares
            </h2>
            <p className="text-sm text-board-muted">{IRREGULAR_VERBS.length} verbos da planilha, nas formas do inglês americano</p>
          </div>
          <button type="button" onClick={onClose} className="-mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10" aria-label="Fechar tabela">
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>

        <label className="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <span className="sr-only">Buscar verbo</span>
          <input
            // Plain text, not type="search": there the first Esc only clears the box instead of closing the panel.
            type="text"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: go, went, ir…"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent py-1 outline-none placeholder:text-muted"
          />
        </label>

        <details className="border-b border-line px-4 py-3 text-sm sm:px-6">
          <summary className="cursor-pointer font-semibold text-text marker:text-muted">E o futuro e os outros tempos?</summary>
          <div className="mt-2 grid gap-2 text-muted">
            <p>
              Só duas formas mudam de verdade: o passado simples e o particípio. Todos os outros tempos são montados com elas ou com o infinitivo, igual para
              qualquer verbo:
            </p>
            <ul className="grid gap-1" lang="en">
              <li>
                <span className="font-semibold text-text">Futuro:</span> will + infinitivo (I will go) ou going to + infinitivo (I’m going to go)
              </li>
              <li>
                <span className="font-semibold text-text">Presente:</span> o infinitivo, com -s em he/she/it (she goes)
              </li>
              <li>
                <span className="font-semibold text-text">Contínuos:</span> be + -ing (I am going, I was going)
              </li>
              <li>
                <span className="font-semibold text-text">Present perfect:</span> have/has + particípio (I have gone)
              </li>
              <li>
                <span className="font-semibold text-text">Past perfect:</span> had + particípio (I had gone)
              </li>
            </ul>
            <p>No presente, as únicas exceções da lista são be (am, is, are) e have (she has).</p>
          </div>
        </details>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-surface text-sm text-muted shadow-[0_1px_0_rgb(var(--line))]">
              <tr>
                <th scope="col" className="py-2.5 pl-4 pr-2 font-semibold sm:pl-6">
                  Infinitivo
                </th>
                <th scope="col" className="px-2 py-2.5 font-semibold">
                  Passado simples
                </th>
                <th scope="col" className="px-2 py-2.5 font-semibold">
                  Particípio passado
                </th>
                <th scope="col" className="w-12 pr-2 sm:pr-4">
                  <span className="sr-only">Ouvir</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([base, past, part, pt]) => (
                <tr key={base} className="border-b border-line/70 align-top">
                  <th scope="row" className="py-2.5 pl-4 pr-2 font-normal sm:pl-6">
                    <span className="block font-semibold" lang="en">
                      {base}
                    </span>
                    <span className="block text-sm text-muted">{pt}</span>
                  </th>
                  <td className="px-2 py-2.5" lang="en">
                    {show(past)}
                  </td>
                  <td className="px-2 py-2.5" lang="en">
                    {part}
                  </td>
                  <td className="py-1.5 pr-2 sm:pr-4">
                    <SpeakButton text={`${base}, ${past.replace('/', ', ')}, ${part}`} label={`Ouvir ${base}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="px-4 py-8 text-center text-muted sm:px-6">Nenhum verbo encontrado para “{query}”. Busque pelo infinitivo, por uma das formas ou pela tradução.</p>}
        </div>
      </div>
    </dialog>
  );
}
