import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, Share } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { api, getUsuarioLogado } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../lib/fonts';

export default function Receita() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [receita, setReceita] = useState<any>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [porcoesAtuais, setPorcoesAtuais] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const intervalRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      carregarTudo();
    }, [id])
  );

  async function carregarTudo() {
    try {
      const user = await getUsuarioLogado();
      setUsuario(user);
      const receitaData = await api.getReceita(Number(id));
      setReceita(receitaData);
      setPorcoesAtuais(receitaData?.porcoes || 1);
      const comentariosData = await api.getComentarios(Number(id));
      setComentarios(Array.isArray(comentariosData) ? comentariosData : []);
      if (user?.id) {
        const fav = await api.verificarFavorito(user.id, Number(id));
        setFavorito(fav?.favorito || false);
      }
    } catch (error) {
      console.error('Erro ao carregar receita:', error);
    }
    setCarregando(false);
  }

  async function toggleFavorito() {
    if (!usuario) {
      Alert.alert('Atenção', 'Faça login para favoritar!');
      return;
    }
    try {
      if (favorito) {
        await api.removerFavorito(usuario.id, Number(id));
        setFavorito(false);
      } else {
        await api.adicionarFavorito(usuario.id, Number(id));
        setFavorito(true);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o favorito!');
    }
  }

  useEffect(() => {
    if (timerAtivo && segundos > 0) {
      intervalRef.current = setInterval(() => {
        setSegundos((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setTimerAtivo(false);
            Alert.alert('⏰ Tempo esgotado!', 'Seu timer chegou ao fim!');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerAtivo]);

  function adicionarMinutos(min: number) {
    setSegundos((s) => s + min * 60);
  }

  function toggleTimer() {
    if (segundos === 0) {
      Alert.alert('Atenção', 'Adicione tempo antes de iniciar!');
      return;
    }
    setTimerAtivo((a) => !a);
  }

  function resetarTimer() {
    clearInterval(intervalRef.current);
    setTimerAtivo(false);
    setSegundos(0);
  }

  function formatarTempo(s: number) {
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }

  async function enviarComentario() {
    if (!novoComentario.trim()) return;
    if (!usuario) {
      Alert.alert('Atenção', 'Faça login para comentar!');
      return;
    }
    setEnviando(true);
    try {
      await api.criarComentario({ receitaId: Number(id), usuarioId: usuario.id, texto: novoComentario });
      setNovoComentario('');
      const comentariosData = await api.getComentarios(Number(id));
      setComentarios(Array.isArray(comentariosData) ? comentariosData : []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário!');
    }
    setEnviando(false);
  }

  async function compartilharReceita() {
    try {
      const ingredientesTexto = (receita.ingredientes || '').split('\n').map((i: string) => `• ${i}`).join('\n');
      const mensagem = `🧁 ${receita.titulo}\n\n⏱ Tempo: ${receita.tempo}\n🍽 Porções: ${receita.porcoes}\n📊 Dificuldade: ${receita.dificuldade}\n\n📝 INGREDIENTES:\n${ingredientesTexto}\n\n👩‍🍳 MODO DE PREPARO:\n${receita.modoPreparo}\n\n— Receita do app Doceira 🍰`;

      await Share.share({
        message: mensagem,
        title: receita.titulo,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a receita!');
    }
  }

  async function adicionarNaLista(ingrediente: string) {
    try {
      const dados = await AsyncStorage.getItem('lista_compras');
      const lista = dados ? JSON.parse(dados) : [];
      lista.push({ id: Date.now().toString(), texto: ingrediente, comprado: false });
      await AsyncStorage.setItem('lista_compras', JSON.stringify(lista));
      Alert.alert('Adicionado!', `"${ingrediente}" foi para a lista de compras 🛒`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar à lista!');
    }
  }

  function ajustarIngrediente(linha: string) {
    const original = receita?.porcoes || 1;
    const fator = porcoesAtuais / original;
    if (fator === 1) return linha;
    return linha.replace(/(\d+(?:[.,]\d+)?)/g, (match) => {
      const num = parseFloat(match.replace(',', '.'));
      const ajustado = num * fator;
      const formatado = Number.isInteger(ajustado) ? ajustado.toString() : ajustado.toFixed(1).replace('.', ',');
      return formatado;
    });
  }

  if (carregando) return <View style={styles.loading}><ActivityIndicator color="#C2185B" size="large" /></View>;
  if (!receita) return <View style={styles.loading}><Text>Receita não encontrada.</Text></View>;

  const ingredientes = receita.ingredientes?.split('\n') || [];
  const passos = receita.modoPreparo?.split('.').filter((p: string) => p.trim()) || [];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>{receita.emoji}</Text>
      <Text style={styles.titulo}>{receita.titulo}</Text>

      <TouchableOpacity style={[styles.botaoFavorito, favorito && styles.botaoFavoritoAtivo]} onPress={toggleFavorito}>
        <Text style={styles.botaoFavoritoTexto}>{favorito ? '❤️ Favoritado' : '🤍 Favoritar'}</Text>
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoValor}>{receita.tempo}</Text>
          <Text style={styles.infoLabel}>Tempo</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoValor}>{porcoesAtuais}</Text>
          <Text style={styles.infoLabel}>Porções</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoValor}>{receita.dificuldade}</Text>
          <Text style={styles.infoLabel}>Dificuldade</Text>
        </View>
      </View>

      <View style={styles.porcoesBox}>
        <Text style={styles.porcoesLabel}>Ajustar porções</Text>
        <View style={styles.porcoesControle}>
          <TouchableOpacity style={styles.porcoesBtn} onPress={() => setPorcoesAtuais((p) => Math.max(1, p - 1))}>
            <Text style={styles.porcoesBtnTexto}>−</Text>
          </TouchableOpacity>
          <Text style={styles.porcoesNumero}>{porcoesAtuais}</Text>
          <TouchableOpacity style={styles.porcoesBtn} onPress={() => setPorcoesAtuais((p) => p + 1)}>
            <Text style={styles.porcoesBtnTexto}>+</Text>
          </TouchableOpacity>
        </View>
        {porcoesAtuais !== receita.porcoes && (
          <TouchableOpacity onPress={() => setPorcoesAtuais(receita.porcoes)}>
            <Text style={styles.resetarTexto}>↺ Voltar ao original ({receita.porcoes})</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.secao}>~ Ingredientes ~</Text>
      <Text style={styles.dicaIngrediente}>toque para adicionar à lista de compras 🛒</Text>
      {ingredientes.map((item: string, i: number) => (
        <TouchableOpacity key={i} style={styles.ingredienteItem} onPress={() => adicionarNaLista(ajustarIngrediente(item))}>
          <Text style={styles.item}>• {ajustarIngrediente(item)}</Text>
          <Text style={styles.maisIcone}>+</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.secao}>~ Modo de Preparo ~</Text>
      {passos.map((passo: string, i: number) => (
        <View key={i} style={styles.passoBox}>
          <Text style={styles.passoNum}>{i + 1}</Text>
          <Text style={styles.passoTexto}>{passo.trim()}.</Text>
        </View>
      ))}

      <Text style={styles.secao}>~ Timer ~</Text>
      <View style={styles.timerBox}>
        <Text style={styles.timerDisplay}>{formatarTempo(segundos)}</Text>

        <View style={styles.timerAtalhos}>
          <TouchableOpacity style={styles.timerAtalhoBtn} onPress={() => adicionarMinutos(1)}>
            <Text style={styles.timerAtalhoTexto}>+1 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timerAtalhoBtn} onPress={() => adicionarMinutos(5)}>
            <Text style={styles.timerAtalhoTexto}>+5 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timerAtalhoBtn} onPress={() => adicionarMinutos(10)}>
            <Text style={styles.timerAtalhoTexto}>+10 min</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerControles}>
          <TouchableOpacity
            style={[styles.timerBtn, timerAtivo ? styles.timerBtnPausar : styles.timerBtnIniciar]}
            onPress={toggleTimer}
          >
            <Text style={styles.timerBtnTexto}>{timerAtivo ? '⏸ Pausar' : '▶ Iniciar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timerBtnResetar} onPress={resetarTimer}>
            <Text style={styles.timerBtnResetarTexto}>↺ Zerar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.secao}>~ Comentários ~</Text>
      <View style={styles.comentarioBox}>
        <TextInput
          style={styles.comentarioInput}
          placeholder="Escreva um comentário..."
          placeholderTextColor="#aaa"
          value={novoComentario}
          onChangeText={setNovoComentario}
          multiline
        />
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarComentario} disabled={enviando}>
          {enviando ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.botaoEnviarTexto}>Enviar</Text>}
        </TouchableOpacity>
      </View>

      {comentarios.length === 0 ? (
        <Text style={styles.semComentarios}>Seja a primeira a comentar!</Text>
      ) : (
        comentarios.map((comentario) => (
          <View key={comentario.id} style={styles.comentario}>
            <Text style={styles.comentarioNome}>👤 {comentario.autorNome || 'Usuário'}</Text>
            <Text style={styles.comentarioTexto}>{comentario.texto}</Text>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.botaoCompartilhar} onPress={compartilharReceita}>
        <Text style={styles.botaoCompartilharTexto}>📤 Compartilhar Receita</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F7' },
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  emoji: { fontSize: 64, textAlign: 'center', marginBottom: 12 },
  titulo: { fontSize: 32, color: '#333', textAlign: 'center', marginBottom: 16, fontFamily: fonts.cursiva },
  botaoFavorito: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#F8BBD9', paddingVertical: 12, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
  botaoFavoritoAtivo: { backgroundColor: '#FFF0F5', borderColor: '#C2185B' },
  botaoFavoritoTexto: { color: '#C2185B', fontSize: 15, fontFamily: fonts.bold },
  botaoCompartilhar: { backgroundColor: '#C2185B', paddingVertical: 12, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
  botaoCompartilharTexto: { color: '#fff', fontSize: 15, fontFamily: fonts.bold },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F8BBD9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  infoBox: { alignItems: 'center' },
  infoValor: { fontSize: 16, color: '#C2185B', fontFamily: fonts.bold },
  infoLabel: { fontSize: 12, color: '#888', marginTop: 4, fontFamily: fonts.regular },
  porcoesBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F8BBD9', alignItems: 'center' },
  porcoesLabel: { fontSize: 14, color: '#555', marginBottom: 10, fontFamily: fonts.bold },
  porcoesControle: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  porcoesBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C2185B', alignItems: 'center', justifyContent: 'center' },
  porcoesBtnTexto: { color: '#fff', fontSize: 24, fontFamily: fonts.bold },
  porcoesNumero: { fontSize: 24, color: '#C2185B', fontFamily: fonts.bold, minWidth: 40, textAlign: 'center' },
  resetarTexto: { fontSize: 12, color: '#888', marginTop: 10, fontFamily: fonts.regular, fontStyle: 'italic' },
  secao: { fontSize: 20, color: '#C2185B', marginBottom: 12, marginTop: 8, textAlign: 'center', fontFamily: fonts.cursiva },
  item: { fontSize: 15, color: '#555', lineHeight: 22, fontFamily: fonts.regular, flex: 1 },
  dicaIngrediente: { fontSize: 12, color: '#aaa', textAlign: 'center', marginBottom: 12, fontFamily: fonts.regular, fontStyle: 'italic' },
  ingredienteItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, borderWidth: 1, borderColor: '#F8BBD9' },
  maisIcone: { fontSize: 20, color: '#C2185B', fontFamily: fonts.bold },
  passoBox: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  passoNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C2185B', color: '#fff', textAlign: 'center', lineHeight: 28, fontFamily: fonts.bold, fontSize: 14 },
  passoTexto: { flex: 1, fontSize: 15, color: '#555', lineHeight: 22, fontFamily: fonts.regular },
  comentarioBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F8BBD9' },
  comentarioInput: { fontSize: 15, color: '#333', minHeight: 60, textAlignVertical: 'top', marginBottom: 10, fontFamily: fonts.regular },
  botaoEnviar: { backgroundColor: '#C2185B', paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  botaoEnviarTexto: { color: '#fff', fontFamily: fonts.bold, fontSize: 14 },
  semComentarios: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 16, fontFamily: fonts.regular, fontStyle: 'italic' },
  comentario: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F8BBD9' },
  comentarioNome: { fontSize: 14, color: '#C2185B', marginBottom: 6, fontFamily: fonts.bold },
  comentarioTexto: { fontSize: 14, color: '#555', lineHeight: 20, fontFamily: fonts.regular },
  timerBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F8BBD9', alignItems: 'center' },
  timerDisplay: { fontSize: 56, color: '#C2185B', fontFamily: fonts.bold, marginBottom: 16 },
  timerAtalhos: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  timerAtalhoBtn: { backgroundColor: '#FFF0F5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#F8BBD9' },
  timerAtalhoTexto: { fontSize: 13, color: '#C2185B', fontFamily: fonts.bold },
  timerControles: { flexDirection: 'row', gap: 12, width: '100%' },
  timerBtn: { flex: 1, paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  timerBtnIniciar: { backgroundColor: '#4CAF50' },
  timerBtnPausar: { backgroundColor: '#FF9800' },
  timerBtnTexto: { color: '#fff', fontSize: 15, fontFamily: fonts.bold },
  timerBtnResetar: { flex: 1, paddingVertical: 14, borderRadius: 30, alignItems: 'center', borderWidth: 2, borderColor: '#C2185B' },
  timerBtnResetarTexto: { color: '#C2185B', fontSize: 15, fontFamily: fonts.bold },
});