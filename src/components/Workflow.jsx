import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Card, SectionHeader } from './ui/Card';
import { showToast } from './ui/Toast';

const FLUXO_SEMANAL = [
  { dia: 'Segunda', responsavel: 'Gestor', acao: 'Revisão de leads da semana + follow-ups pendentes' },
  { dia: 'Segunda', responsavel: 'Gestor', acao: 'Verificar matrículas confirmadas e pendências de pagamento' },
  { dia: 'Terça', responsavel: 'Editor', acao: 'Revisar conteúdo em edição + devolver para publicação' },
  { dia: 'Terça', responsavel: 'Video Maker', acao: 'Gravação de conteúdo técnico (Reels / B-roll de aula)' },
  { dia: 'Quarta', responsavel: 'Analista', acao: 'Relatório semanal: métricas de conteúdo + leads' },
  { dia: 'Quarta', responsavel: 'Gestor', acao: 'Reunião de alinhamento de equipe (15min)' },
  { dia: 'Quinta', responsavel: 'Editor', acao: 'Entrega dos conteúdos editados para revisão final' },
  { dia: 'Quinta', responsavel: 'Gestor', acao: 'Aprovação e agendamento de posts da semana seguinte' },
  { dia: 'Sexta', responsavel: 'Analista', acao: 'Atualizar Kanban + mover cards publicados' },
  { dia: 'Sexta', responsavel: 'Gestor', acao: 'Planejar pautas da semana seguinte (mínimo 5)' },
  { dia: 'Sábado', responsavel: 'Video Maker', acao: 'Gravação de conteúdo de bastidor (se houver aula)' },
  { dia: 'Sábado', responsavel: 'Gestor', acao: 'Checar DMs e leads chegando pelo fim de semana' },
];

const RESPONSAVEL_COLORS = {
  Gestor: { bg: '#FFF3E0', text: '#E65100' },
  Editor: { bg: '#E3F2FD', text: '#1565C0' },
  Analista: { bg: '#E8F5E9', text: '#2E7D32' },
  'Video Maker': { bg: '#F3E5F5', text: '#6A1B9A' },
};

const PROCESSO_CONTEUDO = [
  { etapa: '1', titulo: 'Ideação', descricao: 'Banco de pautas → Sortear pauta ou escolher manualmente', icon: '💡' },
  { etapa: '2', titulo: 'Planejamento', descricao: 'Adicionar ao Calendário com pilar, formato e data prevista', icon: '📅' },
  { etapa: '3', titulo: 'Criação', descricao: 'Gravar ou produzir o conteúdo (bruto)', icon: '🎬' },
  { etapa: '4', titulo: 'Edição', descricao: 'Editor recebe o bruto e entrega editado em até 48h', icon: '✂️' },
  { etapa: '5', titulo: 'Aprovação', descricao: 'Gestor/Diego aprova legenda, thumbnail e copy', icon: '✅' },
  { etapa: '6', titulo: 'Publicação', descricao: 'Publicar no horário definido + atualizar Kanban', icon: '🚀' },
  { etapa: '7', titulo: 'Análise', descricao: 'Registrar métricas em 48h após publicação', icon: '📊' },
];

const TABS = ['Fluxo Semanal', 'Processo de Conteúdo'];
const ACCENT = '#C17F24';

export function Workflow() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Workflow" subtitle="Referência de operação da equipe" />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
            background: tab === i ? '#1C0F05' : '#fff',
            color: tab === i ? ACCENT : '#333',
            border: `1px solid ${tab === i ? '#1C0F05' : '#ddd'}`,
          }}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#1C0F05' }}>
                  {['Dia', 'Responsável', 'Ação'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: ACCENT, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FLUXO_SEMANAL.map((row, i) => {
                  const rc = RESPONSAVEL_COLORS[row.responsavel] || { bg: '#F5F5F5', text: '#666' };
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F5EDE0', background: i % 2 === 0 ? '#fff' : '#FDFAF6' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1C0F05', whiteSpace: 'nowrap' }}>{row.dia}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: rc.bg, color: rc.text }}>{row.responsavel}</span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#444', lineHeight: 1.5 }}>{row.acao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PROCESSO_CONTEUDO.map((step, i) => (
            <Card key={i} style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ background: '#1C0F05', color: ACCENT, borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                {step.etapa}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px' }}>{step.icon}</span>
                  <h4 style={{ fontFamily: 'Georgia,serif', color: ACCENT, fontSize: '15px', margin: 0 }}>{step.titulo}</h4>
                </div>
                <p style={{ color: '#555', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{step.descricao}</p>
              </div>
              {i < PROCESSO_CONTEUDO.length - 1 && (
                <div style={{ position: 'absolute', marginLeft: '17px', marginTop: '52px', width: '2px', height: '10px', background: '#EAD9C0' }} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
