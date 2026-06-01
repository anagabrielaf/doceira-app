import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function Categorias() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoReceitas, setCarregandoReceitas] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      const data = await api.getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
    setCarregando(false);
  }

  async function filtrarPorCategoria(categoriaId: number) {
    setCategoriaSelecionada(categoriaId);
    setCarregandoReceitas(true);
    try {
      const data = await api.getReceitas();
      const filtradas = Array.isArray(data)
        ? data.filter((r: any) => r.categoriaId === categoriaId)
        : [];
      setReceitas(filtradas);
    } catch (error) {
      setReceitas([]);
    }
    setCarregandoReceitas(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Categorias</Text>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoriaBtn, categoriaSelecionada === cat.id && styles.categoriaBtnSelecionado]}
                onPress={() => filtrarPorCategoria(cat.id)}
              >
                <Text style={styles.categoriaEmoji}>{cat.emoji}</Text>
                <Text style={[styles.categoriaTexto, categoriaSelecionada === cat.id && styles.categoriaTextoSelecionado]}>
                  {cat.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {carregandoReceitas ? (
            <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
          ) : categoriaSelecionada === null ? (
            <Text style={styles.dica}>👆 Selecione uma categoria para ver as receitas</Text>
          ) : receitas.length === 0 ? (
            <Text style={styles.semReceitas}>Nenhuma receita nesta categoria ainda.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.receitasList}>
              {receitas.map((receita) => (
                <TouchableOpacity
                  key={receita.id}
                  style={styles.card}
                  onPress={() => router.push({ pathname: '/receita', params: { id: receita.id } })}
                >
                  <Text style={styles.cardEmoji}>{receita.emoji}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitulo}>{receita.titulo}</Text>
                    <Text style={styles.cardCategoria}>{receita.tempo} · {receita.dificuldade}</Text>
                  </View>
                  <Text style={styles.cardSeta}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  categoriasScroll: { marginBottom: 24, flexGrow: 0 },
  categoriaBtn: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginRight: 10, borderWidth: 1.5, borderColor: '#F8BBD9', minWidth: 80 },
  categoriaBtnSelecionado: { backgroundColor: '#C2185B', borderColor: '#C2185B' },
  categoriaEmoji: { fontSize: 28, marginBottom: 4 },
  categoriaTexto: { fontSize: 12, fontFamily: fonts.bold, color: '#555' },
  categoriaTextoSelecionado: { color: '#fff' },
  dica: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  semReceitas: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  receitasList: { flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9' },
  cardEmoji: { fontSize: 36, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontFamily: fonts.bold, color: '#333' },
  cardCategoria: { fontSize: 13, color: '#C2185B', marginTop: 4, fontFamily: fonts.regular, fontStyle: 'italic' },
  cardSeta: { fontSize: 24, color: '#F8BBD9' },
});