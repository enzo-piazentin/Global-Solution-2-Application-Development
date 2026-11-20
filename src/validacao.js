const { TIPOS, PRIORIDADES, BAIRROS } = require('./config');

// Recebe o corpo do formulário e devolve { erros, dados }.
// Se "erros" vier vazio, "dados" já está limpo e pronto para salvar no MongoDB.
function validarOcorrencia(corpo = {}) {
  const erros = [];

  const tipo = String(corpo.tipo || '').trim();
  const bairro = String(corpo.bairro || '').trim();
  const prioridade = String(corpo.prioridade || '').trim();
  const idadeTexto = String(corpo.idade || '').trim();
  const descricao = String(corpo.descricao || '').trim();

  if (!TIPOS[tipo]) erros.push('Escolha o tipo de ocorrência.');
  if (!BAIRROS.includes(bairro)) erros.push('Escolha um bairro da lista.');
  if (!PRIORIDADES[prioridade]) erros.push('Escolha a prioridade (alta, média ou baixa).');

  const idade = Number(idadeTexto);
  if (!idadeTexto || !Number.isInteger(idade) || idade < 60 || idade > 120) {
    erros.push('Informe a idade da pessoa idosa: um número inteiro entre 60 e 120.');
  }

  if (descricao.length < 10) erros.push('A descrição precisa ter pelo menos 10 caracteres.');
  if (descricao.length > 500) erros.push('A descrição pode ter no máximo 500 caracteres.');

  if (erros.length) return { erros, dados: null };

  return {
    erros: [],
    dados: { tipo, bairro, prioridade, idade, descricao, criadoEm: new Date() }
  };
}

module.exports = { validarOcorrencia };
