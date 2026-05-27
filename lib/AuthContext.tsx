import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type Perfil = {
  id: string;
  nome: string;
  email: string;
  tipo: 'leitor' | 'confeiteira' | 'editor' | 'admin';
};

type AuthContextType = {
  perfil: Perfil | null;
  carregando: boolean;
  isLeitor: boolean;
  isConfeiteira: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  recarregar: () => void;
};

const AuthContext = createContext<AuthContextType>({
  perfil: null,
  carregando: true,
  isLeitor: false,
  isConfeiteira: false,
  isEditor: false,
  isAdmin: false,
  recarregar: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setPerfil(null);
      setCarregando(false);
      return;
    }
    const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single();
    setPerfil(data || null);
    setCarregando(false);
  }

  useEffect(() => {
    carregarPerfil();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      carregarPerfil();
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      perfil,
      carregando,
      isLeitor: perfil?.tipo === 'leitor',
      isConfeiteira: perfil?.tipo === 'confeiteira',
      isEditor: perfil?.tipo === 'editor',
      isAdmin: perfil?.tipo === 'admin',
      recarregar: carregarPerfil,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}