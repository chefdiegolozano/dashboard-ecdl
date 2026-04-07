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
    if (!error) setProfile(data);
    setLoading(false);
  }

  const role = profile?.role || null;

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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
