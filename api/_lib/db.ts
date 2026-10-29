import { neon } from '@neondatabase/serverless';
import { SEED_QUESTIONS } from './seed';
import type { Question, QuestionSource, QuestionType } from './types';
import { fingerprint, shuffle } from './util';

/** Bump when seed.ts changes so existing databases receive the new starter questions. */
const SEED_VERSION = '1';

export interface NewQuestion {
  topic: string;
  type: QuestionType;
  instruction: string;
  prompt: string;
  options?: string[];
  answer: string;
  accepted: string[];
  explanation: string;
  source: QuestionSource;
}

export interface Store {
  kind: 'neon' | 'memory';
  pick(topics: string[], limit: number, excludeIds: string[]): Promise<Question[]>;
  insert(questions: NewQuestion[]): Promise<Question[]>;
  get(id: string): Promise<Question | undefined>;
  addAccepted(id: string, answer: string): Promise<void>;
  markServed(ids: string[]): Promise<void>;
  recentPrompts(topics: string[], limit: number): Promise<string[]>;
  counts(): Promise<Record<string, number>>;
}

function seedRows(): NewQuestion[] {
  return SEED_QUESTIONS.map((q) => ({ ...q, source: 'book' as const }));
}

// ------------------------------------------------------------------ Neon (Postgres)

interface Row {
  id: string | number;
  topic: string;
  type: QuestionType;
  instruction: string;
  prompt: string;
  options: string[] | null;
  answer: string;
  accepted: string[];
  explanation: string;
  source: QuestionSource;
}

function fromRow(r: Row): Question {
  return {
    id: String(r.id),
    topic: r.topic,
    type: r.type,
    instruction: r.instruction,
    prompt: r.prompt,
    options: r.options ?? undefined,
    answer: r.answer,
    accepted: r.accepted ?? [],
    explanation: r.explanation,
    source: r.source,
  };
}

function onlyNumericIds(ids: string[]): string[] {
  return ids.filter((id) => /^\d+$/.test(id));
}

function createNeonStore(url: string): Store {
  const sql = neon(url);
  let ready: Promise<void> | undefined;

  async function setup(): Promise<void> {
    await sql`create table if not exists questions (
      id bigserial primary key,
      topic text not null,
      type text not null check (type in ('choice', 'writing', 'multi')),
      instruction text not null,
      prompt text not null,
      options jsonb,
      answer text not null,
      accepted jsonb not null default '[]'::jsonb,
      explanation text not null default '',
      source text not null,
      fingerprint text not null unique,
      times_served integer not null default 0,
      created_at timestamptz not null default now()
    )`;
    await sql`create index if not exists questions_topic_served on questions (topic, times_served)`;
    await sql`create table if not exists app_meta (key text primary key, value text not null)`;
    const meta = (await sql`select value from app_meta where key = 'seed_version'`) as { value: string }[];
    if (meta[0]?.value !== SEED_VERSION) {
      await insertRows(seedRows());
      await sql`insert into app_meta (key, value) values ('seed_version', ${SEED_VERSION})
                on conflict (key) do update set value = excluded.value`;
    }
  }

  function ensure(): Promise<void> {
    ready ??= setup().catch((err) => {
      ready = undefined;
      throw err;
    });
    return ready;
  }

  async function insertRows(questions: NewQuestion[]): Promise<Question[]> {
    if (questions.length === 0) return [];
    const payload = JSON.stringify(
      questions.map((q) => ({ ...q, options: q.options ?? null, fingerprint: fingerprint(q.topic, q.type, q.prompt) })),
    );
    const rows = (await sql`
      insert into questions (topic, type, instruction, prompt, options, answer, accepted, explanation, source, fingerprint)
      select topic, type, instruction, prompt, options, answer, accepted, explanation, source, fingerprint
      from jsonb_to_recordset(${payload}::jsonb) as x(
        topic text, type text, instruction text, prompt text, options jsonb, answer text,
        accepted jsonb, explanation text, source text, fingerprint text)
      on conflict (fingerprint) do nothing
      returning id, topic, type, instruction, prompt, options, answer, accepted, explanation, source`) as Row[];
    return rows.map(fromRow);
  }

  return {
    kind: 'neon',
    async pick(topics, limit, excludeIds) {
      await ensure();
      const exclude = onlyNumericIds(excludeIds);
      const rows = (await sql`
        select id, topic, type, instruction, prompt, options, answer, accepted, explanation, source from questions
        where topic = any(${topics}::text[]) and not (id = any(${exclude}::bigint[]))
        order by times_served asc, random()
        limit ${limit}`) as Row[];
      return rows.map(fromRow);
    },
    async insert(questions) {
      await ensure();
      return insertRows(questions);
    },
    async get(id) {
      if (!/^\d+$/.test(id)) return undefined;
      await ensure();
      const rows = (await sql`select id, topic, type, instruction, prompt, options, answer, accepted, explanation, source
                                   from questions where id = ${id}::bigint`) as Row[];
      return rows[0] ? fromRow(rows[0]) : undefined;
    },
    async addAccepted(id, answer) {
      await ensure();
      await sql`update questions set accepted = accepted || ${JSON.stringify([answer])}::jsonb
                where id = ${id}::bigint and not accepted @> ${JSON.stringify([answer])}::jsonb`;
    },
    async markServed(ids) {
      const numeric = onlyNumericIds(ids);
      if (numeric.length === 0) return;
      await ensure();
      await sql`update questions set times_served = times_served + 1 where id = any(${numeric}::bigint[])`;
    },
    async recentPrompts(topics, limit) {
      await ensure();
      const rows = (await sql`select prompt from questions where topic = any(${topics}::text[])
                              order by created_at desc limit ${limit}`) as { prompt: string }[];
      return rows.map((r) => r.prompt);
    },
    async counts() {
      await ensure();
      const rows = (await sql`select topic, count(*)::int as n from questions group by topic`) as { topic: string; n: number }[];
      return Object.fromEntries(rows.map((r) => [r.topic, r.n]));
    },
  };
}

