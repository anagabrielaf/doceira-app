import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function NovaReceita() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Nova Receita</Text>

      <Text style={styles.label}>Nome da receita</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Bolo de chocolate"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Bolos, Bombons, Tortas..."
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Tempo de preparo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 45 min"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Porções</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 10 porções"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Dificuldade</Text>
      <TextInput
        style={styles.input}
        placeholder="Fácil, Médio ou Difícil"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Liste os ingredientes, um por linha..."
        placeholderTextColor="#aaa"
        multiline
      />

      <Text style={styles.label}>Modo de preparo</Text>
      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Descreva o passo a passo..."
        placeholderTextColor="#aaa"
        multiline
      />

      <TouchableOpacity style={styles.botao} onPress={() => router.push('/perfil')}>
        <Text style={styles.botaoTexto}>Publicar Receita</Text>
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
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#F8BBD9',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  inputGrande: {
    height: 120,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#C2185B',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});