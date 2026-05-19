import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarReceita() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Editar Receita</Text>

      <Text style={styles.label}>Nome da receita</Text>
      <TextInput
        style={styles.input}
        defaultValue="Brigadeiro Gourmet"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput
        style={styles.input}
        defaultValue="Bombons"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Tempo de preparo</Text>
      <TextInput
        style={styles.input}
        defaultValue="30 min"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Porções</Text>
      <TextInput
        style={styles.input}
        defaultValue="20"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Dificuldade</Text>
      <TextInput
        style={styles.input}
        defaultValue="Fácil"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={[styles.input, styles.inputGrande]}
        defaultValue="1 lata de leite condensado&#10;1 colher de manteiga&#10;3 colheres de chocolate em pó&#10;Granulado a gosto"
        placeholderTextColor="#aaa"
        multiline
      />

      <Text style={styles.label}>Modo de preparo</Text>
      <TextInput
        style={[styles.input, styles.inputGrande]}
        defaultValue="Misture todos os ingredientes e leve ao fogo médio até desgrudar da panela."
        placeholderTextColor="#aaa"
        multiline
      />

      <TouchableOpacity style={styles.botao} onPress={() => router.push('/perfil')}>
        <Text style={styles.botaoTexto}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoExcluir} onPress={() => router.push('/perfil')}>
        <Text style={styles.botaoExcluirTexto}>Excluir Receita</Text>
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
    marginBottom: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoExcluir: {
    borderWidth: 2,
    borderColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  botaoExcluirTexto: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
});