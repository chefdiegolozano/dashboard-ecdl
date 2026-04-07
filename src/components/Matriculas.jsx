import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';
import { formatarMoeda } from '../utils/calculations';

const CURSOS = ['Master Confeiteiro', 'Módulo Chocolate', 'Doces pra Cafeteria', 'Confeitaria Moderna', 'Outro'];
const STATUS_LIST = ['Ativa', 'Concluída', 'Cancelada', 'Pendente'];
const FORMAS_PGTO = ['À vista', 'Parcelado', 'Boleto', 'PIX'];

const emptyForm = {
  nome: '', email: '', telefone: '',
  curso: 'Master Confeiteiro', turma: '',
  dataMatricula: new Date().toISOString().split('T')[0],
  valor: '', formaPgto: 'PIX', status: 'Ativa', notas: '',
};

function MatriculaForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.curso) { showToast('Preencha nome e curso', 'error'); return; }
    onSave({ ...form, id: initial?.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Nome do aluno" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome completo" required />
        </div>
        <Input label="E-mail" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
        <Input label="Telefone / WhatsApp" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(11) 99999-9999" />
        <Select label="Curso" value={form.curso} onChange={e => set('curso', e.target.value)} options={CURSOS} />
        <Input label="Turma / Data do curso" value={form.turma} onChange={e => set('turma', e.target.value)} placeholder="Ex: Turma 03 — Maio/25" />
        <Input label="Data da matrícula" type="date" value={form.dataMatricula} onChange={e => set('dataMatricula', e.target.value)} />
        <Input label="Valor (R$)" type="number" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0,00" />
        <Select label="Forma de pagamento" value={form.formaPgto} onChange={e => set('formaPgto', e.target.value)} options={FORMAS_PGTO} />
        <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_LIST} />
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Notas internas" type="textarea" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observações sobre o aluno..." />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn type="submit">{initial ? 'Salvar' : 'Registrar matrícula'}</Btn>
      </div>
    </form>
  );
}

export function Matriculas({ matriculas, setMatriculas, canEdit = true }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [search, setSearch] = useState('');

  const handleSave = (item) => {
    if (editItem) {
      setMatriculas(prev => prev.map(m => m.id === item.id ? item : m));
      showToast('Matrícula atualizada');
    } else {
      setMatriculas(prev => [item, ...prev]);
      showToast('Matrícula registrada');
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setMatriculas(prev => prev.filter(m => m.id !== deleteId));
    showToast('Matrícula removida', 'info');
    setDeleteId(null);
  };

  const filtered = matriculas
    .filter(m => !filterStatus || m.status === filterStatus)
    .filter(m => !filterCurso || m.curso === filterCurso)
    .filter(m => !search || m.nome.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()));

  const totalReceita = filtered.reduce((a, m) => a + (parseFloat(m.valor) || 0), 0);
  const ativas = matriculas.filter(m => m.status === 'Ativa').length;

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Matrículas"
        subtitle={`${ativas} alunos ativos · ${matriculas.length} total`}
        action={canEdit && <Btn onClick={() => setShowForm(true)}><Plus size={14} />Nova matrícula</Btn>}
      />

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Ativas', val: matriculas.filter(m => m.status === 'Ativa').length, color: '#2E7D32' },
          { label: 'Concluídas', val: matriculas.filter(m => m.status === 'Concluída').length, color: '#1565C0' },
          { label: 'Pendentes', val: matriculas.filter(m => m.status === 'Pendente').length, color: '#F57F17' },
          { label: 'Canceladas', val: matriculas.filter(m => m.status === 'Cancelada').length, color: '#C62828' },
        ].map(({ label, val, color }) => (
          <Card key={label} style={{ padding: '14px 16px' }}>
            <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color, margin: 0 }}>{val}</p>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card style={{ padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <Input label="Buscar aluno" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome ou e-mail..." />
        </div>
        <div style={{ minWidth: '140px' }}>
          <Select label="Status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} options={[{ value: '', label: 'Todos' }, ...STATUS_LIST.map(s => ({ value: s, label: s }))]} />
        </div>
        <div style={{ minWidth: '180px' }}>
          <Select label="Curso" value={filterCurso} onChange={e => setFilterCurso(e.target.value)} options={[{ value: '', label: 'Todos os cursos' }, ...CURSOS.map(c => ({ value: c, label: c }))]} />
        </div>
        {(filterStatus || filterCurso || search) && (
          <Btn variant="ghost" size="sm" onClick={() => { setFilterStatus(''); setFilterCurso(''); setSearch(''); }}>Limpar</Btn>
        )}
      </Card>

      {/* Tabela */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
              {matriculas.length === 0 ? 'Nenhuma matrícula registrada. Clique em "Nova matrícula" para começar.' : 'Nenhuma matrícula com esses filtros.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EAD9C0' }}>
                  {['Aluno', 'Curso', 'Turma', 'Data', 'Valor', 'Pgto', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F5EDE0', background: i % 2 === 0 ? '#fff' : '#FDFAF6' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1C0F05' }}>
                      <div>{m.nome}</div>
                      {m.email && <div style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>{m.email}</div>}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#444' }}>{m.curso}</td>
                    <td style={{ padding: '10px 16px', color: '#666', fontSize: '12px' }}>{m.turma || '—'}</td>
                    <td style={{ padding: '10px 16px', color: '#666', whiteSpace: 'nowrap' }}>{m.dataMatricula}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1C0F05' }}>{m.valor ? formatarMoeda(parseFloat(m.valor)) : '—'}</td>
                    <td style={{ padding: '10px 16px', color: '#666', fontSize: '12px' }}>{m.formaPgto}</td>
                    <td style={{ padding: '10px 16px' }}><Badge tipo="status" valor={m.status} /></td>
                    <td style={{ padding: '10px 16px' }}>
                      {canEdit && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => { setEditItem(m); setShowForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '2px' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteId(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '2px' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #EAD9C0', background: '#FBF5EE' }}>
                  <td colSpan={4} style={{ padding: '10px 16px', fontWeight: 700, fontSize: '12px', color: '#555' }}>Total ({filtered.length} registros)</td>
                  <td style={{ padding: '10px 16px', fontWeight: 700, color: '#C17F24' }}>{formatarMoeda(totalReceita)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </Card>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }} title={editItem ? 'Editar matrícula' : 'Nova matrícula'} width="620px">
        <MatriculaForm initial={editItem} onSave={handleSave} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover matrícula" message="Tem certeza que deseja remover esta matrícula? Esta ação não pode ser desfeita." />
    </div>
  );
}
