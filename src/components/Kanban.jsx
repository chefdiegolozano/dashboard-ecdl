import { useState } from 'react';
import { Plus, X, Clock, Edit2 } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { showToast } from './ui/Toast';

const COLUNAS = [
  { id: 'pauta',     label: 'PAUTA',      color: '#FBF5EE', border: '#EAD9C0' },
  { id: 'gravado',   label: 'GRAVADO',    color: '#E3F2FD', border: '#90CAF9' },
  { id: 'editando',  label: 'EDITANDO',   color: '#FFF8E1', border: '#FFE082' },
  { id: 'pronto',    label: 'PRONTO',     color: '#E8F5E9', border: '#A5D6A7' },
  { id: 'publicado', label: 'PUBLICADO',  color: '#FFF8E7', border: '#C17F24' },
];

const PILARES = ['Técnica', 'Gestão', 'ECDL', 'Pessoal', 'Livre'];
const FORMATOS = ['Reels', 'Carrossel', 'Post', 'Story'];

const emptyCard = {
  titulo: '', pilar: 'ECDL', formato: 'Reels',
  copy: '', dataPrevista: '', notas: '',
};

function timeDiff(isoDate) {
  if (!isoDate) return '';
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return '1 dia';
  return `${days} dias`;
}

function KanbanCard({ card, colId, onEdit, onDelete, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('cardId', card.id); e.dataTransfer.setData('fromCol', colId); onDragStart(); }}
      onDragEnd={onDragEnd}
      style={{
        background: '#fff', borderRadius: '8px', padding: '12px',
        border: '1px solid #F0E4D0', cursor: 'grab', marginBottom: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
        <Badge tipo="pilar" valor={card.pilar} />
        <button onClick={() => onDelete(card.id, colId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0, flexShrink: 0 }}>
          <X size={13} />
        </button>
      </div>
      <p style={{ fontWeight: 600, fontSize: '13px', color: '#1C0F05', margin: '0 0 6px', lineHeight: 1.4, cursor: 'pointer' }} onClick={() => onEdit(card, colId)}>
        {card.titulo || <span style={{ color: '#999', fontStyle: 'italic' }}>Sem título</span>}
      </p>
      <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ background: '#F5F5F5', padding: '1px 5px', borderRadius: '3px' }}>{card.formato}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Clock size={9} /><span>{timeDiff(card.criadoEm)}</span>
        </div>
      </div>
      {card.dataPrevista && (
        <div style={{ fontSize: '10px', color: '#C17F24', marginTop: '4px' }}>Prev: {card.dataPrevista}</div>
      )}
      <button onClick={() => onEdit(card, colId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px 0', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
        <Edit2 size={10} />Editar
      </button>
    </div>
  );
}

export function Kanban({ kanban, setKanban }) {
  const [dragging, setDragging] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [editCol, setEditCol] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [addCol, setAddCol] = useState(null);
  const [form, setForm] = useState(emptyCard);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const getCards = (colId) => kanban[colId] || [];

  const handleDrop = (e, toCol) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const fromCol = e.dataTransfer.getData('fromCol');
    if (fromCol === toCol) return;
    const card = getCards(fromCol).find(c => c.id === cardId);
    if (!card) return;
    setKanban(prev => ({
      ...prev,
      [fromCol]: (prev[fromCol] || []).filter(c => c.id !== cardId),
      [toCol]: [...(prev[toCol] || []), card],
    }));
    setDragging(false);
  };

  const addCard = (colId) => {
    setAddCol(colId);
    setEditCard(null);
    setForm(emptyCard);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editCard) {
      setKanban(prev => ({
        ...prev,
        [editCol]: (prev[editCol] || []).map(c => c.id === editCard.id ? { ...c, ...form } : c),
      }));
      showToast('Card atualizado');
    } else {
      const newCard = { ...form, id: `card_${Date.now()}`, criadoEm: new Date().toISOString() };
      setKanban(prev => ({ ...prev, [addCol]: [...(prev[addCol] || []), newCard] }));
      showToast('Card adicionado');
    }
    setShowForm(false);
    setEditCard(null);
    setForm(emptyCard);
  };

  const handleDelete = (cardId, colId) => {
    setKanban(prev => ({ ...prev, [colId]: (prev[colId] || []).filter(c => c.id !== cardId) }));
    showToast('Card removido', 'info');
  };

  const openEdit = (card, colId) => {
    setEditCard(card);
    setEditCol(colId);
    setForm({ titulo: card.titulo, pilar: card.pilar, formato: card.formato, copy: card.copy || '', dataPrevista: card.dataPrevista || '', notas: card.notas || '' });
    setShowForm(true);
  };

  const totalCards = COLUNAS.reduce((a, c) => a + getCards(c.id).length, 0);

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Kanban de Conteúdo" subtitle={`${totalCards} cards no board`} />

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLUNAS.length}, 1fr)`, gap: '12px', overflowX: 'auto' }}>
        {COLUNAS.map(col => {
          const cards = getCards(col.id);
          return (
            <div
              key={col.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, col.id)}
              style={{
                background: col.color, border: `1px solid ${col.border}`,
                borderRadius: '8px', padding: '12px', minHeight: '300px',
                opacity: dragging ? 0.95 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '0.5px' }}>{col.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>{cards.length}</span>
                  <button onClick={() => addCard(col.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              {cards.map(card => (
                <KanbanCard key={card.id} card={card} colId={col.id}
                  onEdit={openEdit} onDelete={handleDelete}
                  onDragStart={() => setDragging(true)} onDragEnd={() => setDragging(false)}
                />
              ))}
              <button onClick={() => addCard(col.id)} style={{
                width: '100%', padding: '8px', border: `1px dashed ${col.border}`,
                background: 'transparent', borderRadius: '6px', cursor: 'pointer',
                fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}>
                <Plus size={12} />Adicionar
              </button>
            </div>
          );
        })}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditCard(null); }} title={editCard ? 'Editar card' : 'Novo card'} width="480px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input label="Título" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do conteúdo..." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
              <Select label="Formato" value={form.formato} onChange={e => set('formato', e.target.value)} options={FORMATOS} />
              <Input label="Data prevista" type="date" value={form.dataPrevista} onChange={e => set('dataPrevista', e.target.value)} />
            </div>
            <Input label="Copy / Roteiro" type="textarea" value={form.copy} onChange={e => set('copy', e.target.value)} placeholder="Copy ou roteiro do conteúdo..." rows={3} />
            <Input label="Notas" type="textarea" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observações internas..." rows={2} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditCard(null); }}>Cancelar</Btn>
            <Btn type="submit">{editCard ? 'Salvar' : 'Adicionar'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
