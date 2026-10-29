/**
 * Rule-based question generator built on the knowledge base. Used when the AI is not configured or
 * fails, so a match always has fresh questions. Every answer here is derived from curated data.
 */
import type { NewQuestion } from './db';
import { IRREGULAR_VERBS, REGULAR_VERBS, WRONG_PAST } from './irregular-verbs';
import { KNOWLEDGE } from './knowledge';
import { normalizeAnswer, normalizeOption } from './normalize';
import { IRREGULAR_TOPIC } from './topics';
import { sample, shuffle } from './util';

type Maker = (topic: string) => NewQuestion | null;

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const first = (en: string) => en.split(' / ')[0].trim();
const variants = (en: string) => en.split(' / ').map((v) => v.trim());

function choice(topic: string, instruction: string, prompt: string, correct: string, distractors: string[], explanation: string): NewQuestion | null {
  const others = distractors.filter((d, i) => normalizeOption(d) !== normalizeOption(correct) && distractors.findIndex((x) => normalizeOption(x) === normalizeOption(d)) === i);
  if (others.length < 3) return null;
  const options = shuffle([correct, ...sample(others, 3)]);
  return { topic, type: 'choice', instruction, prompt, options, answer: correct, accepted: [correct], explanation, source: 'generated' };
}

function writing(topic: string, instruction: string, prompt: string, accepted: string[], explanation: string): NewQuestion {
  return { topic, type: 'writing', instruction, prompt, answer: accepted[0], accepted, explanation, source: 'generated' };
}

// ------------------------------------------------------------------ vocabulary and phrases (theme topics)

const vocabEnToPt: Maker = (topic) => {
  const vocab = KNOWLEDGE[topic]?.vocabulary ?? [];
  if (vocab.length < 6) return null;
  const [en, pt] = pick(vocab);
  return choice(topic, 'O que significa?', `"${first(en)}"`, pt, vocab.filter(([, p]) => p !== pt).map(([, p]) => p), `"${en}" = ${pt}.`);
};

const vocabPtToEn: Maker = (topic) => {
  const vocab = KNOWLEDGE[topic]?.vocabulary ?? [];
  if (vocab.length < 6) return null;
  const [en, pt] = pick(vocab);
  return choice(topic, 'Como se diz em inglês (EUA)?', `"${pt}"`, first(en), vocab.filter(([e]) => e !== en).map(([e]) => first(e)), `"${pt}" = ${en}.`);
};

const vocabWriting: Maker = (topic) => {
  const vocab = KNOWLEDGE[topic]?.vocabulary ?? [];
  if (vocab.length < 6) return null;
  const [en, pt] = pick(vocab);
  if (vocab.filter(([, p]) => p === pt).length > 1) return null;
  return writing(topic, 'Escreva em inglês (EUA)', pt, variants(en), `"${pt}" = ${en}.`);
};

const phraseWriting: Maker = (topic) => {
  const phrases = KNOWLEDGE[topic]?.phrases ?? [];
  if (phrases.length === 0) return null;
  const [en, pt] = pick(phrases);
  if (en.includes('...')) return null;
  return writing(topic, 'Traduza para o inglês', pt, variants(en), `Frase útil do tema: "${variants(en)[0]}".`);
};

// ------------------------------------------------------------------ irregular verbs

const verbPast: Maker = (topic) => {
  const [base, past, , pt] = pick(IRREGULAR_VERBS.filter((v) => !v[1].includes('/')));
  const wrong = [`${base}ed`, `${base}d`, past.endsWith('ed') ? `${base}t` : `${past}ed`, ...IRREGULAR_VERBS.map((v) => v[1])];
  return choice(topic, 'Qual é o passado simples?', `${base} (${pt})`, past, wrong.filter((w) => w !== past && !w.includes('/')), `${base} → ${past} (passado simples).`);
};

const verbParticiple: Maker = (topic) => {
  const [base, past, part, pt] = pick(IRREGULAR_VERBS.filter((v) => v[1] !== v[2]));
  return writing(topic, 'Escreva o particípio passado (inglês americano)', `${base} (${pt}) — passado: ${past}`, [part], `${base} → ${past} → ${part}. O particípio é usado com have/has/had.`);
};