// ------------------------------------------------------------------ In-memory (local development without DATABASE_URL)

interface MemoryRow extends Question {
  fingerprint: string;
  timesServed: number;
  createdAt: number;
}

function createMemoryStore(): Store {
  const rows: MemoryRow[] = [];
  let nextId = 1;

  function insertSync(questions: NewQuestion[]): Question[] {
    const inserted: Question[] = [];
    for (const q of questions) {
      const fp = fingerprint(q.topic, q.type, q.prompt);
      if (rows.some((r) => r.fingerprint === fp)) continue;
      const row: MemoryRow = { ...q, id: String(nextId++), fingerprint: fp, timesServed: 0, createdAt: Date.now() + nextId };
      rows.push(row);
      inserted.push(strip(row));
    }
    return inserted;
  }

  function strip(r: MemoryRow): Question {
    const { fingerprint: _f, timesServed: _t, createdAt: _c, ...q } = r;
    return { ...q, accepted: [...q.accepted] };
  }

  insertSync(seedRows());

  return {
    kind: 'memory',
    async pick(topics, limit, excludeIds) {
      const candidates = shuffle(rows.filter((r) => topics.includes(r.topic) && !excludeIds.includes(r.id)));
      return candidates.sort((a, b) => a.timesServed - b.timesServed).slice(0, limit).map(strip);
    },
    async insert(questions) {
      return insertSync(questions);
    },
    async get(id) {
      const row = rows.find((r) => r.id === id);
      return row ? strip(row) : undefined;
    },
    async addAccepted(id, answer) {
      const row = rows.find((r) => r.id === id);
      if (row && !row.accepted.includes(answer)) row.accepted.push(answer);
    },
    async markServed(ids) {
      for (const r of rows) if (ids.includes(r.id)) r.timesServed++;
    },
    async recentPrompts(topics, limit) {
      return rows
        .filter((r) => topics.includes(r.topic))
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit)
        .map((r) => r.prompt);
    },
    async counts() {
      const out: Record<string, number> = {};
      for (const r of rows) out[r.topic] = (out[r.topic] ?? 0) + 1;
      return out;
    },
  };
}

let store: Store | undefined;

export function getStore(): Store {
  store ??= process.env.DATABASE_URL ? createNeonStore(process.env.DATABASE_URL) : createMemoryStore();
  return store;
}
