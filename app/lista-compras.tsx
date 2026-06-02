import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../lib/fonts';

const CHAVE = 'lista_compras';

export default function ListaCompras() {
  const router = useRouter();
  const [itens, setItens] = useState<any[]>([]);
  const [novoItem, setNovoItem] = useState('');

  useFocusEffect(
    useCallback(() => {
      carregarLista();
    }, [])
  );

  async function carregarLista() {
    try {
      const dados = await AsyncStorage.getItem(CHAVE);
      setItens(dados ? JSON.parse(dados) : []);
    } catch (error) {
      setItens([]);
    }
  }

  async function salvarLista(novaLista: any[]) {
    setItens(novaLista);
    await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
  }

  function adicionarItem() {
    if (!novoItem.trim()) return;
    const novaLista = [...itens, { id: Date.now().toString(), texto: novoItem, comprado: false }];
    salvarLista(novaLista);
    setNovoItem('');
  }

  function toggleComprado(id: string) {
    const novaLista = itens.map((item) =>
      item.id === id ? { ...item, comprado: !item.comprado } : item
    );
    salvarLista(novaLista);
  }

  function removerItem(id: string) {
    const novaLista = itens.filter((item) => item.id !== id);
    salvarLista(novaLista);
  }

  function limparTudo() {
    Alert.alert('Limpar lista', 'Deseja remover todos os itens?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => salvarLista([]) },
    ]);
  }

  const comprados = itens.filter((i) => i.comprado).length;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Lista de Compras</Text>
      {itens.length > 0 && (
        <Text style={styles.subtitulo}>{comprados} de {itens.length} comprados</Text>
      )}

      <View style={styles.addBox}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar ingrediente..."
          placeholderTextColor="#aaa"
          value={novoItem}
          onChangeText={setNovoItem}
          onSubmitEditing={adicionarItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={adicionarItem}>
          <Text style={styles.addBtnTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {itens.length === 0 ? (
        <Text style={styles.vazio}>Sua lista está vazia!{'\n'}Adicione ingredientes das receitas 🛒</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {itens.map((item) => (
            <View key={item.id} style={styles.item}>
              <TouchableOpacity style={styles.itemCheck} onPress={() => toggleComprado(item.id)}>
                <Text style={styles.checkbox}>{item.comprado ? '✅' : '⬜'}</Text>
                <Text style={[styles.itemTexto, item.comprado && styles.itemComprado]}>{item.texto}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerItem(item.id)}>
                <Text style={styles.remover}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.limparBtn} onPress={limparTudo}>
            <Text style={styles.limparTexto}>Limpar lista</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', fontFamily: fonts.cursiva },
  subtitulo: { fontSize: 14, color: '#888', marginBottom: 16, fontFamily: fonts.regular, fontStyle: 'italic' },
  addBox: { flexDirection: 'row', gap: 12, marginBottom: 24, marginTop: 12 },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', fontFamily: fonts.regular },
  addBtn: { backgroundColor: '#C2185B', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  addBtnTexto: { color: '#fff', fontSize: 28, fontFamily: fonts.bold },
  vazio: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 60, fontFamily: fonts.regular, fontStyle: 'italic', lineHeight: 24 },
  item: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F8BBD9' },
  itemCheck: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  checkbox: { fontSize: 22 },
  itemTexto: { fontSize: 15, color: '#333', flex: 1, fontFamily: fonts.regular },
  itemComprado: { textDecorationLine: 'line-through', color: '#aaa' },
  remover: { fontSize: 18, marginLeft: 12 },
  limparBtn: { borderWidth: 2, borderColor: '#C2185B', paddingVertical: 12, borderRadius: 30, alignItems: 'center', marginTop: 12 },
  limparTexto: { color: '#C2185B', fontSize: 15, fontFamily: fonts.bold },
});