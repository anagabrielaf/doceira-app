import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function GerenciarComentarios() {
  const router = useRouter();
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarComentarios();
  }, []);

  async function carregarComentarios() {
    try {
      const data = await api.getTodosComentarios();
      setComentarios(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os comentários!');
    }
    setCarregando(false);
  }

  async function excluirComentario(id: number) {
    Alert.alert('Confirmar', 'Deseja excluir este comentário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.deletarComentario(id);
            carregarComentarios();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o comentário!');
          }
        }
      }
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gerenciar Comentários</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : comentarios.length === 0 ? (
        <Text style={styles.semDados}>Nenhum comentário encontrado.</Text>
      ) : (
        comentarios.map((comentario) => (
          <View key={comentario.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>💬</Text>
              <View style={styles.cardHeaderInfo}>
                <Text style={styles.cardUsuario}>{comentario.autorNome || 'Usuário'}</Text>
                <Text style={styles.cardReceita}>Receita #{comentario.receitaId}</Text>
              </View>
              <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirComentario(comentario.id)}>
                <Text style={styles.botaoExcluirTexto}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardTexto}>{comentario.texto}</Text>
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
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  semDados: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F8BBD9' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardEmoji: { fontSize: 28, marginRight: 10 },
  cardHeaderInfo: { flex: 1 },
  cardUsuario: { fontSize: 14, fontFamily: fonts.bold, color: '#333' },
  cardReceita: { fontSize: 12, color: '#C2185B', marginTop: 2, fontFamily: fonts.regular },
  cardTexto: { fontSize: 14, color: '#555', lineHeight: 20, fontFamily: fonts.regular },
  botaoExcluir: { padding: 8 },
  botaoExcluirTexto: { fontSize: 20 },
});