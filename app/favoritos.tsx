import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Favoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('favoritos')
      .select('*, receitas(*)')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false });

    setFavoritos(data || []);
    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>❤️ Meus Favoritos</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : favoritos.length === 0 ? (
        <Text style={styles.semFavoritos}>Você ainda não tem receitas favoritas!</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {favoritos.map((fav) => (
            <TouchableOpacity
              key={fav.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/receita', params: { id: fav.receita_id } })}
            >
              <Text style={styles.cardEmoji}>{fav.receitas?.emoji}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{fav.receitas?.titulo}</Text>
                <Text style={styles.cardCategoria}>{fav.receitas?.tempo} · {fav.receitas?.dificuldade}</Text>
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
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#C2185B', marginBottom: 24 },
  semFavoritos: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardEmoji: { fontSize: 36, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardCategoria: { fontSize: 13, color: '#C2185B', marginTop: 4 },
  cardSeta: { fontSize: 24, color: '#ccc' },
});