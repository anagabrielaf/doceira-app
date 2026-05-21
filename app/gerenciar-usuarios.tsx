import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function GerenciarUsuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) Alert.alert('Erro', error.message);
    if (data) setUsuarios(data);
    setCarregando(false);
  }

  async function excluirUsuario(id: string) {
    Alert.alert('Confirmar', 'Deseja excluir este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('perfis').delete().eq('id', id);
          if (error) Alert.alert('Erro', error.message);
          else carregarUsuarios();
        }
      }
    ]);
  }

  const emojis: any = { leitor: '👤', confeiteira: '👩‍🍳', confeiteiro: '👨‍🍳', editor: '📋', admin: '⚙️' };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gerenciar Usuários</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : usuarios.length === 0 ? (
        <Text style={styles.semDados}>Nenhum usuário encontrado.</Text>
      ) : (
        usuarios.map((usuario) => (
          <View key={usuario.id} style={styles.card}>
            <Text style={styles.cardEmoji}>{emojis[usuario.tipo] || '👤'}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{usuario.nome}</Text>
              <Text style={styles.cardEmail}>{usuario.email}</Text>
              <Text style={styles.cardPerfil}>{usuario.tipo}</Text>
            </View>
            <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirUsuario(usuario.id)}>
              <Text style={styles.botaoExcluirTexto}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#C2185B', marginBottom: 24 },
  semDados: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardEmoji: { fontSize: 32, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  cardEmail: { fontSize: 12, color: '#888', marginTop: 2 },
  cardPerfil: { fontSize: 12, color: '#C2185B', marginTop: 2 },
  botaoExcluir: { padding: 8 },
  botaoExcluirTexto: { fontSize: 20 },
});