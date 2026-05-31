import { createContext, useContext, useEffect, useState } from 'react';
import { getUsuarioLogado, removerToken } from './api';

type Perfil = {
  id: string;
  nome: string;
  email: string;
  tipo: 'leitor' | 'confeiteira' | 'admin';
};

type AuthContextType = {
  perfil: Perfil | null;
  carregando: boolean;
  isLeitor: boolean;
  isConfeiteira: boolean;
  isAdmin: boolean;
  recarregar: () => void;
  sair: () => void;
};

const AuthContext = createContext<AuthContextType>({
  perfil: null,
  carregando: true,
  isLeitor: false,
  isConfeiteira: false,
  isAdmin: false,
  recarregar: () => {},
  sair: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarPerfil() {
    const usuario = await getUsuarioLogado();
    setPerfil(usuario || null);
    setCarregando(false);
  }

  async function sair() {
    await removerToken();
    setPerfil(null);
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  return (
    <AuthContext.Provider value={{
      perfil,
      carregando,
      isLeitor: perfil?.tipo === 'leitor',
      isConfeiteira: perfil?.tipo === 'confeiteira',
      isAdmin: perfil?.tipo === 'admin',
      recarregar: carregarPerfil,
      sair,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}