import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { api, salvarToken, salvarUsuario } from '../lib/api';
import { fonts } from '../lib/fonts';
import { useAuth } from '../lib/AuthContext';

const tipos = [
  { valor: 'leitor', label: '👤 Leitor', desc: 'Visualiza, comenta e favorita receitas' },
  { valor: 'confeiteira', label: '👩‍🍳 Confeiteira', desc: 'Cria e compartilha suas receitas' },
];

export default function Cadastro() {
  const router = useRouter();
  const { recarregar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipo, setTipo] = useState('leitor');
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
    try {
      const data = await api.cadastro({ nome, email, senha, tipo });
      if (data.error) {
        Alert.alert('Erro', data.error);
      } else {
        await salvarToken(data.token);
        await salvarUsuario(data.perfil);
        await recarregar();
        Alert.alert('Sucesso!', 'Conta criada com sucesso!', [
          { text: 'OK', onPress: () => router.push('/home') }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor!');
    }
    setCarregando(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Image source={require('../assets/doce.png')} style={styles.imagem} />

      <Text style={styles.titulo}>Criar conta</Text>

      <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#aaa" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#aaa" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />

      <Text style={styles.label}>Tipo de perfil</Text>
      {tipos.map((t) => (
        <TouchableOpacity
          key={t.valor}
          style={[styles.tipoCard, tipo === t.valor && styles.tipoCardSelecionado]}
          onPress={() => setTipo(t.valor)}
        >
          <Text style={styles.tipoLabel}>{t.label}</Text>
          <Text style={styles.tipoDesc}>{t.desc}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.botao} onPress={cadastrar} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFF5F7', alignItems: 'center', justifyContent: 'center', padding: 24 },
  voltar: { position: 'absolute', top: 60, left: 24 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  imagem: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 12 },
  titulo: { fontSize: 36, color: '#C2185B', marginBottom: 32, fontFamily: fonts.cursiva },
  input: { width: '100%', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 15, color: '#333', backgroundColor: '#fff', fontFamily: fonts.regular },
  label: { fontSize: 14, color: '#555', marginBottom: 10, alignSelf: 'flex-start', fontFamily: fonts.bold },
  tipoCard: { width: '100%', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, marginBottom: 10, backgroundColor: '#fff' },
  tipoCardSelecionado: { borderColor: '#C2185B', backgroundColor: '#FFF0F5' },
  tipoLabel: { fontSize: 15, fontFamily: fonts.bold, color: '#333' },
  tipoDesc: { fontSize: 12, color: '#888', marginTop: 2, fontFamily: fonts.regular },
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center', marginBottom: 16, marginTop: 16 },
  botaoTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  link: { color: '#C2185B', fontSize: 14, fontFamily: fonts.regular },
});