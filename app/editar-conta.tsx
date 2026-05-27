import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function EditarConta() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single();
    if (data) {
      setNome(data.nome);
      setEmail(data.email);
    }
    setCarregando(false);
  }

  async function salvar() {
    if (!nome) {
      Alert.alert('Atenção', 'O nome não pode estar vazio!');
      return;
    }
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem!');
      return;
    }
    if (novaSenha && novaSenha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }
    setSalvando(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: perfilError } = await supabase
      .from('perfis')
      .update({ nome })
      .eq('id', user.id);

    if (novaSenha) {
      const { error: senhaError } = await supabase.auth.updateUser({ password: novaSenha });
      if (senhaError) {
        setSalvando(false);
        Alert.alert('Erro', 'Não foi possível atualizar a senha!');
        return;
      }
    }

    setSalvando(false);
    if (perfilError) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil!');
    } else {
      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }

  async function excluirConta() {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive', onPress: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from('perfis').delete().eq('id', user.id);
            await supabase.auth.signOut();
            router.push('/');
          }
        }
      ]
    );
  }

  if (carregando) {
    return <View style={styles.loading}><ActivityIndicator color="#C2185B" size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Editar Conta</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={email}
        editable={false}
      />
      <Text style={styles.dica}>O e-mail não pode ser alterado.</Text>

      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Deixe em branco para manter a atual"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <Text style={styles.label}>Confirmar nova senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirme a nova senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Alterações</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoExcluir} onPress={excluirConta}>
        <Text style={styles.botaoExcluirTexto}>🗑️ Excluir Conta</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F7' },
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#C2185B', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', marginBottom: 16 },
  inputDisabled: { backgroundColor: '#f5f5f5', color: '#aaa' },
  dica: { fontSize: 12, color: '#aaa', marginTop: -12, marginBottom: 16 },
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoExcluir: { borderWidth: 2, borderColor: '#e53935', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  botaoExcluirTexto: { color: '#e53935', fontSize: 16, fontWeight: 'bold' },
});