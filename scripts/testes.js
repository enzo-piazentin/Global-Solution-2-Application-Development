// Testes rápidos da validação e dos indicadores (não precisam do MongoDB).
// Uso: npm test
const assert = require('assert');
const { validarOcorrencia } = require('../src/validacao');
const { calcularIndicadores } = require('../src/indicadores');
const { gerarDadosSinteticos } = require('./dados-sinteticos');

let ok = 0;
function teste(nome, fn) {
  fn();
  ok += 1;
  console.log('  ✔', nome);
}

console.log('Validação');
teste('aceita uma ocorrência válida', () => {
  const r = validarOcorrencia({ tipo: 'golpe', bairro: 'Centro', prioridade: 'alta', idade: '72', descricao: 'Ligação de falso banco.' });
  assert.deepStrictEqual(r.erros, []);
  assert.strictEqual(r.dados.idade, 72);
});
teste('recusa formulário vazio com 5 erros', () => {
  assert.strictEqual(validarOcorrencia({}).erros.length, 5);
});
teste('recusa idade abaixo de 60', () => {
  const r = validarOcorrencia({ tipo: 'golpe', bairro: 'Centro', prioridade: 'alta', idade: '45', descricao: 'Descrição válida aqui.' });
  assert.ok(r.erros.some((e) => e.includes('idade')));
});
teste('recusa tipo e bairro fora da lista', () => {
  const r = validarOcorrencia({ tipo: 'xyz', bairro: 'Atlântida', prioridade: 'alta', idade: '70', descricao: 'Descrição válida aqui.' });
  assert.strictEqual(r.erros.length, 2);
});

console.log('Indicadores');
const ind = calcularIndicadores(gerarDadosSinteticos());
teste('total de registros', () => assert.strictEqual(ind.total, 19));
teste('resumo por tipo soma o total', () => {
  assert.strictEqual(ind.porTipo.reduce((s, t) => s + t.quantidade, 0), ind.total);
  assert.strictEqual(ind.porTipo[0].chave, 'golpe');
});
teste('Itaquera e Capão Redondo em risco alto', () => {
  const altos = ind.porBairro.filter((b) => b.nivel === 'alto').map((b) => b.bairro);
  assert.deepStrictEqual(altos, ['Itaquera', 'Capão Redondo']);
  assert.strictEqual(ind.bairrosEmAlerta, 2);
});
teste('Butantã marcado com poucos dados', () => {
  assert.ok(ind.porBairro.find((b) => b.bairro === 'Butantã').poucosDados);
});
teste('lista vazia não quebra', () => {
  const vazio = calcularIndicadores([]);
  assert.strictEqual(vazio.total, 0);
  assert.strictEqual(vazio.porTipo[0].percentual, 0);
});

console.log(`\n${ok} testes passaram.`);
