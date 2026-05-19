import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem!');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }
    setCarregando(true);
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error) {
      setCarregando(false);
      Alert.alert('Erro', error.message);
      return;
    }
    if (data.user) {
      await supabase.from('perfis').insert({
        id: data.user.id,
        nome,
        email,
        tipo: 'leitor',
      });
    }
    setCarregando(false);
    Alert.alert('Sucesso!', 'Conta criada com sucesso!', [
      { text: 'OK', onPress: () => router.push('/home') }
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>🧁</Text>
      <Text style={styles.titulo}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={cadastrar} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  voltar: {
    position: 'absolute',
    top: 60,
    left: 24,
  },
  voltarTexto: {
    color: '#C2185B',
    fontSize: 16,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C2185B',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#F8BBD9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  botao: {
    backgroundColor: '#C2185B',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#C2185B',
    fontSize: 14,
  },
});