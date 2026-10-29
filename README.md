# BockTalk

Revisão e treino das lições básicas aprendidas com Fernando Bockmann.

É um jogo de perguntas (estilo Duolingo) construído a partir do material do curso: as 15 lições de *Inglês para Profissionais de Turismo*, o documento *Tempos Verbais*, a planilha de verbos irregulares e o *English Grammar in Use* (Murphy). Você escolhe um tema, responde 10 questões (múltipla escolha e escrita), vê a correção a cada resposta e um relatório no fim. Sem login nem histórico: tudo fica na sessão do navegador.

## Como funciona

- **Base de conhecimento** — [api/_lib/knowledge.ts](api/_lib/knowledge.ts): vocabulário, frases e regras de cada tema, revisados e convertidos para o inglês dos EUA. As correções feitas no material estão em [CORRECOES.md](CORRECOES.md).
- **Banco inicial** — [api/_lib/seed.ts](api/_lib/seed.ts): ~400 questões tiradas dos exercícios do livro e do docx, com gabarito em inglês americano. São gravadas no banco automaticamente na primeira requisição.
- **Questões novas** — a cada partida o servidor pede à IA novas questões sobre o tema (com o conhecimento do curso como contexto), valida e grava no banco. Se o banco ainda tem questões inéditas para a sessão, a partida começa na hora e a geração acontece em segundo plano para as próximas; se faltar, a partida espera a IA. Sem IA (ou se a cota acabar), um gerador por regras ([api/_lib/procedural.ts](api/_lib/procedural.ts)) completa a partida.
- **Verbos irregulares** — item do quadro de Gramática, com 10 questões só sobre a planilha de verbos ([api/_lib/irregular-verbs.ts](api/_lib/irregular-verbs.ts)). Toda partida traz 3 questões de "marque todas as corretas" (quais verbos são irregulares, quais formas de passado ou particípio estão certas, quais têm passado igual ao particípio), geradas da tabela e conferidas por testes. A tabela completa (93 verbos da planilha menos "learn", que é regular no inglês americano) abre pelo botão "Tabela", ao lado do item e durante a partida.
- **Correção da escrita** — primeiro compara com as respostas aceitas (ignorando maiúsculas, pontuação, acentos e contrações). Se não bater, a IA corrige: diz se está certo, mostra sua frase corrigida e explica o erro. Variações corretas aprovadas pela IA viram respostas aceitas no banco.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:5173. No celular, na mesma rede Wi-Fi, use o endereço "Network" que o Vite mostra. Sem configurar nada, o app usa um banco em memória (zera ao reiniciar) e o gerador por regras. Para usar IA e banco de verdade, copie `.env.example` para `.env` e preencha.

## Publicar (Vercel + Neon + IA grátis)

1. **IA gratuita** (pelo menos uma):
   - Groq: crie uma chave em https://console.groq.com/keys → `GROQ_API_KEY`.
   - Google Gemini: crie uma chave em https://aistudio.google.com/apikey → `GEMINI_API_KEY`.
   O app tenta Groq primeiro e usa o Gemini como reserva. Os modelos podem ser trocados com `GROQ_MODEL` / `GEMINI_MODEL`.
2. **Código no GitHub**: crie um repositório e envie esta pasta (o `.gitignore` já deixa de fora os PDFs, o docx e a planilha).
3. **Vercel**: em https://vercel.com/new importe o repositório (o framework Vite é detectado sozinho).
4. **Banco Neon**: no projeto da Vercel, aba *Storage* → *Create Database* → *Neon*. Isso cria a variável `DATABASE_URL` automaticamente. As tabelas e as questões iniciais são criadas na primeira partida.
5. Em *Settings → Environment Variables*, adicione `GROQ_API_KEY` e/ou `GEMINI_API_KEY` e faça um novo deploy.
6. Confira em `https://SEU-APP.vercel.app/api/status`: deve mostrar `"database": "neon"`, os provedores de IA e quantas questões cada tema tem.

Alternativa sem GitHub: `npx vercel` nesta pasta (o `.vercelignore` também exclui o material).

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | App + API locais |
| `npm test` | Testes (base de questões, gerador, correção, fluxo com IA simulada) |
| `npm run build` | Checagem de tipos e build de produção |

## Observações

- A API não tem autenticação: quem tiver o link pode jogar e, com isso, consumir a cota grátis da IA. Para uso pessoal isso não é problema.
- Quando uma IA responde que o limite gratuito acabou (HTTP 429), ela fica em pausa pelo tempo que o próprio serviço pede (10 minutos se ele não disser), gravado no banco para valer em todas as instâncias. Nesse tempo o app não chama aquela IA: usa a outra, ou monta a partida com o banco e o gerador por regras. O `/api/status` mostra até quando cada uma está pausada (`pausedUntil`).
- `NEW_QUESTIONS_PER_MATCH` controla quantas questões a IA cria por partida (padrão 4; `0` desliga a geração).
- Ao alterar [api/_lib/seed.ts](api/_lib/seed.ts), aumente `SEED_VERSION` em [api/_lib/db.ts](api/_lib/db.ts) para as novas questões entrarem num banco já existente.
