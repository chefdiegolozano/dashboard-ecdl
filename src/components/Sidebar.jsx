import { useState } from 'react';
import {
  LayoutDashboard, Calendar, BarChart3, Lightbulb, FileText,
  CheckSquare, Columns3, GitBranch, Zap, BookOpen, Settings,
  Menu, X, ChevronRight, LogOut, GraduationCap, Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard, group: 'operacional' },
  { id: 'matriculas', label: 'Matrículas',  icon: GraduationCap,   group: 'operacional' },
  { id: 'leads',      label: 'Leads',       icon: Users,           group: 'operacional' },
  { id: 'metricas',   label: 'Métricas',    icon: BarChart3,       group: 'operacional' },
  { id: 'calendario', label: 'Calendário',  icon: Calendar,        group: 'operacional' },
  { id: 'pautas',     label: 'Pautas',      icon: Lightbulb,       group: 'operacional' },
  { id: 'kanban',     label: 'Kanban',      icon: Columns3,        group: 'operacional' },
  { id: 'checklist',  label: 'Checklist',   icon: CheckSquare,     group: 'operacional' },
  { id: 'workflow',   label: 'Workflow',    icon: GitBranch,       group: 'referencia' },
  { id: 'templates',  label: 'Templates',   icon: FileText,        group: 'referencia' },
  { id: 'automacao',  label: 'Automação',   icon: Zap,             group: 'referencia' },
  { id: 'regras',     label: 'Regras',      icon: BookOpen,        group: 'referencia' },
  { id: 'config',     label: 'Config',      icon: Settings,        group: 'referencia' },
];

const ROLE_LABELS = {
  gestor: 'Gestor',
  editor: 'Editor',
  analista: 'Analista',
  video_maker: 'Video Maker',
};

const ACCENT = '#C17F24';

function NavItem({ item, active, onNavigate }) {
  const Icon = item.icon;
  const isActive = active === item.id;
  return (
    <button
      onClick={() => onNavigate(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '9px 20px', border: 'none', cursor: 'pointer',
        background: isActive ? 'rgba(193,127,36,0.15)' : 'transparent',
        color: isActive ? ACCENT : 'rgba(251,245,238,0.6)',
        fontSize: '13px', fontWeight: isActive ? 600 : 400,
        borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
        transition: 'all 0.15s', textAlign: 'left',
      }}
      onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(193,127,36,0.07)')}
      onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={16} />
      <span>{item.label}</span>
      {isActive && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
    </button>
  );
}

export function Sidebar({ active, onNavigate, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, profile, canView } = useAuth();

  const visibleItems = MENU_ITEMS.filter(m => canView(m.id));
  const operacional = visibleItems.filter(m => m.group === 'operacional');
  const referencia = visibleItems.filter(m => m.group === 'referencia');

  const SidebarContent = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid rgba(193,127,36,0.2)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '16px', color: '#1C0F05', letterSpacing: '-1px',
          }}>EC</div>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: ACCENT, fontSize: '13px', lineHeight: 1.2 }}>Escola de Confeitaria</div>
            <div style={{ color: `rgba(193,127,36,0.55)`, fontSize: '11px' }}>Diego Lozano</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {operacional.length > 0 && (
          <>
            <div style={{ padding: '4px 20px 8px', color: `rgba(193,127,36,0.5)`, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Operacional
            </div>
            {operacional.map(item => (
              <NavItem key={item.id} item={item} active={active} onNavigate={(id) => { onNavigate(id); setMobileOpen(false); }} />
            ))}
          </>
        )}

        {referencia.length > 0 && (
          <>
            <div style={{ margin: '12px 20px', borderTop: `1px solid rgba(193,127,36,0.15)` }} />
            <div style={{ padding: '4px 20px 8px', color: `rgba(193,127,36,0.5)`, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Referência
            </div>
            {referencia.map(item => (
              <NavItem key={item.id} item={item} active={active} onNavigate={(id) => { onNavigate(id); setMobileOpen(false); }} />
            ))}
          </>
        )}
      </nav>

      {/* Footer: usuário + sair */}
      <div style={{ borderTop: `1px solid rgba(193,127,36,0.2)` }}>
        {profile && (
          <div style={{ padding: '12px 20px 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(193,127,36,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: ACCENT, flexShrink: 0,
            }}>
              {(profile.name || profile.email || '?')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(251,245,238,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.name || profile.email}
              </div>
              <div style={{ fontSize: '10px', color: ACCENT, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {ROLE_LABELS[role] || role}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          style={{
            width: '100%', padding: '10px 20px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(251,245,238,0.4)',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '13px', fontWeight: 400, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,40,40,0.12)'; e.currentTarget.style.color = '#EF9A9A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(251,245,238,0.4)'; }}
        >
          <LogOut size={15} />
          Sair
        </button>
        <div style={{ padding: '4px 20px 14px', fontSize: '11px', color: `rgba(193,127,36,0.3)` }}>
          v2.0 — Painel ECDL
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none', position: 'fixed', top: '16px', left: '16px', zIndex: 200,
          background: '#1C0F05', border: 'none', borderRadius: '8px',
          padding: '10px', cursor: 'pointer', color: ACCENT,
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      <aside style={{
        width: '220px', minWidth: '220px', height: '100vh',
        background: '#1C0F05', position: 'sticky', top: 0, overflowY: 'auto',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)}>
          <aside style={{ width: '240px', height: '100vh', background: '#1C0F05', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: ACCENT, cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
