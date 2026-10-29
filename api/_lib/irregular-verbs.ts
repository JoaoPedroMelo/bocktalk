/**
 * Irregular verb data shared by the server (question makers) and the browser (reference table).
 * Kept free of other imports so the front end can bundle it on its own.
 */

/** Irregular verbs from "Verbos Irregulares.xlsx", normalized to American English forms. [base, past, past participle, pt] */
export const IRREGULAR_VERBS: [string, string, string, string][] = [
  ['awake', 'awoke', 'awoken', 'acordar'], ['be', 'was/were', 'been', 'ser, estar'], ['bear', 'bore', 'borne', 'suportar, carregar'], ['beat', 'beat', 'beaten', 'bater, vencer'],
  ['become', 'became', 'become', 'tornar-se'], ['begin', 'began', 'begun', 'começar'], ['bend', 'bent', 'bent', 'dobrar'], ['bet', 'bet', 'bet', 'apostar'], ['bid', 'bid', 'bid', 'fazer um lance'],
  ['bite', 'bit', 'bitten', 'morder'], ['blow', 'blew', 'blown', 'soprar'], ['break', 'broke', 'broken', 'quebrar'], ['bring', 'brought', 'brought', 'trazer'], ['build', 'built', 'built', 'construir'],
  ['buy', 'bought', 'bought', 'comprar'], ['catch', 'caught', 'caught', 'pegar'], ['choose', 'chose', 'chosen', 'escolher'], ['come', 'came', 'come', 'vir'], ['cost', 'cost', 'cost', 'custar'],
  ['cut', 'cut', 'cut', 'cortar'], ['do', 'did', 'done', 'fazer'], ['draw', 'drew', 'drawn', 'desenhar'], ['drink', 'drank', 'drunk', 'beber'], ['drive', 'drove', 'driven', 'dirigir'],
  ['eat', 'ate', 'eaten', 'comer'], ['fall', 'fell', 'fallen', 'cair'], ['feed', 'fed', 'fed', 'alimentar'], ['feel', 'felt', 'felt', 'sentir'], ['fight', 'fought', 'fought', 'lutar'],
  ['find', 'found', 'found', 'encontrar'], ['fly', 'flew', 'flown', 'voar'], ['forget', 'forgot', 'forgotten', 'esquecer'], ['forgive', 'forgave', 'forgiven', 'perdoar'], ['freeze', 'froze', 'frozen', 'congelar'],
  ['get', 'got', 'gotten', 'obter, conseguir'], ['give', 'gave', 'given', 'dar'], ['go', 'went', 'gone', 'ir'], ['grow', 'grew', 'grown', 'crescer'], ['hang', 'hung', 'hung', 'pendurar'],
  ['have', 'had', 'had', 'ter'], ['hear', 'heard', 'heard', 'ouvir'], ['hide', 'hid', 'hidden', 'esconder'], ['hit', 'hit', 'hit', 'bater, acertar'], ['hold', 'held', 'held', 'segurar'],
  ['hurt', 'hurt', 'hurt', 'machucar'], ['keep', 'kept', 'kept', 'manter, guardar'], ['know', 'knew', 'known', 'saber, conhecer'], ['lay', 'laid', 'laid', 'colocar, deitar (algo)'], ['lead', 'led', 'led', 'liderar'],
  ['leave', 'left', 'left', 'sair, deixar'], ['lose', 'lost', 'lost', 'perder'], ['make', 'made', 'made', 'fazer'], ['mean', 'meant', 'meant', 'significar'],
  ['meet', 'met', 'met', 'conhecer, encontrar'], ['pay', 'paid', 'paid', 'pagar'], ['put', 'put', 'put', 'colocar'], ['read', 'read', 'read', 'ler'], ['ride', 'rode', 'ridden', 'andar (de bicicleta, cavalo)'],
  ['ring', 'rang', 'rung', 'tocar (campainha)'], ['rise', 'rose', 'risen', 'subir, levantar-se'], ['run', 'ran', 'run', 'correr'], ['say', 'said', 'said', 'dizer'], ['see', 'saw', 'seen', 'ver'],
  ['sell', 'sold', 'sold', 'vender'], ['send', 'sent', 'sent', 'enviar'], ['set', 'set', 'set', 'definir, ajustar'], ['shake', 'shook', 'shaken', 'sacudir, agitar'], ['shine', 'shone', 'shone', 'brilhar'],
  ['shoot', 'shot', 'shot', 'atirar'], ['show', 'showed', 'shown', 'mostrar'], ['shrink', 'shrank', 'shrunk', 'encolher'], ['shut', 'shut', 'shut', 'fechar'], ['sing', 'sang', 'sung', 'cantar'],
  ['sink', 'sank', 'sunk', 'afundar'], ['sit', 'sat', 'sat', 'sentar'], ['sleep', 'slept', 'slept', 'dormir'], ['speak', 'spoke', 'spoken', 'falar'], ['spend', 'spent', 'spent', 'gastar, passar (tempo)'],
  ['stand', 'stood', 'stood', 'ficar em pé'], ['steal', 'stole', 'stolen', 'roubar'], ['swim', 'swam', 'swum', 'nadar'], ['take', 'took', 'taken', 'pegar, levar'], ['teach', 'taught', 'taught', 'ensinar'],
  ['tear', 'tore', 'torn', 'rasgar'], ['tell', 'told', 'told', 'contar, dizer'], ['think', 'thought', 'thought', 'pensar'], ['throw', 'threw', 'thrown', 'jogar, arremessar'], ['understand', 'understood', 'understood', 'entender'],
  ['wake', 'woke', 'woken', 'acordar'], ['wear', 'wore', 'worn', 'vestir, usar (roupa)'], ['win', 'won', 'won', 'ganhar, vencer'], ['write', 'wrote', 'written', 'escrever'],
];

