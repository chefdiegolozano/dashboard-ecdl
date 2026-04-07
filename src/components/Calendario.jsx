import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { showToast } from './ui/Toast';

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const PILARES = ['Técnica', 'Gestão', 'ECDL', 'Pessoal', 'Livre'];
const FORMATOS = ['Reels', 'Carrossel', 'Post', 'Story'];
const STATUS_OPTS = ['Pauta', 'Gravado', 'Editando', 'Pronto', 'Publicado'];
const STATUS_COLORS = {
  Pauta: '#FBF5EE', Gravado: '#E3F2FD', Editando: '#FFF8E1', Pronto: '#E8F5E9', Publicado: '#FFF8E7',
};

function getWeekDates(weekOffset = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff + weekOffset * 7);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d) { return d.toISOString().split('T')[0]; }

const DEFAULT_DAY = () => ({
  pilar: 'ECDL', formato: 'Reels', horario: '19h',
  status: 'Pauta', pauta: '', copy: '', notas: '', publicado: false,
});

export function Calendario({ calendarData, setCalendarData }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedDay, setExpandedDay] = useState(null);
  const weekDays = getWeekDates(weekOffset);

  const getDayData = (date) => {
    const key = formatDate(date);
    return calendarData[key] || DEFAULT_DAY();
  };

  const updateDay = (date, updates) => {
    const key = formatDate(date);
    setCalendarData(prev => ({ ...prev, [key]: { ...getDayData(date), ...updates } }));
    showToast('Salvo', 'info');
  };

  const weekLabel = () => {
    const opts = { day: '2-digit', month: 'short' };
    return `${weekDays[0].toLocaleDateString('pt-BR', opts)} — ${weekDays[6].toLocaleDateString('pt-BR', opts)}`;
  };

  const today = formatDate(new Date());

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Calendário Editorial"
        subtitle="Planejamento semanal de conteúdo"
        action={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setWeekOffset(w => w - 1)} style={{ background: '#fff', border: '1px solid #EAD9C0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{weekLabel()}</span>
            <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: '#fff', border: '1px solid #EAD9C0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><ChevronRight size={16} /></button>
            <Btn variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>Hoje</Btn>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {weekDays.map((day, idx) => {
          const key = formatDate(day);
          const data = getDayData(day);
          const isToday = key === today;
          const isExpanded = expandedDay === key;

          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Cabeçalho dia */}
              <div style={{
                textAlign: 'center', padding: '6px',
                background: isToday ? '#C17F24' : '#1C0F05',
                borderRadius: '6px', color: isToday ? '#1C0F05' : '#C17F24',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>{DIAS_SEMANA[idx]}</div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{day.getDate()}</div>
              </div>

              {/* Card do dia */}
              <Card style={{ padding: '10px', background: STATUS_COLORS[data.status] || '#fff', cursor: 'pointer' }}
                onClick={() => setExpandedDay(isExpanded ? null : key)}>
                <Badge tipo="pilar" valor={data.pilar} size="sm" />
                <p style={{ fontSize: '11px', color: '#555', margin: '6px 0 4px', fontWeight: 500 }}>{data.formato}</p>
                {data.pauta && <p style={{ fontSize: '11px', color: '#333', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{data.pauta}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#999' }}>{data.horario}</span>
                  {data.publicado && <Check size={12} color="#2E7D32" />}
                </div>
              </Card>

              {/* Painel expandido */}
              {isExpanded && (
                <Card style={{ padding: '12px', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Select label="Pilar" value={data.pilar} onChange={e => updateDay(day, { pilar: e.target.value })} options={PILARES} />
                    <Select label="Formato" value={data.formato} onChange={e => updateDay(day, { formato: e.target.value })} options={FORMATOS} />
                    <Select label="Status" value={data.status} onChange={e => updateDay(day, { status: e.target.value })} options={STATUS_OPTS} />
                    <Input label="Horário" value={data.horario} onChange={e => updateDay(day, { horario: e.target.value })} placeholder="19h" />
                    <Input label="Pauta" type="textarea" value={data.pauta} onChange={e => updateDay(day, { pauta: e.target.value })} placeholder="Ideia ou pauta..." rows={2} />
                    <Input label="Notas" type="textarea" value={data.notas} onChange={e => updateDay(day, { notas: e.target.value })} placeholder="Observações..." rows={2} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!data.publicado} onChange={e => updateDay(day, { publicado: e.target.checked })} />
                      Publicado
                    </label>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
