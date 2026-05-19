import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Receita() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [receita, setReceita] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarReceita();
  }, [id]);

  async function carregarReceita() {
    const { data, error } = await supabase
      .from('receitas')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) setReceita(data);
    setCarregando(false);
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#C2185B" size="large" />
      </View>
    );
  }

  if (!receita) {
    return (
      <View style={styles.loading}>
        <Text>Receita não encontrada.</Text>
      </View>
    );
  }

  const ingredientes = receita.ingredientes?.split('\n') || [];
  const passos = receita.modo_preparo?.split('.').filter((p: string) => p.trim()) || [];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>{receita.emoji}</Text>
      <Text style={styles.titulo}>{receita.titulo}</Text>
      <Text style={styles.categoria}>🏷️ {receita.dificuldade}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoValor}>{receita.tempo}</Text>
          <Text style={styles.infoLabel}>Tempo</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoValor}>{receita.porcoes}</Text>
          <Text style={styles.infoLabel}>Porções</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoValor}>{receita.dificuldade}</Text>
          <Text style={styles.infoLabel}>Dificuldade</Text>
        </View>
      </View>

      <Text style={styles.secao}>Ingredientes</Text>
      {ingredientes.map((item: string, i: number) => (
        <Text key={i} style={styles.item}>• {item}</Text>
      ))}

      <Text style={styles.secao}>Modo de preparo</Text>
      {passos.map((passo: string, i: number) => (
        <View key={i} style={styles.passoBox}>
          <Text style={styles.passoNum}>{i + 1}</Text>
          <Text style={styles.passoTexto}>{passo.trim()}.</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.botaoComentario}>
        <Text style={styles.botaoComentarioTexto}>💬 Comentar</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F7',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    padding: 24,
    paddingTop: 60,
  },
  voltar: {
    marginBottom: 16,
  },
  voltarTexto: {
    color: '#C2185B',
    fontSize: 16,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  categoria: {
    fontSize: 14,
    color: '#C2185B',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C2185B',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  item: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
  passoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  passoNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C2185B',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    fontSize: 14,
  },
  passoTexto: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  botaoComentario: {
    borderWidth: 2,
    borderColor: '#C2185B',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoComentarioTexto: {
    color: '#C2185B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});