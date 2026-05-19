import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Perfil() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.avatarBox}>
        <Text style={styles.avatar}>👩‍🍳</Text>
        <Text style={styles.nome}>Ana Paula</Text>
        <Text style={styles.email}>ana@email.com</Text>
        <Text style={styles.badge}>Confeiteira</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>12</Text>
          <Text style={styles.statLabel}>Receitas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>48</Text>
          <Text style={styles.statLabel}>Comentários</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValor}>4.8⭐</Text>
          <Text style={styles.statLabel}>Avaliação</Text>
        </View>
      </View>

      <Text style={styles.secao}>Minhas Receitas</Text>
      {[
        { titulo: 'Brigadeiro Gourmet', emoji: '🍫' },
        { titulo: 'Bolo de Cenoura', emoji: '🥕' },
        { titulo: 'Pavê de Chocolate', emoji: '🍰' },
      ].map((receita, i) => (
        <TouchableOpacity key={i} style={styles.card} onPress={() => router.push('/receita')}>
          <Text style={styles.cardEmoji}>{receita.emoji}</Text>
          <Text style={styles.cardTitulo}>{receita.titulo}</Text>
          <Text style={styles.cardSeta}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.botaoNova} onPress={() => router.push('/nova-receita')}>
        <Text style={styles.botaoNovaTexto}>+ Nova Receita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSair} onPress={() => router.push('/')}>
        <Text style={styles.botaoSairTexto}>Sair</Text>
      </TouchableOpacity>

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
  avatarBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    fontSize: 72,
    marginBottom: 8,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#F8BBD9',
    color: '#C2185B',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 18,
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
  cardTitulo: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  cardSeta: {
    fontSize: 24,
    color: '#ccc',
  },
  botaoNova: {
    backgroundColor: '#C2185B',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  botaoNovaTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSair: {
    borderWidth: 2,
    borderColor: '#C2185B',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  botaoSairTexto: {
    color: '#C2185B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});