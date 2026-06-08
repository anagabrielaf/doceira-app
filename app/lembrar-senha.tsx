import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { fonts } from '../lib/fonts';

export default function LembrarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  function enviar() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail!');
      return;
    }
    Alert.alert(
      'E-mail enviado!',
      `Se houver uma conta com ${email}, você receberá instruções para redefinir sua senha.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Image source={require('../assets/doce.png')} style={styles.imagem} />

      <Text style={styles.titulo}>Esqueci a senha</Text>
      <Text style={styles.subtitulo}>Digite seu e-mail e enviaremos instruções para redefinir sua senha</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.botao} onPress={enviar}>
        <Text style={styles.botaoTexto}>Enviar instruções</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', alignItems: 'center', justifyContent: 'center', padding: 24 },
  voltar: { position: 'absolute', top: 60, left: 24 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  imagem: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 12 },
  titulo: { fontSize: 36, color: '#C2185B', marginBottom: 8, fontFamily: fonts.cursiva },
  subtitulo: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 32, fontFamily: fonts.regular },
  input: { width: '100%', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 15, color: '#333', backgroundColor: '#fff', fontFamily: fonts.regular },
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center', marginBottom: 16 },
  botaoTexto: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  link: { color: '#C2185B', fontSize: 14, fontFamily: fonts.regular },
});