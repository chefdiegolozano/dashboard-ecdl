// 'edit' inclui view. Ausência de chave = sem acesso.
const PERMISSIONS = {
  gestor: {
    dashboard: 'edit', matriculas: 'edit', leads: 'edit',
    metricas: 'edit', anuncios: 'edit', calendario: 'edit', pautas: 'edit',
    kanban: 'edit', checklist: 'edit', tarefas: 'edit', workflow: 'edit',
    templates: 'edit', automacao: 'edit', regras: 'edit', config: 'edit',
    atividade: 'view',
  },
  editor: {
    dashboard: 'view',
    metricas: 'view', anuncios: 'view', calendario: 'edit', pautas: 'edit',
    kanban: 'edit', checklist: 'edit', tarefas: 'view', workflow: 'view',
    templates: 'edit', automacao: 'view', regras: 'view',
    atividade: 'view', config: 'view',
  },
  analista: {
    dashboard: 'view', matriculas: 'view', leads: 'view',
    metricas: 'edit', anuncios: 'edit', calendario: 'view', pautas: 'view',
    kanban: 'view', checklist: 'view', tarefas: 'edit', workflow: 'view',
    templates: 'view', automacao: 'view', regras: 'view',
    atividade: 'view', config: 'view',
  },
  video_maker: {
    calendario: 'view', pautas: 'view',
    kanban: 'edit', checklist: 'edit', tarefas: 'view', workflow: 'view', templates: 'view',
    atividade: 'view',
  },
};

export function canView(role, section) {
  return !!(PERMISSIONS[role] || {})[section];
}

export function canEdit(role, section) {
  return (PERMISSIONS[role] || {})[section] === 'edit';
}

export function firstAllowedSection(role) {
  const order = ['dashboard', 'matriculas', 'leads', 'metricas', 'anuncios', 'calendario', 'pautas', 'kanban', 'checklist', 'tarefas', 'atividade', 'workflow', 'templates', 'automacao', 'regras', 'config'];
  return order.find(s => canView(role, s)) || 'dashboard';
}
