import { useState } from 'react';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';
import { Card, SectionHeader, Btn, Input } from './ui/Card';
import { showToast } from './ui/Toast';

export function Config({
  posts, pautas, calendarData, matriculas, leads, checklists, kanban, triggers, templates,
  onImport, onReset, apiKey, setApiKey,
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

  const exportar = () => {
    const data = {
      posts, pautas, calendarData, matriculas, leads, checklists, kanban, triggers, templates,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecdl-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso');
  };

  const importar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        onImport(data);
        showToast('Dados importados com sucesso');
      } catch {
        showToast('Arquivo inválido', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const salvarApiKey = () => {
    setApiKey(keyInput.trim());
    showToast('API Key salva');
  };

  const ACCENT = '#C17F24';

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Configurações" subtitle="Backup, importação e preferências" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>

        {/* Backup */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 8px', fontSize: '16px' }}>Backup de dados</h3>
          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.6 }}>
            Todos os dados são salvos localmente no seu navegador (localStorage). Exporte regularmente para não perder dados ao limpar o cache.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Btn onClick={exportar}><Download size={14} />Exportar JSON</Btn>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px',
              background: 'transparent', color: ACCENT, border: `1px solid ${ACCENT}`,
            }}>
              <Upload size={14} />Importar JSON
              <input type="file" accept=".json" onChange={importar} style={{ display: 'none' }} />
            </label>
          </div>
        </Card>

        {/* Resumo de dados */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 16px', fontSize: '16px' }}>Resumo dos dados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { label: 'Posts registrados', value: (posts || []).length },
              { label: 'Pautas', value: (pautas || []).length },
              { label: 'Matrículas', value: (matriculas || []).length },
              { label: 'Leads', value: (leads || []).length },
              { label: 'Checklists', value: (checklists || []).length },
              { label: 'Triggers', value: (triggers || []).length },
              { label: 'Templates custom', value: (templates || []).length },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '12px', background: '#FDFAF6', borderRadius: '6px', border: '1px solid #EAD9C0' }}>
                <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.4px' }}>{label}</p>
                <p style={{ fontSize: '22px', fontWeight: 700, color: '#1C0F05', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* API Key Anthropic */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: ACCENT, margin: '0 0 8px', fontSize: '16px' }}>Claude AI (opcional)</h3>
          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.6 }}>
            Configure sua API Key da Anthropic para usar funcionalidades de IA (geração de copy, análise de métricas).
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Anthropic API Key"
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>
            <Btn variant="ghost" size="sm" onClick={() => setShowKey(s => !s)} style={{ marginBottom: '1px' }}>
              {showKey ? 'Ocultar' : 'Mostrar'}
            </Btn>
            <Btn onClick={salvarApiKey} style={{ marginBottom: '1px' }}><Save size={14} />Salvar</Btn>
          </div>
        </Card>

        {/* Reset */}
        <Card style={{ padding: '24px', border: '1px solid #FFCDD2' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#C62828', margin: '0 0 8px', fontSize: '16px' }}>Zona de perigo</h3>
          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.6 }}>
            Reseta todos os dados do dashboard. Esta ação é <strong>irreversível</strong>. Exporte o backup antes de prosseguir.
          </p>
          <Btn variant="danger" onClick={() => {
            if (window.confirm('Tem certeza? Todos os dados serão perdidos. Exporte o backup antes!')) {
              onReset();
              showToast('Dados resetados', 'info');
            }
          }}>
            <RotateCcw size={14} />Resetar todos os dados
          </Btn>
        </Card>
      </div>
    </div>
  );
}
