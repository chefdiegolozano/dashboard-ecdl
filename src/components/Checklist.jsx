import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, RotateCcw } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Modal } from './ui/Modal';
import { showToast } from './ui/Toast';

const TEMPLATES_CHECKLIST = [
  {
    nome: 'Pré-publicação de post',
    itens: [
      'O conteúdo é único e não poderia ter sido postado por qualquer outro chef?',
      'Tem gancho contraintuitivo na primeira frase?',
      'O tom é de conversa, não de copy de lançamento?',
      'Tem vulnerabilidade com número, ano e contexto específico?',
      'O CTA é conversacional (pergunta reflexiva), não mecânico?',
      'Qualidade de imagem/vídeo está aprovada?',
      'Legenda revisada (ortografia e pontuação)?',
      'Hashtags definidas?',
      'Data e horário de publicação confirmados?',
    ],
  },
  {
    nome: 'Pré-início de turma',
    itens: [
      'Material didático impresso/preparado?',
      'Kit do aluno separado?',
      'Ingredientes da aula confirmados com fornecedor?',
      'Lista de alunos atualizada?',
      'Espaço da aula organizado e limpo?',
      'Equipamentos testados (forno, batedeira, etc.)?',
      'Alunos notificados (WhatsApp/e-mail)?',
      'Câmera/celular carregado para conteúdo de bastidor?',
    ],
  },
  {
    nome: 'Pós-turma',
    itens: [
      'Fotos/vídeos da turma capturados?',
      'Depoimentos de alunos coletados?',
      'Feedback dos alunos registrado?',
      'Pagamentos pendentes verificados?',
      'Próxima turma aberta para vendas?',
      'Conteúdo de bastidor agendado para posts?',
    ],
  },
];

export function Checklist({ checklists, setChecklists, canEdit = true }) {
  const [showNew, setShowNew] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoTemplate, setNovoTemplate] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [novoItem, setNovoItem] = useState('');

  const criarChecklist = () => {
    if (!novoNome) { showToast('Nome obrigatório', 'error'); return; }
    let itens = [];
    if (novoTemplate) {
      const tpl = TEMPLATES_CHECKLIST.find(t => t.nome === novoTemplate);
      if (tpl) itens = tpl.itens.map((texto, i) => ({ id: i, texto, feito: false }));
    }
    const novo = {
      id: Date.now(), nome: novoNome, itens, createdAt: new Date().toISOString().split('T')[0],
    };
    setChecklists(prev => [novo, ...prev]);
    setActiveId(novo.id);
    setShowNew(false);
    setNovoNome('');
    setNovoTemplate('');
    showToast('Checklist criado');
  };

  const toggleItem = (checkId, itemId) => {
    setChecklists(prev => prev.map(c => c.id === checkId
      ? { ...c, itens: c.itens.map(i => i.id === itemId ? { ...i, feito: !i.feito } : i) }
      : c
    ));
  };

  const addItem = (checkId) => {
    if (!novoItem.trim()) return;
    setChecklists(prev => prev.map(c => c.id === checkId
      ? { ...c, itens: [...c.itens, { id: Date.now(), texto: novoItem.trim(), feito: false }] }
      : c
    ));
    setNovoItem('');
    showToast('Item adicionado');
  };

  const removeItem = (checkId, itemId) => {
    setChecklists(prev => prev.map(c => c.id === checkId
      ? { ...c, itens: c.itens.filter(i => i.id !== itemId) }
      : c
    ));
  };

  const resetChecklist = (checkId) => {
    setChecklists(prev => prev.map(c => c.id === checkId
      ? { ...c, itens: c.itens.map(i => ({ ...i, feito: false })) }
      : c
    ));
    showToast('Checklist resetado', 'info');
  };

  const deleteChecklist = (checkId) => {
    setChecklists(prev => prev.filter(c => c.id !== checkId));
    if (activeId === checkId) setActiveId(null);
    showToast('Checklist removido', 'info');
  };

  const active = checklists.find(c => c.id === activeId);

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Checklists"
        subtitle={`${checklists.length} listas`}
        action={canEdit && <Btn onClick={() => setShowNew(true)}><Plus size={14} />Novo checklist</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        {/* Lista lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {checklists.length === 0 && (
            <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>Nenhum checklist. Crie o primeiro!</p>
          )}
          {checklists.map(c => {
            const feitos = c.itens.filter(i => i.feito).length;
            const total = c.itens.length;
            const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(activeId === c.id ? null : c.id)}
                style={{
                  background: activeId === c.id ? '#C17F24' : '#fff',
                  color: activeId === c.id ? '#fff' : '#333',
                  border: `1px solid ${activeId === c.id ? '#C17F24' : '#EAD9C0'}`,
                  borderRadius: '8px', padding: '12px 14px', textAlign: 'left',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{c.nome}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>{feitos}/{total} feitos</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: activeId === c.id ? '#fff' : (pct === 100 ? '#2E7D32' : '#C17F24') }}>{pct}%</span>
                </div>
                <div style={{ height: '3px', background: activeId === c.id ? 'rgba(255,255,255,0.3)' : '#EAD9C0', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: activeId === c.id ? '#fff' : '#C17F24', borderRadius: '2px' }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Área do checklist ativo */}
        <div>
          {!active ? (
            <Card style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#999', fontSize: '14px' }}>Selecione um checklist ao lado ou crie um novo.</p>
            </Card>
          ) : (
            <Card style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Georgia,serif', color: '#C17F24', fontSize: '18px', margin: 0 }}>{active.nome}</h3>
                {canEdit && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Btn variant="ghost" size="sm" onClick={() => resetChecklist(active.id)}><RotateCcw size={12} />Reset</Btn>
                    <Btn variant="danger" size="sm" onClick={() => deleteChecklist(active.id)}><Trash2 size={12} />Excluir</Btn>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {active.itens.length === 0 && (
                  <p style={{ color: '#999', fontSize: '13px' }}>Nenhum item. Adicione abaixo.</p>
                )}
                {active.itens.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', background: item.feito ? '#E8F5E9' : '#FDFAF6',
                    borderRadius: '6px', border: `1px solid ${item.feito ? '#A5D6A7' : '#EAD9C0'}`,
                  }}>
                    <button onClick={() => toggleItem(active.id, item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.feito ? '#2E7D32' : '#ccc', padding: 0, flexShrink: 0 }}>
                      {item.feito ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>
                    <span style={{ flex: 1, fontSize: '14px', color: item.feito ? '#2E7D32' : '#333', textDecoration: item.feito ? 'line-through' : 'none', lineHeight: 1.4 }}>
                      {item.texto}
                    </span>
                    {canEdit && (
                      <button onClick={() => removeItem(active.id, item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {canEdit && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={novoItem}
                    onChange={e => setNovoItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addItem(active.id)}
                    placeholder="Novo item..."
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                  <Btn onClick={() => addItem(active.id)}><Plus size={14} />Adicionar</Btn>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Novo checklist" width="440px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Nome do checklist" value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Ex: Pré-publicação do post" required />
          <Select label="Usar template (opcional)" value={novoTemplate} onChange={e => setNovoTemplate(e.target.value)}
            options={[{ value: '', label: 'Em branco' }, ...TEMPLATES_CHECKLIST.map(t => ({ value: t.nome, label: t.nome }))]} />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowNew(false)}>Cancelar</Btn>
            <Btn onClick={criarChecklist}>Criar</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
