import { useState } from 'react';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

const TIPOS = ['DM', 'Comentário', 'WhatsApp'];

const emptyForm = {
  keyword: '',
  tipo: 'DM',
  mensagem: '',
  status: 'Ativo',
};

export function Automacao({ triggers, setTriggers }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.keyword || !form.mensagem) { showToast('Preencha keyword e mensagem', 'error'); return; }
    if (editItem) {
      setTriggers(prev => prev.map(t => t.id === editItem.id ? { ...editItem, ...form, ultimaAtualizacao: new Date().toISOString().split('T')[0] } : t));
      showToast('Trigger atualizado');
    } else {
      setTriggers(prev => [...prev, { id: Date.now(), ...form, ultimaAtualizacao: new Date().toISOString().split('T')[0] }]);
      showToast('Trigger criado');
    }
    setShowForm(false);
    setEditItem(null);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    setTriggers(prev => prev.filter(t => t.id !== deleteId));
    showToast('Trigger removido', 'info');
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Ativo' ? 'Inativo' : 'Ativo' } : t));
    showToast('Status atualizado', 'info');
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ keyword: item.keyword, tipo: item.tipo, mensagem: item.mensagem, status: item.status });
    setShowForm(true);
  };

  const ativos = triggers.filter(t => t.status === 'Ativo').length;

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Automação de Mensagens"
        subtitle={`${ativos} triggers ativos · ManyChat / WhatsApp`}
        action={<Btn onClick={() => { setEditItem(null); setForm(emptyForm); setShowForm(true); }}><Plus size={14} />Novo trigger</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {triggers.length === 0 && (
          <p style={{ color: '#999', fontSize: '14px', padding: '24px 0' }}>Nenhum trigger configurado.</p>
        )}
        {triggers.map(trigger => (
          <Card key={trigger.id} style={{ padding: '20px', opacity: trigger.status === 'Inativo' ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: trigger.status === 'Ativo' ? '#E8F5E9' : '#F5F5F5', padding: '6px', borderRadius: '6px' }}>
                  <Zap size={14} color={trigger.status === 'Ativo' ? '#2E7D32' : '#999'} />
                </div>
                <div>
                  <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, color: '#C17F24', fontSize: '15px' }}>{trigger.keyword}</span>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{trigger.tipo} · Atualizado {trigger.ultimaAtualizacao}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEdit(trigger)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '4px' }}><Edit2 size={13} /></button>
                <button onClick={() => setDeleteId(trigger.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '4px' }}><Trash2 size={13} /></button>
              </div>
            </div>

            <div style={{ background: '#FDFAF6', borderRadius: '6px', padding: '12px', border: '1px solid #EAD9C0', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: '#444', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{trigger.mensagem}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                display: 'inline-block', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                background: trigger.tipo === 'DM' ? '#E3F2FD' : trigger.tipo === 'WhatsApp' ? '#E8F5E9' : '#FFF8E1',
                color: trigger.tipo === 'DM' ? '#1565C0' : trigger.tipo === 'WhatsApp' ? '#2E7D32' : '#F57F17',
              }}>{trigger.tipo}</span>
              <button onClick={() => toggleStatus(trigger.id)} style={{
                padding: '4px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: trigger.status === 'Ativo' ? '#E8F5E9' : '#F5F5F5',
                color: trigger.status === 'Ativo' ? '#2E7D32' : '#999',
              }}>
                {trigger.status === 'Ativo' ? 'Ativo' : 'Inativo'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Editar trigger' : 'Novo trigger'} width="500px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Keyword (palavra-chave)" value={form.keyword} onChange={e => set('keyword', e.target.value)} placeholder="Ex: CURSO, VAGA, PREÇO..." required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)} options={TIPOS} />
              <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)} options={['Ativo', 'Inativo']} />
            </div>
            <Input label="Mensagem automática" type="textarea" value={form.mensagem} onChange={e => set('mensagem', e.target.value)} placeholder="Mensagem que será enviada automaticamente..." rows={5} required />
            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Use [NOME], [URL], [MÊS] como variáveis na mensagem.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditItem(null); }}>Cancelar</Btn>
            <Btn type="submit">{editItem ? 'Salvar' : 'Criar trigger'}</Btn>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover trigger" message="Deseja remover este trigger?" />
    </div>
  );
}
