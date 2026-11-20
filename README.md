# Elo 60+ | Painel de ocorrências com pessoas idosas

Global Solution 2026.2 · Application Development · Desafio CitizenTech

> *Tecnologia que cuida de quem cuidou da gente.*

## Grupo

- Bento Donato Garcia — RM561621
- Enzo Ribeiro Domingues Piazentin — RM564216
- Guilherme Domingues Califoni — RM565157

## Problema, público-alvo, objetivo e ODS

- **Problema:** solidão, golpes e exclusão digital atingem pessoas com 60 anos ou mais. O Brasil tem 32 milhões de idosos (Censo 2022), e 5,6 milhões deles moram sozinhos. Hoje esses casos ficam espalhados e o poder público não sabe onde agir primeiro.
- **Público-alvo:** pessoas idosas e suas famílias, que são beneficiadas. Quem usa o sistema são as equipes da prefeitura e dos CRAS.
- **Objetivo:** registrar ocorrências por bairro (golpes, idosos sozinhos, saúde e calor, falta de serviço) e transformar esses registros em indicadores de risco. O painel sugere onde agir, e a decisão final é sempre da equipe.
- **ODS:** **3** (Saúde e bem-estar), **10** (Redução das desigualdades) e **11** (Cidades e comunidades sustentáveis).

Este protótipo é a versão mínima do **Painel Elo 60+** apresentado no vídeo pitch do grupo.

## Tecnologias

HTML, CSS, JavaScript, Node.js, Express e MongoDB (driver oficial `mongodb`).

## Como executar

Pré-requisitos: **Node.js 18+** e **MongoDB** rodando localmente (ou uma URI do MongoDB Atlas).

```bash
npm install          # instala express e mongodb
npm run seed         # (opcional) insere 19 registros ilustrativos para a demonstração
npm start            # sobe o servidor em http://localhost:3000
```

Para usar outro banco, defina as variáveis antes do `npm start`:

```bash
MONGODB_URI="mongodb+srv://usuario:senha@cluster/..." MONGODB_DB=elo60 npm start
```

No Windows (PowerShell): `$env:MONGODB_URI="..."; npm start`

`npm test` roda os testes da validação e dos indicadores, sem precisar do MongoDB.

## Rotas

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/` | Página com a introdução e o formulário (`public/index.html`) |
| POST | `/ocorrencias` | Valida os campos e grava na coleção `ocorrencias`. Mostra uma mensagem de confirmação (201) ou de erro (400) |
| GET | `/painel` | Consulta o MongoDB e mostra os indicadores e a lista de registros, com filtro por tipo e bairro |
| GET | `/api/indicadores` | Os mesmos indicadores em JSON |
| * | qualquer outra | Página 404 |

## Campos de cada registro

| Campo | Validação |
| --- | --- |
| `tipo` | golpe, isolamento, saude_calor ou falta_servico |
| `bairro` | um dos bairros da lista |
| `prioridade` | alta, media ou baixa |
| `idade` | número inteiro de 60 a 120 |
| `descricao` | de 10 a 500 caracteres |
| `criadoEm` | data gerada pelo servidor |

O registro é anônimo: o formulário não pede nome, telefone nem endereço (LGPD).

## Indicadores

1. **Total de registros:** a quantidade de ocorrências na coleção, com destaque para as de prioridade alta.
2. **Resumo por categoria:** quantidade e percentual por tipo de ocorrência e por prioridade.
3. **Risco por bairro (classificação por regra):** cada ocorrência soma pontos pela prioridade (alta = 3, média = 2, baixa = 1). A soma é o índice de risco do bairro:
   - **8 ou mais:** risco alto (conta no card "Bairros em risco alto");
   - **4 a 7:** atenção;
   - **abaixo de 4:** normal.

   Bairros com menos de 3 registros recebem o aviso "poucos dados: leitura pouco confiável", porque poucos casos não bastam para uma conclusão. O painel também mostra o tipo de ocorrência mais comum em cada bairro, para indicar qual ação faz mais sentido.

Os dados de `npm run seed` são **ilustrativos (sintéticos)** e não representam casos reais.

## Estrutura

```
elo60-ocorrencias/
├── server.js              # Express: rotas GET/POST, 404 e erro 500
├── package.json
├── public/
│   ├── index.html         # introdução + formulário
│   └── style.css
├── src/
│   ├── config.js          # tipos, prioridades, bairros e regras de risco
│   ├── db.js              # conexão com o MongoDB
│   ├── validacao.js       # validação dos campos do formulário
│   ├── indicadores.js     # cálculo dos indicadores
│   └── views.js           # HTML do painel, das mensagens e do 404
└── scripts/
    ├── seed.js            # popula o banco com dados ilustrativos
    ├── dados-sinteticos.js
    └── testes.js
```

## Vídeo pitch

Link: _(colar aqui o link do YouTube)_
