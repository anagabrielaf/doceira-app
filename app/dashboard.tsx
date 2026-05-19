import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Dashboard Admin</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>👥</Text>
          <Text style={styles.statValor}>128</Text>
          <Text style={styles.statLabel}>Usuários</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>🧁</Text>
          <Text style={styles.statValor}>64</Text>
          <Text style={styles.statLabel}>Receitas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>💬</Text>
          <Text style={styles.statValor}>312</Text>
          <Text style={styles.statLabel}>Comentários</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>🏷️</Text>
          <Text style={styles.statValor}>18</Text>
          <Text style={styles.statLabel}>Categorias</Text>
        </View>
      </View>

      <Text style={styles.secao}>Gerenciar</Text>

      {[
        { titulo: 'Usuários', emoji: '👥', rota: '/gerenciar-usuarios' },
        { titulo: 'Receitas', emoji: '🧁', rota: '/gerenciar-receitas' },
        { titulo: 'Comentários', emoji: '💬', rota: '/gerenciar-comentarios' },
        { titulo: 'Categorias', emoji: '🏷️', rota: '/gerenciar-categorias' },
      ].map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() => router.push(item.rota as any)}
        >
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <Text style={styles.cardSeta}>›</Text>
        </TouchableOpacity>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  statValor: {
    fontSize: 24,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSeta: {
    fontSize: 24,
    color: '#ccc',
  },
});