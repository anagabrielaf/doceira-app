import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { fonts } from '../lib/fonts';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Image
        source={require('../assets/doce.png')}
        style={[styles.cupcakeImage, { transform: [{ scale: scaleAnim }] }]}
      />

      <Animated.View style={{ transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
        <Text style={styles.titulo}>Doceira</Text>
        <Text style={styles.subtitulo}>Receitinhas doces</Text>
      </Animated.View>

      <Animated.View style={[styles.botoesBox, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.botao} onPress={() => router.push('/login')}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSecundario} onPress={() => router.push('/cadastro')}>
          <Text style={styles.botaoSecundarioTexto}>Criar conta</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', alignItems: 'center', justifyContent: 'center', padding: 24 },
  cupcakeImage: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 16 },
  titulo: { fontSize: 48, color: '#C2185B', marginBottom: 8, fontFamily: fonts.cursiva },
  subtitulo: { fontSize: 18, color: '#888', textAlign: 'center', marginBottom: 40, fontFamily: fonts.cursiva },
  botoesBox: { width: '100%', gap: 12 },
  botao: { backgroundColor: '#C2185B', paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: fonts.bold },
  botaoSecundario: { borderWidth: 2, borderColor: '#C2185B', paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center' },
  botaoSecundarioTexto: { color: '#C2185B', fontSize: 16, fontWeight: 'bold', fontFamily: fonts.bold },
});