import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Busca() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [buscou, setBuscou] = useState(false);

  async function buscarReceitas() {
    if (!busca.trim()) return;
    setCarregando(true);
    setBuscou(true);
    const { data } = await supabase
      .from('receitas')
      .select('*')
      .eq('publicada', true)
      .ilike('titulo', `%${busca}%`);
    setReceitas(data || []);
    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>🔍 Buscar Receitas</Text>

      <View style={styles.buscaBox}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da receita..."
          placeholderTextColor="#aaa"
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={buscarReceitas}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.botaoBuscar} onPress={buscarReceitas}>
          <Text style={styles.botaoBuscarTexto}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : buscou && receitas.length === 0 ? (
        <Text style={styles.semResultados}>Nenhuma receita encontrada para "{busca}"</Text>
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
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#C2185B', marginBottom: 24 },
  buscaBox: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  botaoBuscar: { backgroundColor: '#C2185B', paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center' },
  botaoBuscarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  semResultados: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardEmoji: { fontSize: 36, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardCategoria: { fontSize: 13, color: '#C2185B', marginTop: 4 },
  cardSeta: { fontSize: 24, color: '#ccc' },
});