import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  return fontsLoaded;
}

export const fonts = {
  cursiva: 'DancingScript_700Bold',
  regular: 'PlayfairDisplay_400Regular',
  bold: 'PlayfairDisplay_700Bold',
};