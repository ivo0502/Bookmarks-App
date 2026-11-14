import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

const colorsByScheme = {
  light: {
    surface: '#ffffff',
    text: '#0f1720',
  },
  dark: {
    surface: '#0d181d',
    text: '#f0f7f4',
  },
} as const;

export default function BookmarksLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = colorsByScheme[colorScheme as keyof typeof colorsByScheme];

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}>
      <Stack.Screen name="index" options={{ title: 'Bookmarks' }} />
      <Stack.Screen name="new" options={{ title: 'Add Bookmark' }} />
      <Stack.Screen name="[id]" options={{ title: 'View Bookmark' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Bookmark' }} />
      <Stack.Screen name="[id]/delete" options={{ title: 'Delete Bookmark' }} />
    </Stack>
  );
}
