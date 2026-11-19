import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { t } = useTranslation();
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
          title: t('tabs.training'),
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: t('tabs.exercises'),
          tabBarIcon: ({ color, size }) => <Ionicons name="body" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: t('tabs.attendance'),
          tabBarIcon: ({ color, size }) => <Ionicons name="trail-sign" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
