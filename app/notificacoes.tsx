import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api, getUsuarioLogado } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function Notificacoes() {
  const router = useRouter();
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function carregarNotificacoes() {
    try {
      const usuario = await getUsuarioLogado();
      if (!usuario) return;

      const receitas = await api.getReceitas();
      const minhasReceitas = Array.isArray(receitas)
        ? receitas.filter((r: any) => r.autorId === usuario.id)
        : [];

      const notifs = minhasReceitas.map((r: any) => ({
        id: `pub_${r.id}`,
        tipo: 'publicacao',
        titulo: r.publicada ? '✅ Receita publicada!' : '⏳ Receita pendente',
        mensagem: r.publicada
          ? `Sua receita "${r.titulo}" foi publicada!`
          : `Sua receita "${r.titulo}" está aguardando aprovação.`,
        data: r.createdAt,
        receitaId: r.id,
      }));

      setNotificacoes(notifs);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
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

      <Text style={styles.titulo}>Notificações</Text>

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
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  semNotificacoes: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F8BBD9' },
  cardPublicacao: { backgroundColor: '#E8F5E9' },
  cardComentario: { backgroundColor: '#FFF3E0' },
  cardTitulo: { fontSize: 15, color: '#333', marginBottom: 4, fontFamily: fonts.bold },
  cardMensagem: { fontSize: 14, color: '#555', marginBottom: 8, fontFamily: fonts.regular },
  cardData: { fontSize: 12, color: '#888', fontFamily: fonts.regular, fontStyle: 'italic' },
});