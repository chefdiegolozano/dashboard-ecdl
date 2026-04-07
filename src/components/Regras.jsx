import { useState } from 'react';
import { Star, TrendingUp, AlertTriangle, Users, MessageSquare, BookOpen, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, SectionHeader } from './ui/Card';

const ACCENT = '#C17F24';

const REGRAS = [
  {
    id: 1, icone: Target,
    titulo: 'Conteúdo técnico é a porta de entrada',
    resumo: 'Quem nos segue quer aprender. Técnica bem explicada gera confiança e leads.',
    detalhe: 'Todo conteúdo técnico deve mostrar o "porquê" por trás da técnica, não só o "como". A ECDL se diferencia por ensinar com profundidade — isso deve aparecer no conteúdo.',
  },
  {
    id: 2, icone: MessageSquare,
    titulo: 'Tom: professor-amigo, não palestrante',
    resumo: 'Falamos como um chef experiente falaria pra um amigo querendo evoluir na confeitaria.',
    detalhe: 'Evitar: linguagem corporativa, jargões de marketing digital, frases genéricas. Preferir: exemplos reais de aula, erros cometidos na prática, histórias de alunos.',
  },
  {
    id: 3, icone: Star,
    titulo: 'Especificidade > Generalidade',
    resumo: '"Sua ganache talhou porque estava a 52°C quando deveria estar a 35°C" > "Cuidado com a temperatura".',
    detalhe: 'Números, temperaturas, percentuais, nomes de ingredientes específicos — esses detalhes são o que diferenciam o conteúdo da ECDL de um canal genérico de confeitaria.',
  },
  {
    id: 4, icone: TrendingUp,
    titulo: 'Cada post deve ter uma chamada para o funil',
    resumo: 'Todo post deve ter um CTA claro — mesmo que sutil — direcionando para o curso ou lista de espera.',
    detalhe: 'CTAs que funcionam: "Comenta aqui qual técnica você mais tem dificuldade", "Salva esse post — você vai precisar", "Manda pra mim sua dúvida sobre isso". CTAs ruins: "Clica no link da bio", "Compra o curso".',
  },
  {
    id: 5, icone: Users,
    titulo: 'Depoimentos são o maior ativo',
    resumo: 'Um aluno real contando a transformação vale mais que 10 posts de técnica.',
    detalhe: 'Sempre que uma turma terminar, coletar depoimentos em vídeo (30-60s). Pedir que o aluno mencione: o que era antes, o que aprendeu, como isso mudou algo concreto na vida dele.',
  },
  {
    id: 6, icone: AlertTriangle,
    titulo: 'Não criar urgência falsa',
    resumo: 'Se as vagas são limitadas, dizer quantas restam. Não usar "últimas vagas" quando há dezenas disponíveis.',
    detalhe: 'A credibilidade da escola é o principal ativo. Qualquer promessa deve ser verdadeira. Se uma turma está com 3 vagas reais, dizer "3 vagas". Se está com 15, não criar falsa urgência.',
  },
  {
    id: 7, icone: BookOpen,
    titulo: 'Conteúdo de bastidor gera conexão',
    resumo: 'Mostrar o que acontece dentro da escola (preparo, alunos, erros, acertos) humaniza a marca.',
    detalhe: 'B-roll de aulas, fotos de alunos concentrados, momentos de "aha!" em sala — tudo isso cria desejo. Quem vê quer participar. Prioridade de captura em toda turma.',
  },
  {
    id: 8, icone: Zap,
    titulo: 'Responder DMs em até 2h no horário comercial',
    resumo: 'Velocidade de resposta é fator de conversão. Lead que espera 24h provavelmente foi falar com a concorrência.',
    detalhe: 'Turno da manhã: responder até o meio-dia. Turno da tarde: responder até as 18h. Finais de semana: uma varredura de manhã e uma à tarde. Templates de resposta padronizados na seção Automação.',
  },
];

const PILARES_CONTEUDO = [
  { pilar: 'Técnica', pct: '40%', cor: '#6A1B9A', desc: 'Receitas, técnicas, erros comuns, ciência por trás da confeitaria' },
  { pilar: 'ECDL', pct: '30%', cor: '#2E7D32', desc: 'Bastidores, turmas, depoimentos, lançamentos' },
  { pilar: 'Gestão', pct: '20%', cor: '#E65100', desc: 'Negócio de confeitaria, precificação, CMV, produtividade' },
  { pilar: 'Pessoal', pct: '10%', cor: '#1565C0', desc: 'Diego, história, motivação, bastidor pessoal' },
];

const TABS = ['8 Regras', 'Pilares de Conteúdo'];

export function Regras() {
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Regras & Estratégia" subtitle="Referência permanente de posicionamento e conteúdo" />

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {REGRAS.map(regra => {
            const Icon = regra.icone;
            const isExpanded = expanded === regra.id;
            return (
              <Card
                key={regra.id}
                style={{ padding: '16px', cursor: 'pointer', border: isExpanded ? `1px solid ${ACCENT}` : '1px solid #EAD9C0' }}
                onClick={() => setExpanded(isExpanded ? null : regra.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: '#1C0F05', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                    <Icon size={16} color={ACCENT} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontFamily: 'Georgia,serif', color: ACCENT, fontSize: '14px', margin: 0, lineHeight: 1.3 }}>
                        {regra.id}. {regra.titulo}
                      </h4>
                      {isExpanded ? <ChevronUp size={14} color="#999" /> : <ChevronDown size={14} color="#999" />}
                    </div>
                    <p style={{ color: '#555', fontSize: '12px', margin: '6px 0 0', lineHeight: 1.5 }}>{regra.resumo}</p>
                    {isExpanded && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #EAD9C0' }}>
                        <p style={{ color: '#333', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{regra.detalhe}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Card style={{ padding: '20px', marginBottom: '8px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 16px', fontSize: '16px' }}>Distribuição de pilares</h3>
            {PILARES_CONTEUDO.map(p => (
              <div key={p.pilar} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: p.cor, fontSize: '14px' }}>{p.pilar}</span>
                  <span style={{ fontWeight: 700, color: p.cor, fontSize: '18px' }}>{p.pct}</span>
                </div>
                <div style={{ height: '8px', background: '#F0E4D0', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                  <div style={{ width: p.pct, height: '100%', background: p.cor, borderRadius: '4px' }} />
                </div>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </Card>

          <Card style={{ padding: '20px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 16px', fontSize: '16px' }}>Formatos por pilar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { pilar: 'Técnica', formatos: 'Reels (principal), Carrossel', cor: '#6A1B9A' },
                { pilar: 'ECDL', formatos: 'Reels de bastidor, Stories', cor: '#2E7D32' },
                { pilar: 'Gestão', formatos: 'Carrossel, Reels analíticos', cor: '#E65100' },
                { pilar: 'Pessoal', formatos: 'Reels narrativos, Stories', cor: '#1565C0' },
              ].map(({ pilar, formatos, cor }) => (
                <div key={pilar} style={{ padding: '14px', background: '#FDFAF6', borderRadius: '6px', border: `1px solid #EAD9C0`, borderLeft: `3px solid ${cor}` }}>
                  <p style={{ fontWeight: 700, color: cor, fontSize: '13px', margin: '0 0 4px' }}>{pilar}</p>
                  <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{formatos}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
