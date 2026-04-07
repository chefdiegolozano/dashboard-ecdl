import { useState } from 'react';
import { Plus, Edit2, Trash2, MessageCircle } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

const STATUS_FUNIL = ['Novo', 'Contato', 'Proposta', 'Matriculado', 'Perdido'];
const ORIGENS = ['Instagram', 'WhatsApp', 'Indicação', 'Google', 'Site', 'Evento', 'Outro'];
const CURSOS_INTERESSE = ['Master Confeiteiro', 'Módulo Chocolate', 'Doces pra Cafeteria', 'Confeitaria Moderna', 'Indefinido'];

const emptyForm = {
  nome: '', telefone: '', email: '', origem: 'Instagram',
  cursoInteresse: 'Indefinido', status: 'Novo',
  dataEntrada: new Date().toISOString().split('T')[0],
  notas: '',
};

const STATUS_COLORS = {
  Novo: '#1565C0', Contato: '#F57F17', Proposta: '#6A1B9A',
  Matriculado: '#2E7D32', Perdido: '#C62828',
};

function LeadForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome) { showToast('Preencha o nome', 'error'); return; }
    onSave({ ...form, id: initial?.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Nome" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome completo" required />
        </div>
        <Input label="WhatsApp / Telefone" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(11) 99999-9999" />
        <Input label="E-mail" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
        <Select label="Origem" value={form.origem} onChange={e => set('origem', e.target.value)} options={ORIGENS} />
        <Select label="Curso de interesse" value={form.cursoInteresse} onChange={e => set('cursoInteresse', e.target.value)} options={CURSOS_INTERESSE} />
        <Select label="Status no funil" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_FUNIL} />
        <Input label="Data de entrada" type="date" value={form.dataEntrada} onChange={e => set('dataEntrada', e.target.value)} />
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Notas / histórico" type="textarea" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observações sobre o contato..." rows={3} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn type="submit">{initial ? 'Salvar' : 'Adicionar lead'}</Btn>
      </div>
    </form>
  );
}

const COLUNAS_FUNIL = [
  { id: 'Novo',        label: 'NOVO',        color: '#E3F2FD', border: '#90CAF9' },
  { id: 'Contato',     label: 'CONTATO',     color: '#FFF8E1', border: '#FFE082' },
  { id: 'Proposta',    label: 'PROPOSTA',    color: '#F3E5F5', border: '#CE93D8' },
  { id: 'Matriculado', label: 'MATRICULADO', color: '#E8F5E9', border: '#A5D6A7' },
  { id: 'Perdido',     label: 'PERDIDO',     color: '#FFEBEE', border: '#EF9A9A' },
];

