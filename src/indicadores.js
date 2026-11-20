const { TIPOS, PRIORIDADES, PESOS, LIMITES_RISCO, MINIMO_CONFIAVEL } = require('./config');

// Conta quantos registros existem para cada chave (ex.: cada tipo ou cada prioridade)
function contarPor(registros, campo, chaves) {
  const contagem = {};
  chaves.forEach((c) => (contagem[c] = 0));
  registros.forEach((r) => {
    if (r[campo] in contagem) contagem[r[campo]] += 1;
  });
  return contagem;
}

function percentual(parte, total) {
  return total ? Math.round((parte / total) * 100) : 0;
}

// Classificação por regra: cada ocorrência soma o peso da sua prioridade
// (alta = 3, média = 2, baixa = 1). A soma é o índice de risco do bairro.
function classificarRisco(indice) {
  if (indice >= LIMITES_RISCO.alto) return { nivel: 'alto', rotulo: 'Risco alto' };
  if (indice >= LIMITES_RISCO.atencao) return { nivel: 'atencao', rotulo: 'Atenção' };
  return { nivel: 'normal', rotulo: 'Normal' };
}

function calcularIndicadores(registros) {
  const total = registros.length;

  // Indicador 1: total de registros (e quantos são de prioridade alta)
  const porPrioridade = contarPor(registros, 'prioridade', Object.keys(PRIORIDADES));

  // Indicador 2: resumo por categoria (tipo de ocorrência)
  const porTipoContagem = contarPor(registros, 'tipo', Object.keys(TIPOS));
  const porTipo = Object.keys(TIPOS)
    .map((chave) => ({
      chave,
      rotulo: TIPOS[chave],
      quantidade: porTipoContagem[chave],
      percentual: percentual(porTipoContagem[chave], total)
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  // Indicador 3: risco por bairro (agrupamento + regra de classificação)
  const grupos = {};
  registros.forEach((r) => {
    if (!grupos[r.bairro]) grupos[r.bairro] = [];
    grupos[r.bairro].push(r);
  });

  const porBairro = Object.entries(grupos)
    .map(([bairro, lista]) => {
      const indice = lista.reduce((soma, r) => soma + (PESOS[r.prioridade] || 0), 0);
      const tipos = contarPor(lista, 'tipo', Object.keys(TIPOS));
      const principal = Object.keys(tipos).sort((a, b) => tipos[b] - tipos[a])[0];
      return {
        bairro,
        quantidade: lista.length,
        altas: lista.filter((r) => r.prioridade === 'alta').length,
        indice,
        tipoPrincipal: TIPOS[principal],
        poucosDados: lista.length < MINIMO_CONFIAVEL,
        ...classificarRisco(indice)
      };
    })
    .sort((a, b) => b.indice - a.indice || b.quantidade - a.quantidade);

  const bairrosEmAlerta = porBairro.filter((b) => b.nivel === 'alto').length;

  return {
    total,
    porPrioridade: Object.keys(PRIORIDADES).map((chave) => ({
      chave,
      rotulo: PRIORIDADES[chave],
      quantidade: porPrioridade[chave],
      percentual: percentual(porPrioridade[chave], total)
    })),
    altas: porPrioridade.alta,
    porTipo,
    porBairro,
    bairrosEmAlerta
  };
}

module.exports = { calcularIndicadores, classificarRisco };