const verbPastWriting: Maker = (topic) => {
  const [base, past, , pt] = pick(IRREGULAR_VERBS.filter((v) => !v[1].includes('/')));
  return writing(topic, 'Escreva o passado simples', `${base} (${pt})`, [past], `${base} → ${past}.`);
};

const PERFECT_SUBJECTS: [string, string][] = [['I', 'have'], ['We', 'have'], ['They', 'have'], ['She', 'has'], ['He', 'has'], ['My brother', 'has']];
const PERFECT_FRAMES: [string, string][] = [
  ['eat', 'sushi'], ['see', 'the Grand Canyon'], ['drive', 'a truck'], ['fly', 'in a helicopter'], ['ride', 'a horse'], ['swim', 'in the ocean'],
  ['write', 'a poem'], ['break', 'a bone'], ['take', 'a cruise'], ['drink', 'coconut water'], ['wear', 'a suit to work'], ['sing', 'in public'],
  ['give', 'a speech'], ['throw', 'a surprise party'], ['steal', 'anything'], ['speak', 'in public'], ['draw', 'a map'], ['grow', 'vegetables'],
  ['shake', 'hands with a celebrity'], ['forget', 'an appointment'], ['fall', 'off a bike'],
];

const participleSentence: Maker = (topic) => {
  const [verb, rest] = pick(PERFECT_FRAMES);
  const [subject, aux] = pick(PERFECT_SUBJECTS);
  const [, past, part] = IRREGULAR_VERBS.find((v) => v[0] === verb)!;
  return choice(topic, 'Complete com o particípio passado', `${subject} ${aux} never ___ ${rest}. (${verb})`, part, [past, verb, WRONG_PAST[verb] ?? `${verb}ed`], `Present perfect: have/has + particípio. ${verb} → ${past} → ${part}.`);
};

// Pasts that are also the base form of another verb (to saw, to found, to fell, to bore): "which verb is it from?" would be ambiguous.
const AMBIGUOUS_PAST = new Set(['saw', 'found', 'fell', 'bore']);

const baseFromPast: Maker = (topic) => {
  const [base, past, part, pt] = pick(IRREGULAR_VERBS.filter((v) => v[1] !== v[0] && !v[1].includes('/') && !AMBIGUOUS_PAST.has(v[1])));
  return choice(topic, 'Escolha a alternativa correta', `“${past}” é o passado simples de qual verbo?`, base, IRREGULAR_VERBS.map((v) => v[0]), `${base} → ${past} → ${part} (${pt}).`);
};

// ------------------------------------------------------------------ irregular verbs: pick every correct option

