import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧁</Text>
      <Text style={styles.titulo}>DoceriaBR</Text>
      <Text style={styles.subtitulo}>Receitas e criações da confeitaria brasileira</Text>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSecundario}>
        <Text style={styles.botaoSecundarioTexto}>Criar conta</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  botao: {
    backgroundColor: '#C2185B',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    borderWidth: 2,
    borderColor: '#C2185B',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  botaoSecundarioTexto: {
    color: '#C2185B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});