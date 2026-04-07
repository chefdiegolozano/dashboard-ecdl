// ─── Conteúdo / Redes sociais ─────────────────────────────────────────────────

export function calcEngajamento(post) {
  if (post.engajamento && post.engajamento > 0) return parseFloat(post.engajamento);
  const reach = parseFloat(post.reach) || parseFloat(post.viewsIG) || 0;
  if (reach === 0) return 0;
  const interacoes = post.totalInteractions
    ? parseFloat(post.totalInteractions)
    : (parseFloat(post.likes) || 0) + (parseFloat(post.comments) || 0) +
      (parseFloat(post.shares) || 0) + (parseFloat(post.saves) || 0);
  return (interacoes / reach) * 100;
}

export function classificarPost(engajamento, viewsIG) {
  const eng = parseFloat(engajamento);
  const reach = parseFloat(viewsIG);
  if (eng > 5.0 && reach > 80000) return 'EXCELENTE';
  if (eng >= 3.0 && reach >= 40000) return 'BOM';
  if (eng >= 1.5 && reach >= 10000) return 'REGULAR';
  return 'FRACO';
}

export function classificarCor(classificacao) {
  const cores = {
    EXCELENTE: { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
    BOM:       { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
    REGULAR:   { bg: '#FFF8E1', text: '#F57F17', border: '#F57F17' },
    FRACO:     { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
  };
  return cores[classificacao] || cores.FRACO;
}

export function formatarViews(views) {
  if (!views) return '0';
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}k`;
  return views.toString();
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

export function getPostsDoMes(posts) {
  const agora = new Date();
  const mes = agora.getMonth();
  const ano = agora.getFullYear();
  return (posts || []).filter(p => {
    const d = new Date(p.data);
    return d.getMonth() === mes && d.getFullYear() === ano;
  });
}

export function getSemanasRecentes(posts, numSemanas = 8) {
  const semanas = [];
  const hoje = new Date();
  for (let i = numSemanas - 1; i >= 0; i--) {
    const inicioSemana = new Date(hoje);
    const diaSemana = hoje.getDay();
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1;
    inicioSemana.setDate(hoje.getDate() - diffInicio - i * 7);
    inicioSemana.setHours(0, 0, 0, 0);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);
    const postsSemana = (posts || []).filter(p => {
      const d = new Date(p.data);
      return d >= inicioSemana && d <= fimSemana;
    });
    const label = `S${numSemanas - i}`;
    const mediaViews = postsSemana.length > 0
      ? postsSemana.reduce((a, p) => a + (parseFloat(p.reach) || parseFloat(p.viewsIG) || 0), 0) / postsSemana.length
      : 0;
    const mediaEng = postsSemana.length > 0
      ? postsSemana.reduce((a, p) => a + calcEngajamento(p), 0) / postsSemana.length
      : 0;
    semanas.push({ label, mediaViews: Math.round(mediaViews), mediaEng: parseFloat(mediaEng.toFixed(2)) });
  }
  return semanas;
}

export function agruparPorPilar(posts) {
  const pilares = ['Técnica', 'Gestão', 'ECDL', 'Pessoal', 'Livre'];
  return pilares.map(pilar => {
    const pPilar = posts.filter(p => p.pilar === pilar);
    const mediaViews = pPilar.length > 0
      ? pPilar.reduce((a, p) => a + (parseFloat(p.reach) || parseFloat(p.viewsIG) || 0), 0) / pPilar.length
      : 0;
    const mediaEng = pPilar.length > 0
      ? pPilar.reduce((a, p) => a + (calcEngajamento(p) || 0), 0) / pPilar.length
      : 0;
    return { pilar, count: pPilar.length, mediaViews, mediaEng };
  });
}

// ─── Matrículas ───────────────────────────────────────────────────────────────

export function calcTaxaConversao(leads, matriculas) {
  if (!leads || leads === 0) return 0;
  return ((matriculas / leads) * 100).toFixed(1);
}

export function calcReceitaMensal(matriculas) {
  return (matriculas || [])
    .filter(m => {
      const d = new Date(m.dataMatricula);
      const agora = new Date();
      return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    })
    .reduce((a, m) => a + (parseFloat(m.valor) || 0), 0);
}
