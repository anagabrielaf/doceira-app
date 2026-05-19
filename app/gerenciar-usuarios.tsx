import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const usuarios = [
  { id: 1, nome: 'Ana Paula', email: 'ana@email.com', perfil: 'Confeiteira', emoji: '👩‍🍳' },
  { id: 2, nome: 'Carlos Silva', email: 'carlos@email.com', perfil: 'Leitor', emoji: '👨' },
  { id: 3, nome: 'Maria Santos', email: 'maria@email.com', perfil: 'Editora', emoji: '👩' },
  { id: 4, nome: 'João Costa', email: 'joao@email.com', perfil: 'Confeiteiro', emoji: '👨‍🍳' },
];

export default function GerenciarUsuarios() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Gerenciar Usuários</Text>

      {usuarios.map((usuario) => (
        <View key={usuario.id} style={styles.card}>
          <Text style={styles.cardEmoji}>{usuario.emoji}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>{usuario.nome}</Text>
            <Text style={styles.cardEmail}>{usuario.email}</Text>
            <Text style={styles.cardPerfil}>{usuario.perfil}</Text>
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
  cardNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  cardEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardPerfil: {
    fontSize: 12,
    color: '#C2185B',
    marginTop: 2,
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoExcluirTexto: {
    fontSize: 20,
  },
});