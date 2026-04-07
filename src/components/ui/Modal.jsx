import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children, width = '520px' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(28,15,5,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-fade-in"
        style={{
          background: '#fff', borderRadius: '12px', width: '100%', maxWidth: width,
          maxHeight: '90vh', overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid #EAD9C0',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', color: '#C17F24', fontSize: '18px' }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#666', display: 'flex', padding: '4px', borderRadius: '4px',
          }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="400px">
      <p style={{ color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{
          padding: '8px 20px', border: '1px solid #C17F24', borderRadius: '6px',
          background: 'transparent', color: '#C17F24', cursor: 'pointer', fontWeight: 600,
        }}>Cancelar</button>
        <button onClick={() => { onConfirm(); onClose(); }} style={{
          padding: '8px 20px', border: 'none', borderRadius: '6px',
          background: '#C62828', color: '#fff', cursor: 'pointer', fontWeight: 600,
        }}>Confirmar</button>
      </div>
    </Modal>
  );
}
