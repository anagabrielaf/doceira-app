import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Notificacoes() {
  const router = useRouter();
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function carregarNotificacoes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar receitas do usuário que foram publicadas recentemente
    const { data: receitasPublicadas } = await supabase
      .from('receitas')
      .select('*')
      .eq('autor_id', user.id)
      .eq('publicada', true)
      .order('created_at', { ascending: false });

    // Buscar comentários nas receitas do usuário
    const { data: minhasReceitas } = await supabase
      .from('receitas')
      .select('id, titulo')
      .eq('autor_id', user.id);

    const receitaIds = minhasReceitas?.map(r => r.id) || [];

    let comentariosRecentes: any[] = [];
    if (receitaIds.length > 0) {
      const { data: comentarios } = await supabase
        .from('comentarios')
        .select('*, perfis(nome), receitas(titulo)')
        .in('receita_id', receitaIds)
        .neq('usuario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      comentariosRecentes = comentarios || [];
    }

    const notifs = [
      ...(receitasPublicadas || []).map(r => ({
        id: `pub_${r.id}`,
        tipo: 'publicacao',
        titulo: '✅ Receita publicada!',
        mensagem: `Sua receita "${r.titulo}" foi publicada com sucesso!`,
        data: r.created_at,
      })),
      ...comentariosRecentes.map(c => ({
        id: `com_${c.id}`,
        tipo: 'comentario',
        titulo: '💬 Novo comentário!',
        mensagem: `${c.perfis?.nome} comentou em "${c.receitas?.titulo}"`,
        data: c.created_at,
        receitaId: c.receita_id,
      })),
    ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    setNotificacoes(notifs);
    setCarregando(false);
  }

  function formatarData(data: string) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>🔔 Notificações</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : notificacoes.length === 0 ? (
        <Text style={styles.semNotificacoes}>Nenhuma notificação por enquanto!</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notificacoes.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.card, notif.tipo === 'publicacao' ? styles.cardPublicacao : styles.cardComentario]}
              onPress={() => notif.receitaId && router.push({ pathname: '/receita', params: { id: notif.receitaId } })}
            >
              <Text style={styles.cardTitulo}>{notif.titulo}</Text>
              <Text style={styles.cardMensagem}>{notif.mensagem}</Text>
              <Text style={styles.cardData}>{formatarData(notif.data)}</Text>
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
  semNotificacoes: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40 },
  card: { borderRadius: 16, padding: 16, marginBottom: 12 },
  cardPublicacao: { backgroundColor: '#E8F5E9' },
  cardComentario: { backgroundColor: '#FFF3E0' },
  cardTitulo: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardMensagem: { fontSize: 14, color: '#555', marginBottom: 8 },
  cardData: { fontSize: 12, color: '#888' },
});