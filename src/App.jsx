import { useState } from 'react';
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
import { PAUTAS_INICIAIS, KANBAN_INICIAL, TRIGGERS_INICIAIS } from './data/initial';

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('ecdl_session') === 'authenticated'
  );
  const [posts, setPosts] = useLocalStorage('ecdl_posts', []);
  const [pautas, setPautas] = useLocalStorage('ecdl_pautas', PAUTAS_INICIAIS);
  const [matriculas, setMatriculas] = useLocalStorage('ecdl_matriculas', []);
  const [leads, setLeads] = useLocalStorage('ecdl_leads', []);
  const [calendarData, setCalendarData] = useLocalStorage('ecdl_calendar', {});
  const [checklists, setChecklists] = useLocalStorage('ecdl_checklists', []);
  const [kanban, setKanban] = useLocalStorage('ecdl_kanban', KANBAN_INICIAL);
  const [triggers, setTriggers] = useLocalStorage('ecdl_triggers', TRIGGERS_INICIAIS);
  const [templates, setTemplates] = useLocalStorage('ecdl_templates', []);
  const [apiKey, setApiKey] = useLocalStorage('ecdl_anthropic_key', '');

  const handleLogout = () => {
    sessionStorage.removeItem('ecdl_session');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
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
    dashboard: <Dashboard posts={posts} matriculas={matriculas} leads={leads} />,
    matriculas: <Matriculas matriculas={matriculas} setMatriculas={setMatriculas} />,
    leads: <Leads leads={leads} setLeads={setLeads} />,
    metricas: <Metricas posts={posts} setPosts={setPosts} />,
    calendario: <Calendario calendarData={calendarData} setCalendarData={setCalendarData} />,
    pautas: <Pautas pautas={pautas} setPautas={setPautas} />,
    kanban: <Kanban kanban={kanban} setKanban={setKanban} />,
    checklist: <Checklist checklists={checklists} setChecklists={setChecklists} />,
    workflow: <Workflow />,
    templates: <Templates templates={templates} setTemplates={setTemplates} />,
    automacao: <Automacao triggers={triggers} setTriggers={setTriggers} />,
    regras: <Regras />,
    config: <Config
      posts={posts} pautas={pautas} calendarData={calendarData}
      matriculas={matriculas} leads={leads} checklists={checklists}
      kanban={kanban} triggers={triggers} templates={templates}
      onImport={handleImport} onReset={handleReset}
      apiKey={apiKey} setApiKey={setApiKey}
    />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FBF5EE' }}>
      <Sidebar active={active} onNavigate={setActive} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: '#FBF5EE' }}>
        {pages[active] || <div style={{ padding: '32px', color: '#999' }}>Seção não encontrada</div>}
      </main>
      <ToastContainer />
    </div>
  );
}
