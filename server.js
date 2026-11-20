const path = require('path');
const express = require('express');

const db = require('./src/db');
const { TIPOS, BAIRROS } = require('./src/config');
const { validarOcorrencia } = require('./src/validacao');
const { calcularIndicadores } = require('./src/indicadores');
const { paginaMensagem, paginaPainel, pagina404 } = require('./src/views');

const app = express();
const PORTA = process.env.PORT || 3000;

// Lê os campos enviados pelo formulário HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));
// Entrega o index.html (formulário) e o style.css da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// GET /painel: consulta os registros no MongoDB e mostra indicadores + lista
app.get('/painel', async (req, res, next) => {
  try {
    const todos = await db.ocorrencias().find().sort({ criadoEm: -1 }).toArray();
    const ind = calcularIndicadores(todos);

    // Filtros opcionais da listagem (?tipo=golpe&bairro=Centro)
    const filtros = {
      tipo: TIPOS[req.query.tipo] ? req.query.tipo : '',
      bairro: BAIRROS.includes(req.query.bairro) ? req.query.bairro : ''
    };
    const registros = todos.filter(
      (r) => (!filtros.tipo || r.tipo === filtros.tipo) && (!filtros.bairro || r.bairro === filtros.bairro)
    );

    res.send(paginaPainel({ ind, registros, filtros }));
  } catch (erro) {
    next(erro);
  }
});

// POST /ocorrencias: valida os campos e grava na coleção "ocorrencias"
app.post('/ocorrencias', async (req, res, next) => {
  const { erros, dados } = validarOcorrencia(req.body);

  if (erros.length) {
    return res.status(400).send(
      paginaMensagem({ sucesso: false, titulo: 'Não foi possível registrar', texto: 'Corrija os campos abaixo:', itens: erros })
    );
  }

  try {
    await db.ocorrencias().insertOne(dados);
    res.status(201).send(
      paginaMensagem({
        sucesso: true,
        titulo: 'Ocorrência registrada',
        texto: `${TIPOS[dados.tipo]} em ${dados.bairro} foi salva e já entra nos indicadores do painel.`
      })
    );
  } catch (erro) {
    next(erro);
  }
});

// GET /api/indicadores: os mesmos indicadores em JSON (útil para testar)
app.get('/api/indicadores', async (req, res, next) => {
  try {
    const todos = await db.ocorrencias().find().toArray();
    res.json(calcularIndicadores(todos));
  } catch (erro) {
    next(erro);
  }
});

// 404: nenhuma rota acima respondeu
app.use((req, res) => {
  res.status(404).send(pagina404(req.originalUrl));
});

// 500: erro inesperado (ex.: banco fora do ar)
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).send(
    paginaMensagem({ sucesso: false, titulo: 'Erro no servidor', texto: 'Tente novamente em instantes.' })
  );
});

db.conectar()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`MongoDB conectado em ${db.URI} (banco "${db.NOME_BANCO}")`);
      console.log(`Elo 60+ rodando em http://localhost:${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error('Não foi possível conectar ao MongoDB:', erro.message);
    console.error('Verifique se o MongoDB está ligado ou defina a variável MONGODB_URI.');
    process.exit(1);
  });
