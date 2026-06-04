import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.10:3000';

async function getToken() {
  return await AsyncStorage.getItem('token');
}

async function request(method: string, path: string, body?: any) {
  const token = await getToken();
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
}

export const api = {
  // Auth
  cadastro: (dados: any) => request('POST', '/auth/cadastro', dados),
  login: (email: string, senha: string) => request('POST', '/auth/login', { email, senha }),

  // Receitas
  getReceitas: () => request('GET', '/receitas'),
  getReceita: (id: number) => request('GET', `/receitas/${id}`),
  criarReceita: (dados: any) => request('POST', '/receitas', dados),
  atualizarReceita: (id: number, dados: any) => request('PUT', `/receitas/${id}`, dados),
  deletarReceita: (id: number) => request('DELETE', `/receitas/${id}`),

  // Usuários
  getUsuarios: () => request('GET', '/usuarios'),
  getUsuario: (id: string) => request('GET', `/usuarios/${id}`),
  atualizarUsuario: (id: string, dados: any) => request('PUT', `/usuarios/${id}`, dados),
  deletarUsuario: (id: string) => request('DELETE', `/usuarios/${id}`),

  // Categorias
  getCategorias: () => request('GET', '/categorias'),
  criarCategoria: (dados: any) => request('POST', '/categorias', dados),
  deletarCategoria: (id: number) => request('DELETE', `/categorias/${id}`),
// Comentarios
  getComentarios: (receitaId: number) => request('GET', `/comentarios/receita/${receitaId}`),
  criarComentario: (dados: any) => request('POST', '/comentarios', dados),
  deletarComentario: (id: number) => request('DELETE', `/comentarios/${id}`),
  // Favoritos
  getFavoritos: (usuarioId: string) => request('GET', `/favoritos/usuario/${usuarioId}`),
  verificarFavorito: (usuarioId: string, receitaId: number) => request('GET', `/favoritos/verificar/${usuarioId}/${receitaId}`),
  adicionarFavorito: (usuarioId: string, receitaId: number) => request('POST', '/favoritos', { usuarioId, receitaId }),
  removerFavorito: (usuarioId: string, receitaId: number) => request('DELETE', `/favoritos/${usuarioId}/${receitaId}`),
};

export async function salvarToken(token: string) {
  await AsyncStorage.setItem('token', token);
}

export async function removerToken() {
  await AsyncStorage.removeItem('token');
}

export async function getUsuarioLogado() {
  const dados = await AsyncStorage.getItem('usuario');
  return dados ? JSON.parse(dados) : null;
}

export async function salvarUsuario(usuario: any) {
  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
}