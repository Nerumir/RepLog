import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, Redirect, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { PremiumGateModal } from '@/components/ui/PremiumGateModal';
import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations';
import { getFreeTierStatus } from '@/db/queries/premium';
import { getUserProfile } from '@/db/queries/profile';
import { getAppSettings } from '@/db/queries/settings';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/state/useThemeStore';
import { removeDeprecatedExercises, runSeedIfEmpty, syncExerciseCatalog, syncPerformanceStandards } from '@data/seed';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const [seedReady, setSeedReady] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [fontsLoaded] = useFonts({ Sora_600SemiBold, Sora_700Bold });
  const setThemeMode = useThemeStore((state) => state.setMode);
  const colorScheme = useColorScheme();
  const [freeTierReminder, setFreeTierReminder] = useState<{ completedSessions: number; limitReached: boolean } | null>(null);

  useEffect(() => {
    if (!success) return;
    runSeedIfEmpty(db)
      .then(() => syncExerciseCatalog(db))
      .then(() => removeDeprecatedExercises(db))
      .then(() => syncPerformanceStandards(db))
      .then(() => Promise.all([getAppSettings(), getUserProfile()]))
      .then(([settings, profile]) => {
        if (settings) setThemeMode(settings.themeMode);
        setHasProfile(profile !== null);
      })
      .finally(() => setSeedReady(true));
  }, [success, setThemeMode]);

  useEffect(() => {
    if (error || (success && seedReady && fontsLoaded)) {
      SplashScreen.hideAsync();
    }
  }, [success, seedReady, error, fontsLoaded]);

  useEffect(() => {
    if (hasProfile !== true) return;
    getFreeTierStatus().then(({ unlocked, completedSessions, limitReached }) => {
      if (!unlocked) setFreeTierReminder({ completedSessions, limitReached });
    });
  }, [hasProfile]);

  if (error) {
    throw error;
  }
  if (!success || !seedReady || !fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {hasProfile === false && <Redirect href="/onboarding" />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="exercises/[exerciseId]" />
        <Stack.Screen name="muscle/[muscleGroupId]" />
        <Stack.Screen name="achievements/index" />
        <Stack.Screen name="player/[templateId]/index" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="player/[templateId]/summary" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
      <PremiumGateModal
        visible={freeTierReminder !== null}
        limitReached={freeTierReminder?.limitReached ?? false}
        completedSessions={freeTierReminder?.completedSessions ?? 0}
        onDismiss={() => setFreeTierReminder(null)}
        onUnlocked={() => setFreeTierReminder(null)}
      />
    </ThemeProvider>
  );
}
