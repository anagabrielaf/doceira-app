import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api, salvarToken, salvarUsuario } from '../lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha!');
      return;
    }
    setCarregando(true);
    try {
      const data = await api.login(email, senha);
      if (data.error) {
        Alert.alert('Erro', data.error);
      } else {
        await salvarToken(data.token);
        await salvarUsuario(data.perfil);
        router.push('/home');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor!');
    }
    setCarregando(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>🧁</Text>
      <Text style={styles.titulo}>Entrar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/cadastro')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', alignItems: 'center', justifyContent: 'center', padding: 24 },
  voltar: { position: 'absolute', top: 60, left: 24 },
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  emoji: { fontSize: 56, marginBottom: 12 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#C2185B', marginBottom: 32 },
  input: { width: '100%', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 15, color: '#333', backgroundColor: '#fff' },
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#C2185B', fontSize: 14 },
});