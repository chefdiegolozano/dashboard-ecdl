import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';
import { calcEngajamento, classificarPost, formatarViews } from '../utils/calculations';

const PILARES = ['Técnica', 'Gestão', 'ECDL', 'Pessoal', 'Livre'];
const FORMATOS = ['Reels', 'Carrossel', 'Post foto', 'Story'];

const emptyForm = {
  data: new Date().toISOString().split('T')[0],
  titulo: '', pilar: 'ECDL', formato: 'Reels',
  viewsIG: '', viewsFB: '', likes: '', comments: '', shares: '', saves: '',
  profileVisits: '', followersPerc: '', nonFollowersPerc: '',
};

function PostForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const eng = form.viewsIG
    ? calcEngajamento({ viewsIG: parseFloat(form.viewsIG), likes: parseFloat(form.likes) || 0, comments: parseFloat(form.comments) || 0, shares: parseFloat(form.shares) || 0, saves: parseFloat(form.saves) || 0 })
    : 0;
  const classif = form.viewsIG ? classificarPost(eng, parseFloat(form.viewsIG)) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo || !form.data) { showToast('Preencha título e data', 'error'); return; }
    onSave({ ...form, id: initial?.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Input label="Data" type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
        <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Título do post" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do post" required />
        </div>
        <Select label="Formato" value={form.formato} onChange={e => set('formato', e.target.value)} options={FORMATOS} />
      </div>

      <p style={{ fontFamily: 'Georgia,serif', color: '#C17F24', fontWeight: 700, fontSize: '14px', margin: '0 0 12px' }}>Métricas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <Input label="Views IG" type="number" value={form.viewsIG} onChange={e => set('viewsIG', e.target.value)} placeholder="0" />
        <Input label="Views FB" type="number" value={form.viewsFB} onChange={e => set('viewsFB', e.target.value)} placeholder="0" />
        <Input label="Likes" type="number" value={form.likes} onChange={e => set('likes', e.target.value)} placeholder="0" />
        <Input label="Comments" type="number" value={form.comments} onChange={e => set('comments', e.target.value)} placeholder="0" />
        <Input label="Shares" type="number" value={form.shares} onChange={e => set('shares', e.target.value)} placeholder="0" />
        <Input label="Saves" type="number" value={form.saves} onChange={e => set('saves', e.target.value)} placeholder="0" />
        <Input label="Profile Visits" type="number" value={form.profileVisits} onChange={e => set('profileVisits', e.target.value)} placeholder="0" />
        <Input label="Followers %" type="number" value={form.followersPerc} onChange={e => set('followersPerc', e.target.value)} placeholder="0-100" />
        <Input label="Non-followers %" type="number" value={form.nonFollowersPerc} onChange={e => set('nonFollowersPerc', e.target.value)} placeholder="0-100" />
      </div>

      {form.viewsIG && (
        <div style={{ background: '#FBF5EE', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#666' }}>Engajamento calculado:</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#1C0F05', marginLeft: '8px' }}>{eng.toFixed(2)}%</span>
          </div>
          {classif && <Badge tipo="classificacao" valor={classif} size="lg" />}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn type="submit">{initial ? 'Salvar' : 'Registrar post'}</Btn>
      </div>
    </form>
  );
}

export function Metricas({ posts, setPosts, canEdit = true }) {
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterPilar, setFilterPilar] = useState('');
  const [filterClassif, setFilterClassif] = useState('');
  const [sortField, setSortField] = useState('data');
  const [sortDir, setSortDir] = useState('desc');

  const handleSave = (post) => {
    if (editPost) {
      setPosts(prev => prev.map(p => p.id === post.id ? post : p));
      showToast('Post atualizado');
    } else {
      setPosts(prev => [post, ...prev]);
      showToast('Post registrado');
    }
    setShowForm(false);
    setEditPost(null);
  };

  const handleDelete = () => {
    setPosts(prev => prev.filter(p => p.id !== deleteId));
    showToast('Post removido', 'info');
    setDeleteId(null);
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = posts
    .filter(p => !filterPilar || p.pilar === filterPilar)
    .filter(p => {
      if (!filterClassif) return true;
      const eng = calcEngajamento(p);
      return classificarPost(eng, p.viewsIG) === filterClassif;
    })
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'data') { va = new Date(va); vb = new Date(vb); }
      else if (sortField === 'engajamento') { va = calcEngajamento(a); vb = calcEngajamento(b); }
      else { va = parseFloat(va) || 0; vb = parseFloat(vb) || 0; }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const SortIcon = ({ field }) => sortField === field ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null;

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Métricas de Conteúdo"
        subtitle={`${posts.length} posts registrados`}
        action={canEdit && <Btn onClick={() => setShowForm(true)}><Plus size={14} />Registrar post</Btn>}
      />

      {/* Filtros */}
      <Card style={{ padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Select label="Pilar" value={filterPilar} onChange={e => setFilterPilar(e.target.value)}
          options={[{ value: '', label: 'Todos os pilares' }, ...PILARES.map(p => ({ value: p, label: p }))]}
          style={{ minWidth: '160px' }} />
        <Select label="Classificação" value={filterClassif} onChange={e => setFilterClassif(e.target.value)}
          options={[{ value: '', label: 'Todas' }, ...['EXCELENTE','BOM','REGULAR','FRACO'].map(c => ({ value: c, label: c }))]}
          style={{ minWidth: '140px' }} />
        {(filterPilar || filterClassif) && (
          <Btn variant="ghost" size="sm" onClick={() => { setFilterPilar(''); setFilterClassif(''); }}>Limpar</Btn>
        )}
      </Card>

      {/* Tabela */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
              {posts.length === 0 ? 'Nenhum post registrado. Clique em "Registrar post" para começar.' : 'Nenhum post com esses filtros.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EAD9C0' }}>
                  {[
                    { label: 'Data', field: 'data' },
                    { label: 'Título', field: 'titulo' },
                    { label: 'Pilar', field: 'pilar' },
                    { label: 'Formato', field: 'formato' },
                    { label: 'Views', field: 'viewsIG' },
                    { label: 'Engajamento', field: 'engajamento' },
                    { label: 'Classificação', field: null },
                    { label: '', field: null },
                  ].map(({ label, field }) => (
                    <th key={label} onClick={() => field && toggleSort(field)}
                      style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: field ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{label}<SortIcon field={field} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const eng = calcEngajamento(p);
                  const classif = classificarPost(eng, p.viewsIG);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F5EDE0', background: i % 2 === 0 ? '#fff' : '#FDFAF6' }}>
                      <td style={{ padding: '10px 16px', color: '#666', whiteSpace: 'nowrap' }}>{p.data}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1C0F05', maxWidth: '200px' }}>
                        <span title={p.titulo} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo}</span>
                      </td>
                      <td style={{ padding: '10px 16px' }}><Badge tipo="pilar" valor={p.pilar} /></td>
                      <td style={{ padding: '10px 16px', color: '#666', fontSize: '12px' }}>{p.formato}</td>
                      <td style={{ padding: '10px 16px', fontVariantNumeric: 'tabular-nums' }}>{formatarViews(p.viewsIG)}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{eng.toFixed(2)}%</td>
                      <td style={{ padding: '10px 16px' }}><Badge tipo="classificacao" valor={classif} /></td>
                      <td style={{ padding: '10px 16px' }}>
                        {canEdit && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => { setEditPost(p); setShowForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px' }}><Edit2 size={13} /></button>
                            <button onClick={() => setDeleteId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '2px' }}><Trash2 size={13} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditPost(null); }} title={editPost ? 'Editar post' : 'Registrar post'} width="580px">
        <PostForm initial={editPost} onSave={handleSave} onCancel={() => { setShowForm(false); setEditPost(null); }} />
      </Modal>
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover post" message="Tem certeza que deseja remover este post?" />
    </div>
  );
}
