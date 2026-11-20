// Popula a coleção com dados ilustrativos para a demonstração.
// Uso: npm run seed   (apaga só os registros sintéticos antigos e insere de novo)
const db = require('../src/db');
const { gerarDadosSinteticos } = require('./dados-sinteticos');

(async () => {
  try {
    const colecao = await db.conectar();
    const removidos = await colecao.deleteMany({ sintetico: true });
    const resultado = await colecao.insertMany(gerarDadosSinteticos());
    console.log(`Removidos ${removidos.deletedCount} registros sintéticos antigos.`);
    console.log(`Inseridos ${resultado.insertedCount} registros ilustrativos em "${db.NOME_BANCO}.ocorrencias".`);
  } catch (erro) {
    console.error('Erro ao popular o banco:', erro.message);
    process.exitCode = 1;
  } finally {
    await db.fechar();
  }
})();
