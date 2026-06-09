import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../lib/AuthContext';
import { api, removerToken, getUsuarioLogado } from '../lib/api';
import { fonts } from '../lib/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
  const router = useRouter();
  const { perfil: authPerfil, isConfeiteira, isAdmin, recarregar } = useAuth();
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const usuario = await getUsuarioLogado();
      if (usuario?.id) {
        const data = await api.getReceitasAutor(usuario.id);
        setReceitas(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
    setCarregando(false);
  }

  async function sair() {
    await removerToken();
    await AsyncStorage.removeItem('usuario');
    recarregar();
    router.push('/');
  }

  if (carregando) {
    return <View style={styles.loading}><ActivityIndicator color="#C2185B" size="large" /></View>;
  }

  const tipoLabel: any = {
    leitor: '👤 Leitor',
    confeiteira: '👩‍🍳 Confeiteira',
    admin: '⚙️ Admin',
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.avatarBox}>
        <Text style={styles.avatar}>
          {authPerfil?.tipo === 'admin' ? '⚙️' : authPerfil?.tipo === 'confeiteira' ? '👩‍🍳' : '👤'}
        </Text>
        <Text style={styles.nome}>{authPerfil?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{authPerfil?.email}</Text>
        <Text style={styles.badge}>{tipoLabel[authPerfil?.tipo || 'leitor']}</Text>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => router.push('/editar-conta')}>
          <Text style={styles.botaoEditarTexto}>✏️ Editar Conta</Text>
        </TouchableOpacity>
      </View>

      {(isConfeiteira || isAdmin) && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValor}>{receitas.length}</Text>
            <Text style={styles.statLabel}>Receitas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValor}>{receitas.filter(r => r.publicada).length}</Text>
            <Text style={styles.statLabel}>Publicadas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValor}>{receitas.filter(r => !r.publicada).length}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </View>
      )}

      {(isConfeiteira || isAdmin) && (
        <>
          <Text style={styles.secao}>Minhas Receitas</Text>
          {receitas.length === 0 ? (
            <Text style={styles.semReceitas}>Você ainda não tem receitas. Crie uma!</Text>
          ) : (
            receitas.map((receita) => (
              <TouchableOpacity key={receita.id} style={styles.card} onPress={() => router.push({ pathname: '/editar-receita', params: { id: receita.id } })}>
                <Text style={styles.cardEmoji}>{receita.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitulo}>{receita.titulo}</Text>
                  <Text style={[styles.cardStatus, receita.publicada ? styles.publicada : styles.pendente]}>
                    {receita.publicada ? '✅ Publicada' : '⏳ Pendente'}
                  </Text>
                </View>
                <Text style={styles.cardSeta}>›</Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity style={styles.botaoNova} onPress={() => router.push('/nova-receita')}>
            <Text style={styles.botaoNovaTexto}>+ Nova Receita</Text>
          </TouchableOpacity>
        </>
      )}

      {isAdmin && (
        <>
          <TouchableOpacity style={styles.botaoAdmin} onPress={() => router.push('/painel-editor')}>
            <Text style={styles.botaoAdminTexto}>📋 Aprovar Receitas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoDashboard} onPress={() => router.push('/dashboard')}>
            <Text style={styles.botaoDashboardTexto}>📊 Dashboard</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.botaoSairTexto}>Sair</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F7' },
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  avatarBox: { alignItems: 'center', marginBottom: 24 },
  avatar: { fontSize: 72, marginBottom: 8 },
  nome: { fontSize: 28, color: '#333', fontFamily: fonts.cursiva },
  email: { fontSize: 14, color: '#888', marginBottom: 8, fontFamily: fonts.regular },
  badge: { backgroundColor: '#F8BBD9', color: '#C2185B', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, fontSize: 13, fontFamily: fonts.bold, marginBottom: 12 },
  botaoEditar: { borderWidth: 1.5, borderColor: '#C2185B', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  botaoEditarTexto: { color: '#C2185B', fontSize: 14, fontFamily: fonts.bold },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F8BBD9' },
  statBox: { alignItems: 'center' },
  statValor: { fontSize: 18, color: '#C2185B', fontFamily: fonts.bold },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4, fontFamily: fonts.regular },
  secao: { fontSize: 22, color: '#C2185B', marginBottom: 12, fontFamily: fonts.cursiva },
  semReceitas: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 16, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9' },
  cardEmoji: { fontSize: 28, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontFamily: fonts.bold, color: '#333' },
  cardStatus: { fontSize: 12, marginTop: 4, fontFamily: fonts.regular },
  publicada: { color: '#4CAF50' },
  pendente: { color: '#FF9800' },
  cardSeta: { fontSize: 24, color: '#F8BBD9' },
  botaoNova: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoNovaTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  botaoAdmin: { backgroundColor: '#7B1FA2', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoAdminTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  botaoDashboard: { backgroundColor: '#1565C0', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoDashboardTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  botaoSair: { borderWidth: 2, borderColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoSairTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.bold },
});