import { classificarCor } from '../../utils/calculations';

const PILAR_COLORS = {
  Técnica:  { bg: '#F3E5F5', text: '#6A1B9A', border: '#6A1B9A' },
  Gestão:   { bg: '#FFF3E0', text: '#E65100', border: '#E65100' },
  ECDL:     { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  Pessoal:  { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  Livre:    { bg: '#F5F5F5', text: '#666',    border: '#999' },
};

const STATUS_COLORS = {
  Disponível:  { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  Produção:    { bg: '#FFF8E1', text: '#F57F17', border: '#F57F17' },
  Publicado:   { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  Arquivado:   { bg: '#F5F5F5', text: '#666',    border: '#999' },
  // Lead
  Novo:        { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  Contato:     { bg: '#FFF8E1', text: '#F57F17', border: '#F57F17' },
  Proposta:    { bg: '#F3E5F5', text: '#6A1B9A', border: '#6A1B9A' },
  Matriculado: { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  Perdido:     { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
  // Matrícula
  Ativa:       { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  Concluída:   { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  Cancelada:   { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
  Pendente:    { bg: '#FFF8E1', text: '#F57F17', border: '#F57F17' },
};

export function Badge({ tipo, valor, size = 'sm' }) {
  const pad = size === 'sm' ? '2px 8px' : '4px 12px';
  const fs  = size === 'sm' ? '11px' : '13px';

  let c;
  if (tipo === 'pilar') c = PILAR_COLORS[valor] || PILAR_COLORS.Livre;
  else if (tipo === 'status') c = STATUS_COLORS[valor] || STATUS_COLORS.Disponível;
  else if (tipo === 'classificacao') c = classificarCor(valor);
  else c = { bg: '#FBF5EE', text: '#C17F24', border: '#C17F24' };

  return (
    <span style={{
      display: 'inline-block', padding: pad, borderRadius: '4px',
      fontSize: fs, fontWeight: 600,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>{valor}</span>
  );
}
