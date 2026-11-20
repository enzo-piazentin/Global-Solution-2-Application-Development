const { MongoClient } = require('mongodb');

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const NOME_BANCO = process.env.MONGODB_DB || 'elo60';

const cliente = new MongoClient(URI);
let colecao = null;

// Abre a conexão uma vez, quando o servidor sobe
async function conectar() {
  await cliente.connect();
  colecao = cliente.db(NOME_BANCO).collection('ocorrencias');
  await colecao.createIndex({ criadoEm: -1 });
  return colecao;
}

function ocorrencias() {
  if (!colecao) throw new Error('Banco de dados ainda não conectado.');
  return colecao;
}

async function fechar() {
  await cliente.close();
}

module.exports = { conectar, ocorrencias, fechar, URI, NOME_BANCO };
