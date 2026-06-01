import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function GerenciarReceitas() {
  const router = useRouter();
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarReceitas();
  }, []);

  async function carregarReceitas() {
    try {
      const data = await api.getReceitas();
      setReceitas(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as receitas!');
    }
    setCarregando(false);
  }

  async function excluirReceita(id: number) {
    Alert.alert('Confirmar', 'Deseja excluir esta receita?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.deletarReceita(id);
            carregarReceitas();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a receita!');
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

      <Text style={styles.titulo}>Gerenciar Receitas</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : receitas.length === 0 ? (
        <Text style={styles.semDados}>Nenhuma receita encontrada.</Text>
      ) : (
        receitas.map((receita) => (
          <View key={receita.id} style={styles.card}>
            <Text style={styles.cardEmoji}>{receita.emoji}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{receita.titulo}</Text>
              <Text style={[styles.cardStatus, receita.publicada ? styles.publicada : styles.pendente]}>
                {receita.publicada ? '✅ Publicada' : '⏳ Pendente'}
              </Text>
            </View>
            <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirReceita(receita.id)}>
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
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  semDados: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9' },
  cardEmoji: { fontSize: 32, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontFamily: fonts.bold, color: '#333' },
  cardStatus: { fontSize: 12, marginTop: 4, fontFamily: fonts.regular },
  publicada: { color: '#4CAF50' },
  pendente: { color: '#FF9800' },
  botaoExcluir: { padding: 8 },
  botaoExcluirTexto: { fontSize: 20 },
});