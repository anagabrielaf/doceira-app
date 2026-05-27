import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Perfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: perfilData } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: receitasData } = await supabase
      .from('receitas')
      .select('*')
      .eq('autor_id', user.id);

    setPerfil(perfilData);
    setReceitas(receitasData || []);
    setCarregando(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#C2185B" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.avatarBox}>
        <Text style={styles.avatar}>👩‍🍳</Text>
        <Text style={styles.nome}>{perfil?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{perfil?.email}</Text>
        <Text style={styles.badge}>{perfil?.tipo || 'Leitor'}</Text>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => router.push('/editar-conta')}>
          <Text style={styles.botaoEditarTexto}>✏️ Editar Conta</Text>
        </TouchableOpacity>
      </View>

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

      <Text style={styles.secao}>Minhas Receitas</Text>

      {receitas.length === 0 ? (
        <Text style={styles.semReceitas}>Você ainda não tem receitas. Crie uma!</Text>
      ) : (
        receitas.map((receita) => (
          <TouchableOpacity key={receita.id} style={styles.card} onPress={() => router.push({ pathname: '/receita', params: { id: receita.id } })}>
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

      <TouchableOpacity style={styles.botaoEditor} onPress={() => router.push('/painel-editor')}>
        <Text style={styles.botaoEditorTexto}>📋 Painel do Editor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoDashboard} onPress={() => router.push('/dashboard')}>
        <Text style={styles.botaoDashboardTexto}>📊 Dashboard Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoNova} onPress={() => router.push('/nova-receita')}>
        <Text style={styles.botaoNovaTexto}>+ Nova Receita</Text>
      </TouchableOpacity>

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
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  avatarBox: { alignItems: 'center', marginBottom: 24 },
  avatar: { fontSize: 72, marginBottom: 8 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#888', marginBottom: 8 },
  badge: { backgroundColor: '#F8BBD9', color: '#C2185B', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  botaoEditar: { borderWidth: 1.5, borderColor: '#C2185B', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  botaoEditarTexto: { color: '#C2185B', fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statBox: { alignItems: 'center' },
  statValor: { fontSize: 18, fontWeight: 'bold', color: '#C2185B' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  secao: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  semReceitas: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardEmoji: { fontSize: 28, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '600', color: '#333' },
  cardStatus: { fontSize: 12, marginTop: 4 },
  publicada: { color: '#4CAF50' },
  pendente: { color: '#FF9800' },
  cardSeta: { fontSize: 24, color: '#ccc' },
  botaoEditorTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoEditor: { backgroundColor: '#7B1FA2', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoDashboard: { backgroundColor: '#1565C0', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoDashboardTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoNova: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  botaoNovaTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoSair: { borderWidth: 2, borderColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  botaoSairTexto: { color: '#C2185B', fontSize: 16, fontWeight: 'bold' },
});