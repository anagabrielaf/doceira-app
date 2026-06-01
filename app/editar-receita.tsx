import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function EditarReceita() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [titulo, setTitulo] = useState('');
  const [tempo, setTempo] = useState('');
  const [porcoes, setPorcoes] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [ingredientes, setIngredientes] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const dificuldades = ['Fácil', 'Médio', 'Difícil'];

  useEffect(() => {
    if (id) carregarReceita();
  }, [id]);

  async function carregarReceita() {
    try {
      const data = await api.getReceita(Number(id));
      if (data) {
        setTitulo(data.titulo || '');
        setTempo(data.tempo || '');
        setPorcoes(data.porcoes?.toString() || '');
        setDificuldade(data.dificuldade || 'Fácil');
        setIngredientes(data.ingredientes || '');
        setModoPreparo(data.modoPreparo || '');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a receita!');
    }
    setCarregando(false);
  }

  async function salvarReceita() {
    if (!titulo || !ingredientes || !modoPreparo) {
      Alert.alert('Atenção', 'Preencha pelo menos o nome, ingredientes e modo de preparo!');
      return;
    }
    setSalvando(true);
    try {
      await api.atualizarReceita(Number(id), {
        titulo, tempo, porcoes: parseInt(porcoes) || 0,
        dificuldade, ingredientes, modoPreparo,
      });
      Alert.alert('Sucesso!', 'Receita atualizada!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a receita!');
    }
    setSalvando(false);
  }

  async function excluirReceita() {
    Alert.alert('Confirmar', 'Deseja excluir esta receita?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await api.deletarReceita(Number(id));
            router.push('/perfil');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a receita!');
          }
        }
      }
    ]);
  }

  if (carregando) {
    return <View style={styles.loading}><ActivityIndicator color="#C2185B" size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Editar Receita</Text>

      <Text style={styles.label}>Nome da receita</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholderTextColor="#aaa" />

      <Text style={styles.label}>Tempo de preparo</Text>
      <TextInput style={styles.input} value={tempo} onChangeText={setTempo} placeholderTextColor="#aaa" />

      <Text style={styles.label}>Porções</Text>
      <TextInput style={styles.input} value={porcoes} onChangeText={setPorcoes} keyboardType="numeric" placeholderTextColor="#aaa" />

      <Text style={styles.label}>Dificuldade</Text>
      <View style={styles.dificuldadeRow}>
        {dificuldades.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.dificuldadeBtn, dificuldade === d && styles.dificuldadeBtnSelecionado]}
            onPress={() => setDificuldade(d)}
          >
            <Text style={[styles.dificuldadeBtnTexto, dificuldade === d && styles.dificuldadeBtnTextoSelecionado]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput style={[styles.input, styles.inputGrande]} value={ingredientes} onChangeText={setIngredientes} multiline placeholderTextColor="#aaa" />

      <Text style={styles.label}>Modo de preparo</Text>
      <TextInput style={[styles.input, styles.inputGrande]} value={modoPreparo} onChangeText={setModoPreparo} multiline placeholderTextColor="#aaa" />

      <TouchableOpacity style={styles.botao} onPress={salvarReceita} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Alterações</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoExcluir} onPress={excluirReceita}>
        <Text style={styles.botaoExcluirTexto}>🗑️ Excluir Receita</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F7' },
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', marginBottom: 24, fontFamily: fonts.cursiva },
  label: { fontSize: 14, color: '#555', marginBottom: 6, fontFamily: fonts.bold },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', marginBottom: 16, fontFamily: fonts.regular },
  inputGrande: { height: 120, textAlignVertical: 'top' },
  dificuldadeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  dificuldadeBtn: { flex: 1, borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  dificuldadeBtnSelecionado: { backgroundColor: '#C2185B', borderColor: '#C2185B' },
  dificuldadeBtnTexto: { fontSize: 14, fontFamily: fonts.bold, color: '#555' },
  dificuldadeBtnTextoSelecionado: { color: '#fff' },
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  botaoTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  botaoExcluir: { borderWidth: 2, borderColor: '#e53935', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  botaoExcluirTexto: { color: '#e53935', fontSize: 16, fontFamily: fonts.bold },
});