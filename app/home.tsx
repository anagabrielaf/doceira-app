import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Home() {
  const router = useRouter();
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarReceitas();
  }, []);

  async function carregarReceitas() {
    const { data, error } = await supabase
      .from('receitas')
      .select('*')
      .eq('publicada', true);
    if (!error && data) setReceitas(data);
    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>🧁 DoceiraBR</Text>
        <TouchableOpacity onPress={() => router.push('/perfil')}>
          <Text style={styles.headerPerfil}>👤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Receitas em destaque</Text>

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
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C2185B',
  },
  headerPerfil: {
    fontSize: 28,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCategoria: {
    fontSize: 13,
    color: '#C2185B',
    marginTop: 4,
  },
  cardSeta: {
    fontSize: 24,
    color: '#ccc',
  },
});