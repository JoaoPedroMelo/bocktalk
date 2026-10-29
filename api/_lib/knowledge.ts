/**
 * Knowledge base extracted from the course material (15 lessons of "Inglês para Profissionais de Turismo",
 * "Tempos Verbais.docx", "Verbos Irregulares.xlsx" and Murphy's "English Grammar in Use").
 * Everything here was reviewed and normalized to American English; see CORRECOES.md for what was fixed.
 *
 * vocabulary/phrases: [English (US), Portuguese]. Alternatives that are all correct in US English are separated by " / ".
 */
export interface TopicKnowledge {
  summary: string;
  vocabulary: [string, string][];
  phrases: [string, string][];
  grammar: string[];
  usNotes?: string[];
  relatedGrammar?: string[];
}

export const KNOWLEDGE: Record<string, TopicKnowledge> = {
  saudacoes: {
    summary: 'Cumprimentar, se apresentar, perguntar o nome, agradecer e se despedir; tratamento formal (Sir, Ma’am, Mr., Mrs., Ms., Miss); soletrar nomes.',
    vocabulary: [
      ['hello / hi', 'olá / oi'], ['good morning', 'bom dia'], ['good afternoon', 'boa tarde'], ['good evening', 'boa noite (ao chegar)'],
      ['good night', 'boa noite (ao se despedir / antes de dormir)'], ['thank you / thanks', 'obrigado(a)'], ['you’re welcome', 'de nada'],
      ['nice to meet you', 'prazer em conhecê-lo(a)'], ['goodbye / bye', 'tchau'], ['see you later', 'até mais tarde'], ['see you', 'até mais'],
      ['excuse me', 'com licença'], ['I’m sorry', 'sinto muito / desculpe'], ['welcome', 'bem-vindo'], ['name', 'nome'],
      ['student', 'estudante'], ['teacher', 'professor(a)'], ['taxi driver', 'motorista de táxi'], ['Sir', 'senhor (sem saber o nome)'],
      ['Ma’am', 'senhora (sem saber o nome)'], ['Mr.', 'Sr. (com o sobrenome)'], ['Mrs.', 'Sra. (casada)'], ['Ms.', 'Sra./Srta. (neutro)'], ['Miss', 'senhorita'],
    ],
    phrases: [
      ['What’s your name?', 'Qual é o seu nome?'], ['My name is Mary.', 'Meu nome é Mary.'], ['Nice to meet you too.', 'Prazer em conhecê-lo também.'],
      ['How are you?', 'Como vai você?'], ['I’m fine, thanks. And you?', 'Estou bem, obrigado. E você?'], ['I’m great!', 'Estou ótimo!'],
      ['What do you do?', 'O que você faz? (profissão)'], ['I’m a tourism student.', 'Sou estudante de turismo.'], ['Welcome to Brazil!', 'Bem-vindo ao Brasil!'],
      ['Can you spell it, please?', 'Você pode soletrar, por favor?'], ['Good morning, Mr. Jones.', 'Bom dia, Sr. Jones.'], ['Good morning, Sir.', 'Bom dia, senhor.'],
    ],
    grammar: [
      'Subject pronouns: I, you, he, she, it (coisas, animais, lugares), we, you (plural), they.',
      'Verb to be (ser/estar): I am, you are, he/she/it is, we/you/they are. Contrações: I’m, you’re, he’s, she’s, it’s, we’re, they’re.',
      '"Too" no fim da frase = também: "Nice to meet you too."',
      'Antes de profissão usa-se artigo: "She is a student." / "He is a taxi driver." (nunca "She is student").',
      'Mr./Mrs./Ms. são usados com o sobrenome (Mr. Jones), não com o primeiro nome; em inglês americano levam ponto final.',
    ],
    usNotes: ['Nos EUA, "Madam" é pouco usado no dia a dia; a forma comum é "Ma’am".', 'Mr./Mrs./Ms. levam ponto no inglês americano (no britânico, não).'],
    relatedGrammar: ['g-to-be', 'g-pronouns'],
  },

  'dia-a-dia': {
    summary: 'Palavras do cotidiano, gírias e cumprimentos informais, perguntas com to be (inversão), question words, de onde a pessoa é, países e nacionalidades, profissões do turismo, artigos a/an/the.',
    vocabulary: [
      ['please', 'por favor'], ['nice / cool', 'legal / bacana'], ['that’s OK', 'não foi nada / tudo bem'], ['maybe', 'talvez'], ['pardon? / excuse me?', 'perdão? (pedir para repetir)'],
      ['today', 'hoje'], ['tomorrow', 'amanhã'], ['yesterday', 'ontem'], ['every day', 'todo dia'], ['why', 'por que'], ['because', 'porque'],
      ['here', 'aqui'], ['there', 'lá / ali'], ['this', 'este / isto'], ['that', 'aquele / aquilo'], ['what', 'o que / qual'], ['where', 'onde'], ['who', 'quem'], ['when', 'quando'],
      ['Hey, man! / Hey, dude!', 'E aí, cara!'], ['Really?', 'Sério?'], ['Take care!', 'Se cuida!'], ['What’s up?', 'E aí?'], ['guys', 'pessoal'], ['sure', 'claro / com certeza'], ['yeah', 'é / sim (informal)'],
      ['waiter', 'garçom'], ['receptionist', 'recepcionista'], ['manager', 'gerente'], ['tour guide', 'guia de turismo'], ['driver', 'motorista'], ['clerk', 'atendente / balconista'],
      ['travel agent', 'agente de viagens'], ['hotel manager', 'gerente de hotel'], ['store clerk / salesclerk', 'atendente de loja'], ['soccer player', 'jogador de futebol'],
      ['the United States', 'os Estados Unidos'], ['the United Kingdom', 'o Reino Unido'], ['Spain', 'Espanha'], ['Germany', 'Alemanha'], ['Switzerland', 'Suíça'], ['Canada', 'Canadá'], ['Argentina', 'Argentina'], ['Australia', 'Austrália'],
      ['American', 'americano(a)'], ['Brazilian', 'brasileiro(a)'], ['English', 'inglês(a)'], ['Spanish', 'espanhol(a)'], ['German', 'alemão(ã)'], ['Canadian', 'canadense'],
    ],
    phrases: [
      ['Nice to see you again.', 'Bom te ver de novo.'], ['What is this? / What is that?', 'O que é isto? / O que é aquilo?'], ['Where are you from?', 'De onde você é?'],
      ['I’m from the United States.', 'Sou dos Estados Unidos.'], ['What’s your job? / What do you do?', 'Qual é a sua profissão?'], ['How do you say ... in English?', 'Como se diz ... em inglês?'],
      ['Why are you here? Because I have a test.', 'Por que você está aqui? Porque tenho uma prova.'], ['Thanks, man! Take care!', 'Valeu, cara! Se cuida!'],
    ],
    grammar: [
      'Perguntas com to be: inverte-se verbo e sujeito. "She is a student." → "Is she a student?" / "Where is Mr. Jones?"',
      'Why é usado na pergunta e because na resposta.',
      'Para pedir que alguém repita, use "Excuse me?" ou "Pardon?"; "What?" sozinho pode soar rude.',
      'Artigo indefinido: a antes de som de consoante (a book, a hotel, a university); an antes de som de vogal (an apple, an hour, an airport).',
      'Artigo definido the = o/a/os/as, sem gênero nem número.',
      'Em inglês não se usa artigo antes de nacionalidades como adjetivo: "He is American." Nomes de países com United/Kingdom/States levam the: the United States.',
      'Profissão composta: o tipo vem antes — travel agent, hotel manager, tour guide.',
    ],
    usNotes: ['"Cheers" como "valeu" é britânico; nos EUA diga "Thanks!".', 'Atendente de loja nos EUA: "salesclerk" ou "sales associate" ("shop assistant" é britânico).'],
    relatedGrammar: ['g-to-be', 'g-articles-nouns'],
  },

  numeros: {
    summary: 'Números cardinais (0 a milhões), ordinais, idade, telefone, andares, negativa do to be, adjetivos básicos (old/young, big/small).',
    vocabulary: [
      ['zero', 'zero'], ['one', 'um'], ['two', 'dois'], ['three', 'três'], ['four', 'quatro'], ['five', 'cinco'], ['six', 'seis'], ['seven', 'sete'], ['eight', 'oito'], ['nine', 'nove'], ['ten', 'dez'],
      ['eleven', 'onze'], ['twelve', 'doze'], ['thirteen', 'treze'], ['fourteen', 'catorze'], ['fifteen', 'quinze'], ['sixteen', 'dezesseis'], ['seventeen', 'dezessete'], ['eighteen', 'dezoito'], ['nineteen', 'dezenove'],
      ['twenty', 'vinte'], ['thirty', 'trinta'], ['forty', 'quarenta'], ['fifty', 'cinquenta'], ['sixty', 'sessenta'], ['seventy', 'setenta'], ['eighty', 'oitenta'], ['ninety', 'noventa'],
      ['one hundred', 'cem'], ['one thousand', 'mil'], ['one million', 'um milhão'],
      ['first', 'primeiro'], ['second', 'segundo'], ['third', 'terceiro'], ['fourth', 'quarto'], ['fifth', 'quinto'], ['sixth', 'sexto'], ['seventh', 'sétimo'], ['eighth', 'oitavo'], ['ninth', 'nono'], ['tenth', 'décimo'],
      ['hour', 'hora'], ['day', 'dia'], ['week', 'semana'], ['month', 'mês'], ['year', 'ano'], ['time', 'tempo / vez'], ['new', 'novo'], ['old', 'velho'], ['young', 'jovem'],
      ['big', 'grande'], ['small', 'pequeno'], ['good', 'bom'], ['bad', 'ruim'], ['long', 'longo'], ['short', 'curto'], ['a bit / a little', 'um pouco'], ['more or less', 'mais ou menos'],
      ['floor', 'andar'], ['place', 'lugar (colocação)'], ['first class', 'primeira classe'], ['busy', 'ocupado'],
    ],
    phrases: [
      ['How old are you?', 'Quantos anos você tem?'], ['I’m 25 years old. / I’m 25.', 'Tenho 25 anos.'], ['What’s your phone number?', 'Qual é o seu telefone?'],
      ['My number is 5474-5585.', 'Meu número é 5474-5585.'], ['I’ll call you later.', 'Eu te ligo mais tarde.'], ['I’m busy.', 'Estou ocupado.'],
      ['Is this your first time here, Sir?', 'É a primeira vez do senhor aqui?'], ['This is the second floor.', 'Este é o segundo andar.'], ['He is in first place.', 'Ele está em primeiro lugar.'],
    ],
    grammar: [
      'Idade usa o verbo to be: "I am 32 years old." (nunca "I have 32 years").',
      'Negativa do to be: verbo + not. "I am not old." Contrações: isn’t, aren’t ("I’m not").',
      'Dezenas compostas levam hífen: twenty-one, forty-five, ninety-nine.',
      'Hundred, thousand e million não vão para o plural depois de número: two hundred, five thousand, three million. Mas: hundreds of / millions of people.',
      'Nos EUA, 101 é normalmente "one hundred one" (o "and" é comum no inglês britânico: one hundred and one).',
      'Telefone: dígito a dígito; zero pode ser "zero" ou "oh". Dígitos repetidos podem ser lidos "double five" ou "five five".',
      'Números grandes usam vírgula para milhar em inglês: 1,000,000; e ponto para decimal: 2.5.',
      'Ordinais abreviados: 1st, 2nd, 3rd, 4th, 21st, 22nd, 23rd.',
    ],
    usNotes: ['No inglês americano o andar térreo é o "first floor"; o britânico chama de "ground floor".', 'Americanos dizem "one hundred twenty" sem "and".'],
    relatedGrammar: ['g-to-be'],
  },

  cidade: {
    summary: 'Lugares da cidade, preposições de lugar (next to, in front of, behind, between, across from), simple present (afirmativa e 3ª pessoa), dar direções, there is/are, in/on/at.',
    vocabulary: [
      ['city', 'cidade'], ['country', 'país'], ['street', 'rua'], ['road', 'estrada / rua'], ['avenue', 'avenida'], ['square', 'praça'], ['bank', 'banco'], ['supermarket', 'supermercado'],
      ['travel agency', 'agência de viagens'], ['post office', 'correio'], ['drugstore / pharmacy', 'farmácia'], ['museum', 'museu'], ['hospital', 'hospital'], ['movie theater', 'cinema'],
      ['bus station', 'rodoviária / terminal de ônibus'], ['bus stop', 'ponto de ônibus'], ['gas station', 'posto de gasolina'], ['soccer stadium', 'estádio de futebol'], ['mall', 'shopping center'],
      ['park', 'parque'], ['downtown', 'centro da cidade'], ['police officer', 'policial'],
      ['next to', 'ao lado de'], ['in front of', 'em frente a'], ['behind', 'atrás de'], ['between', 'entre'], ['across from', 'do outro lado de / em frente (do outro lado da rua)'],
      ['on the right', 'à direita'], ['on the left', 'à esquerda'], ['upstairs', 'no andar de cima'], ['downstairs', 'no andar de baixo'],
      ['like', 'gostar'], ['have', 'ter'], ['speak', 'falar'], ['live', 'morar / viver'], ['do', 'fazer'], ['go', 'ir'], ['travel', 'viajar'], ['work', 'trabalhar'],
    ],
    phrases: [
      ['Excuse me, where is the bank?', 'Com licença, onde fica o banco?'], ['The bank is in front of the bus stop.', 'O banco fica em frente ao ponto de ônibus.'],
      ['Go straight and turn right on Second Street.', 'Siga em frente e vire à direita na Second Street.'], ['Turn left.', 'Vire à esquerda.'], ['The bank is on the left.', 'O banco fica à esquerda.'],
      ['Is there a drugstore in the mall? Yes, there is.', 'Tem farmácia no shopping? Sim, tem.'], ['There are two banks on Main Street.', 'Há dois bancos na Main Street.'],
      ['Take bus number 305.', 'Pegue o ônibus número 305.'], ['Have a nice day!', 'Tenha um bom dia!'],
    ],
    grammar: [
      'Simple present: mesma forma do infinitivo, exceto he/she/it, que recebe -s: I like / she likes; I work / he works.',
      '3ª pessoa: -es depois de o, s, sh, ch, x (goes, does, watches); consoante + y → -ies (study → studies). Irregular: have → has.',
      'Nomes próprios equivalem a he/she/it: "Mary speaks English." / "Rex is a good dog."',
      'There is (singular) / there are (plural) = há/tem/existe. Pergunta: Is there...? Are there...?',
      'IN: dentro de lugar/cidade/país (in the car, in Brazil, in New York). ON: sobre superfície, rua e andar (on the table, on the wall, on Main Street, on the third floor). AT: ponto/local específico ou endereço completo (at the bus stop, at home, at work, at 45 Main Street).',
      'Direções: "turn right/left on/onto ... Street", "go straight (ahead)", "it’s on the right/left".',
    ],
    usNotes: ['"Across from" é a forma americana de "opposite"/"do outro lado".', 'Farmácia nos EUA: "drugstore" ou "pharmacy" ("chemist’s" é britânico).', 'Shopping center nos EUA: "mall".'],
    relatedGrammar: ['g-simple-present', 'g-prepositions'],
  },

  'dinheiro-horas': {
    summary: 'Dinheiro e pagamentos, perguntar preço (How much...?), perguntas com do/does, moedas, dizer as horas (o’clock, past/after, to/before, a.m./p.m.), dias da semana, meses, anos e períodos do dia.',
    vocabulary: [
      ['cash', 'dinheiro (em espécie)'], ['bill', 'conta (mensal) / nota de dinheiro'], ['check', 'conta (restaurante) / cheque'], ['bank account', 'conta bancária'], ['change', 'troco'],
      ['ATM', 'caixa eletrônico'], ['currency exchange', 'casa de câmbio'], ['currency', 'moeda (de um país)'], ['coin', 'moeda (metálica)'], ['withdrawal', 'saque'], ['withdraw', 'sacar'],
      ['cheap', 'barato'], ['expensive', 'caro'], ['cash register / register', 'caixa (de loja)'], ['tax', 'imposto / taxa'], ['wallet', 'carteira'], ['credit card', 'cartão de crédito'], ['checkbook', 'talão de cheques'],
      ['want', 'querer'], ['need', 'precisar'], ['pay', 'pagar'], ['sell', 'vender'], ['buy', 'comprar'], ['exchange', 'trocar (dinheiro)'],
      ['the US dollar', 'o dólar americano'], ['the euro', 'o euro'], ['the pound sterling', 'a libra esterlina'], ['the yen', 'o iene'],
      ['watch', 'relógio de pulso'], ['clock', 'relógio de parede'], ['noon', 'meio-dia'], ['midnight', 'meia-noite'], ['quarter', 'quarto (15 minutos)'], ['half', 'meia (30 minutos)'],
      ['Monday', 'segunda-feira'], ['Tuesday', 'terça-feira'], ['Wednesday', 'quarta-feira'], ['Thursday', 'quinta-feira'], ['Friday', 'sexta-feira'], ['Saturday', 'sábado'], ['Sunday', 'domingo'],
      ['January', 'janeiro'], ['February', 'fevereiro'], ['March', 'março'], ['April', 'abril'], ['May', 'maio'], ['June', 'junho'], ['July', 'julho'], ['August', 'agosto'], ['September', 'setembro'], ['October', 'outubro'], ['November', 'novembro'], ['December', 'dezembro'],
    ],
    phrases: [
      ['How much is the ticket?', 'Quanto custa a passagem?'], ['It’s eighty reais.', 'São oitenta reais.'], ['That’s expensive!', 'Que caro!'], ['Can I pay by credit card?', 'Posso pagar com cartão de crédito?'],
      ['How would you like to pay?', 'Como você gostaria de pagar?'], ['In cash, please.', 'Em dinheiro, por favor.'], ['Do you have change?', 'Você tem troco?'], ['Keep the change.', 'Pode ficar com o troco.'],
      ['What time is it?', 'Que horas são?'], ['At what time? / What time?', 'A que horas?'], ['What day is today? / What day is it today?', 'Que dia é hoje?'], ['How can I help you?', 'Como posso ajudá-lo?'],
      ['It’s eight thirty. / It’s half past eight.', 'São oito e meia.'], ['It’s a quarter to nine.', 'São quinze para as nove.'], ['It’s ten after eight. / It’s ten past eight.', 'São oito e dez.'],
    ],
    grammar: [
      'Perguntas no simple present usam o auxiliar do/does antes do sujeito: "Do you speak English?" / "Does she like to travel?"',
      'Com does, o verbo principal fica no infinitivo: "Does she speak...?" (nunca "Does she speaks?").',
      'Preço: "How much is/are...?" → "It’s ..." / "They’re ...".',
      'Horas: "It’s five o’clock" (hora cheia); "It’s two fifteen" = "a quarter past/after two"; "8:45" = "eight forty-five" = "a quarter to/of nine".',
      'a.m. = da meia-noite ao meio-dia; p.m. = do meio-dia à meia-noite. 12:00 p.m. = noon (meio-dia); 12:00 a.m. = midnight (meia-noite).',
      'Preposições de tempo: on + dia da semana/data (on Saturday, on May 5th); in + mês/ano/estação (in December, in 2009); at + horas (at nine o’clock, at noon, at night).',
      'Períodos: in the morning, in the afternoon, in the evening, at night.',
      'Anos: 1985 = nineteen eighty-five; 2009 = two thousand nine; 2024 = twenty twenty-four.',
      'Dias da semana e meses sempre com letra maiúscula em inglês.',
    ],
    usNotes: ['"Pay by credit card" / "pay with a credit card" e "pay in cash" são os usos naturais.', 'Nos EUA, "check" é a conta do restaurante; "bill" é a conta mensal ou nota de dinheiro.', '"Till" é britânico; nos EUA, "cash register".', 'Americanos usam "after" e "of" nas horas (ten after eight, a quarter of nine) além de past/to.'],
    relatedGrammar: ['g-simple-present', 'g-prepositions'],
  },

  hotel: {
    summary: 'Tipos de hospedagem, funcionários do hotel, itens do quarto, tipos de quarto, reservas e check-in, negativa no simple present (don’t/doesn’t), respostas curtas.',
    vocabulary: [
      ['hotel', 'hotel'], ['hostel', 'albergue'], ['inn', 'pousada'], ['bed and breakfast', 'pousada / pensão com café'], ['bungalow / cabin', 'chalé'], ['guest', 'hóspede'],
      ['front desk / reception', 'recepção'], ['lobby', 'saguão'], ['front door', 'porta principal'], ['receptionist / desk clerk', 'recepcionista'], ['bellhop', 'carregador de malas'],
      ['doorman', 'porteiro'], ['housekeeper', 'camareira'], ['hotel manager', 'gerente do hotel'], ['bartender', 'barman'], ['intern / trainee', 'estagiário'], ['call', 'chamar / ligar'],
      ['air conditioner / air conditioning', 'ar-condicionado'], ['bed', 'cama'], ['towel', 'toalha'], ['sheets', 'lençóis'], ['desk', 'escrivaninha'], ['pillow', 'travesseiro'], ['balcony', 'sacada'],
      ['closet', 'armário (embutido)'], ['cable TV', 'TV a cabo'], ['minibar', 'frigobar'], ['remote control', 'controle remoto'], ['shower', 'chuveiro'], ['bathtub', 'banheira'], ['alarm clock', 'despertador'],
      ['single room', 'quarto de solteiro'], ['double room', 'quarto de casal / duplo'], ['twin room', 'quarto com duas camas de solteiro'], ['triple room', 'quarto triplo'], ['shared room', 'quarto compartilhado'],
      ['reservation', 'reserva'], ['vacancy', 'vaga'], ['fully booked', 'lotado'], ['check-in', 'check-in'], ['checkout', 'check-out'], ['gym', 'academia'], ['pool', 'piscina'], ['valet parking', 'manobrista'],
    ],
    phrases: [
      ['Park Ville Hotel, may I help you?', 'Hotel Park Ville, posso ajudar?'], ['Do you have a reservation?', 'O senhor tem reserva?'], ['Do you have any vacancies?', 'Vocês têm vagas?'],
      ['I’d like a room, please.', 'Eu gostaria de um quarto, por favor.'], ['Sorry, we’re fully booked.', 'Desculpe, estamos lotados.'], ['How many nights?', 'Quantas noites?'],
      ['When is checkout?', 'Que horas é o check-out?'], ['Just a minute, please.', 'Só um minuto, por favor.'], ['Enjoy your stay! / Have a nice stay!', 'Tenha uma boa estadia!'],
      ['I’ll call the manager.', 'Vou chamar o gerente.'], ['Would you like to make a reservation?', 'Gostaria de fazer uma reserva?'],
      ['Yes, we do. / No, we don’t.', 'Sim, temos. / Não, não temos.'],
    ],
    grammar: [
      'Negativa no simple present: do/does + not + verbo no infinitivo. "I don’t speak French." / "She doesn’t work in the afternoon."',
      'Nunca conjugue o verbo depois de doesn’t: "She doesn’t speak" (não "doesn’t speaks").',
      'Respostas curtas repetem o auxiliar: "Do you have vacancies?" → "Yes, we do." / "No, we don’t." "Is he the manager?" → "Yes, he is."',
      'Para ação que começou no passado e continua: present perfect com since/for. "I have been the manager here since 1985." (não "I am the manager since...")',
      'Pergunta de duração: "How long has Ian worked at the hotel?"',
    ],
    usNotes: ['"Front desk" é o termo americano para recepção.', '"Bellhop"/"bellman" nos EUA; "porter" é mais britânico.', '"Housekeeper" no lugar de "chambermaid" (antiquado/britânico).', '"Bartender" no lugar de "barman".', '"Closet" no lugar de "wardrobe".', '"Checkout" (substantivo) / "check out" (verbo).'],
    relatedGrammar: ['g-simple-present', 'g-present-perfect'],
  },

  restaurante: {
    summary: 'Refeições, talheres, alimentos e bebidas, pedir no restaurante, would/can/could, have breakfast/lunch/dinner, culinárias, comidas brasileiras, pedir a conta.',
    vocabulary: [
      ['breakfast', 'café da manhã'], ['lunch', 'almoço'], ['dinner', 'jantar'], ['snack', 'lanche'], ['fork', 'garfo'], ['knife', 'faca'], ['spoon', 'colher'], ['glass', 'copo / taça'],
      ['cup', 'xícara'], ['plate', 'prato (louça)'], ['napkin', 'guardanapo'], ['waiter', 'garçom'], ['waitress', 'garçonete'], ['server', 'garçom/garçonete (neutro)'], ['food', 'comida'], ['meal', 'refeição'],
      ['appetizer', 'entrada / aperitivo'], ['main course / entrée', 'prato principal'], ['dessert', 'sobremesa'], ['cook / chef', 'cozinheiro'], ['menu', 'cardápio'], ['check', 'conta'], ['tip', 'gorjeta'],
      ['soda', 'refrigerante'], ['juice', 'suco'], ['wine', 'vinho'], ['beer', 'cerveja'], ['water', 'água'], ['beef', 'carne bovina'], ['pork', 'carne de porco'], ['chicken', 'frango'], ['lamb', 'cordeiro'],
      ['fish', 'peixe'], ['sausage', 'linguiça / salsicha'], ['shrimp', 'camarão'], ['pasta', 'massa / macarrão'], ['soup', 'sopa'], ['potato', 'batata'], ['tomato', 'tomate'], ['onion', 'cebola'],
      ['lettuce', 'alface'], ['garlic', 'alho'], ['apple', 'maçã'], ['orange', 'laranja'], ['grape', 'uva'], ['strawberry', 'morango'], ['pineapple', 'abacaxi'], ['watermelon', 'melancia'], ['lemon', 'limão'],
      ['rice', 'arroz'], ['beans', 'feijão'], ['bread', 'pão'], ['cheese', 'queijo'], ['milk', 'leite'], ['egg', 'ovo'], ['corn', 'milho'], ['carrot', 'cenoura'], ['ice cream', 'sorvete'], ['French fries / fries', 'batata frita'],
      ['restroom / bathroom', 'banheiro'], ['order', 'pedir / pedido'], ['eat', 'comer'], ['wait', 'esperar'], ['sit', 'sentar'],
      ['cheese bread', 'pão de queijo'], ['black bean stew with pork', 'feijoada'], ['chicken croquette', 'coxinha'], ['barbecue', 'churrasco'], ['fried pastry', 'pastel'],
    ],
    phrases: [
      ['Can I take your order?', 'Posso anotar seu pedido?'], ['Are you ready to order?', 'Já sabem o que vão pedir?'], ['I’d like the chicken with a tomato salad.', 'Eu gostaria do frango com salada de tomate.'],
      ['I’ll have a soda, please.', 'Vou querer um refrigerante, por favor.'], ['Would you like something to drink?', 'Gostaria de algo para beber?'], ['Anything else?', 'Mais alguma coisa?'],
      ['Can I have the menu, please?', 'Pode me trazer o cardápio, por favor?'], ['Could I have a napkin?', 'Poderia me dar um guardanapo?'], ['Can I have the check, please?', 'Pode me trazer a conta, por favor?'],
      ['Where is the restroom?', 'Onde fica o banheiro?'], ['Would you like another one?', 'Gostaria de mais um?'], ['Just a moment.', 'Só um momento.'], ['A soda with ice, please.', 'Um refrigerante com gelo, por favor.'],
    ],
    grammar: [
      'Would + verbo = futuro do pretérito ("-ria"): I would like (eu gostaria), I would travel (eu viajaria). Contração: I’d like.',
      'Can = poder (pedido informal / habilidade). Could = poderia (mais educado). "Can I have a table?" / "Could I have a napkin?"',
      'I’ll have... = vou querer... (pedido na hora).',
      'Refeições com o verbo have e sem artigo: have breakfast, have lunch, have dinner. "Did you have lunch today?"',
      'Explain algo TO alguém: "Could you explain the exercise to me?" (nunca "explain me").',
      'Ordem dos advérbios: "Do you often go to Italian restaurants?" (advérbio de frequência antes do verbo principal).',
    ],
    usNotes: ['"Soda" (ou "soft drink") nos EUA.', '"Shrimp" é o termo americano ("prawn" é britânico).', '"Check" é a conta ("bill" é britânico nesse sentido).', '"Restroom" em lugares públicos; "toilet" nos EUA se refere ao vaso sanitário.', '"Favorite" sem u.', 'Nos EUA, "entrée" é o prato principal.', 'Gorjeta (tip) de 15% a 20% é esperada nos EUA.'],
    relatedGrammar: ['g-modals', 'g-frequency'],
  },

  aeroporto: {
    summary: 'Vocabulário de aeroporto e voo, cartão de embarque, assentos, check-in, avisos de bordo, possessive adjectives e possessive pronouns, object pronouns.',
    vocabulary: [
      ['airport', 'aeroporto'], ['flight', 'voo'], ['aisle seat', 'assento no corredor'], ['window seat', 'assento na janela'], ['pilot', 'piloto'], ['departure', 'partida'], ['arrival', 'chegada'],
      ['landing', 'aterrissagem'], ['takeoff', 'decolagem'], ['check-in counter', 'balcão de check-in'], ['business class', 'classe executiva'], ['economy class / coach', 'classe econômica'], ['first class', 'primeira classe'],
      ['flight attendant', 'comissário(a) de bordo'], ['airplane / plane', 'avião'], ['plane ticket', 'passagem aérea'], ['gate', 'portão'], ['boarding pass', 'cartão de embarque'], ['airline', 'companhia aérea'],
      ['passport', 'passaporte'], ['visa', 'visto'], ['luggage / baggage', 'bagagem'], ['carry-on (bag)', 'bagagem de mão'], ['seat belt', 'cinto de segurança'], ['delayed', 'atrasado'], ['canceled', 'cancelado'],
      ['customs', 'alfândega'], ['baggage claim', 'esteira de bagagem / restituição'], ['layover', 'escala / conexão'],
      ['fly', 'voar'], ['board', 'embarcar'], ['arrive', 'chegar'], ['leave / depart', 'partir'], ['check (a bag)', 'despachar (uma mala)'],
    ],
    phrases: [
      ['Your flight number is JJ8998.', 'O número do seu voo é JJ8998.'], ['Your seat is 41A.', 'Seu assento é o 41A.'], ['Your boarding time is 5:20.', 'Seu horário de embarque é 5h20.'],
      ['Your gate number is three.', 'Seu portão é o número três.'], ['Do you have any bags to check?', 'Você tem bagagem para despachar?'], ['May I see your passport, please?', 'Posso ver seu passaporte, por favor?'],
      ['May I see your visa?', 'Posso ver seu visto?'], ['Is it an aisle or a window seat?', 'É corredor ou janela?'], ['Have a good flight!', 'Tenha um bom voo!'],
      ['Please remain seated.', 'Por favor, permaneçam sentados.'], ['Please return to your seats.', 'Por favor, voltem aos seus assentos.'], ['Fasten your seat belts.', 'Apertem os cintos.'],
      ['Return your seat to the upright position.', 'Coloquem o encosto na posição vertical.'], ['Turn off all electronic devices.', 'Desliguem todos os aparelhos eletrônicos.'],
    ],
    grammar: [
      'Possessive adjectives vêm antes de substantivo: my, your, his, her, its, our, your, their. "This is my ticket." / "Her plane is delayed."',
      'Possessive pronouns substituem adjetivo + substantivo: mine, yours, his, hers, ours, yours, theirs. "This seat is mine." / "The ticket is yours."',
      'Object pronouns vêm depois do verbo ou preposição: me, you, him, her, it, us, you, them. "Mr. Jones likes her." / "Mary knows us."',
      'Subject pronouns vêm antes do verbo: "I like to travel" (nunca "Me like").',
      'Its (possessivo, sem apóstrofo) ≠ it’s (= it is).',
      'Voar: "How many times a year do you fly?" (fly é o verbo; flight é o substantivo).',
    ],
    usNotes: ['"Boarding pass" (EUA) em vez de "boarding card".', '"Check a bag" em vez de "dispatch luggage".', '"Business class" é o termo usual.', '"Airline" em vez de "air company".', '"Canceled" com um L nos EUA.'],
    relatedGrammar: ['g-pronouns'],
  },

  agencia: {
    summary: 'Viagens, pacotes, passagens (one-way, round-trip), seguro, reservas, possessivo com ’s, atrações turísticas famosas, conselhos com should e obrigação com must, Reino Unido x Grã-Bretanha x Inglaterra.',
    vocabulary: [
      ['travel agency', 'agência de viagens'], ['vacation', 'férias'], ['holiday', 'feriado'], ['trip', 'viagem'], ['tour', 'excursão / passeio'], ['city tour', 'passeio pela cidade'],
      ['package tour / vacation package', 'pacote de viagem'], ['cruise', 'cruzeiro'], ['fare', 'tarifa'], ['one-way ticket', 'passagem só de ida'], ['round-trip ticket', 'passagem de ida e volta'],
      ['travel insurance', 'seguro-viagem'], ['car insurance', 'seguro de carro'], ['accommodations', 'hospedagem / acomodação'], ['brochure', 'folheto / catálogo'], ['flyer', 'panfleto'],
      ['discount', 'desconto'], ['special offer / deal', 'promoção / oferta'], ['book', 'reservar'], ['cancel', 'cancelar'], ['change', 'alterar'], ['confirm', 'confirmar'], ['include', 'incluir'],
      ['Iguazu Falls', 'Cataratas do Iguaçu'], ['Christ the Redeemer', 'Cristo Redentor'], ['Sugarloaf Mountain', 'Pão de Açúcar'], ['the Amazon rainforest', 'a Floresta Amazônica'],
      ['the Eiffel Tower', 'a Torre Eiffel'], ['the Statue of Liberty', 'a Estátua da Liberdade'], ['the Great Pyramids', 'as Grandes Pirâmides'], ['Tower Bridge', 'Tower Bridge'],
    ],
    phrases: [
      ['I’d like to book a cruise.', 'Eu gostaria de reservar um cruzeiro.'], ['I’d like some information about package tours.', 'Eu gostaria de informações sobre pacotes.'],
      ['What do you suggest?', 'O que você sugere?'], ['I suggest a city tour.', 'Eu sugiro um city tour.'], ['I’ll see what I can do.', 'Vou ver o que posso fazer.'],
      ['We have a special offer.', 'Temos uma oferta especial.'], ['Take a look at these brochures.', 'Dê uma olhada nesses folhetos.'], ['This package includes accommodations for three nights.', 'Este pacote inclui hospedagem por três noites.'],
      ['Does this package include tickets to the park? Yes, it does.', 'Esse pacote inclui ingressos para o parque? Sim, inclui.'], ['I just need your details.', 'Só preciso dos seus dados.'],
      ['I think you should visit Salvador.', 'Acho que você deveria visitar Salvador.'], ['We go on a cruise every year.', 'Fazemos um cruzeiro todo ano.'],
    ],
    grammar: [
      'Com cruise e tour usa-se go on: "I’d like to go on a cruise." / "She wants to go on a city tour."',
      'Posse com ’s: "Mary’s house" (= the house of Mary). Plural terminado em s recebe só apóstrofo: "my parents’ car". Nomes terminados em s aceitam ’s ou só apóstrofo: "Carlos’s / Carlos’ restaurant".',
      'Posse de duas pessoas juntas: "John and Mary’s tickets".',
      'Should = deveria (conselho): "You should study English." / "You shouldn’t eat so much." Depois de should, verbo no infinitivo sem to.',
      'Must = deve (obrigação/necessidade forte): "You must wait here." Mustn’t = proibição.',
      'Advice é incontável: "some advice", "a piece of advice" (nunca "advices").',
      'Suggest: "I suggest (that) you visit..." ou "I suggest visiting..." (nunca "suggest you to").',
      'Ordem com sujeito composto: "My wife and I want to..." (não "Me and my wife").',
      'O Reino Unido (the UK) = Inglaterra, Escócia, País de Gales e Irlanda do Norte; a Grã-Bretanha = Inglaterra, Escócia e País de Gales.',
    ],
    usNotes: ['"Vacation" = férias nos EUA; "holiday" é feriado.', '"Round-trip ticket" em vez de "return ticket".', '"Accommodations" costuma ir para o plural nos EUA.', '"Flyer" é mais comum que "leaflet".'],
    relatedGrammar: ['g-modals', 'g-pronouns'],
  },

  transporte: {
    summary: 'Meios de transporte, pegar/dirigir/alugar, quanto tempo leva, by bus/on foot, futuro com will (afirmativa, negativa won’t e pergunta), leitura sobre metrô.',
    vocabulary: [
      ['bus', 'ônibus'], ['taxi / cab', 'táxi'], ['train', 'trem'], ['truck', 'caminhão'], ['ship', 'navio'], ['boat', 'barco'], ['subway', 'metrô'], ['auto repair shop / garage', 'oficina mecânica'],
      ['streetcar / trolley', 'bonde'], ['cable car', 'teleférico / bondinho'], ['motorcycle', 'moto'], ['helicopter', 'helicóptero'], ['bicycle / bike', 'bicicleta'], ['car', 'carro'], ['van', 'van'],
      ['parking lot', 'estacionamento'], ['driver', 'motorista'], ['fare', 'tarifa / preço da passagem'], ['(intercity) bus / coach', 'ônibus de viagem'], ['stop', 'parada'], ['ride', 'corrida / carona'],
      ['take', 'pegar (ônibus, táxi)'], ['drive', 'dirigir'], ['walk', 'andar a pé'], ['rent', 'alugar'], ['far', 'longe'], ['close / near', 'perto'],
    ],
    phrases: [
      ['Next stop.', 'Próxima parada.'], ['Last stop.', 'Ponto final.'], ['The taxi fare is twenty reais.', 'A corrida de táxi custa vinte reais.'], ['The ticket is two reais.', 'A passagem custa dois reais.'],
      ['It’s far away.', 'É muito longe.'], ['It’s close.', 'É perto.'], ['It’s within walking distance.', 'Dá para ir a pé.'], ['How long does it take?', 'Quanto tempo leva?'], ['It takes two hours.', 'Leva duas horas.'],
      ['Let’s go by taxi.', 'Vamos de táxi.'], ['You can go by subway.', 'Você pode ir de metrô.'], ['Is this seat taken?', 'Este lugar está ocupado?'], ['I’ll go on foot.', 'Vou a pé.'],
      ['Should we take the subway?', 'Vamos de metrô?'],
    ],
    grammar: [
      'Futuro com will: will + verbo no infinitivo para todas as pessoas. "I will take a bus." Contração: I’ll, you’ll, he’ll...',
      'Negativa: will not = won’t. "I won’t go by bus."',
      'Pergunta: will antes do sujeito. "Will you drive?" / "Will Mary rent a car next week?" Resposta curta: "Yes, I will. / No, I won’t."',
      'It will = previsão/evento futuro: "It will rain today."',
      'Meio de transporte: by + transporte sem artigo (by bus, by car, by plane, by subway); a pé = on foot.',
      'Take + transporte com artigo: "take a taxi", "take the subway", "take bus number 305".',
      'Duração: "How long does it take?" → "It takes about fifty minutes."',
      'Perguntas com will e question word: "What will Curitiba do...?" / "Which parts of the city will it connect?"',
    ],
    usNotes: ['"Subway" (EUA) em vez de "underground/tube".', '"Truck" em vez de "lorry".', '"Parking lot" em vez de "car park".', '"Streetcar/trolley" em vez de "tram".', 'Nos EUA "coach" é raro para ônibus; diga "bus" (ou "intercity bus").'],
    relatedGrammar: ['g-future'],
  },

  turismo: {
    summary: 'Pontos turísticos, recomendar e sugerir lugares, plurais (regulares e irregulares), as 7 maravilhas do mundo moderno, substantivos contáveis e incontáveis (many/much, few/little, a lot of).',
    vocabulary: [
      ['sights', 'pontos turísticos'], ['place', 'lugar'], ['statue', 'estátua'], ['church', 'igreja'], ['park', 'parque'], ['landscape', 'paisagem'], ['group', 'grupo'], ['visitors', 'visitantes'],
      ['nightlife', 'vida noturna'], ['sightseeing', 'passeio pelos pontos turísticos'], ['monument', 'monumento'], ['building', 'prédio'], ['palace', 'palácio'], ['beach', 'praia'], ['map', 'mapa'],
      ['tour guide', 'guia de turismo'], ['attractions', 'atrações'], ['shopping', 'compras'], ['city hall', 'prefeitura'], ['bridge', 'ponte'], ['amusement park', 'parque de diversões'],
      ['visit', 'visitar'], ['help', 'ajudar'], ['recommend', 'recomendar'], ['find', 'encontrar'], ['suggest', 'sugerir'],
      ['Christ the Redeemer', 'Cristo Redentor'], ['the Great Wall of China', 'a Muralha da China'], ['the Colosseum', 'o Coliseu'], ['Machu Picchu', 'Machu Picchu'], ['the Taj Mahal', 'o Taj Mahal'], ['Petra', 'Petra'], ['Chichén Itzá', 'Chichén Itzá'],
    ],
    phrases: [
      ['Can you help me find the museum?', 'Você pode me ajudar a encontrar o museu?'], ['What are the main attractions?', 'Quais são as principais atrações?'], ['What are the best places to visit?', 'Quais são os melhores lugares para visitar?'],
      ['Can you recommend a good restaurant?', 'Você pode me recomendar um bom restaurante?'], ['I recommend the History Museum.', 'Eu recomendo o Museu de História.'], ['I suggest (that) you visit the park.', 'Sugiro que você visite o parque.'],
      ['You should visit the beach.', 'Você deveria visitar a praia.'], ['Here’s a map.', 'Aqui está um mapa.'], ['I want to go sightseeing.', 'Quero passear pelos pontos turísticos.'],
    ],
    grammar: [
      'Plural regular: + s (place → places).',
      '+ es depois de s, ss, sh, ch, x, z: bus → buses, church → churches, box → boxes, fax → faxes.',
      'Consoante + y → ies (city → cities, country → countries); vogal + y → + s (day → days, boy → boys, toy → toys).',
      'Muitas palavras em f/fe → ves: wife → wives, knife → knives, shelf → shelves.',
      'Irregulares: man → men, woman → women, child → children, tooth → teeth, foot → feet, person → people. Compostos: tour guide → tour guides.',
      'Incontáveis (sem plural): money, water, sugar, salt, gas, rice, oil, information, advice, luggage.',
      'Many/few com contáveis (many hotels, few people); much/little com incontáveis (much money, little time). A lot of serve para ambos.',
      'Few/little = pouco (sentido negativo); a few/a little = um pouco, alguns (sentido positivo).',
      'Em frases afirmativas, prefira "a lot of": "Mary spends a lot of money." Much é mais natural em negativas e perguntas: "Luis doesn’t spend much money." / "How much is it?"',
      'Recommend: "Can you recommend a good place?" (sem "me" logo após recommend); "I recommend visiting..." / "I recommend (that) you visit...".',
      'Pergunta sobre opções: "What are the main attractions?" ("which" quando há um conjunto definido de opções).',
    ],
    usNotes: ['"Honor", "favorite", "center" — grafia americana sem u e com -er.', 'Parque de diversões: "amusement park".'],
    relatedGrammar: ['g-articles-nouns', 'g-modals'],
  },

  clima: {
    summary: 'Tempo e clima, temperatura (Fahrenheit x Celsius), previsão do tempo, estações do ano, roupas, passado do verbo to be (was/were), simple past de verbos regulares.',
    vocabulary: [
      ['weather', 'tempo / clima'], ['climate', 'clima (de uma região)'], ['hot', 'quente'], ['warm', 'quente (agradável)'], ['cool', 'fresco'], ['cold', 'frio'], ['freezing', 'congelante'],
      ['sun', 'sol'], ['cloud', 'nuvem'], ['rain', 'chuva'], ['snow', 'neve'], ['wind', 'vento'], ['fog', 'neblina'], ['thunder', 'trovão'], ['lightning', 'relâmpago / raio'], ['storm', 'tempestade'],
      ['forecast / weather forecast', 'previsão do tempo'], ['degrees', 'graus'], ['temperature', 'temperatura'], ['sunscreen', 'protetor solar'], ['sunburn', 'queimadura de sol'],
      ['sunny', 'ensolarado'], ['cloudy', 'nublado'], ['rainy', 'chuvoso'], ['snowy', 'com neve'], ['stormy', 'tempestuoso'], ['windy', 'com vento'], ['foggy', 'com neblina'],
      ['summer', 'verão'], ['fall', 'outono'], ['winter', 'inverno'], ['spring', 'primavera'], ['season', 'estação do ano'],
      ['T-shirt', 'camiseta'], ['sweater', 'suéter / blusa de lã'], ['umbrella', 'guarda-chuva'], ['sunglasses', 'óculos de sol'], ['raincoat', 'capa de chuva'], ['boots', 'botas'],
      ['pants', 'calça'], ['scarf', 'cachecol'], ['gloves', 'luvas'], ['shorts', 'bermuda / short'], ['sandals', 'sandálias'], ['coat', 'casaco'], ['jacket', 'jaqueta'],
    ],
    phrases: [
      ['What’s the weather like in Canada?', 'Como é o clima no Canadá?'], ['How’s the weather today?', 'Como está o tempo hoje?'], ['What’s the temperature?', 'Qual é a temperatura?'],
      ['What’s your favorite season?', 'Qual é a sua estação favorita?'], ['The forecast for today is sunny and 86 degrees.', 'A previsão para hoje é de sol e 30 °C (86 °F).'],
      ['It rains a lot this time of year.', 'Chove muito nesta época do ano.'], ['Bring warm clothes.', 'Traga roupas quentes.'], ['Bring light clothes.', 'Traga roupas leves.'],
      ['It’s hot all year round.', 'É quente o ano todo.'], ['It’s freezing!', 'Está congelando!'], ['It was sunny yesterday.', 'Estava ensolarado ontem.'], ['What a terrible day!', 'Que dia horrível!'],
    ],
    grammar: [
      'Tempo usa o sujeito it: "It’s cold today." / "It’s raining." / "It was sunny yesterday."',
      'Passado do to be: I/he/she/it was; you/we/they were. Negativa: wasn’t/weren’t. Pergunta: "Was it cold?" / "Were you in Rio last week?"',
      'Simple past regular: verbo + ed (worked, traveled, wanted). Terminado em e: só d (liked, arrived). Consoante + y: ied (study → studied).',
      'Simple past tem a mesma forma para todas as pessoas: I traveled, she traveled, they traveled.',
      'Expressões de passado: yesterday, last week, last Friday, last year, two days ago.',
      'Estações sem artigo e com "in": "in (the) summer", "in winter". Dias com "on": "on sunny days".',
      'Conversão: °F = °C × 1.8 + 32; °C = (°F − 32) ÷ 1.8. Ex.: 30 °C = 86 °F; 0 °C = 32 °F.',
    ],
    usNotes: ['Nos EUA usa-se Fahrenheit: 86 °F é calor (30 °C), 32 °F é o ponto de congelamento.', '"Fall" (EUA) = "autumn" (britânico).', '"Pants" = calça nos EUA (no britânico, "trousers"; "pants" lá é cueca).', '"Sweater" em vez de "pullover/jumper".', '"Sunscreen" em vez de "sun cream".', '"Traveled" com um L nos EUA.', '"What’s the weather like?" é a pergunta mais natural.'],
    relatedGrammar: ['g-to-be', 'g-simple-past'],
  },

  esportes: {
    summary: 'Esportes, lazer e entretenimento, lugares (stadium, arena, court...), verbos play/watch/practice/root for/win/lose, esportes de aventura, gêneros de filmes, verbos irregulares no passado, did/didn’t.',
    vocabulary: [
      ['fun', 'diversão'], ['entertainment', 'entretenimento'], ['sport', 'esporte'], ['leisure', 'lazer'], ['amusement park', 'parque de diversões'], ['concert', 'show / concerto'], ['concert hall', 'casa de shows'],
      ['play', 'peça de teatro / jogar / tocar'], ['movie theater', 'cinema'], ['game', 'jogo / partida'], ['match', 'partida'], ['movie', 'filme'], ['stadium', 'estádio'], ['arena', 'arena'],
      ['gym', 'ginásio / academia'], ['swimming pool', 'piscina'], ['court', 'quadra'], ['game room', 'salão de jogos'], ['ticket', 'ingresso'], ['team', 'time'], ['fan', 'torcedor / fã'],
      ['soccer', 'futebol'], ['football', 'futebol americano'], ['volleyball', 'vôlei'], ['beach volleyball', 'vôlei de praia'], ['basketball', 'basquete'], ['running', 'corrida'], ['swimming', 'natação'],
      ['jogging', 'corrida leve / cooper'], ['table tennis / ping-pong', 'tênis de mesa'], ['pool', 'sinuca / bilhar'], ['foosball', 'pebolim / totó'],
      ['skydiving', 'paraquedismo'], ['hiking', 'trilha / caminhada'], ['cycling', 'ciclismo'], ['diving', 'mergulho'], ['climbing', 'escalada'], ['rafting', 'rafting'],
      ['comedy', 'comédia'], ['thriller', 'suspense'], ['animation', 'animação'], ['adventure', 'aventura'], ['western', 'faroeste'], ['horror', 'terror'], ['science fiction / sci-fi', 'ficção científica'], ['action', 'ação'], ['drama', 'drama'], ['documentary', 'documentário'],
      ['watch', 'assistir'], ['practice', 'praticar'], ['root for', 'torcer por'], ['win', 'ganhar'], ['lose', 'perder'],
    ],
    phrases: [
      ['The game is about to start.', 'O jogo já vai começar.'], ['The game starts at four.', 'A partida começa às quatro.'], ['Where can I play tennis?', 'Onde posso jogar tênis?'],
      ['What kind of movies do you like?', 'Que tipo de filme você gosta?'], ['What’s your favorite sport?', 'Qual é o seu esporte favorito?'], ['Are you interested in sports?', 'Você se interessa por esportes?'],
      ['What team do you root for?', 'Para que time você torce?'], ['Who’s playing?', 'Quem vai jogar?'], ['Where is it going to be?', 'Onde vai ser?'],
      ['Do you prefer to watch a game at the stadium or on TV?', 'Você prefere assistir a um jogo no estádio ou na TV?'], ['You can watch a rock concert at the concert hall.', 'Você pode assistir a um show de rock na casa de shows.'],
    ],
    grammar: [
      'Play + esportes com bola/competição (play soccer, play tennis); go + atividades em -ing (go swimming, go hiking, go diving); do + algumas atividades (do yoga, do karate).',
      'Play também é tocar instrumento: "play the guitar".',
      'Verbos irregulares têm passado próprio: speak → spoke, win → won, have → had, do → did, go → went, lose → lost.',
      'Negativa e pergunta no simple past usam did/didn’t + verbo no infinitivo: "I didn’t play soccer yesterday." / "Did you play soccer yesterday?"',
      'Com did, o verbo volta ao infinitivo: "Did he win?" (nunca "Did he won?").',
      'Experiência de vida: "What’s the biggest city you’ve ever visited?" (present perfect com ever).',
    ],
    usNotes: ['Nos EUA, "soccer" é o futebol e "football" é o futebol americano.', '"Root for" é a forma americana de "torcer" ("support" é britânico).', '"Movie theater" e "movie" (EUA) em vez de "cinema" e "film".', '"Game" é mais comum que "match" nos EUA.'],
    relatedGrammar: ['g-simple-past', 'g-irregular'],
  },

  negocios: {
    summary: 'Empresa e escritório, reuniões e conferências, objetos de escritório, agendar e remarcar, telefone e recados, advérbios de frequência, present continuous.',
    vocabulary: [
      ['company', 'empresa'], ['job', 'emprego / trabalho'], ['manager', 'gerente'], ['employee', 'funcionário'], ['employer', 'empregador'], ['meeting', 'reunião'], ['deadline', 'prazo'],
      ['branch', 'filial'], ['headquarters / head office', 'sede'], ['meeting room / conference room', 'sala de reuniões'], ['business', 'negócios / empresa'], ['office', 'escritório'], ['director', 'diretor'],
      ['boss', 'chefe'], ['coworker', 'colega de trabalho'], ['busy', 'ocupado'], ['presentation', 'apresentação'], ['conference', 'conferência'], ['speech / talk', 'palestra / discurso'],
      ['auditorium', 'auditório'], ['entrance', 'entrada'], ['exit', 'saída'], ['projector', 'projetor'], ['microphone', 'microfone'], ['event', 'evento'], ['workshop', 'oficina / workshop'], ['screen', 'tela'], ['whiteboard', 'quadro branco'],
      ['stapler', 'grampeador'], ['hole punch', 'furador'], ['scissors', 'tesoura'], ['paper clip', 'clipe'], ['pen', 'caneta'], ['pencil', 'lápis'], ['trash can', 'lixeira'], ['printer', 'impressora'],
      ['keyboard', 'teclado'], ['notepad', 'bloco de notas'], ['monitor', 'monitor'], ['coffee maker', 'cafeteira'],
      ['schedule', 'agendar'], ['organize', 'organizar'], ['receive', 'receber'], ['negotiate', 'negociar'], ['send', 'enviar'], ['confirm', 'confirmar'],
      ['always', 'sempre'], ['usually', 'normalmente'], ['often', 'frequentemente'], ['sometimes', 'às vezes'], ['seldom / rarely', 'raramente'], ['never', 'nunca'],
    ],
    phrases: [
      ['I’d like to schedule a meeting.', 'Eu gostaria de agendar uma reunião.'], ['You can use our business center.', 'Você pode usar nosso business center.'], ['I’d like to talk to the manager.', 'Eu gostaria de falar com o gerente.'],
      ['Sorry, he’s busy at the moment.', 'Desculpe, ele está ocupado no momento.'], ['Would you like to leave a message?', 'Gostaria de deixar um recado?'], ['You’ll have to talk to the manager.', 'Você terá que falar com o gerente.'],
      ['I’ll fix this as soon as possible.', 'Vou resolver isso o mais rápido possível.'], ['I’ll call you back.', 'Eu te ligo de volta.'], ['This is George Harper from Mitsuo Motors.', 'Aqui é George Harper, da Mitsuo Motors.'],
      ['It’s in auditorium number two, on the third floor.', 'É no auditório número dois, no terceiro andar.'], ['The projector isn’t working.', 'O projetor não está funcionando.'], ['How often do you travel?', 'Com que frequência você viaja?'],
    ],
    grammar: [
      'Advérbios de frequência ficam antes do verbo principal ("I often have meetings") e depois do verbo to be ("Mary is always busy").',
      'How often...? → once a day, twice a week, three times a month, every day.',
      'Present continuous = ação acontecendo agora: am/is/are + verbo-ing. "I am working." / "George is booking a flight."',
      'Ortografia do -ing: e mudo cai (make → making); CVC tônico dobra a consoante (run → running, stop → stopping); ie → ying (lie → lying).',
      'Present continuous costuma vir com now, right now, at the moment. Verbos de estado (know, like, want) normalmente não vão para o -ing.',
    ],
    usNotes: ['"Coworker" (EUA) é mais comum que "colleague" no dia a dia.', '"Trash can" em vez de "bin".', '"Take a shower" (EUA) em vez de "have a shower".', '"Schedule" é pronunciado "ské-djul" nos EUA.'],
    relatedGrammar: ['g-frequency', 'g-present-continuous'],
  },

  geografia: {
    summary: 'Natureza e geografia, pesos e medidas (sistema americano x métrico), desastres naturais, comparativos e superlativos, superlativos do Brasil.',
    vocabulary: [
      ['land', 'terra'], ['mountain', 'montanha'], ['ocean', 'oceano'], ['waterfall', 'cachoeira'], ['desert', 'deserto'], ['island', 'ilha'], ['hill', 'colina / morro'], ['sky', 'céu'],
      ['forest', 'floresta'], ['rainforest', 'floresta tropical'], ['grass', 'grama'], ['lake', 'lago'], ['sea', 'mar'], ['bay', 'baía'], ['woods', 'bosque'], ['sand', 'areia'], ['river', 'rio'], ['coast', 'litoral'],
      ['weight', 'peso'], ['pound', 'libra'], ['ounce', 'onça'], ['meter', 'metro'], ['mile', 'milha'], ['foot / feet', 'pé / pés'], ['inch', 'polegada'], ['gallon', 'galão'], ['kilogram', 'quilo'], ['kilometer', 'quilômetro'],
      ['distance', 'distância'], ['height', 'altura'], ['long', 'longo / comprido'], ['tall', 'alto (pessoas, prédios)'], ['high', 'alto (montanhas, preços, temperaturas)'], ['short', 'curto / baixo'],
      ['hurricane', 'furacão'], ['earthquake', 'terremoto'], ['mudslide / landslide', 'deslizamento'], ['flood', 'enchente'], ['drought', 'seca'], ['storm', 'tempestade'], ['fresh water', 'água doce'],
    ],
    phrases: [
      ['São Paulo is bigger than Curitiba.', 'São Paulo é maior que Curitiba.'], ['Pico da Neblina is the highest mountain in Brazil.', 'O Pico da Neblina é a montanha mais alta do Brasil.'],
      ['How tall are you?', 'Qual é a sua altura?'], ['How far is it?', 'Qual é a distância?'], ['How much do you weigh?', 'Quanto você pesa?'],
      ['What’s the highest mountain you’ve ever seen?', 'Qual é a montanha mais alta que você já viu?'], ['Let’s take a look at some superlatives.', 'Vamos dar uma olhada em alguns superlativos.'],
    ],
    grammar: [
      'Comparativo de adjetivos curtos (1 sílaba): + er + than. "I am older than you." Dobra consoante em CVC: big → bigger, hot → hotter.',
      'Adjetivos de 2 sílabas terminados em y: y → ier (happy → happier, busy → busier). Os demais de 2+ sílabas: more + adjetivo (more famous, more expensive, more beautiful).',
      'Superlativo: the + adjetivo-est (the tallest, the biggest, the happiest) ou the most + adjetivo (the most expensive).',
      'Irregulares: good → better → the best; bad → worse → the worst; far → farther → the farthest.',
      'Comparativo compara dois elementos; superlativo compara um elemento com todo o grupo: "Mary is the tallest student in the class."',
      'Depois do superlativo use in para lugares/grupos: "the biggest city in Brazil", "the best player in the world".',
      'Tall para pessoas e prédios; high para montanhas, cachoeiras e valores.',
      'Perguntas com auxiliar e ordem correta: "In which state is the highest mountain in Brazil located?" / "Why do tourists like to visit São Joaquim?" / "Where is it located?"',
    ],
    usNotes: ['Os EUA usam o sistema imperial: milhas (1 km ≈ 0.62 mi), libras (1 kg ≈ 2.2 lb), galões (1 L ≈ 0.26 gal), pés e polegadas.', '"Meter" e "kilometer" com -er nos EUA (centre/metre são britânicos).', 'Fatos: o Pico da Neblina (≈2,995 m) é o ponto mais alto do Brasil; São Joaquim (Santa Catarina) é uma das cidades mais frias do país.'],
    relatedGrammar: ['g-comparatives'],
  },

  // ---------------------------------------------------------------- grammar topics

  'g-to-be': {
    summary: 'Verbo to be no presente (am/is/are) e no passado (was/were): afirmativa, negativa, perguntas, respostas curtas, contrações e usos (idade, profissão, origem, tempo).',
    vocabulary: [['am / is / are', 'sou, é, somos, são / estou, está...'], ['was / were', 'era, estava / eram, estavam']],
    phrases: [
      ['I am a teacher.', 'Eu sou professor.'], ['She isn’t from Brazil.', 'Ela não é do Brasil.'], ['Are they taxi drivers?', 'Eles são taxistas?'], ['Yes, they are.', 'Sim, são.'],
      ['I’m 25 years old.', 'Tenho 25 anos.'], ['It was cold yesterday.', 'Estava frio ontem.'], ['Were you at home last night?', 'Você estava em casa ontem à noite?'], ['No, I wasn’t.', 'Não, não estava.'],
    ],
    grammar: [
      'Presente: I am; you/we/they are; he/she/it is. Contrações: I’m, you’re, he’s, she’s, it’s, we’re, they’re.',
      'Negativa: I’m not; isn’t; aren’t. Pergunta: inverte verbo e sujeito: "Is she a student?"',
      'Passado: I/he/she/it was; you/we/they were. wasn’t / weren’t. "Was it sunny?"',
      'Respostas curtas não usam contração no afirmativo: "Yes, I am." (nunca "Yes, I’m.")',
      'Usos: idade (I’m 30), profissão com artigo (She’s a nurse), origem (We’re from Brazil), estado (I’m tired), tempo (It’s hot).',
      'Sujeitos compostos e plurais levam are/were: "Robinho and Ronaldo are soccer players."',
    ],
    relatedGrammar: [],
  },

  'g-simple-present': {
    summary: 'Simple present: hábitos e verdades; -s na 3ª pessoa; do/does em perguntas e negativas; respostas curtas.',
    vocabulary: [['do / does', 'auxiliar de perguntas e negativas'], ['don’t / doesn’t', 'negativa'], ['every day / every week', 'todo dia / toda semana']],
    phrases: [
      ['She works at a hotel.', 'Ela trabalha num hotel.'], ['He doesn’t speak French.', 'Ele não fala francês.'], ['Do you like soccer?', 'Você gosta de futebol?'],
      ['Does Mr. Jones work today?', 'O Sr. Jones trabalha hoje?'], ['Yes, he does.', 'Sim, trabalha.'], ['They go to the park every day.', 'Eles vão ao parque todo dia.'],
    ],
    grammar: [
      'Afirmativa: verbo no infinitivo; he/she/it recebe -s (works, likes), -es (goes, does, watches, fixes) ou -ies (studies). have → has.',
      'Negativa: don’t / doesn’t + infinitivo. "She doesn’t like fish."',
      'Pergunta: Do/Does + sujeito + infinitivo. "Does he live in Rio?"',
      'Com does/doesn’t o verbo principal NÃO recebe -s.',
      'Respostas curtas: Yes, I do. / No, she doesn’t.',
      'Usa-se para rotina, hábitos, fatos e horários fixos: "The train leaves at 8."',
    ],
  },

  'g-present-continuous': {
    summary: 'Present continuous (am/is/are + -ing): ações acontecendo agora, planos próximos; regras de ortografia do -ing; contraste com simple present.',
    vocabulary: [['now / right now', 'agora'], ['at the moment', 'no momento'], ['today / this week', 'hoje / esta semana']],
    phrases: [
      ['I’m working right now.', 'Estou trabalhando agora.'], ['She is taking a shower.', 'Ela está tomando banho.'], ['Are you studying English?', 'Você está estudando inglês?'],
      ['They aren’t listening.', 'Eles não estão ouvindo.'], ['The projector is working now.', 'O projetor está funcionando agora.'],
    ],
    grammar: [
      'Forma: am/is/are + verbo-ing. Negativa: am not / isn’t / aren’t + -ing. Pergunta: Am/Is/Are + sujeito + -ing?',
      'Ortografia: write → writing; run → running; swim → swimming; lie → lying; play → playing.',
      'Usado para o que está acontecendo agora ou temporariamente, e para planos combinados: "I’m meeting the client tomorrow."',
      'Simple present = rotina ("I work every day"); present continuous = agora ("I’m working now").',
      'Verbos de estado (know, like, love, want, need, believe) normalmente não ficam no -ing: "I know him" (não "I’m knowing").',
    ],
  },

  'g-simple-past': {
    summary: 'Simple past: verbos regulares (-ed), irregulares, did/didn’t, perguntas, expressões de tempo; diferença no inglês americano.',
    vocabulary: [['yesterday', 'ontem'], ['last week / last year', 'semana passada / ano passado'], ['ago', 'atrás (two days ago)'], ['did / didn’t', 'auxiliar do passado']],
    phrases: [
      ['I traveled to Europe last year.', 'Viajei para a Europa ano passado.'], ['She didn’t go to work yesterday.', 'Ela não foi trabalhar ontem.'], ['Did you watch the game?', 'Você assistiu ao jogo?'],
      ['Yes, I did.', 'Sim, assisti.'], ['We had lunch at noon.', 'Almoçamos ao meio-dia.'], ['I just had lunch.', 'Acabei de almoçar.'],
    ],
    grammar: [
      'Regulares: + ed (worked), + d (arrived), consoante+y → ied (studied), CVC tônico dobra (stop → stopped, plan → planned).',
      'Nos EUA, verbos terminados em L não dobram se a sílaba não é tônica: traveled, canceled.',
      'Irregulares: forma própria (go → went, see → saw, buy → bought, eat → ate, have → had).',
      'Negativa: didn’t + infinitivo. Pergunta: Did + sujeito + infinitivo? "Did she call?"',
      'Simple past = ação concluída em tempo definido no passado (yesterday, last week, in 2010, ago).',
      'No inglês americano, o simple past é comum com just/already/yet: "I already ate." / "Did you finish yet?"',
    ],
  },

  'g-irregular': {
    summary: 'Verbos irregulares: infinitivo, passado simples e particípio passado (planilha do curso, com as formas americanas).',
    vocabulary: [],
    phrases: [['I went to the beach.', 'Fui à praia.'], ['She has written three books.', 'Ela escreveu três livros.'], ['They had already left.', 'Eles já tinham saído.']],
    grammar: [
      'O passado simples é usado sozinho na afirmativa (I went); o particípio (V3) é usado com have/has/had (have gone) e na voz passiva (was written).',
      'Formas americanas: get → got → gotten; learn → learned → learned; dream → dreamed; burn → burned; spell → spelled.',
      'Grupos que ajudam a memorizar: AAA (cut-cut-cut, put, hit, cost, let, set, shut, hurt, bet); ABB (buy-bought-bought, bring, think, teach, catch, fight); ABC (go-went-gone, see-saw-seen, write-wrote-written).',
    ],
  },

  'g-future': {
    summary: 'Futuro com will (decisões no momento, previsões, promessas) e going to (planos já decididos, previsões com evidência); negativas e perguntas.',
    vocabulary: [['tomorrow', 'amanhã'], ['next week / next year', 'semana que vem / ano que vem'], ['soon', 'em breve'], ['won’t', 'will not']],
    phrases: [
      ['I’ll call you later.', 'Eu te ligo mais tarde.'], ['It will rain tomorrow.', 'Vai chover amanhã.'], ['Will you drive?', 'Você vai dirigir?'],
      ['I’m going to visit my grandparents next weekend.', 'Vou visitar meus avós no próximo fim de semana.'], ['Look at those clouds. It’s going to rain.', 'Olha essas nuvens. Vai chover.'],
      ['Are you going to attend the party?', 'Você vai à festa?'], ['They aren’t going to move.', 'Eles não vão se mudar.'],
    ],
    grammar: [
      'Will + infinitivo (todas as pessoas): "She will travel." Negativa: won’t. Pergunta: "Will they come?" Resposta: "Yes, they will."',
      'Will: decisões tomadas na hora ("I’ll have the fish"), promessas, ofertas, previsões de opinião ("I think it will be fine").',
      'Be going to + infinitivo: planos já decididos ("We’re going to travel to Europe next summer") e previsões com evidência ("It’s going to rain").',
      'Negativa: am not / isn’t / aren’t going to. Pergunta: "Is she going to start a new job?"',
      'Com if no presente, a outra oração vai para o futuro: "If you don’t study, you won’t pass the exam."',
      'Nos EUA, "shall" é raro; para sugestões usa-se "Should we...?" ou "Let’s...".',
    ],
  },

  'g-present-perfect': {
    summary: 'Present perfect (have/has + particípio): experiências, ações com efeito no presente, duração com for/since, ever/never/just/already/yet; contraste com simple past.',
    vocabulary: [['ever', 'alguma vez'], ['never', 'nunca'], ['already', 'já'], ['yet', 'ainda / já (perguntas)'], ['just', 'acabou de'], ['for', 'há / por (duração)'], ['since', 'desde']],
    phrases: [
      ['I have visited Paris.', 'Eu já visitei Paris.'], ['She has worked here for five years.', 'Ela trabalha aqui há cinco anos.'], ['He has worked at the company since 2010.', 'Ele trabalha na empresa desde 2010.'],
      ['Have you ever been to New York?', 'Você já esteve em Nova York?'], ['Maria has never eaten sushi.', 'Maria nunca comeu sushi.'], ['We haven’t visited that museum yet.', 'Ainda não visitamos aquele museu.'],
    ],
    grammar: [
      'Forma: I/you/we/they have + V3; he/she/it has + V3. Negativa: haven’t/hasn’t. Pergunta: "Have you seen...?" / "Has she traveled...?"',
      'Experiência sem tempo definido: "I have visited Paris." Com tempo definido usa-se simple past: "I visited Paris in 2019."',
      'Duração até agora: for + período (for ten years) / since + ponto inicial (since 2010, since Monday).',
      'Ever (perguntas), never, already, yet (negativas e perguntas, no fim da frase), just (acabou de).',
      'Been x gone: "She has been to Asia" (foi e voltou) / "She has gone to Asia" (está lá).',
      'No inglês americano, com just/already/yet o simple past também é aceito: "I just finished" = "I’ve just finished".',
    ],
  },

  'g-past-perfect': {
    summary: 'Past perfect (had + particípio): ação anterior a outra no passado; by the time, before, already, when.',
    vocabulary: [['by the time', 'quando / até o momento em que'], ['before', 'antes'], ['already', 'já']],
    phrases: [
      ['By the time we arrived, they had already eaten.', 'Quando chegamos, eles já tinham comido.'], ['She had seen that movie before.', 'Ela já tinha visto aquele filme antes.'],
      ['When we arrived, they had already started the meeting.', 'Quando chegamos, eles já tinham começado a reunião.'], ['Had you met him before?', 'Você já o conhecia?'],
    ],
    grammar: [
      'Forma: had + V3 para todas as pessoas. Negativa: hadn’t. Pergunta: "Had she met him before?"',
      'Usado para a ação que aconteceu primeiro, quando já se fala de outra no passado: "When I got to the party, they had left."',
      'A outra ação fica no simple past: "By the time I got there (simple past), they had left (past perfect)."',
      'Contração ’d: "I’d finished" (= I had finished) — cuidado para não confundir com I’d = I would.',
    ],
  },

  'g-perfect-continuous': {
    summary: 'Present perfect continuous (have/has been + -ing) e past perfect continuous (had been + -ing): duração e continuidade até agora ou até um ponto no passado.',
    vocabulary: [['how long', 'há quanto tempo'], ['for / since', 'há / desde'], ['all day / all week', 'o dia todo / a semana toda']],
    phrases: [
      ['I have been studying English for two hours.', 'Estou estudando inglês há duas horas.'], ['She has been working on this project all week.', 'Ela está trabalhando neste projeto a semana toda.'],
      ['How long have you been learning Spanish?', 'Há quanto tempo você está aprendendo espanhol?'], ['They had been waiting for two hours when I arrived.', 'Eles estavam esperando havia duas horas quando cheguei.'],
      ['She had been living in New York before she moved to London.', 'Ela morava em Nova York antes de se mudar para Londres.'],
    ],
    grammar: [
      'Present perfect continuous: have/has been + -ing. Ação que começou no passado e continua (ou acabou de parar) — ênfase na duração.',
      'Past perfect continuous: had been + -ing. Ação contínua até um ponto no passado: "She had been working there for five years when it closed."',
      'Negativas: haven’t/hasn’t/hadn’t been + -ing. Perguntas: "Have you been waiting long?" / "Had he been playing...?"',
      'Pergunta de duração: How long + have/has/had + sujeito + been + -ing?',
      'Verbos de estado (know, like, be) usam a forma simples: "I have known her for years."',
    ],
  },

  'g-pronouns': {
    summary: 'Pronomes sujeito, objeto, adjetivos e pronomes possessivos, posse com ’s.',
    vocabulary: [
      ['I / me / my / mine', 'eu / me, mim / meu / o meu'], ['you / you / your / yours', 'você'], ['he / him / his / his', 'ele'], ['she / her / her / hers', 'ela'],
      ['it / it / its', 'ele, ela (coisa)'], ['we / us / our / ours', 'nós'], ['they / them / their / theirs', 'eles, elas'],
    ],
    phrases: [['This is my ticket. This ticket is mine.', 'Esta é minha passagem. Esta passagem é minha.'], ['Mr. Jones likes her.', 'O Sr. Jones gosta dela.'], ['This is Mary’s house.', 'Esta é a casa da Mary.']],
    grammar: [
      'Sujeito antes do verbo (I, you, he, she, it, we, they); objeto depois do verbo/preposição (me, you, him, her, it, us, them).',
      'Possessive adjective + substantivo (my car); possessive pronoun sozinho (the car is mine).',
      'His serve como adjetivo e pronome: "his bag" / "the bag is his". Its não tem forma de pronoun usual e não leva apóstrofo.',
      'O possessivo concorda com o dono, não com a coisa: "Mary loves her job." / "John likes his job."',
      'Posse com ’s: "Paul’s car"; plural terminado em s: "the students’ books"; nomes em s: "Carlos’s" ou "Carlos’".',
    ],
  },

  'g-articles-nouns': {
    summary: 'Artigos a/an/the, plurais regulares e irregulares, contáveis e incontáveis, many/much, few/little, a lot of.',
    vocabulary: [['a / an', 'um, uma'], ['the', 'o, a, os, as'], ['many / much', 'muitos / muito'], ['few / little', 'poucos / pouco'], ['a few / a little', 'alguns / um pouco'], ['a lot of', 'muito(s)']],
    phrases: [['an hour, an apple, a hotel, a university', 'uma hora, uma maçã, um hotel, uma universidade'], ['How many people?', 'Quantas pessoas?'], ['How much money?', 'Quanto dinheiro?']],
    grammar: [
      'A antes de SOM de consoante (a car, a hotel, a university, a European city); an antes de SOM de vogal (an apple, an hour, an airport, an MBA).',
      'Profissões levam a/an: "He is an engineer."',
      'The para algo específico ou já mencionado; não se usa the para generalizar: "I like coffee." / "Children love parks."',
      'Plurais: +s; +es (s, sh, ch, x, z, alguns o: potatoes, tomatoes); y → ies; f/fe → ves; irregulares (men, women, children, feet, teeth, people).',
      'Incontáveis não têm plural nem a/an: money, water, information, advice, luggage, furniture, news.',
      'Many/few + contáveis; much/little + incontáveis; a lot of para ambos.',
    ],
  },

  'g-prepositions': {
    summary: 'Preposições de lugar (in, on, at, next to, between...) e de tempo (in, on, at), by + transporte, on foot.',
    vocabulary: [['in', 'em, dentro'], ['on', 'em, sobre'], ['at', 'em (ponto específico)'], ['next to', 'ao lado de'], ['between', 'entre'], ['behind', 'atrás'], ['in front of', 'na frente de'], ['across from', 'em frente (do outro lado)']],
    phrases: [['The book is on the table.', 'O livro está na mesa.'], ['She is at the bus stop.', 'Ela está no ponto de ônibus.'], ['I work on Saturdays.', 'Eu trabalho aos sábados.'], ['Christmas is in December.', 'O Natal é em dezembro.']],
    grammar: [
      'Lugar — IN: dentro, cidades, países (in the box, in Brazil). ON: superfícies, ruas, andares, transporte público (on the wall, on Main Street, on the 2nd floor, on the bus). AT: pontos e endereços (at the door, at home, at work, at 22 Main Street).',
      'Tempo — AT: horas e momentos (at 7:00, at noon, at night). ON: dias e datas (on Monday, on July 4th, on the weekend). IN: meses, anos, estações, partes do dia (in May, in 2010, in summer, in the morning).',
      'By + meio de transporte (by bus, by car); on foot = a pé.',
      'No inglês americano: "on the weekend" (britânico: "at the weekend").',
    ],
  },

  'g-modals': {
    summary: 'Verbos modais: can, could, would, should, must, may — pedidos, permissão, habilidade, conselhos e obrigação.',
    vocabulary: [['can', 'poder / saber'], ['could', 'poderia / pôde'], ['would', '-ria (gostaria)'], ['should', 'deveria'], ['must', 'deve / precisa'], ['may', 'pode (formal) / talvez'], ['have to', 'ter que']],
    phrases: [
      ['Can I have the menu?', 'Pode me trazer o cardápio?'], ['Could you help me, please?', 'Você poderia me ajudar?'], ['I would like a room.', 'Eu gostaria de um quarto.'],
      ['You should visit Salvador.', 'Você deveria visitar Salvador.'], ['You must wait here.', 'Você deve esperar aqui.'], ['May I see your passport?', 'Posso ver seu passaporte?'],
    ],
    grammar: [
      'Modais não recebem -s na 3ª pessoa e são seguidos de infinitivo sem to: "She can swim." / "He should go."',
      'Negativas: can’t, couldn’t, wouldn’t, shouldn’t, mustn’t. Perguntas: inverta o modal: "Can you...?", "Should I...?"',
      'Pedidos: Can I...? (informal), Could I...? (mais educado), May I...? (formal).',
      'Should = conselho; must = obrigação forte ou conclusão lógica; have to = obrigação externa (muito usado nos EUA).',
      'Would like = want (educado): "Would you like something to drink?"',
      'Nos EUA, para pedir conselho: "Should we go?" ("Shall we?" é raro).',
    ],
  },

  'g-comparatives': {
    summary: 'Comparativos (-er than / more ... than) e superlativos (the -est / the most); irregulares good/bad/far; as ... as.',
    vocabulary: [['than', 'do que'], ['the most', 'o mais'], ['better / best', 'melhor / o melhor'], ['worse / worst', 'pior / o pior'], ['as ... as', 'tão ... quanto']],
    phrases: [['Brazil is bigger than Venezuela.', 'O Brasil é maior que a Venezuela.'], ['This is the most expensive restaurant in the city.', 'Este é o restaurante mais caro da cidade.'], ['Curitiba is colder than São Paulo.', 'Curitiba é mais fria que São Paulo.']],
    grammar: [
      '1 sílaba: + er / the + est (cheap → cheaper → the cheapest). Terminados em e: + r/st (nice → nicer → the nicest).',
      'CVC: dobra a consoante (big → bigger → the biggest; hot → hotter).',
      '2 sílabas terminadas em y: y → ier/iest (happy → happier → the happiest; busy, easy, early).',
      'Demais adjetivos de 2+ sílabas: more / the most (famous, expensive, beautiful, important, intelligent).',
      'Irregulares: good → better → the best; bad → worse → the worst; far → farther → the farthest.',
      'Igualdade: as + adjetivo + as ("as tall as"); not as ... as.',
    ],
  },

  'g-frequency': {
    summary: 'Advérbios de frequência (always, usually, often, sometimes, rarely/seldom, never), posição na frase, How often, once/twice/three times a...',
    vocabulary: [['always', 'sempre'], ['usually', 'normalmente'], ['often', 'frequentemente'], ['sometimes', 'às vezes'], ['rarely / seldom', 'raramente'], ['never', 'nunca'], ['once / twice', 'uma vez / duas vezes'], ['How often...?', 'Com que frequência...?']],
    phrases: [['I usually take the bus.', 'Eu normalmente pego ônibus.'], ['She is always busy.', 'Ela está sempre ocupada.'], ['How often do you travel? Twice a year.', 'Com que frequência você viaja? Duas vezes por ano.']],
    grammar: [
      'Posição: antes do verbo principal ("I often have meetings"), depois do to be ("He is never late"), entre auxiliar e verbo ("I have never been there", "Do you often go...?").',
      'Sometimes também pode iniciar a frase: "Sometimes I take the bus."',
      'Never já é negativo — não se usa com not: "I never go" (não "I don’t never go").',
      'Frequência exata vai no fim: once a week, twice a month, three times a year, every day.',
    ],
  },
};

export { IRREGULAR_VERBS, REGULAR_IN_US } from './irregular-verbs';

export function knowledgeFor(topicId: string): TopicKnowledge | undefined {
  return KNOWLEDGE[topicId];
}
