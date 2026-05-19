import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const comentarios = [
  { id: 1, usuario: 'Carlos Silva', receita: 'Brigadeiro Gourmet', texto: 'Ficou incrível! Fiz em casa e todos amaram!', emoji: '👨' },
  { id: 2, usuario: 'Maria Santos', receita: 'Bolo de Cenoura', texto: 'Receita perfeita, muito fácil de fazer.', emoji: '👩' },
  { id: 3, usuario: 'João Costa', receita: 'Pavê de Chocolate', texto: 'Melhor pavê que já fiz na vida!', emoji: '👨‍🍳' },
  { id: 4, usuario: 'Ana Paula', receita: 'Cheesecake de Morango', texto: 'Ficou lindo e delicioso!', emoji: '👩‍🍳' },
];

export default function GerenciarComentarios() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gerenciar Comentários</Text>

      {comentarios.map((comentario) => (
        <View key={comentario.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>{comentario.emoji}</Text>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.cardUsuario}>{comentario.usuario}</Text>
              <Text style={styles.cardReceita}>em {comentario.receita}</Text>
            </View>
            <TouchableOpacity style={styles.botaoExcluir}>
              <Text style={styles.botaoExcluirTexto}>🗑️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardTexto}>{comentario.texto}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardUsuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardReceita: {
    fontSize: 12,
    color: '#C2185B',
    marginTop: 2,
  },
  cardTexto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoExcluirTexto: {
    fontSize: 20,
  },
});