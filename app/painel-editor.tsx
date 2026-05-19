import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const receitas = [
  { id: 1, titulo: 'Brigadeiro Gourmet', emoji: '🍫', publicada: true },
  { id: 2, titulo: 'Bolo de Cenoura', emoji: '🥕', publicada: false },
  { id: 3, titulo: 'Pavê de Chocolate', emoji: '🍰', publicada: true },
  { id: 4, titulo: 'Trufa de Maracujá', emoji: '🍬', publicada: false },
  { id: 5, titulo: 'Cheesecake de Morango', emoji: '🍓', publicada: true },
];

export default function PainelEditor() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Painel do Editor</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>5</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>3</Text>
          <Text style={styles.statLabel}>Publicadas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>2</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      <Text style={styles.secao}>Gerenciar Receitas</Text>

      {receitas.map((receita) => (
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
            onPress={() => router.push('/editar-receita')}
          >
            <Text style={styles.botaoStatusTexto}>
              {receita.publicada ? 'Despublicar' : 'Publicar'}
            </Text>
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
  statsRow: {
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
  statBox: {
    alignItems: 'center',
  },
  statValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C2185B',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
    fontSize: 28,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
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
  botaoStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  botaoPublicar: {
    backgroundColor: '#C2185B',
  },
  botaoDespublicar: {
    backgroundColor: '#eee',
  },
  botaoStatusTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});