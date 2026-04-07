import { useState } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

let toastId = 0;
let globalSetToasts = null;

export function showToast(message, type = 'success') {
  if (globalSetToasts) {
    const id = ++toastId;
    globalSetToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      globalSetToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  globalSetToasts = setToasts;

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = {
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
    info: <Info size={16} />,
  };
  const colors = {
    success: { bg: '#2E7D32', text: '#fff' },
    error:   { bg: '#C62828', text: '#fff' },
    info:    { bg: '#1565C0', text: '#fff' },
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {toasts.map(toast => {
        const color = colors[toast.type] || colors.success;
        return (
          <div
            key={toast.id}
            className="animate-toast"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: color.bg, color: color.text,
              padding: '12px 16px', borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '260px', maxWidth: '360px',
              fontSize: '14px', fontWeight: 500,
            }}
          >
            {icons[toast.type]}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: color.text, padding: 0, display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
