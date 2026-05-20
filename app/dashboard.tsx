import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ usuarios: 0, receitas: 0, comentarios: 0, categorias: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarStats();
  }, []);

  async function carregarStats() {
    const [usuarios, receitas, comentarios, categorias] = await Promise.all([
      supabase.from('perfis').select('*', { count: 'exact', head: true }),
      supabase.from('receitas').select('*', { count: 'exact', head: true }),
      supabase.from('comentarios').select('*', { count: 'exact', head: true }),
      supabase.from('categorias').select('*', { count: 'exact', head: true }),
    ]);
    setStats({
      usuarios: usuarios.count || 0,
      receitas: receitas.count || 0,
      comentarios: comentarios.count || 0,
      categorias: categorias.count || 0,
    });
    setCarregando(false);
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Dashboard Admin</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValor}>{stats.usuarios}</Text>
            <Text style={styles.statLabel}>Usuários</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🧁</Text>
            <Text style={styles.statValor}>{stats.receitas}</Text>
            <Text style={styles.statLabel}>Receitas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>💬</Text>
            <Text style={styles.statValor}>{stats.comentarios}</Text>
            <Text style={styles.statLabel}>Comentários</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🏷️</Text>
            <Text style={styles.statValor}>{stats.categorias}</Text>
            <Text style={styles.statLabel}>Categorias</Text>
          </View>
        </View>
      )}

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
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#C2185B', marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '48%', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statEmoji: { fontSize: 28, marginBottom: 6 },
  statValor: { fontSize: 24, fontWeight: 'bold', color: '#C2185B' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  secao: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardEmoji: { fontSize: 28, marginRight: 12 },
  cardTitulo: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  cardSeta: { fontSize: 24, color: '#ccc' },
});