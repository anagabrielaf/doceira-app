import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/AuthContext';
import { useAppFonts } from '../lib/fonts';
import { View, ActivityIndicator } from 'react-native';

export default function Layout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F7' }}>
        <ActivityIndicator color="#C2185B" size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}