export function Leads({ leads, setLeads }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [view, setView] = useState('kanban'); // 'kanban' | 'lista'
  const [dragId, setDragId] = useState(null);
  const [search, setSearch] = useState('');

  const handleSave = (item) => {
    if (editItem) {
      setLeads(prev => prev.map(l => l.id === item.id ? item : l));
      showToast('Lead atualizado');
    } else {
      setLeads(prev => [item, ...prev]);
      showToast('Lead adicionado');
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setLeads(prev => prev.filter(l => l.id !== deleteId));
    showToast('Lead removido', 'info');
    setDeleteId(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('leadId'));
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setDragId(null);
  };

  const moveStatus = (lead, newStatus) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
    showToast(`Lead movido para ${newStatus}`);
  };

  const filteredLeads = leads.filter(l =>
    !search || l.nome.toLowerCase().includes(search.toLowerCase()) ||
    l.telefone?.includes(search) || l.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Leads"
        subtitle={`${leads.length} total · ${leads.filter(l => l.status === 'Novo').length} novos`}
        action={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', border: '1px solid #EAD9C0', borderRadius: '6px', overflow: 'hidden' }}>
              {['kanban', 'lista'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: view === v ? '#C17F24' : '#fff', color: view === v ? '#fff' : '#666',
                }}>{v === 'kanban' ? 'Funil' : 'Lista'}</button>
              ))}
            </div>
            <Btn onClick={() => setShowForm(true)}><Plus size={14} />Novo lead</Btn>
          </div>
        }
      />

      {/* Contadores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {STATUS_FUNIL.map(s => (
          <Card key={s} style={{ padding: '12px 14px', borderTop: `3px solid ${STATUS_COLORS[s]}` }}>
            <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.4px' }}>{s}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: STATUS_COLORS[s], margin: 0 }}>{leads.filter(l => l.status === s).length}</p>
          </Card>
        ))}
      </div>

      {/* Busca */}
      <Card style={{ padding: '12px 16px', marginBottom: '16px' }}>
        <Input label="" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, telefone ou e-mail..." />
      </Card>

      {/* View: Kanban */}
      {view === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', overflowX: 'auto' }}>
          {COLUNAS_FUNIL.map(col => {
            const colLeads = filteredLeads.filter(l => l.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, col.id)}
                style={{ background: col.color, border: `1px solid ${col.border}`, borderRadius: '8px', padding: '12px', minHeight: '200px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: STATUS_COLORS[col.id], letterSpacing: '0.5px' }}>{col.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: STATUS_COLORS[col.id] }}>{colLeads.length}</span>
                </div>
                {colLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={e => { e.dataTransfer.setData('leadId', lead.id); setDragId(lead.id); }}
                    onDragEnd={() => setDragId(null)}
                    style={{
                      background: '#fff', borderRadius: '6px', padding: '10px',
                      border: '1px solid #F0E4D0', marginBottom: '8px',
                      cursor: 'grab', opacity: dragId === lead.id ? 0.5 : 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: '13px', color: '#1C0F05', margin: '0 0 4px' }}>{lead.nome}</p>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 6px' }}>{lead.cursoInteresse}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#999', background: '#F5F5F5', padding: '2px 6px', borderRadius: '3px' }}>{lead.origem}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => { setEditItem(lead); setShowForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px' }}>
                          <Edit2 size={11} />
                        </button>
                        <button onClick={() => setDeleteId(lead.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '2px' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    {lead.telefone && (
                      <a href={`https://wa.me/55${lead.telefone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#25D366', marginTop: '6px', textDecoration: 'none' }}>
                        <MessageCircle size={10} />WhatsApp
                      </a>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* View: Lista */}
      {view === 'lista' && (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            {filteredLeads.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                {leads.length === 0 ? 'Nenhum lead cadastrado. Clique em "Novo lead" para começar.' : 'Nenhum lead encontrado.'}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #EAD9C0' }}>
                    {['Nome', 'Telefone', 'Curso Interesse', 'Origem', 'Data', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #F5EDE0', background: i % 2 === 0 ? '#fff' : '#FDFAF6' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1C0F05' }}>
                        {l.nome}
                        {l.email && <div style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>{l.email}</div>}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#444' }}>
                        {l.telefone || '—'}
                        {l.telefone && (
                          <a href={`https://wa.me/55${l.telefone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#25D366', marginTop: '2px', textDecoration: 'none' }}>
                            <MessageCircle size={9} />Zap
                          </a>
                        )}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#666' }}>{l.cursoInteresse}</td>
                      <td style={{ padding: '10px 16px', color: '#666', fontSize: '12px' }}>{l.origem}</td>
                      <td style={{ padding: '10px 16px', color: '#666', whiteSpace: 'nowrap' }}>{l.dataEntrada}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <select
                          value={l.status}
                          onChange={e => moveStatus(l, e.target.value)}
                          style={{ fontSize: '12px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                        >
                          {STATUS_FUNIL.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => { setEditItem(l); setShowForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px' }}><Edit2 size={13} /></button>
                          <button onClick={() => setDeleteId(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '2px' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Editar lead' : 'Novo lead'} width="580px">
        <LeadForm initial={editItem} onSave={handleSave} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover lead" message="Tem certeza que deseja remover este lead?" />
    </div>
  );
}
