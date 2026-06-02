import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { fonts } from '../lib/fonts';

// Tabelas de conversão usadas na confeitaria
const conversoes: any = {
  'Açúcar': { xicara: 200, colherSopa: 12 },
  'Farinha de trigo': { xicara: 120, colherSopa: 7.5 },
  'Açúcar de confeiteiro': { xicara: 130, colherSopa: 8 },
  'Cacau em pó': { xicara: 90, colherSopa: 6 },
  'Manteiga': { xicara: 200, colherSopa: 14 },
  'Leite': { xicara: 240, colherSopa: 15 },
};

export default function Conversor() {
  const router = useRouter();
  const [ingrediente, setIngrediente] = useState('Açúcar');
  const [xicaras, setXicaras] = useState('1');
  const [tempF, setTempF] = useState('350');

  const dados = conversoes[ingrediente];
  const qtd = parseFloat(xicaras.replace(',', '.')) || 0;
  const gramas = Math.round(qtd * dados.xicara);

  const fahrenheit = parseFloat(tempF.replace(',', '.')) || 0;
  const celsius = Math.round((fahrenheit - 32) * 5 / 9);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Conversor de Medidas</Text>
      <Text style={styles.subtitulo}>~ medidas de confeitaria ~</Text>

      {/* Xícaras para gramas */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>🥄 Xícaras → Gramas</Text>

        <Text style={styles.label}>Ingrediente</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientesScroll}>
          {Object.keys(conversoes).map((ing) => (
            <TouchableOpacity
              key={ing}
              style={[styles.ingredienteBtn, ingrediente === ing && styles.ingredienteBtnSelecionado]}
              onPress={() => setIngrediente(ing)}
            >
              <Text style={[styles.ingredienteTexto, ingrediente === ing && styles.ingredienteTextoSelecionado]}>{ing}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Quantidade (xícaras)</Text>
        <TextInput
          style={styles.input}
          value={xicaras}
          onChangeText={setXicaras}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />

        <View style={styles.resultado}>
          <Text style={styles.resultadoNumero}>{gramas}g</Text>
          <Text style={styles.resultadoLabel}>{qtd} xícara(s) de {ingrediente.toLowerCase()}</Text>
        </View>

        <View style={styles.equivalencias}>
          <Text style={styles.equivalenciaTexto}>1 xícara = {dados.xicara}g</Text>
          <Text style={styles.equivalenciaTexto}>1 colher de sopa = {dados.colherSopa}g</Text>
        </View>
      </View>

      {/* Temperatura */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>🌡️ Fahrenheit → Celsius</Text>

        <Text style={styles.label}>Temperatura (°F)</Text>
        <TextInput
          style={styles.input}
          value={tempF}
          onChangeText={setTempF}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />

        <View style={styles.resultado}>
          <Text style={styles.resultadoNumero}>{celsius}°C</Text>
          <Text style={styles.resultadoLabel}>{fahrenheit}°F no forno</Text>
        </View>
      </View>

      {/* Tabela rápida de colheres */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>📏 Tabela Rápida</Text>
        <Text style={styles.tabelaItem}>1 xícara = 240 ml</Text>
        <Text style={styles.tabelaItem}>1 colher de sopa = 15 ml</Text>
        <Text style={styles.tabelaItem}>1 colher de chá = 5 ml</Text>
        <Text style={styles.tabelaItem}>1 xícara = 16 colheres de sopa</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 24, paddingTop: 60 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: '#C2185B', fontSize: 16, fontFamily: fonts.regular },
  titulo: { fontSize: 32, color: '#C2185B', fontFamily: fonts.cursiva, textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24, fontFamily: fonts.regular, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F8BBD9' },
  cardTitulo: { fontSize: 18, color: '#C2185B', marginBottom: 16, fontFamily: fonts.bold },
  label: { fontSize: 13, color: '#555', marginBottom: 8, fontFamily: fonts.bold },
  ingredientesScroll: { marginBottom: 16, flexGrow: 0 },
  ingredienteBtn: { backgroundColor: '#FFF0F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: '#F8BBD9' },
  ingredienteBtnSelecionado: { backgroundColor: '#C2185B', borderColor: '#C2185B' },
  ingredienteTexto: { fontSize: 12, color: '#C2185B', fontFamily: fonts.regular },
  ingredienteTextoSelecionado: { color: '#fff' },
  input: { backgroundColor: '#FFF5F7', borderWidth: 1.5, borderColor: '#F8BBD9', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', marginBottom: 16, fontFamily: fonts.regular },
  resultado: { backgroundColor: '#FFF0F5', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  resultadoNumero: { fontSize: 36, color: '#C2185B', fontFamily: fonts.bold },
  resultadoLabel: { fontSize: 13, color: '#888', marginTop: 4, fontFamily: fonts.regular, fontStyle: 'italic' },
  equivalencias: { borderTopWidth: 1, borderTopColor: '#F8BBD9', paddingTop: 12 },
  equivalenciaTexto: { fontSize: 13, color: '#888', marginBottom: 4, fontFamily: fonts.regular },
  tabelaItem: { fontSize: 14, color: '#555', marginBottom: 8, fontFamily: fonts.regular },
});