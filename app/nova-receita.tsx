import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api, getUsuarioLogado } from '../lib/api';
import { fonts } from '../lib/fonts';

export default function NovaReceita() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [tempo, setTempo] = useState('');
  const [porcoes, setPorcoes] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [ingredientes, setIngredientes] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const dificuldades = ['Fácil', 'Médio', 'Difícil'];

  async function publicarReceita() {
    if (!titulo || !ingredientes || !modoPreparo) {
      Alert.alert('Atenção', 'Preencha pelo menos o nome, ingredientes e modo de preparo!');
      return;
    }
    setCarregando(true);
    try {
      const usuario = await getUsuarioLogado();
      await api.criarReceita({
        titulo,
        tempo,
        porcoes: parseInt(porcoes) || 0,
        dificuldade,
        ingredientes,
        modoPreparo,
        emoji: '🍰',
        publicada: false,
        autorId: usuario?.id,
      });
      Alert.alert('Sucesso!', 'Receita enviada para revisão!', [
        { text: 'OK', onPress: () => router.push('/perfil') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a receita!');
    }
    setCarregando(false);
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Nova Receita</Text>

      <Text style={styles.label}>Nome da receita</Text>
      <TextInput style={styles.input} placeholder="Ex: Bolo de chocolate" placeholderTextColor="#aaa" value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Tempo de preparo</Text>
      <TextInput style={styles.input} placeholder="Ex: 45 min" placeholderTextColor="#aaa" value={tempo} onChangeText={setTempo} />

      <Text style={styles.label}>Porções</Text>
      <TextInput style={styles.input} placeholder="Ex: 10" placeholderTextColor="#aaa" keyboardType="numeric" value={porcoes} onChangeText={setPorcoes} />

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
      <TextInput style={[styles.input, styles.inputGrande]} placeholder="Liste os ingredientes, um por linha..." placeholderTextColor="#aaa" multiline value={ingredientes} onChangeText={setIngredientes} />

      <Text style={styles.label}>Modo de preparo</Text>
      <TextInput style={[styles.input, styles.inputGrande]} placeholder="Descreva o passo a passo..." placeholderTextColor="#aaa" multiline value={modoPreparo} onChangeText={setModoPreparo} />

      <TouchableOpacity style={styles.botao} onPress={publicarReceita} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Enviar Receita</Text>}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
});