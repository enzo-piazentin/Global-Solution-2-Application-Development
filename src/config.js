// Listas fixas usadas pelo formulário, pela validação e pelos indicadores.
// Ficam num só lugar para o formulário e o servidor nunca ficarem diferentes.

const TIPOS = {
  golpe: 'Tentativa de golpe',
  isolamento: 'Idoso sozinho / sem check-in',
  saude_calor: 'Saúde e onda de calor',
  falta_servico: 'Falta de serviço ou atividade'
};

const PRIORIDADES = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa'
};

// Peso de cada prioridade no índice de risco do bairro
const PESOS = { alta: 3, media: 2, baixa: 1 };

// Regras do nível de risco por bairro (índice = soma dos pesos)
const LIMITES_RISCO = { alto: 8, atencao: 4 };

// Abaixo desta quantidade de registros, o painel avisa que a leitura do bairro é pouco confiável
const MINIMO_CONFIAVEL = 3;

const BAIRROS = [
  'Butantã',
  'Capão Redondo',
  'Centro',
  'Itaquera',
  'Mooca',
  'Pinheiros',
  'Santana',
  'São Miguel Paulista'
];

module.exports = { TIPOS, PRIORIDADES, PESOS, LIMITES_RISCO, MINIMO_CONFIAVEL, BAIRROS };
