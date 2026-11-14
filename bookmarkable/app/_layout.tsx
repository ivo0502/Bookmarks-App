import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/components/auth-provider';

const colorsByScheme = {
  light: {
    page: '#eef4f1',
    surface: '#ffffff',
    text: '#0f1720',
  },
  dark: {
    page: '#071015',
    surface: '#0d181d',
    text: '#f0f7f4',
  },
} as const;

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = colorsByScheme[colorScheme as keyof typeof colorsByScheme];

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.page },
          }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="register" options={{ title: 'Register' }} />
          <Stack.Screen name="bookmarks" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}

