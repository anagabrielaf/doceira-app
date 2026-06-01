import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api, getUsuarioLogado } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function Favoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    try {
      const usuario = await getUsuarioLogado();
      if (!usuario) return;
      const data = await api.getReceitas();
      setFavoritos(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Meus Favoritos</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : favoritos.length === 0 ? (
        <Text style={styles.semFavoritos}>Você ainda não tem receitas favoritas!</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {favoritos.map((receita) => (
            <TouchableOpacity
              key={receita.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/receita', params: { id: receita.id } })}
            >
              <Text style={styles.cardEmoji}>{receita.emoji}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{receita.titulo}</Text>
                <Text style={styles.cardCategoria}>{receita.tempo} · {receita.dificuldade}</Text>
              </View>
              <Text style={styles.cardSeta}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  semFavoritos: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9' },
  cardEmoji: { fontSize: 36, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontFamily: fonts.bold, color: '#333' },
  cardCategoria: { fontSize: 13, color: '#C2185B', marginTop: 4, fontFamily: fonts.regular, fontStyle: 'italic' },
  cardSeta: { fontSize: 24, color: '#F8BBD9' },
});