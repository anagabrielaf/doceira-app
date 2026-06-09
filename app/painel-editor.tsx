import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function PainelEditor() {
  const router = useRouter();
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarReceitas();
  }, []);

  async function carregarReceitas() {
    try {
      const data = await api.getTodasReceitas();
      setReceitas(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as receitas!');
    }
    setCarregando(false);
  }

  async function togglePublicar(receita: any) {
    try {
      await api.atualizarReceita(receita.id, { publicada: !receita.publicada });
      carregarReceitas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a receita!');
    }
  }

  const publicadas = receitas.filter(r => r.publicada).length;
  const pendentes = receitas.filter(r => !r.publicada).length;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Aprovar Receitas</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>{receitas.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>{publicadas}</Text>
          <Text style={styles.statLabel}>Publicadas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>{pendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
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
            <TouchableOpacity
              style={[styles.botaoStatus, receita.publicada ? styles.botaoDespublicar : styles.botaoPublicar]}
              onPress={() => togglePublicar(receita)}
            >
              <Text style={[styles.botaoStatusTexto, { color: receita.publicada ? '#333' : '#fff' }]}>
                {receita.publicada ? 'Despublicar' : 'Publicar'}
              </Text>
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
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F8BBD9' },
  statBox: { alignItems: 'center' },
  statValor: { fontSize: 22, color: '#C2185B', fontFamily: fonts.bold },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4, fontFamily: fonts.regular },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9' },
  cardEmoji: { fontSize: 28, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontFamily: fonts.bold, color: '#333' },
  cardStatus: { fontSize: 12, marginTop: 4, fontFamily: fonts.regular },
  publicada: { color: '#4CAF50' },
  pendente: { color: '#FF9800' },
  botaoStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  botaoPublicar: { backgroundColor: '#C2185B' },
  botaoDespublicar: { backgroundColor: '#eee' },
  botaoStatusTexto: { fontSize: 12, fontFamily: fonts.bold },
});