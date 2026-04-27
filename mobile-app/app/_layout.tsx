import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Theme } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (!loaded) return;
    const checkAuth = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            try {
                await authService.getMe();
                router.replace('/dashboard');
            } catch {
                router.replace('/login');
            }
        }
    };
    checkAuth();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const appTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Theme.colors.background,
      card: Theme.colors.surfaceContainerLow,
      text: Theme.colors.onBackground,
      border: Theme.colors.outlineVariant,
      primary: Theme.colors.primary,
    },
  };

  return (
    <ThemeProvider value={appTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
