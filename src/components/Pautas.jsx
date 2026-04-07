import { useState } from 'react';
import { Plus, Shuffle, Search, Edit2, Trash2 } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

const PILARES = ['Técnica', 'Gestão', 'ECDL', 'Pessoal', 'Livre'];
const FORMATOS = ['Reels', 'Carrossel', 'Post', 'Story'];
const STATUS_OPTS = ['Disponível', 'Usada', 'Arquivada'];

const emptyForm = { pilar: 'ECDL', titulo: '', formato: 'Reels', status: 'Disponível' };

export function Pautas({ pautas, setPautas }) {
  const [filterPilar, setFilterPilar] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPauta, setEditPauta] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = pautas
    .filter(p => !filterPilar || p.pilar === filterPilar)
    .filter(p => !search || p.titulo.toLowerCase().includes(search.toLowerCase()));

  const sortear = () => {
    const pool = filterPilar
      ? pautas.filter(p => p.pilar === filterPilar && p.status === 'Disponível')
      : pautas.filter(p => p.status === 'Disponível');
    if (pool.length === 0) { showToast('Nenhuma pauta disponível', 'error'); return; }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    showToast(`Sorteada: "${chosen.titulo}"`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.titulo) { showToast('Título obrigatório', 'error'); return; }
    if (editPauta) {
      setPautas(prev => prev.map(p => p.id === editPauta.id ? { ...editPauta, ...form } : p));
      showToast('Pauta atualizada');
    } else {
      const maxNum = pautas.reduce((a, p) => Math.max(a, p.numero || 0), 0);
      setPautas(prev => [...prev, { id: Date.now(), numero: maxNum + 1, ...form }]);
      showToast('Pauta adicionada');
    }
    setShowForm(false);
    setEditPauta(null);
    setForm(emptyForm);
  };

  const marcarUsada = (id) => {
    setPautas(prev => prev.map(p => p.id === id ? { ...p, status: 'Usada', dataUso: new Date().toISOString().split('T')[0] } : p));
    showToast('Marcada como usada', 'info');
  };

  const handleDelete = () => {
    setPautas(prev => prev.filter(p => p.id !== deleteId));
    showToast('Pauta removida', 'info');
    setDeleteId(null);
  };

  const disponíveis = pautas.filter(p => p.status === 'Disponível').length;

  const openEdit = (pauta) => {
    setEditPauta(pauta);
    setForm({ pilar: pauta.pilar, titulo: pauta.titulo, formato: pauta.formato, status: pauta.status });
    setShowForm(true);
  };

  const PILAR_COLORS = {
    Técnica: '#6A1B9A', Gestão: '#E65100', ECDL: '#2E7D32', Pessoal: '#1565C0', Livre: '#999',
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Banco de Pautas"
        subtitle={`${disponíveis} disponíveis · ${pautas.length} total`}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn variant="secondary" onClick={sortear}><Shuffle size={14} />Sortear</Btn>
            <Btn onClick={() => { setEditPauta(null); setForm(emptyForm); setShowForm(true); }}><Plus size={14} />Nova pauta</Btn>
          </div>
        }
      />

      {/* Contadores por pilar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {PILARES.map(pilar => {
          const count = pautas.filter(p => p.pilar === pilar && p.status === 'Disponível').length;
          return (
            <Card key={pilar} style={{ padding: '12px 14px', borderLeft: `3px solid ${PILAR_COLORS[pilar]}`, cursor: 'pointer', background: filterPilar === pilar ? '#FBF5EE' : '#fff' }}
              onClick={() => setFilterPilar(filterPilar === pilar ? '' : pilar)}>
              <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{pilar}</p>
              <p style={{ fontSize: '22px', fontWeight: 700, color: PILAR_COLORS[pilar], margin: 0 }}>{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card style={{ padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input label="" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pauta..." />
        </div>
        <Select label="Pilar" value={filterPilar} onChange={e => setFilterPilar(e.target.value)}
          options={[{ value: '', label: 'Todos' }, ...PILARES.map(p => ({ value: p, label: p }))]} style={{ minWidth: '140px' }} />
        {(filterPilar || search) && <Btn variant="ghost" size="sm" onClick={() => { setFilterPilar(''); setSearch(''); }}>Limpar</Btn>}
      </Card>

      {/* Lista */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
              {pautas.length === 0 ? 'Nenhuma pauta cadastrada.' : 'Nenhuma pauta com esses filtros.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EAD9C0' }}>
                  {['#', 'Pilar', 'Título', 'Formato', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F5EDE0', background: i % 2 === 0 ? '#fff' : '#FDFAF6', opacity: p.status === 'Arquivada' ? 0.5 : 1 }}>
                    <td style={{ padding: '10px 16px', color: '#999', fontSize: '12px' }}>#{p.numero}</td>
                    <td style={{ padding: '10px 16px' }}><Badge tipo="pilar" valor={p.pilar} /></td>
                    <td style={{ padding: '10px 16px', fontWeight: 500, color: '#1C0F05', maxWidth: '320px' }}>
                      <span title={p.titulo} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo}</span>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#666', fontSize: '12px' }}>{p.formato}</td>
                    <td style={{ padding: '10px 16px' }}><Badge tipo="status" valor={p.status} /></td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {p.status === 'Disponível' && (
                          <button onClick={() => marcarUsada(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2E7D32', fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', border: '1px solid #2E7D32' }}>Marcar usada</button>
                        )}
                        <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px' }}><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '2px' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditPauta(null); setForm(emptyForm); }} title={editPauta ? 'Editar pauta' : 'Nova pauta'} width="480px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Título da pauta" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do conteúdo..." required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
              <Select label="Formato" value={form.formato} onChange={e => set('formato', e.target.value)} options={FORMATOS} />
              <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTS} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditPauta(null); setForm(emptyForm); }}>Cancelar</Btn>
            <Btn type="submit">{editPauta ? 'Salvar' : 'Adicionar'}</Btn>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover pauta" message="Deseja remover esta pauta do banco?" />
    </div>
  );
}
