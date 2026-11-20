// Dados ILUSTRATIVOS (sintéticos) para demonstrar o painel. Não são casos reais.
// Formato: [tipo, bairro, prioridade, idade, descrição, horas atrás]
const LINHAS = [
  ['golpe', 'Itaquera', 'alta', 74, 'Mensagem de falso filho pedindo Pix de R$ 1.500 por troca de número.', 2],
  ['golpe', 'Itaquera', 'alta', 81, 'Ligação de falsa central do banco pedindo senha do cartão.', 5],
  ['golpe', 'Itaquera', 'media', 69, 'Link de falso brinde da aposentadoria recebido no WhatsApp.', 9],
  ['isolamento', 'Itaquera', 'alta', 86, 'Mora sozinha e não respondeu ao check-in por dois dias.', 20],
  ['saude_calor', 'Capão Redondo', 'alta', 79, 'Onda de calor: idoso sozinho sem ventilação em casa.', 3],
  ['saude_calor', 'Capão Redondo', 'alta', 83, 'Tontura no calor e esqueceu o remédio da pressão.', 7],
  ['isolamento', 'Capão Redondo', 'media', 72, 'Família mora em outra cidade e ele não sai de casa há semanas.', 30],
  ['falta_servico', 'Capão Redondo', 'baixa', 66, 'Não há centro de convivência perto de casa.', 50],
  ['falta_servico', 'São Miguel Paulista', 'media', 70, 'Fila longa no posto e sem atendimento domiciliar.', 12],
  ['falta_servico', 'São Miguel Paulista', 'media', 75, 'Sem aula de celular para idosos na região.', 26],
  ['golpe', 'São Miguel Paulista', 'baixa', 68, 'Recebeu SMS suspeito, mas não clicou.', 40],
  ['isolamento', 'Santana', 'media', 88, 'Viúva, mora sozinha e quase não recebe visitas.', 15],
  ['golpe', 'Santana', 'baixa', 64, 'Perfil falso de neto pediu dinheiro; família percebeu a tempo.', 33],
  ['saude_calor', 'Santana', 'baixa', 71, 'Pediu ajuda para saber onde há ponto de hidratação.', 60],
  ['golpe', 'Centro', 'media', 77, 'Boleto falso de conta de luz entregue em mãos.', 8],
  ['isolamento', 'Centro', 'baixa', 73, 'Gostaria de participar de atividades em grupo.', 45],
  ['falta_servico', 'Mooca', 'baixa', 67, 'Procura atividade física gratuita para idosos.', 70],
  ['golpe', 'Pinheiros', 'media', 80, 'Falso técnico de internet tentou entrar em casa.', 18],
  ['isolamento', 'Butantã', 'alta', 92, 'Mora sozinho, mobilidade reduzida, faltou ao check-in.', 1]
];

function gerarDadosSinteticos(agora = Date.now()) {
  return LINHAS.map(([tipo, bairro, prioridade, idade, descricao, horas]) => ({
    tipo,
    bairro,
    prioridade,
    idade,
    descricao,
    criadoEm: new Date(agora - horas * 3600 * 1000),
    sintetico: true
  }));
}

module.exports = { gerarDadosSinteticos };
