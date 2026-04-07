const ACCENT = '#C17F24';

export function Card({ children, style = {}, className = '' }) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(28,15,5,0.08)',
        border: '1px solid #EAD9C0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      <div>
        <h2 style={{
          fontFamily: 'Georgia, serif', fontWeight: 700,
          color: ACCENT, fontSize: '22px', margin: '0 0 4px',
        }}>{title}</h2>
        {subtitle && <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, color = ACCENT }) {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#666', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>{label}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F05', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
          {sub && <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>{sub}</p>}
        </div>
        {Icon && (
          <div style={{ background: color + '18', padding: '10px', borderRadius: '8px' }}>
            <Icon size={22} color={color} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', style = {}, disabled = false, type = 'button' }) {
  const sizes = { sm: '6px 14px', md: '8px 20px', lg: '12px 28px' };
  const fs = { sm: '12px', md: '14px', lg: '15px' };
  const styles = {
    primary:   { background: ACCENT, color: '#fff', border: `1px solid ${ACCENT}` },
    secondary: { background: 'transparent', color: ACCENT, border: `1px solid ${ACCENT}` },
    danger:    { background: '#C62828', color: '#fff', border: '1px solid #C62828' },
    ghost:     { background: 'transparent', color: '#666', border: '1px solid #ddd' },
    dark:      { background: '#1C0F05', color: ACCENT, border: '1px solid #1C0F05' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: sizes[size], borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600, fontSize: fs[size],
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'opacity 0.15s', opacity: disabled ? 0.5 : 1,
        ...styles[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, type = 'text', value, onChange, placeholder, style = {}, rows, required }) {
  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '14px', color: '#333',
    background: '#fff', fontFamily: 'inherit', ...style,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}{required && <span style={{ color: '#C62828' }}> *</span>}</label>}
      {type === 'textarea' ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows || 3} style={{ ...inputStyle, resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={inputStyle} />
      )}
    </div>
  );
}

export function Select({ label, value, onChange, options, style = {}, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}{required && <span style={{ color: '#C62828' }}> *</span>}</label>}
      <select value={value} onChange={onChange} required={required} style={{
        width: '100%', padding: '8px 12px', borderRadius: '6px',
        border: '1px solid #ddd', fontSize: '14px', color: '#333',
        background: '#fff', cursor: 'pointer', fontFamily: 'inherit', ...style,
      }}>
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
    </div>
  );
}