const listPt = (items: string[]) => `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
const between = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const ALL_PASTS = new Set(IRREGULAR_VERBS.flatMap((v) => v[1].split('/')));
const ALL_PARTICIPLES = new Set(IRREGULAR_VERBS.map((v) => v[2]));
const COMMON = new Set([
  'go', 'see', 'eat', 'take', 'write', 'speak', 'break', 'choose', 'drive', 'give', 'know', 'fly', 'throw', 'steal', 'forget', 'swim', 'sing',
  'begin', 'drink', 'fall', 'ride', 'wear', 'buy', 'bring', 'think', 'teach', 'catch', 'sell', 'tell', 'sleep', 'keep', 'feel', 'find', 'meet',
  'lose', 'send', 'spend', 'stand', 'understand', 'make', 'hear', 'get', 'have', 'do', 'come', 'run', 'sit', 'win', 'pay', 'say', 'leave', 'hold',
]);
const COMMON_VERBS = IRREGULAR_VERBS.filter((v) => COMMON.has(v[0]));
const forms = (v: (typeof IRREGULAR_VERBS)[number]) => `${v[0]} → ${v[1]} → ${v[2]}`;

/** 6 options, 2 to 4 of them correct. The prompt lists the options in the order they are shown. */
function multi(topic: string, prompt: (listed: string) => string, correct: string[], wrong: string[], explanation: string): NewQuestion | null {
  const options = shuffle([...correct, ...wrong]);
  if (options.length !== 6 || new Set(options.map(normalizeOption)).size !== 6) return null;
  const accepted = options.filter((o) => correct.includes(o));
  return { topic, type: 'multi', instruction: 'Selecione todas as alternativas corretas', prompt: prompt(listPt(options)), options, answer: accepted.join(', '), accepted, explanation, source: 'generated' };
}

const multiIrregular: Maker = (topic) => {
  const n = between(2, 4);
  const irregular = sample(IRREGULAR_VERBS.filter((v) => v[0] !== 'be'), n);
  const regular = sample(REGULAR_VERBS, 6 - n);
  return multi(
    topic,
    (list) => `Dentre os verbos ${list}, quais são irregulares?`,
    irregular.map((v) => v[0]),
    regular.map(([base]) => base),
    `Irregulares: ${irregular.map(forms).join('; ')}. Regulares, com passado em -ed: ${regular.map(([b, p]) => `${b} → ${p}`).join('; ')}.`,
  );
};

const multiPast: Maker = (topic) => {
  const n = between(2, 4);
  const pool = shuffle(COMMON_VERBS.filter((v) => v[1] !== v[0]));
  const right = pool.slice(0, n);
  const wrong: { form: string; why: string }[] = [];
  for (const v of pool.slice(n)) {
    if (wrong.length === 6 - n) break;
    // Half the wrong forms are participles used as past (taken), half are a made-up -ed (taked).
    const asParticiple = Math.random() < 0.5 && v[2] !== v[1] && v[2] !== v[0];
    const form = asParticiple ? v[2] : WRONG_PAST[v[0]];
    if (!form || ALL_PASTS.has(form)) continue;
    wrong.push({ form, why: asParticiple ? `${form} é o particípio de ${v[0]}; o passado é ${v[1]}` : `${form} não existe; o passado de ${v[0]} é ${v[1]}` });
  }
  if (wrong.length < 6 - n) return null;
  return multi(
    topic,
    (list) => `Dentre as formas ${list}, quais são passado simples corretos?`,
    right.map((v) => v[1]),
    wrong.map((w) => w.form),
    `Corretas: ${right.map((v) => `${v[1]} (${v[0]})`).join(', ')}. Erradas: ${wrong.map((w) => w.why).join('; ')}.`,
  );
};

const multiParticiple: Maker = (topic) => {
  const n = between(2, 4);
  const pool = shuffle(COMMON_VERBS.filter((v) => v[2] !== v[1] && v[2] !== v[0]));
  const right = pool.slice(0, n);
  const wrong: { form: string; why: string }[] = [];
  for (const v of pool.slice(n)) {
    if (wrong.length === 6 - n) break;
    const asPast = Math.random() < 0.6;
    const form = asPast ? v[1] : WRONG_PAST[v[0]];
    if (!form || ALL_PARTICIPLES.has(form)) continue;
    wrong.push({ form, why: asPast ? `${form} é o passado de ${v[0]}; o particípio é ${v[2]}` : `${form} não existe; o particípio de ${v[0]} é ${v[2]}` });
  }
  if (wrong.length < 6 - n) return null;
  return multi(
    topic,
    (list) => `Dentre as formas ${list}, quais são particípios passados corretos?`,
    right.map((v) => v[2]),
    wrong.map((w) => w.form),
    `Corretas: ${right.map((v) => `${v[2]} (${v[0]})`).join(', ')}. Erradas: ${wrong.map((w) => w.why).join('; ')}.`,
  );
};

const multiSameForms: Maker = (topic) => {
  const n = between(2, 4);
  const same = sample(COMMON_VERBS.filter((v) => v[1] === v[2]), n);
  const different = sample(COMMON_VERBS.filter((v) => v[1] !== v[2]), 6 - n);
  return multi(
    topic,
    (list) => `Dentre os verbos ${list}, quais têm o passado igual ao particípio?`,
    same.map((v) => v[0]),
    different.map((v) => v[0]),
    `Iguais: ${same.map(forms).join('; ')}. Diferentes: ${different.map(forms).join('; ')}.`,
  );
};

/** One "pick every correct option" question of each kind, in random order; the irregular-verb drill always opens with these. */
export function irregularMultiQuestions(count: number, avoidPrompts: Set<string>): NewQuestion[] {
  const out: NewQuestion[] = [];
  const kinds = shuffle([multiIrregular, multiPast, multiParticiple, multiSameForms]);
  for (let attempt = 0; out.length < count && attempt < count * 25; attempt++) {
    const q = kinds[out.length % kinds.length](IRREGULAR_TOPIC);
    if (q && !avoidPrompts.has(q.prompt) && !out.some((o) => o.prompt === q.prompt)) out.push(q);
  }
  return out;
}

const PAST_SUBJECTS = ['I', 'She', 'They', 'We', 'Mr. Jones', 'The tourists'];
const PAST_FRAMES: [string, string][] = [
  ['go', 'to the beach yesterday'], ['buy', 'a new suitcase last week'], ['see', 'Christ the Redeemer last year'], ['eat', 'feijoada last Saturday'],
  ['take', 'a taxi to the airport this morning'], ['speak', 'with the manager yesterday'], ['have', 'dinner at a great restaurant last night'],
  ['meet', 'a tour guide in Salvador'], ['fly', 'to New York last month'], ['write', 'an email to the hotel yesterday'], ['leave', 'the hotel at nine this morning'],
];

const pastSentence: Maker = (topic) => {
  const [verb, rest] = pick(PAST_FRAMES);
  const subject = pick(PAST_SUBJECTS);
  const past = IRREGULAR_VERBS.find((v) => v[0] === verb)?.[1] ?? `${verb}ed`;
  const wrong = [`${verb}ed`, verb, `${verb}s`, `did ${past}`, `was ${verb}`];
  return choice(topic, 'Complete com o simple past', `${subject} ___ ${rest}. (${verb})`, past, wrong, `${verb} é irregular: passado = ${past}.`);
};

const pastQuestion: Maker = (topic) => {
  const [verb, rest] = pick(PAST_FRAMES);
  const subject = pick(PAST_SUBJECTS);
  const past = IRREGULAR_VERBS.find((v) => v[0] === verb)?.[1] ?? `${verb}ed`;
  const subj = ['She', 'They', 'We'].includes(subject) ? subject.toLowerCase() : subject.replace(/^The /, 'the ');
  return writing(topic, 'Passe para a forma interrogativa', `${subject} ${past} ${rest}.`, [`Did ${subj} ${verb} ${rest}?`], 'Pergunta no passado: Did + sujeito + verbo no infinitivo.');
};

// ------------------------------------------------------------------ comparatives

const ADJECTIVES: [string, string, string][] = [
  ['cheap', 'cheaper', 'the cheapest'], ['tall', 'taller', 'the tallest'], ['old', 'older', 'the oldest'], ['cold', 'colder', 'the coldest'],
  ['small', 'smaller', 'the smallest'], ['fast', 'faster', 'the fastest'], ['high', 'higher', 'the highest'], ['long', 'longer', 'the longest'],
  ['big', 'bigger', 'the biggest'], ['hot', 'hotter', 'the hottest'], ['nice', 'nicer', 'the nicest'], ['large', 'larger', 'the largest'],
  ['happy', 'happier', 'the happiest'], ['busy', 'busier', 'the busiest'], ['easy', 'easier', 'the easiest'], ['early', 'earlier', 'the earliest'],
  ['expensive', 'more expensive', 'the most expensive'], ['beautiful', 'more beautiful', 'the most beautiful'], ['famous', 'more famous', 'the most famous'],
  ['important', 'more important', 'the most important'], ['comfortable', 'more comfortable', 'the most comfortable'], ['interesting', 'more interesting', 'the most interesting'],
  ['good', 'better', 'the best'], ['bad', 'worse', 'the worst'], ['far', 'farther', 'the farthest'],
];

function wrongComparatives(adj: string): string[] {
  return [`more ${adj}`, `${adj}er`, `${adj}r`, `more ${adj}er`, `${adj}est`, `most ${adj}`].filter((w) => !w.endsWith('eer'));
}

const comparativeChoice: Maker = (topic) => {
  const [adj, comp] = pick(ADJECTIVES);
  return choice(topic, 'Qual é o comparativo?', adj, comp, [...wrongComparatives(adj), 'more better', 'worst'], `${adj} → ${comp}.`);
};

const superlativeWriting: Maker = (topic) => {
  const [adj, , sup] = pick(ADJECTIVES);
  return writing(topic, 'Escreva o superlativo', adj, [sup, sup.replace(/^the /, '')], `${adj} → ${sup}.`);
};

// ------------------------------------------------------------------ nouns and articles

const PLURALS: [string, string][] = [
  ['bus', 'buses'], ['church', 'churches'], ['box', 'boxes'], ['beach', 'beaches'], ['glass', 'glasses'], ['city', 'cities'], ['country', 'countries'],
  ['day', 'days'], ['boy', 'boys'], ['key', 'keys'], ['wife', 'wives'], ['knife', 'knives'], ['shelf', 'shelves'], ['man', 'men'], ['woman', 'women'],
  ['child', 'children'], ['tooth', 'teeth'], ['foot', 'feet'], ['person', 'people'], ['potato', 'potatoes'], ['tomato', 'tomatoes'], ['museum', 'museums'],
  ['map', 'maps'], ['statue', 'statues'], ['party', 'parties'], ['dish', 'dishes'], ['life', 'lives'], ['mouse', 'mice'], ['family', 'families'],
];

const pluralWriting: Maker = (topic) => {
  const [s, p] = pick(PLURALS);
  return writing(topic, 'Escreva o plural', s, [p], `${s} → ${p}.`);
};

const ARTICLE_WORDS: [string, 'a' | 'an', string][] = [
  ['hour', 'an', 'h mudo, som de vogal'], ['honest man', 'an', 'h mudo'], ['airport', 'an', 'som de vogal'], ['apple', 'an', 'som de vogal'],
  ['umbrella', 'an', 'som de vogal'], ['island', 'an', 'som de vogal'], ['aisle seat', 'an', 'som de vogal'], ['inn', 'an', 'som de vogal'],
  ['hotel', 'a', 'h aspirado, som de consoante'], ['hospital', 'a', 'h aspirado'], ['university', 'a', 'som de "iu" (consoante)'],
  ['European city', 'a', 'som de "iu" (consoante)'], ['uniform', 'a', 'som de "iu"'], ['one-way ticket', 'a', 'som de "uan" (consoante)'],
  ['tour guide', 'a', 'som de consoante'], ['restaurant', 'a', 'som de consoante'], ['receptionist', 'a', 'som de consoante'], ['engineer', 'an', 'som de vogal'],
];

const articleChoice: Maker = (topic) => {
  const [word, art, why] = pick(ARTICLE_WORDS);
  const other = art === 'a' ? 'an' : 'a';
  const words = word.split(' ');
  const plural = [...words.slice(0, -1), `${words[words.length - 1]}s`].join(' ');
  const options = shuffle([`${art} ${word}`, `${other} ${word}`, `${art} ${plural}`, `${other} ${plural}`]);
  return { topic, type: 'choice', instruction: 'Escolha a forma correta', prompt: `Artigo indefinido + "${word}"`, options, answer: `${art} ${word}`, accepted: [`${art} ${word}`], explanation: `"${art} ${word}": ${why}. O artigo a/an só acompanha substantivo no singular.`, source: 'generated' };
};

// ------------------------------------------------------------------ to be and simple present

/** [subject, present form, complement in the present, complement in the past] */
const BE_FRAMES: [string, string, string, string][] = [
  ['I', 'am', 'a tour guide', 'at the hotel last night'], ['She', 'is', 'from Canada', 'in Toronto last week'], ['They', 'are', 'at the airport', 'at the airport yesterday'],
  ['We', 'are', 'tourism students', 'very tired after the trip'], ['The hotel', 'is', 'next to the beach', 'full last weekend'], ['Mary and Sandra', 'are', 'in Rio', 'in Salvador last month'],
  ['It', 'is', 'very hot today', 'very cold yesterday'], ['You', 'are', 'late', 'late for the meeting yesterday'], ['My flight', 'is', 'delayed', 'delayed this morning'],
  ['The museums', 'are', 'closed on Mondays', 'closed last Monday'], ['He', 'is', 'the hotel manager', 'at the bank this morning'],
];
const BE_PAST: Record<string, string> = { am: 'was', is: 'was', are: 'were' };

const beChoice: Maker = (topic) => {
  const [subject, verb, present, pastRest] = pick(BE_FRAMES);
  const past = Math.random() < 0.4;
  const correct = past ? BE_PAST[verb] : verb;
  const options = past ? ['was', 'were', 'did', 'is'] : ['am', 'is', 'are', 'be'];
  const prompt = `${subject} ___ ${past ? pastRest : present}.`;
  return { topic, type: 'choice', instruction: 'Complete com o verbo to be', prompt, options: shuffle(options), answer: correct, accepted: [correct], explanation: past ? `Passado: I/he/she/it → was; you/we/they → were.` : 'Presente: I am; he/she/it is; you/we/they are.', source: 'generated' };
};

/** [base, third person, complement] */
const PRESENT_VERBS: [string, string, string][] = [
  ['work', 'works', 'at a hotel'], ['live', 'lives', 'near the beach'], ['speak', 'speaks', 'English and Spanish'], ['like', 'likes', 'Italian food'],
  ['travel', 'travels', 'for work'], ['go', 'goes', 'to the gym'], ['watch', 'watches', 'soccer games on TV'], ['study', 'studies', 'English at night'],
  ['have', 'has', 'lunch at noon'], ['fly', 'flies', 'to São Paulo'], ['fix', 'fixes', 'cars at the auto repair shop'], ['play', 'plays', 'volleyball on the beach'],
  ['wash', 'washes', 'the dishes'], ['teach', 'teaches', 'English to tourists'], ['take', 'takes', 'the subway to work'], ['drive', 'drives', 'a taxi'],
];

const thirdPerson: Maker = (topic) => {
  const [base, third, rest] = pick(PRESENT_VERBS);
  const subject = pick(['He', 'She', 'Mary', 'The manager', 'My brother']);
  return writing(topic, 'Complete com o simple present', `${subject} ___ ${rest} every day. (${base})`, [third], `Terceira pessoa (he/she/it): ${base} → ${third}.`);
};

const negativePresent: Maker = (topic) => {
  const [base, third, rest] = pick(PRESENT_VERBS.filter(([b]) => b !== 'have'));
  const he = Math.random() < 0.5;
  const subject = he ? pick(['She', 'He', 'Mr. Jones']) : pick(['They', 'We', 'I']);
  const neg = `${subject} ${he ? 'does' : 'do'} not ${base} ${rest}.`;
  return writing(topic, 'Passe para a forma negativa', `${subject} ${he ? third : base} ${rest}.`, [neg], he ? 'He/she/it: doesn’t + verbo no infinitivo.' : 'I/you/we/they: don’t + verbo.');
};

// ------------------------------------------------------------------ curated templates for the other grammar topics

/** [prompt, accepted answers, explanation, options?]. With options, the first one is correct and it becomes a choice question. */
type Frame = [string, string[], string, string[]?];

const FRAMES: Record<string, Frame[]> = {
  'g-modals': [
    ['___ I help you, sir?', ['May'], 'Oferta de ajuda formal: May/Can I help you?', ['May', 'Must', 'Should', 'Would']],
    ['You ___ wear a seat belt. It’s the law.', ['must'], 'Obrigação forte (lei): must.', ['must', 'would', 'could', 'may']],
    ['___ you like some coffee?', ['Would'], 'Oferta educada: Would you like...?', ['Would', 'Do', 'Should', 'Must']],
    ['I ___ swim when I was five.', ['could'], 'Habilidade no passado: could.', ['could', 'can', 'must', 'should']],
    ['You have a fever. You ___ see a doctor.', ['should'], 'Conselho: should.', ['should', 'would', 'may', 'can’t']],
    ['She ___ speak three languages.', ['can'], 'Habilidade no presente: can.', ['can', 'cans', 'can to', 'is can']],
    ['You ___ park here. It’s a bus stop.', ['can’t'], 'Proibição: can’t (cannot).', ['can’t', 'should', 'would', 'could']],
    ['The museum is open until 6 p.m., so we ___ visit it this afternoon.', ['can'], 'Possibilidade: can.', ['can', 'must not', 'can’t', 'shouldn’t']],
  ],
  'g-prepositions': [
    ['The meeting starts ___ 9 a.m.', ['at'], 'Horas: at.', ['at', 'on', 'in', 'by']],
    ['We always travel ___ July.', ['in'], 'Meses: in.', ['in', 'on', 'at', 'by']],
    ['The museum is closed ___ Mondays.', ['on'], 'Dias da semana: on.', ['on', 'in', 'at', 'by']],
    ['My parents live ___ Florida.', ['in'], 'Estados, cidades e países: in.', ['in', 'on', 'at', 'by']],
    ['The restaurant is ___ the second floor.', ['on'], 'Andares: on.', ['on', 'in', 'at', 'by']],
    ['I’ll meet you ___ the airport.', ['at'], 'Ponto de encontro específico: at.', ['at', 'on', 'by', 'to']],
    ['The keys are ___ my bag.', ['in'], 'Dentro de algo: in.', ['in', 'on', 'at', 'by']],
    ['We went to the beach ___ bus.', ['by'], 'Meio de transporte: by.', ['by', 'on', 'in', 'with']],
    ['The bank is ___ the post office and the drugstore.', ['between'], 'Entre dois lugares: between.', ['between', 'behind', 'next', 'across']],
    ['There’s a nice café ___ the hotel, on the other side of the street.', ['across from'], 'Do outro lado da rua: across from.', ['across from', 'next', 'between', 'behind of']],
  ],
  'g-pronouns': [
    ['This is Paul. ___ is my coworker.', ['He'], 'Sujeito masculino: he.', ['He', 'Him', 'His', 'Her']],
    ['I don’t know those tourists. Do you know ___?', ['them'], 'Objeto plural: them.', ['them', 'they', 'their', 'theirs']],
    ['Is this your passport? — Yes, it’s ___.', ['mine'], 'Pronome possessivo: mine.', ['mine', 'my', 'me', 'I']],
    ['Sandra loves ___ job at the hotel.', ['her'], 'Possessivo de she: her.', ['her', 'his', 'their', 'hers']],
    ['We booked ___ tickets online.', ['our'], 'Possessivo de we: our.', ['our', 'ours', 'us', 'we']],
    ['The dog is wagging ___ tail.', ['its'], 'Possessivo de it: its (sem apóstrofo).', ['its', 'it’s', 'it', 'its’']],
    ['Can you help ___? I’m lost.', ['me'], 'Objeto de I: me.', ['me', 'I', 'my', 'mine']],
    ['These bags aren’t ours. They’re ___.', ['theirs'], 'Pronome possessivo de they: theirs.', ['theirs', 'their', 'them', 'they']],
  ],
  'g-future': [
    ['It’s cold. I think I ___ a jacket. (wear)', ['will wear'], 'Decisão no momento: will.'],
    ['We ___ my grandparents next weekend. We bought the tickets yesterday. (visit)', ['are going to visit'], 'Plano já decidido: be going to.'],
    ['Look at the sky! It ___. (rain)', ['is going to rain'], 'Previsão com evidência: going to.'],
    ['Don’t worry. I ___ anyone. (not / tell)', ['will not tell'], 'Promessa: will / won’t.'],
    ['She ___ her new job on Monday. She signed the contract. (start)', ['is going to start'], 'Plano decidido: going to.'],
    ['If it rains, we ___ at the hotel. (stay)', ['will stay'], 'If + presente → will.'],
  ],
  'g-present-perfect': [
    ['I ___ to New York three times. (be)', ['have been'], 'Experiência: have been.'],
    ['She ___ her passport. She can’t travel. (lose)', ['has lost'], 'Ação passada com efeito agora: has lost.'],
    ['We ___ each other since 2015. (know)', ['have known'], 'Duração com since: have known.'],
    ['They ___ the report yet. (not / finish)', ['have not finished'], 'Negativa + yet.'],
    ['He ___ here for ten years. (work)', ['has worked', 'has been working'], 'Duração com for.'],
    ['I ___ snow. (never / see)', ['have never seen'], 'Never entre have e o particípio.'],
    ['The plane ___. (just / land)', ['has just landed', 'just landed'], 'Just = acabou de (nos EUA o simple past também é aceito).'],
  ],
  'g-past-perfect': [
    ['When we got to the gate, the plane ___. (leave)', ['had left', 'had already left'], 'Ação anterior: had left.'],
    ['She ___ by plane before that trip. (never / travel)', ['had never traveled'], 'Had + never + particípio.'],
    ['I couldn’t pay because I ___ my wallet. (forget)', ['had forgotten'], 'A causa aconteceu antes: had forgotten.'],
    ['By the time the guide arrived, the tourists ___ to the beach. (go)', ['had gone', 'had already gone'], 'Had + gone.'],
    ['They ___ anything, so they were hungry. (not / eat)', ['had not eaten'], 'Hadn’t + particípio.'],
    ['He told me he ___ to Peru before. (be)', ['had been'], 'Had been = tinha estado.'],
  ],
  'g-perfect-continuous': [
    ['I ___ for the bus for 30 minutes. (wait)', ['have been waiting'], 'Present perfect continuous: have been + -ing.'],
    ['She’s tired because she ___ all day. (work)', ['has been working'], 'Has been + -ing.'],
    ['They ___ here since 2018. (live)', ['have been living', 'have lived'], 'Duração até agora.'],
    ['We ___ for hours when we finally found the hotel. (walk)', ['had been walking'], 'Past perfect continuous: had been + -ing.'],
    ['He ___ for six hours before he stopped for lunch. (drive)', ['had been driving'], 'Had been + -ing.'],
  ],
  'g-present-continuous': [
    ['Be quiet! The baby ___. (sleep)', ['is sleeping'], 'Agora: is + -ing.'],
    ['We ___ lunch right now. Can I call you later? (have)', ['are having'], 'Have (refeição) aceita -ing: are having.'],
    ['The guests ___ in at the front desk now. (check)', ['are checking'], 'Plural: are + -ing.'],
    ['I ___ for the subway station. (look)', ['am looking'], 'I am + -ing.'],
    ['She ___ today. She’s on vacation. (not / work)', ['is not working'], 'Negativa: isn’t + -ing.'],
    ['The taxi driver ___ outside. (wait)', ['is waiting'], 'Is + -ing.'],
  ],
  'g-frequency': [
    ['I go to the gym three times a week. I ___ go to the gym.', ['often', 'usually'], 'Três vezes por semana = often/usually.'],
    ['He hates flying, so he ___ travels by plane.', ['rarely', 'seldom', 'never'], 'Raramente ou nunca.'],
    ['Escolha a ordem correta (to be):', ['She is usually late.'], 'Com to be, o advérbio vem depois do verbo.', ['She is usually late.', 'She usually is late.', 'Usually is she late.', 'She is late usually always.']],
    ['Escolha a ordem correta (verbo principal):', ['We always have breakfast at 7.'], 'O advérbio vem antes do verbo principal.', ['We always have breakfast at 7.', 'We have always breakfast at 7.', 'Always we have breakfast always at 7.', 'We have breakfast always at 7 every.']],
    ['___ do you go to the beach? — Every weekend.', ['How often'], 'Pergunta de frequência: How often.', ['How often', 'How much', 'How long', 'How many']],
    ['The sun ___ rises in the east.', ['always'], 'Verdade universal: always.', ['always', 'sometimes', 'rarely', 'never']],
  ],
};

function frameMaker(frames: Frame[]): Maker {
  return (topic) => {
    const [prompt, accepted, explanation, options] = pick(frames);
    if (options) return { topic, type: 'choice', instruction: 'Escolha a alternativa correta', prompt, options: shuffle(options), answer: options[0], accepted: [options[0]], explanation, source: 'generated' };
    return writing(topic, 'Complete a frase', prompt, accepted, explanation);
  };
}

// ------------------------------------------------------------------ routing

const ROUTES: Record<string, Maker[]> = {
  [IRREGULAR_TOPIC]: [verbPast, verbParticiple, verbPastWriting, participleSentence, baseFromPast],
  'g-simple-past': [pastSentence, pastQuestion, verbPastWriting],
  'g-comparatives': [comparativeChoice, superlativeWriting],
  'g-articles-nouns': [pluralWriting, articleChoice],
  'g-to-be': [beChoice],
  'g-simple-present': [thirdPerson, negativePresent],
  turismo: [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting, pluralWriting],
  esportes: [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting, pastSentence],
  geografia: [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting, comparativeChoice],
  clima: [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting, beChoice],
  cidade: [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting, thirdPerson],
  'dia-a-dia': [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting, articleChoice],
};
for (const [topic, frames] of Object.entries(FRAMES)) ROUTES[topic] = [frameMaker(frames)];
const THEME_DEFAULT: Maker[] = [vocabEnToPt, vocabPtToEn, vocabWriting, phraseWriting];

export function proceduralQuestions(topics: string[], count: number, avoidPrompts: Set<string>): NewQuestion[] {
  const out: NewQuestion[] = [];
  const seen = new Set([...avoidPrompts].map(normalizeAnswer));
  for (let attempt = 0; out.length < count && attempt < count * 25; attempt++) {
    const topic = pick(topics);
    const q = pick(ROUTES[topic] ?? THEME_DEFAULT)(topic);
    if (!q) continue;
    const key = normalizeAnswer(q.prompt);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
