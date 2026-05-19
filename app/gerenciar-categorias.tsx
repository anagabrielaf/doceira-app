import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const categorias = [
  { id: 1, nome: 'Bolos', emoji: '🎂', total: 12 },
  { id: 2, nome: 'Bombons', emoji: '🍫', total: 8 },
  { id: 3, nome: 'Tortas', emoji: '🥧', total: 6 },
  { id: 4, nome: 'Sobremesas', emoji: '🍰', total: 15 },
  { id: 5, nome: 'Cookies', emoji: '🍪', total: 9 },
  { id: 6, nome: 'Doces Típicos', emoji: '🍬', total: 14 },
];

export default function GerenciarCategorias() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gerenciar Categorias</Text>

      <View style={styles.novaCategoria}>
        <TextInput
          style={styles.input}
          placeholder="Nova categoria..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.botaoAdicionar}>
          <Text style={styles.botaoAdicionarTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {categorias.map((categoria) => (
        <View key={categoria.id} style={styles.card}>
          <Text style={styles.cardEmoji}>{categoria.emoji}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>{categoria.nome}</Text>
            <Text style={styles.cardTotal}>{categoria.total} receitas</Text>
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
  novaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#F8BBD9',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
  },
  botaoAdicionar: {
    backgroundColor: '#C2185B',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAdicionarTexto: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
  cardNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTotal: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoExcluirTexto: {
    fontSize: 20,
  },
});