const { TIPOS, PRIORIDADES, BAIRROS } = require('./config');

// Evita que um texto digitado no formulário vire HTML/JavaScript na página (XSS)
function esc(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(titulo, conteudo) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titulo)} | Elo 60+</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="topo">
    <a class="marca" href="/"><span class="marca-elo">Elo</span> 60+</a>
    <nav>
      <a href="/">Registrar ocorrência</a>
      <a href="/painel">Painel</a>
    </nav>
  </header>
  <main>
${conteudo}
  </main>
  <footer class="rodape">
    Elo 60+ · Tecnologia que cuida de quem cuidou da gente · ODS 3, 10 e 11
  </footer>
</body>
</html>`;
}

function paginaMensagem({ sucesso, titulo, itens = [], texto = '' }) {
  const lista = itens.length ? `<ul>${itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
  const conteudo = `
    <section class="cartao mensagem ${sucesso ? 'ok' : 'erro'}">
      <h1>${sucesso ? '✔' : '✖'} ${esc(titulo)}</h1>
      ${texto ? `<p>${esc(texto)}</p>` : ''}
      ${lista}
      <div class="acoes">
        ${sucesso
          ? '<a class="botao" href="/painel">Ver no painel</a> <a class="botao secundario" href="/">Registrar outra</a>'
          : '<a class="botao" href="javascript:history.back()">Voltar e corrigir</a>'}
      </div>
    </section>`;
  return layout(titulo, conteudo);
}

function barras(itens) {
  return itens
    .map(
      (i) => `
      <div class="barra-linha">
        <span class="barra-rotulo">${esc(i.rotulo)}</span>
        <span class="barra-trilho"><span class="barra ${esc(i.chave)}" style="width:${i.percentual}%"></span></span>
        <span class="barra-valor">${i.quantidade} <small>(${i.percentual}%)</small></span>
      </div>`
    )
    .join('');
}

function opcoes(mapaOuLista, selecionado) {
  const pares = Array.isArray(mapaOuLista)
    ? mapaOuLista.map((v) => [v, v])
    : Object.entries(mapaOuLista);
  return pares
    .map(([valor, rotulo]) => `<option value="${esc(valor)}"${valor === selecionado ? ' selected' : ''}>${esc(rotulo)}</option>`)
    .join('');
}

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function paginaPainel({ ind, registros, filtros }) {
  const linhasBairro = ind.porBairro.length
    ? ind.porBairro
        .map(
          (b) => `
        <tr>
          <td><strong>${esc(b.bairro)}</strong>${b.poucosDados ? '<br><small class="aviso">poucos dados: leitura pouco confiável</small>' : ''}</td>
          <td>${b.quantidade}</td>
          <td>${b.altas}</td>
          <td>${b.indice}</td>
          <td>${esc(b.tipoPrincipal)}</td>
          <td><span class="selo ${b.nivel}">${esc(b.rotulo)}</span></td>
        </tr>`
        )
        .join('')
    : '<tr><td colspan="6" class="vazio">Nenhum bairro com registros ainda.</td></tr>';

  const linhasRegistros = registros.length
    ? registros
        .map(
          (r) => `
        <tr>
          <td>${esc(formatarData(r.criadoEm))}</td>
          <td>${esc(TIPOS[r.tipo] || r.tipo)}</td>
          <td>${esc(r.bairro)}</td>
          <td><span class="selo p-${esc(r.prioridade)}">${esc(PRIORIDADES[r.prioridade] || r.prioridade)}</span></td>
          <td>${esc(r.idade)}</td>
          <td class="descricao">${esc(r.descricao)}</td>
        </tr>`
        )
        .join('')
    : '<tr><td colspan="6" class="vazio">Nenhuma ocorrência encontrada.</td></tr>';

  const filtrando = filtros.tipo || filtros.bairro;

  const conteudo = `
    <section class="cabecalho-painel">
      <div>
        <h1>Painel Elo 60+</h1>
        <p class="sub">Ocorrências com pessoas idosas agrupadas por bairro, para a prefeitura e os CRAS anteciparem problemas.</p>
      </div>
      <span class="selo decisao">Decisão final: equipe do CRAS</span>
    </section>

    <section class="indicadores">
      <article class="kpi">
        <span class="kpi-rotulo">Total de registros</span>
        <span class="kpi-valor">${ind.total}</span>
      </article>
      <article class="kpi">
        <span class="kpi-rotulo">Prioridade alta</span>
        <span class="kpi-valor">${ind.altas}</span>
      </article>
      <article class="kpi alerta">
        <span class="kpi-rotulo">Bairros em risco alto</span>
        <span class="kpi-valor">${ind.bairrosEmAlerta}</span>
      </article>
    </section>

    <section class="grade-2">
      <article class="cartao">
        <h2>Por tipo de ocorrência</h2>
        ${barras(ind.porTipo)}
      </article>
      <article class="cartao">
        <h2>Por prioridade</h2>
        ${barras(ind.porPrioridade)}
      </article>
    </section>

    <section class="cartao">
      <h2>Risco por bairro</h2>
      <p class="regra">Regra: cada ocorrência soma pontos pela prioridade (alta = 3, média = 2, baixa = 1).
        Índice de 8 ou mais = <strong>risco alto</strong>; de 4 a 7 = <strong>atenção</strong>; abaixo de 4 = normal.
        O painel sugere onde agir; quem decide é a equipe.</p>
      <div class="tabela-rolagem">
        <table>
          <thead><tr><th>Bairro</th><th>Ocorrências</th><th>Alta</th><th>Índice</th><th>Tipo mais comum</th><th>Nível</th></tr></thead>
          <tbody>${linhasBairro}</tbody>
        </table>
      </div>
    </section>

    <section class="cartao">
      <h2>Ocorrências registradas</h2>
      <form class="filtros" method="GET" action="/painel">
        <label>Tipo
          <select name="tipo"><option value="">Todos</option>${opcoes(TIPOS, filtros.tipo)}</select>
        </label>
        <label>Bairro
          <select name="bairro"><option value="">Todos</option>${opcoes(BAIRROS, filtros.bairro)}</select>
        </label>
        <button class="botao" type="submit">Filtrar</button>
        ${filtrando ? '<a class="botao secundario" href="/painel">Limpar</a>' : ''}
      </form>
      <p class="contagem">${registros.length} ocorrência(s) ${filtrando ? 'no filtro' : 'no total'}</p>
      <div class="tabela-rolagem">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Bairro</th><th>Prioridade</th><th>Idade</th><th>Descrição</th></tr></thead>
          <tbody>${linhasRegistros}</tbody>
        </table>
      </div>
    </section>`;

  return layout('Painel', conteudo);
}

function pagina404(caminho) {
  const conteudo = `
    <section class="cartao mensagem erro centro">
      <p class="codigo">404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço <code>${esc(caminho)}</code> não existe neste sistema.</p>
      <div class="acoes">
        <a class="botao" href="/">Registrar ocorrência</a>
        <a class="botao secundario" href="/painel">Ir para o painel</a>
      </div>
    </section>`;
  return layout('Página não encontrada', conteudo);
}

module.exports = { paginaMensagem, paginaPainel, pagina404, esc };
