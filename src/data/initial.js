export const PAUTAS_INICIAIS = [
  // TÉCNICA
  { id: 1, numero: 1, pilar: 'Técnica', titulo: 'Por que seu macaron racha (e não é o forno)', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 2, numero: 2, pilar: 'Técnica', titulo: 'Temperagem: o erro que 90% dos alunos cometem na primeira aula', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 3, numero: 3, pilar: 'Técnica', titulo: 'Ganache perfeita: proporção, temperatura e o detalhe que ninguém ensina', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 4, numero: 4, pilar: 'Técnica', titulo: 'Massa folhada: a física por trás do croissant que infla', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 5, numero: 5, pilar: 'Técnica', titulo: 'Choux: por que a sua não cresce como deveria', formato: 'Reels', status: 'Disponível', dataUso: null },

  // ECDL
  { id: 6, numero: 6, pilar: 'ECDL', titulo: 'A nova escola: 14 anos de sonho virando realidade', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 7, numero: 7, pilar: 'ECDL', titulo: 'Master Confeiteiro: o que muda em 10 dias de imersão', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 8, numero: 8, pilar: 'ECDL', titulo: 'Doces pra Cafeteria: por que o básico bem feito muda tudo', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 9, numero: 9, pilar: 'ECDL', titulo: 'O que esperar do Módulo Chocolate: da bean to bar ao bombom premium', formato: 'Carrossel', status: 'Disponível', dataUso: null },
  { id: 10, numero: 10, pilar: 'ECDL', titulo: 'Depoimento de aluna: o antes e depois depois da imersão', formato: 'Reels', status: 'Disponível', dataUso: null },

  // GESTÃO
  { id: 11, numero: 11, pilar: 'Gestão', titulo: 'CMV real: a conta que nenhum confeiteiro faz direito', formato: 'Carrossel', status: 'Disponível', dataUso: null },
  { id: 12, numero: 12, pilar: 'Gestão', titulo: 'Precificar por sentimento vs ficha técnica: qual te quebra primeiro', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 13, numero: 13, pilar: 'Gestão', titulo: 'Faturar R$30k e não sobrar nada: onde está o erro', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 14, numero: 14, pilar: 'Gestão', titulo: 'Cardápio inchado: por que 47 sabores te quebram', formato: 'Reels', status: 'Disponível', dataUso: null },

  // PESSOAL
  { id: 15, numero: 15, pilar: 'Pessoal', titulo: 'A torta de morango que me fez virar confeiteiro', formato: 'Reels', status: 'Disponível', dataUso: null },
  { id: 16, numero: 16, pilar: 'Pessoal', titulo: 'O primeiro dia de aula que mudou a vida de um aluno', formato: 'Reels', status: 'Disponível', dataUso: null },
];

export const KANBAN_INICIAL = {
  pauta: [],
  gravado: [],
  editando: [],
  pronto: [],
  publicado: [],
};

export const TRIGGERS_INICIAIS = [
  {
    id: 1,
    keyword: 'CURSO',
    tipo: 'Comentário',
    mensagem: 'Olá! Aqui estão os cursos disponíveis na ECDL: [URL catálogo]. Qual te interessa mais?',
    status: 'Ativo',
    ultimaAtualizacao: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    keyword: 'VAGA',
    tipo: 'DM',
    mensagem: 'Oi! As vagas da próxima turma estão limitadas. Para garantir a sua, acessa: [URL]. Ficou com dúvida? Me chama aqui!',
    status: 'Ativo',
    ultimaAtualizacao: new Date().toISOString().split('T')[0],
  },
  {
    id: 3,
    keyword: 'PREÇO',
    tipo: 'DM',
    mensagem: 'Oi! Os valores e condições de pagamento estão aqui: [URL]. Posso te ajudar com mais alguma informação?',
    status: 'Ativo',
    ultimaAtualizacao: new Date().toISOString().split('T')[0],
  },
  {
    id: 4,
    keyword: 'GRATUITO',
    tipo: 'Comentário',
    mensagem: 'Temos uma aula gratuita pra você experimentar! Acessa o link na bio e se inscreve.',
    status: 'Ativo',
    ultimaAtualizacao: new Date().toISOString().split('T')[0],
  },
];

export const CURSOS_INICIAIS = [
  { id: 'master', nome: 'Master Confeiteiro', duracao: '10 dias', valor: 4500 },
  { id: 'chocolate', nome: 'Módulo Chocolate', duracao: '3 dias', valor: 1800 },
  { id: 'cafeteria', nome: 'Doces pra Cafeteria', duracao: '2 dias', valor: 1200 },
  { id: 'moderna', nome: 'Confeitaria Moderna', duracao: '3 dias', valor: 1800 },
];
