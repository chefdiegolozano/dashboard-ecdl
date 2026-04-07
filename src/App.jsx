import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Matriculas } from './components/Matriculas';
import { Leads } from './components/Leads';
import { Metricas } from './components/Metricas';
import { Calendario } from './components/Calendario';
import { Pautas } from './components/Pautas';
import { Kanban } from './components/Kanban';
import { Checklist } from './components/Checklist';
import { Workflow } from './components/Workflow';
import { Templates } from './components/Templates';
import { Automacao } from './components/Automacao';
import { Regras } from './components/Regras';
import { Config } from './components/Config';
import { ToastContainer } from './components/ui/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSupabaseData } from './hooks/useSupabaseData';
import { PAUTAS_INICIAIS, KANBAN_INICIAL, TRIGGERS_INICIAIS } from './data/initial';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { session, loading, canView, canEdit, firstSection, signOut } = useAuth();

  // Dados compartilhados — sincronizados com o Supabase (fallback: localStorage)
  const [posts, setPosts]           = useSupabaseData('ecdl_posts', []);
  const [pautas, setPautas]         = useSupabaseData('ecdl_pautas', PAUTAS_INICIAIS);
  const [matriculas, setMatriculas] = useSupabaseData('ecdl_matriculas', []);
  const [leads, setLeads]           = useSupabaseData('ecdl_leads', []);
  const [calendarData, setCalendarData] = useSupabaseData('ecdl_calendar', {});
  const [checklists, setChecklists] = useSupabaseData('ecdl_checklists', []);
  const [kanban, setKanban]         = useSupabaseData('ecdl_kanban', KANBAN_INICIAL);
  const [triggers, setTriggers]     = useSupabaseData('ecdl_triggers', TRIGGERS_INICIAIS);
  const [templates, setTemplates]   = useSupabaseData('ecdl_templates', []);

  // API key fica apenas local (dado sensível, por usuário)
  const [apiKey, setApiKey] = useLocalStorage('ecdl_anthropic_key', '');

  const [active, setActive] = useState('dashboard');

  // Quando o role carregar, navegar para primeira seção permitida
  useEffect(() => {
    if (!loading && session) {
      setActive(firstSection());
    }
  }, [loading, session]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1C0F05', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(193,127,36,0.3)', borderTopColor: '#C17F24', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const handleImport = (data) => {
    if (data.posts) setPosts(data.posts);
    if (data.pautas) setPautas(data.pautas);
    if (data.matriculas) setMatriculas(data.matriculas);
    if (data.leads) setLeads(data.leads);
    if (data.calendarData) setCalendarData(data.calendarData);
    if (data.checklists) setChecklists(data.checklists);
    if (data.kanban) setKanban(data.kanban);
    if (data.triggers) setTriggers(data.triggers);
    if (data.templates) setTemplates(data.templates);
  };

  const handleReset = () => {
    setPosts([]);
    setPautas(PAUTAS_INICIAIS);
    setMatriculas([]);
    setLeads([]);
    setCalendarData({});
    setChecklists([]);
    setKanban(KANBAN_INICIAL);
    setTriggers(TRIGGERS_INICIAIS);
    setTemplates([]);
  };

  const pages = {
    dashboard:  <Dashboard posts={posts} matriculas={matriculas} leads={leads} />,
    matriculas: <Matriculas matriculas={matriculas} setMatriculas={setMatriculas} canEdit={canEdit('matriculas')} />,
    leads:      <Leads leads={leads} setLeads={setLeads} canEdit={canEdit('leads')} />,
    metricas:   <Metricas posts={posts} setPosts={setPosts} canEdit={canEdit('metricas')} />,
    calendario: <Calendario calendarData={calendarData} setCalendarData={setCalendarData} canEdit={canEdit('calendario')} />,
    pautas:     <Pautas pautas={pautas} setPautas={setPautas} canEdit={canEdit('pautas')} />,
    kanban:     <Kanban kanban={kanban} setKanban={setKanban} canEdit={canEdit('kanban')} />,
    checklist:  <Checklist checklists={checklists} setChecklists={setChecklists} canEdit={canEdit('checklist')} />,
    workflow:   <Workflow />,
    templates:  <Templates templates={templates} setTemplates={setTemplates} canEdit={canEdit('templates')} />,
    automacao:  <Automacao triggers={triggers} setTriggers={setTriggers} canEdit={canEdit('automacao')} />,
    regras:     <Regras />,
    config:     <Config
      posts={posts} pautas={pautas} calendarData={calendarData}
      matriculas={matriculas} leads={leads} checklists={checklists}
      kanban={kanban} triggers={triggers} templates={templates}
      onImport={handleImport} onReset={handleReset}
      apiKey={apiKey} setApiKey={setApiKey}
    />,
  };

  // Garante que o usuário não acessa seção proibida via state direto
  const safePage = canView(active) ? active : firstSection();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FBF5EE' }}>
      <Sidebar active={safePage} onNavigate={setActive} onLogout={signOut} />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: '#FBF5EE' }}>
        {pages[safePage] || <div style={{ padding: '32px', color: '#999' }}>Seção não encontrada</div>}
      </main>
      <ToastContainer />
    </div>
  );
}
