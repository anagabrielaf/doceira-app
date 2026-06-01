import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function GerenciarCategorias() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novaCategoria, setNovaCategoria] = useState('');

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      const data = await api.getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias!');
    }
    setCarregando(false);
  }

  async function adicionarCategoria() {
    if (!novaCategoria.trim()) return;
    try {
      await api.criarCategoria({ nome: novaCategoria, emoji: '🍰' });
      setNovaCategoria('');
      carregarCategorias();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a categoria!');
    }
  }

  async function excluirCategoria(id: number) {
    Alert.alert('Confirmar', 'Deseja excluir esta categoria?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.deletarCategoria(id);
            carregarCategorias();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a categoria!');
          }
        }
      }
    ]);
  }

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
          value={novaCategoria}
          onChangeText={setNovaCategoria}
        />
        <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarCategoria}>
          <Text style={styles.botaoAdicionarTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator color="#C2185B" size="large" style={{ marginTop: 40 }} />
      ) : categorias.length === 0 ? (
        <Text style={styles.semDados}>Nenhuma categoria encontrada.</Text>
      ) : (
        categorias.map((categoria) => (
          <View key={categoria.id} style={styles.card}>
            <Text style={styles.cardEmoji}>{categoria.emoji}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{categoria.nome}</Text>
            </View>
            <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirCategoria(categoria.id)}>
              <Text style={styles.botaoExcluirTexto}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  novaCategoria: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', fontFamily: fonts.regular },
  botaoAdicionar: { backgroundColor: '#C2185B', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  botaoAdicionarTexto: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  semDados: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 40, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8BBD9' },
  cardEmoji: { fontSize: 32, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 15, fontFamily: fonts.bold, color: '#333' },
  botaoExcluir: { padding: 8 },
  botaoExcluirTexto: { fontSize: 20 },
});