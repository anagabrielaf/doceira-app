import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function Home() {
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
      console.error('Erro ao carregar receitas:', error);
    }
    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Doceira</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/busca')} style={styles.iconBtn}>
            <Text style={styles.iconTexto}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notificacoes')} style={styles.iconBtn}>
            <Text style={styles.iconTexto}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/favoritos')} style={styles.iconBtn}>
            <Text style={styles.iconTexto}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.iconBtn}>
            <Text style={styles.iconTexto}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.atalhos}>
        {[
          { emoji: '🏷️', label: 'Categorias', rota: '/categorias' },
          { emoji: '🛒', label: 'Compras', rota: '/lista-compras' },
          { emoji: '🧮', label: 'Conversor', rota: '/conversor' },
          { emoji: '❤️', label: 'Favoritos', rota: '/favoritos' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.atalhoBtn} onPress={() => router.push(item.rota as any)}>
            <View style={styles.atalhoCirculo}>
              <Text style={styles.atalhoEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.atalhoTexto}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitulo}>~ Receitas em Destaque ~</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {receitas.map((receita) => (
            <TouchableOpacity
              key={receita.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/receita', params: { id: receita.id } })}
            >
              <Text style={styles.cardEmoji}>{receita.emoji}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{receita.titulo}</Text>
                <Text style={styles.cardCategoria}>⏱ {receita.tempo} · {receita.dificuldade}</Text>
              </View>
              <Text style={styles.cardSeta}>›</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitulo: { fontSize: 36, color: '#C2185B', fontFamily: fonts.cursiva },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 4 },
  iconTexto: { fontSize: 22 },
  atalhos: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  atalhoBtn: { alignItems: 'center', flex: 1 },
  atalhoCirculo: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: '#C2185B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  atalhoEmoji: { fontSize: 28 },
  atalhoTexto: { fontSize: 11, fontFamily: fonts.bold, color: '#7A7A7A', textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#C2185B', textAlign: 'center', fontFamily: fonts.cursiva, marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardEmoji: { fontSize: 36, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontFamily: fonts.bold, color: '#333' },
  cardCategoria: { fontSize: 12, color: '#C2185B', marginTop: 4, fontFamily: fonts.regular, fontStyle: 'italic' },
  cardSeta: { fontSize: 24, color: '#F8BBD9' },
});