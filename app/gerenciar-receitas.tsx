import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const receitas = [
  { id: 1, titulo: 'Brigadeiro Gourmet', autor: 'Ana Paula', emoji: '🍫', publicada: true },
  { id: 2, titulo: 'Bolo de Cenoura', autor: 'João Costa', emoji: '🥕', publicada: false },
  { id: 3, titulo: 'Pavê de Chocolate', autor: 'Ana Paula', emoji: '🍰', publicada: true },
  { id: 4, titulo: 'Trufa de Maracujá', autor: 'Maria Santos', emoji: '🍬', publicada: false },
  { id: 5, titulo: 'Cheesecake de Morango', autor: 'João Costa', emoji: '🍓', publicada: true },
];

export default function GerenciarReceitas() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gerenciar Receitas</Text>

      {receitas.map((receita) => (
        <View key={receita.id} style={styles.card}>
          <Text style={styles.cardEmoji}>{receita.emoji}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitulo}>{receita.titulo}</Text>
            <Text style={styles.cardAutor}>por {receita.autor}</Text>
            <Text style={[styles.cardStatus, receita.publicada ? styles.publicada : styles.pendente]}>
              {receita.publicada ? '✅ Publicada' : '⏳ Pendente'}
            </Text>
          </View>
          <TouchableOpacity style={styles.botaoExcluir}>
            <Text style={styles.botaoExcluirTexto}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 24,
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
    fontSize: 32,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  cardAutor: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardStatus: {
    fontSize: 12,
    marginTop: 4,
  },
  publicada: {
    color: '#4CAF50',
  },
  pendente: {
    color: '#FF9800',
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoExcluirTexto: {
    fontSize: 20,
  },
});