import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (err) {
      setError('E-mail ou senha incorretos.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#1C0F05',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '16px',
            background: '#C17F24',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '24px', color: '#1C0F05',
            marginBottom: '16px', letterSpacing: '-1px',
          }}>EC</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#C17F24', fontSize: '22px', margin: '0 0 4px' }}>
            Escola de Confeitaria
          </h1>
          <p style={{ color: 'rgba(193,127,36,0.5)', fontSize: '13px', margin: 0 }}>
            Painel de Gestão
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#2A1508', borderRadius: '12px',
            border: '1px solid rgba(193,127,36,0.2)', padding: '32px',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(193,127,36,0.7)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px',
            }}>E-mail</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" autoComplete="email" autoFocus required
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '8px',
                border: `1px solid ${error ? 'rgba(198,40,40,0.5)' : 'rgba(193,127,36,0.25)'}`,
                background: 'rgba(255,255,255,0.05)', color: '#FBF5EE',
                fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#C17F24'}
              onBlur={e => e.target.style.borderColor = error ? 'rgba(198,40,40,0.5)' : 'rgba(193,127,36,0.25)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(193,127,36,0.7)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px',
            }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••••" autoComplete="current-password" required
                style={{
                  width: '100%', padding: '11px 42px 11px 14px', borderRadius: '8px',
                  border: `1px solid ${error ? 'rgba(198,40,40,0.5)' : 'rgba(193,127,36,0.25)'}`,
                  background: 'rgba(255,255,255,0.05)', color: '#FBF5EE',
                  fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#C17F24'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(198,40,40,0.5)' : 'rgba(193,127,36,0.25)'}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(193,127,36,0.5)', padding: 0, display: 'flex',
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(198,40,40,0.15)', border: '1px solid rgba(198,40,40,0.4)',
              borderRadius: '6px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#EF9A9A', fontWeight: 500,
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: loading ? 'rgba(193,127,36,0.5)' : '#C17F24',
              color: '#1C0F05', fontWeight: 700, fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'inherit',
            }}
          >
            {loading ? (
              <><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #1C0F05', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Entrando...</>
            ) : (
              <><LogIn size={16} />Entrar</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(193,127,36,0.25)', fontSize: '11px', marginTop: '24px' }}>
          ECDL · Diego Lozano
        </p>
      </div>
    </div>
  );
}
