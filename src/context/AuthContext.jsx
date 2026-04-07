import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { canView, canEdit, firstAllowedSection } from '../lib/permissions';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('[AuthContext] fetchProfile error:', error.message, error.code);
      // Linha não existe ainda — cria com role padrão
      if (error.code === 'PGRST116') {
        const { data: inserted } = await supabase
          .from('profiles')
          .insert({ id: userId, nome: '', role: 'editor', cargo: '' })
          .select()
          .single();
        if (inserted) setProfile(inserted);
      }
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  // Role: prioridade → profiles.role → user_metadata.role → 'editor'
  const metaRole = session?.user?.user_metadata?.role;
  const role = profile?.role || metaRole || 'editor';

  // Só diego@levena.com.br pode usar este caminho
  const OWNER_EMAIL = 'diego@levena.com.br';

  async function claimGestor() {
    const email = session?.user?.email;
    if (email !== OWNER_EMAIL) return false;

    // 1. Grava no user_metadata (não depende de RLS)
    const { error: metaErr } = await supabase.auth.updateUser({
      data: { role: 'gestor' },
    });
    if (metaErr) {
      console.error('[claimGestor] updateUser error:', metaErr.message);
      return false;
    }

    // 2. Tenta atualizar a tabela profiles (pode falhar sem linha — tudo bem)
    if (profile?.id) {
      await supabase.from('profiles').update({ role: 'gestor' }).eq('id', profile.id);
    }

    setProfile(p => ({ ...(p || {}), id: session.user.id, email, role: 'gestor' }));
    return true;
  }

  return (
    <AuthContext.Provider value={{
      session,
      profile,
      role,
      loading,
      canView: (section) => canView(role, section),
      canEdit: (section) => canEdit(role, section),
      firstSection: () => firstAllowedSection(role),
      signOut: () => supabase.auth.signOut(),
      claimGestor,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