/** Verbs that are regular in American English although British English also uses an irregular form (learnt, dreamt...). */
export const REGULAR_IN_US: [string, string][] = [['learn', 'learned'], ['dream', 'dreamed'], ['burn', 'burned'], ['spell', 'spelled']];

/**
 * Verbs that are unambiguously regular in American English, with their past form. Distractors for
 * "which verbs are irregular?" questions, so verbs regular only in the US (learn, dream) stay out.
 */
export const REGULAR_VERBS: [string, string][] = [
  ['work', 'worked'], ['play', 'played'], ['visit', 'visited'], ['travel', 'traveled'], ['call', 'called'], ['watch', 'watched'],
  ['want', 'wanted'], ['need', 'needed'], ['help', 'helped'], ['open', 'opened'], ['ask', 'asked'], ['like', 'liked'],
  ['love', 'loved'], ['cook', 'cooked'], ['clean', 'cleaned'], ['walk', 'walked'], ['talk', 'talked'], ['live', 'lived'],
  ['arrive', 'arrived'], ['stay', 'stayed'], ['study', 'studied'], ['try', 'tried'], ['stop', 'stopped'], ['plan', 'planned'],
  ['listen', 'listened'], ['start', 'started'], ['finish', 'finished'], ['answer', 'answered'], ['book', 'booked'], ['rent', 'rented'],
  ['order', 'ordered'], ['enjoy', 'enjoyed'], ['wait', 'waited'], ['use', 'used'], ['dance', 'danced'], ['move', 'moved'],
  ['change', 'changed'], ['close', 'closed'], ['carry', 'carried'], ['explain', 'explained'], ['look', 'looked'], ['smile', 'smiled'],
  ['park', 'parked'], ['pack', 'packed'], ['land', 'landed'], ['relax', 'relaxed'], ['return', 'returned'], ['prefer', 'preferred'],
];

/**
 * The typical learner mistake of adding -ed to an irregular verb. Only forms that are wrong in standard
 * American English with any meaning: hanged, shined, costed, putted, flied, ringed, singed... are left out.
 */
export const WRONG_PAST: Record<string, string> = {
  go: 'goed', eat: 'eated', buy: 'buyed', take: 'taked', catch: 'catched', bring: 'bringed', think: 'thinked', teach: 'teached',
  sell: 'selled', tell: 'telled', sleep: 'sleeped', keep: 'keeped', feel: 'feeled', find: 'finded', write: 'writed', drive: 'drived',
  speak: 'speaked', break: 'breaked', choose: 'choosed', know: 'knowed', grow: 'growed', throw: 'throwed', drink: 'drinked',
  swim: 'swimmed', win: 'winned', sit: 'sitted', run: 'runned', meet: 'meeted', lose: 'losed', send: 'sended', spend: 'spended',
  stand: 'standed', understand: 'understanded', give: 'gived', forget: 'forgetted', fall: 'falled', hold: 'holded', steal: 'stealed',
  wear: 'weared', say: 'sayed', make: 'maked', hear: 'heared', get: 'getted', have: 'haved', do: 'doed', cut: 'cutted',
  freeze: 'freezed', shoot: 'shooted', fight: 'fighted', begin: 'beginned', draw: 'drawed', blow: 'blowed', ride: 'rided',
  see: 'seed', fly: 'flyed', shake: 'shaked', come: 'comed', become: 'becomed', bite: 'bited', sink: 'sinked', forgive: 'forgived',
};
