// 'edit' inclui view. Ausência de chave = sem acesso.
const PERMISSIONS = {
  gestor: {
    dashboard: 'edit', matriculas: 'edit', leads: 'edit',
    metricas: 'edit', calendario: 'edit', pautas: 'edit',
    kanban: 'edit', checklist: 'edit', workflow: 'edit',
    templates: 'edit', automacao: 'edit', regras: 'edit', config: 'edit',
  },
  editor: {
    dashboard: 'view',
    metricas: 'view', calendario: 'edit', pautas: 'edit',
    kanban: 'edit', checklist: 'edit', workflow: 'view',
    templates: 'edit', automacao: 'view', regras: 'view',
  },
  analista: {
    dashboard: 'view', matriculas: 'view', leads: 'view',
    metricas: 'edit', calendario: 'view', pautas: 'view',
    kanban: 'view', checklist: 'view', workflow: 'view',
    templates: 'view', automacao: 'view', regras: 'view',
  },
  video_maker: {
    calendario: 'view', pautas: 'view',
    kanban: 'edit', checklist: 'edit', workflow: 'view', templates: 'view',
  },
};

export function canView(role, section) {
  return !!(PERMISSIONS[role] || {})[section];
}

export function canEdit(role, section) {
  return (PERMISSIONS[role] || {})[section] === 'edit';
}

export function firstAllowedSection(role) {
  const order = ['dashboard', 'matriculas', 'leads', 'metricas', 'calendario', 'pautas', 'kanban', 'checklist', 'workflow', 'templates', 'automacao', 'regras', 'config'];
  return order.find(s => canView(role, s)) || 'dashboard';
}
