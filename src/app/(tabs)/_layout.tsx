import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="programs"
        options={{
          title: 'Entraînement',
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Exercices',
          tabBarIcon: ({ color, size }) => <Ionicons name="body" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Assiduité',
          tabBarIcon: ({ color, size }) => <Ionicons name="trail-sign" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
