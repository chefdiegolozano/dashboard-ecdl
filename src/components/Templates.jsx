import { useState } from 'react';
import { Plus, Copy, Trash2, Edit2 } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

const CATEGORIAS = ['Copy de Post', 'DM de Boas-vindas', 'Proposta de Curso', 'E-mail de Matrícula', 'Resposta de Objeção', 'Outro'];
const PILARES = ['Técnica', 'Gestão', 'ECDL', 'Pessoal', 'Livre'];

const TEMPLATES_PADRAO = [
  {
    id: 1, nome: 'DM de boas-vindas (novo lead)', categoria: 'DM de Boas-vindas', pilar: 'ECDL',
    corpo: `Oi, [NOME]! Aqui é a equipe da Escola de Confeitaria Diego Lozano 👋

Vi que você demonstrou interesse nos nossos cursos — obrigado!

Posso te contar um pouco mais sobre o que temos disponível? Qual é o seu maior objetivo hoje na confeitaria?

— Estou começando do zero
— Já trabalho, mas quero me profissionalizar
— Quero abrir um negócio

Me conta, qual dessas se encaixa mais pra você?`,
  },
  {
    id: 2, nome: 'Proposta Master Confeiteiro', categoria: 'Proposta de Curso', pilar: 'ECDL',
    corpo: `Olá, [NOME]!

Aqui está o que você vai ter no **Master Confeiteiro** de 10 dias:

✅ Técnicas avançadas de chocolate, massas e sobremesas
✅ Gestão de negócio para confeiteiros
✅ Material didático incluso
✅ Turma reduzida (máximo 15 alunos)
✅ Certificado ECDL

Investimento: R$4.500 à vista ou 6x de R$750

Vagas limitadas para a turma de [MÊS]. Posso te enviar o contrato para garantir a sua?`,
  },
  {
    id: 3, nome: 'Copy Reels - Técnica', categoria: 'Copy de Post', pilar: 'Técnica',
    corpo: `[GANCHO — primeira frase que para o scroll]

Esse erro quase me custou [CONSEQUÊNCIA ESPECÍFICA].

[CONTEXTO — quando e onde aconteceu]

O que a maioria faz: [ABORDAGEM ERRADA]
O que funciona de verdade: [SOLUÇÃO]

A diferença está em [DETALHE TÉCNICO ESPECÍFICO].

[CTA conversacional — pergunta reflexiva]`,
  },
];

const emptyForm = { nome: '', categoria: 'Copy de Post', pilar: 'ECDL', corpo: '' };

export function Templates({ templates, setTemplates, canEdit = true }) {
  const [filterCategoria, setFilterCategoria] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const allTemplates = [...TEMPLATES_PADRAO, ...(templates || [])];
  const filtered = allTemplates.filter(t => !filterCategoria || t.categoria === filterCategoria);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.nome || !form.corpo) { showToast('Nome e corpo são obrigatórios', 'error'); return; }
    if (editItem) {
      setTemplates(prev => prev.map(t => t.id === editItem.id ? { ...editItem, ...form } : t));
      showToast('Template atualizado');
    } else {
      setTemplates(prev => [...prev, { id: Date.now(), ...form }]);
      showToast('Template criado');
    }
    setShowForm(false);
    setEditItem(null);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    setTemplates(prev => prev.filter(t => t.id !== deleteId));
    showToast('Template removido', 'info');
    setDeleteId(null);
  };

  const copiar = (texto) => {
    navigator.clipboard.writeText(texto).then(() => showToast('Copiado para o clipboard'));
  };

  const openEdit = (tpl) => {
    if (TEMPLATES_PADRAO.find(t => t.id === tpl.id)) { showToast('Templates padrão não podem ser editados', 'info'); return; }
    setEditItem(tpl);
    setForm({ nome: tpl.nome, categoria: tpl.categoria, pilar: tpl.pilar, corpo: tpl.corpo });
    setShowForm(true);
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Templates"
        subtitle={`${allTemplates.length} templates disponíveis`}
        action={canEdit && <Btn onClick={() => { setEditItem(null); setForm(emptyForm); setShowForm(true); }}><Plus size={14} />Novo template</Btn>}
      />

      {/* Filtro */}
      <Card style={{ padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Select label="Categoria" value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}
          options={[{ value: '', label: 'Todas' }, ...CATEGORIAS.map(c => ({ value: c, label: c }))]}
          style={{ minWidth: '180px' }} />
        {filterCategoria && <Btn variant="ghost" size="sm" onClick={() => setFilterCategoria('')}>Limpar</Btn>}
      </Card>

      {/* Grid de templates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filtered.map(tpl => {
          const isPadrao = !!TEMPLATES_PADRAO.find(t => t.id === tpl.id);
          return (
            <Card key={tpl.id} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h4 style={{ fontFamily: 'Georgia,serif', color: '#C17F24', fontSize: '14px', margin: '0 0 6px' }}>{tpl.nome}</h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Badge tipo="pilar" valor={tpl.pilar} />
                    <span style={{ fontSize: '11px', color: '#888', background: '#F5F5F5', padding: '2px 6px', borderRadius: '3px' }}>{tpl.categoria}</span>
                    {isPadrao && <span style={{ fontSize: '10px', color: '#C17F24', background: '#FFF8E7', padding: '2px 6px', borderRadius: '3px', border: '1px solid #EAD9C0' }}>padrão</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => copiar(tpl.corpo)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '4px' }} title="Copiar">
                    <Copy size={14} />
                  </button>
                  {canEdit && !isPadrao && (
                    <>
                      <button onClick={() => openEdit(tpl)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C17F24', padding: '4px' }}><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(tpl.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828', padding: '4px' }}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#555', background: '#FDFAF6', borderRadius: '6px', padding: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '160px', overflow: 'auto', fontFamily: 'inherit', lineHeight: 1.6, border: '1px solid #EAD9C0' }}>
                {tpl.corpo}
              </pre>
              <button onClick={() => copiar(tpl.corpo)} style={{
                width: '100%', marginTop: '10px', padding: '7px', border: '1px solid #EAD9C0',
                background: '#FBF5EE', borderRadius: '6px', cursor: 'pointer',
                fontSize: '12px', color: '#C17F24', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <Copy size={12} />Copiar template
              </button>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); setForm(emptyForm); }} title={editItem ? 'Editar template' : 'Novo template'} width="580px">
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Nome do template" value={form.nome} onChange={e => set('nome', e.target.value)} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select label="Categoria" value={form.categoria} onChange={e => set('categoria', e.target.value)} options={CATEGORIAS} />
              <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
            </div>
            <Input label="Corpo do template" type="textarea" value={form.corpo} onChange={e => set('corpo', e.target.value)} placeholder="Conteúdo do template..." rows={8} required />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditItem(null); }}>Cancelar</Btn>
            <Btn type="submit">{editItem ? 'Salvar' : 'Criar template'}</Btn>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remover template" message="Deseja remover este template?" />
    </div>
  );
}
