import type { TopicMeta } from './types';

export const MIXED_TOPIC = 'misturado';
export const IRREGULAR_TOPIC = 'g-irregular';

export const TOPICS: TopicMeta[] = [
  { id: 'saudacoes', kind: 'theme', badge: 'hand', title: 'Saudações', subtitle: 'Cumprimentos, apresentações e despedidas', source: 'Lição 1' },
  { id: 'dia-a-dia', kind: 'theme', badge: 'messages', title: 'Dia a dia', subtitle: 'Expressões, perguntas e profissões', source: 'Lição 2' },
  { id: 'numeros', kind: 'theme', badge: 'hash', title: 'Números', subtitle: 'Idade, telefone, ordinais e andares', source: 'Lição 3' },
  { id: 'cidade', kind: 'theme', badge: 'map', title: 'Cidade e direções', subtitle: 'Lugares, preposições e como chegar', source: 'Lição 4' },
  { id: 'dinheiro-horas', kind: 'theme', badge: 'wallet', title: 'Dinheiro e horas', subtitle: 'Preços, pagamentos, horas e datas', source: 'Lição 5' },
  { id: 'hotel', kind: 'theme', badge: 'bed', title: 'Hotel', subtitle: 'Reservas, recepção e quarto', source: 'Lição 6' },
  { id: 'restaurante', kind: 'theme', badge: 'utensils', title: 'Restaurante', subtitle: 'Comida, pedidos e a conta', source: 'Lição 7' },
  { id: 'aeroporto', kind: 'theme', badge: 'plane', title: 'Aeroporto', subtitle: 'Check-in, voos e embarque', source: 'Lição 8' },
  { id: 'agencia', kind: 'theme', badge: 'luggage', title: 'Agência de viagens', subtitle: 'Pacotes, passagens e conselhos', source: 'Lição 9' },
  { id: 'transporte', kind: 'theme', badge: 'bus', title: 'Transporte', subtitle: 'Ônibus, metrô, táxi e distâncias', source: 'Lição 10' },
  { id: 'turismo', kind: 'theme', badge: 'landmark', title: 'Informações turísticas', subtitle: 'Atrações, recomendações e plurais', source: 'Lição 11' },
  { id: 'clima', kind: 'theme', badge: 'cloud', title: 'Clima', subtitle: 'Tempo, estações e roupas', source: 'Lição 12' },
  { id: 'esportes', kind: 'theme', badge: 'trophy', title: 'Esportes e lazer', subtitle: 'Jogos, filmes e shows', source: 'Lição 13' },
  { id: 'negocios', kind: 'theme', badge: 'briefcase', title: 'Negócios', subtitle: 'Escritório, reuniões e eventos', source: 'Lição 14' },
  { id: 'geografia', kind: 'theme', badge: 'mountain', title: 'Geografia e medidas', subtitle: 'Natureza, pesos, medidas e comparações', source: 'Lição 15' },

  { id: 'g-to-be', kind: 'grammar', badge: 'am / is / are', title: 'Verbo to be', subtitle: 'Presente e passado (was/were)', source: 'Lições 1, 2, 3 e 12' },
  { id: 'g-simple-present', kind: 'grammar', badge: 'do / does', title: 'Simple present', subtitle: 'Afirmativa, negativa e perguntas', source: 'Lições 4, 5 e 6' },
  { id: 'g-present-continuous', kind: 'grammar', badge: 'be + -ing', title: 'Present continuous', subtitle: 'Ações acontecendo agora', source: 'Lição 14' },
  { id: 'g-simple-past', kind: 'grammar', badge: '-ed / did', title: 'Simple past', subtitle: 'Regulares, irregulares e did', source: 'Lições 12 e 13' },
  { id: IRREGULAR_TOPIC, kind: 'grammar', badge: 'go / went / gone', title: 'Verbos irregulares', subtitle: 'Passado e particípio', source: 'Planilha de verbos' },
  { id: 'g-future', kind: 'grammar', badge: 'will / going to', title: 'Futuro', subtitle: 'Will, won’t e going to', source: 'Lição 10 e Tempos Verbais' },
  { id: 'g-present-perfect', kind: 'grammar', badge: 'have + V3', title: 'Present perfect', subtitle: 'Experiências, for/since, just/yet', source: 'Tempos Verbais' },
  { id: 'g-past-perfect', kind: 'grammar', badge: 'had + V3', title: 'Past perfect', subtitle: 'Uma ação antes da outra no passado', source: 'Tempos Verbais' },
  { id: 'g-perfect-continuous', kind: 'grammar', badge: 'been + -ing', title: 'Perfect continuous', subtitle: 'Present e past perfect continuous', source: 'Tempos Verbais' },
  { id: 'g-pronouns', kind: 'grammar', badge: 'my / mine / me', title: 'Pronomes e posse', subtitle: 'Sujeito, objeto, possessivos e ’s', source: 'Lições 1, 8 e 9' },
  { id: 'g-articles-nouns', kind: 'grammar', badge: 'a / an / the', title: 'Artigos e substantivos', subtitle: 'Plurais, contáveis e much/many', source: 'Lições 2 e 11' },
  { id: 'g-prepositions', kind: 'grammar', badge: 'in / on / at', title: 'Preposições', subtitle: 'Lugar, tempo e posição', source: 'Lições 4 e 5' },
  { id: 'g-modals', kind: 'grammar', badge: 'can / should', title: 'Verbos modais', subtitle: 'Can, could, would, should, must', source: 'Lições 7 e 9' },
  { id: 'g-comparatives', kind: 'grammar', badge: '-er / -est', title: 'Comparativos', subtitle: 'Comparativos e superlativos', source: 'Lição 15' },
  { id: 'g-frequency', kind: 'grammar', badge: 'always → never', title: 'Advérbios de frequência', subtitle: 'Always, often, never, how often', source: 'Lição 14' },

  { id: MIXED_TOPIC, kind: 'mixed', badge: 'shuffle', title: 'Misturado', subtitle: 'Um pouco de tudo, sorteado a cada partida' },
];

export const TOPIC_IDS = TOPICS.map((t) => t.id);

export function findTopic(id: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.id === id);
}
