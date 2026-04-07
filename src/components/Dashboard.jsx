import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { GraduationCap, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, SectionHeader, StatCard } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatarMoeda, formatarViews, calcEngajamento, getSemanasRecentes, getPostsDoMes } from '../utils/calculations';

const ACCENT = '#C17F24';

const SAMPLE_SEMANAS = [
  { label: 'S1', leads: 12, matriculas: 3, engajamento: 2.1 },
  { label: 'S2', leads: 18, matriculas: 5, engajamento: 2.4 },
  { label: 'S3', leads: 14, matriculas: 4, engajamento: 1.9 },
  { label: 'S4', leads: 22, matriculas: 7, engajamento: 2.8 },
  { label: 'S5', leads: 19, matriculas: 6, engajamento: 2.5 },
  { label: 'S6', leads: 28, matriculas: 9, engajamento: 3.1 },
  { label: 'S7', leads: 24, matriculas: 8, engajamento: 2.9 },
  { label: 'S8', leads: 31, matriculas: 10, engajamento: 3.4 },
];

const SAMPLE_CURSOS = [
  { curso: 'Master', receita: 31500 },
  { curso: 'Chocolate', receita: 14400 },
  { curso: 'Cafeteria', receita: 8400 },
  { curso: 'Moderna', receita: 12600 },
];

const PILAR_COLORS = {
  Técnica: '#6A1B9A',
  Gestão: '#E65100',
  ECDL: '#2E7D32',
  Pessoal: '#1565C0',
  Livre: '#999',
};

export function Dashboard({ posts, matriculas, leads }) {
  const totalMatriculas = (matriculas || []).filter(m => m.status === 'Ativa').length;
  const totalLeads = (leads || []).length;
  const leadsNovas = (leads || []).filter(l => l.status === 'Novo').length;
  const receitaMes = (matriculas || [])
    .filter(m => {
      const d = new Date(m.dataMatricula);
      const agora = new Date();
      return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    })
    .reduce((a, m) => a + (parseFloat(m.valor) || 0), 0);

  const postsMes = getPostsDoMes(posts);
  const mediaEng = postsMes.length > 0
    ? (postsMes.reduce((a, p) => a + calcEngajamento(p), 0) / postsMes.length).toFixed(2)
    : 0;

  const semanas = posts.length > 0 ? getSemanasRecentes(posts, 8) : SAMPLE_SEMANAS;
  const isEmpty = posts.length === 0 && matriculas.length === 0 && leads.length === 0;

  const taxaConversao = totalLeads > 0
    ? ((totalMatriculas / totalLeads) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Dashboard"
        subtitle={isEmpty ? 'Dados de exemplo — registre informações reais nas seções' : `Visão geral da escola`}
      />

      {isEmpty && (
        <div style={{ background: '#FFF8E7', border: `1px solid ${ACCENT}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: ACCENT }}>
          Mostrando dados de exemplo. Use <strong>Matrículas</strong>, <strong>Leads</strong> e <strong>Métricas</strong> para registrar dados reais.
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Alunos ativos" value={totalMatriculas || '—'} icon={GraduationCap} sub="matrículas ativas" />
        <StatCard label="Leads no funil" value={totalLeads || '—'} icon={Users} sub={`${leadsNovas || '—'} novos`} color="#1565C0" />
        <StatCard label="Tx. conversão" value={totalLeads > 0 ? `${taxaConversao}%` : '—'} icon={TrendingUp} sub="lead → matrícula" color="#2E7D32" />
        <StatCard label="Receita (mês)" value={receitaMes > 0 ? formatarMoeda(receitaMes) : '—'} icon={DollarSign} sub="matrículas no mês" color="#6A1B9A" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 16px', fontSize: '15px' }}>Leads × Matrículas — 8 semanas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={isEmpty ? SAMPLE_SEMANAS : semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} />
              <Tooltip />
              <Bar dataKey="leads" fill="#1565C0" radius={[4,4,0,0]} name="Leads" />
              <Bar dataKey="matriculas" fill={ACCENT} radius={[4,4,0,0]} name="Matrículas" />
              <Legend formatter={v => <span style={{ fontSize: '11px' }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 16px', fontSize: '15px' }}>Engajamento % — 8 semanas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={isEmpty ? SAMPLE_SEMANAS : semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#666' }} />
              <Tooltip formatter={v => [`${v}%`, 'Engajamento']} />
              <Line type="monotone" dataKey={isEmpty ? 'engajamento' : 'mediaEng'} stroke="#2E7D32" strokeWidth={2} dot={{ fill: '#2E7D32', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 16px', fontSize: '15px' }}>Receita por curso</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SAMPLE_CURSOS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D0" />
              <XAxis type="number" tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#666' }} />
              <YAxis type="category" dataKey="curso" tick={{ fontSize: 12, fill: '#333' }} width={65} />
              <Tooltip formatter={v => [formatarMoeda(v), 'Receita']} />
              <Bar dataKey="receita" fill={ACCENT} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 8px', fontSize: '15px' }}>Pipeline de leads</h3>
          {leads && leads.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {['Novo', 'Contato', 'Proposta', 'Matriculado', 'Perdido'].map(status => {
                const count = leads.filter(l => l.status === status).length;
                const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                const colors = { Novo: '#1565C0', Contato: '#F57F17', Proposta: '#6A1B9A', Matriculado: '#2E7D32', Perdido: '#C62828' };
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '80px', fontSize: '12px', color: '#333', fontWeight: 600 }}>{status}</span>
                    <div style={{ flex: 1, height: '8px', background: '#F0E4D0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: colors[status], borderRadius: '4px', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ width: '30px', fontSize: '12px', color: '#666', textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {[{ status: 'Novo', count: 8, pct: 26 }, { status: 'Contato', count: 12, pct: 39 }, { status: 'Proposta', count: 7, pct: 23 }, { status: 'Matriculado', count: 3, pct: 10 }, { status: 'Perdido', count: 1, pct: 3 }].map(({ status, count, pct }) => {
                const colors = { Novo: '#1565C0', Contato: '#F57F17', Proposta: '#6A1B9A', Matriculado: '#2E7D32', Perdido: '#C62828' };
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ width: '80px', fontSize: '12px', color: '#333', fontWeight: 600 }}>{status}</span>
                    <div style={{ flex: 1, height: '8px', background: '#F0E4D0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: colors[status], borderRadius: '4px' }} />
                    </div>
                    <span style={{ width: '30px', fontSize: '12px', color: '#666', textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
