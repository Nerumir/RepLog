import { useCallback, useRef, useState } from 'react';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { playSuccess } from '@/audio/soundEffects';
import { AttendanceMap } from '@/components/attendance/AttendanceMap';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Confetti } from '@/components/ui/Confetti';
import { GameButton } from '@/components/ui/GameButton';
import { HelpButton } from '@/components/ui/HelpButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { applyDebugPenalty, applyLazyPenaltiesIfNeeded, recordAttendanceSession, setPenaltyThresholdDays } from '@/db/queries/attendance';
import { getAppSettings } from '@/db/queries/settings';
import { absolutePosition, BIOMES, stateFromAbsolute } from '@/domain/attendance';

export default function AttendanceScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [loaded, setLoaded] = useState(false);
  const [biomeIndex, setBiomeIndex] = useState(0);
  const [pointInBiome, setPointInBiome] = useState(0);
  const [thresholdConfigured, setThresholdConfigured] = useState(true);
  const [thresholdInput, setThresholdInput] = useState('7');
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);
  const [animateFromPointInBiome, setAnimateFromPointInBiome] = useState<number | undefined>(undefined);
  const [celebrate, setCelebrate] = useState(false);
  const params = useLocalSearchParams<{ from?: string }>();
  const handledFromRef = useRef<string | null>(null);

  const load = useCallback(() => {
    (async () => {
      const [progress, settings] = await Promise.all([applyLazyPenaltiesIfNeeded(), getAppSettings()]);
      setBiomeIndex(progress.biomeIndex);
      setPointInBiome(progress.pointInBiome);
      setThresholdConfigured(progress.penaltyThresholdDays != null);
      setDebugModeEnabled(settings?.debugModeEnabled ?? false);
      setLoaded(true);

      if (params.from && handledFromRef.current !== params.from) {
        handledFromRef.current = params.from;
        const fromState = stateFromAbsolute(Number(params.from));
        const toState = { biomeIndex: progress.biomeIndex, pointInBiome: progress.pointInBiome };
        if (absolutePosition(fromState) !== absolutePosition(toState)) {
          if (fromState.biomeIndex === toState.biomeIndex) {
            setAnimateFromPointInBiome(fromState.pointInBiome);
          } else {
            setCelebrate(true);
            playSuccess();
          }
        }
      }
    })();
  }, [params.from]);

  useFocusEffect(load);

  function handleArrived() {
    setAnimateFromPointInBiome(undefined);
    setCelebrate(true);
    playSuccess();
  }

  async function handleConfirmThreshold() {
    const days = Number(thresholdInput);
    if (!Number.isFinite(days) || days <= 0) return;
    await setPenaltyThresholdDays(Math.round(days));
    load();
  }

  async function handleDebugAdvance() {
    await recordAttendanceSession();
    load();
  }

  async function handleDebugPenalty() {
    await applyDebugPenalty();
    load();
  }

  if (!loaded) return <ThemedView style={styles.container} />;

  if (!thresholdConfigured) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="subtitle">{t('attendance.setup.title')}</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            {t('attendance.setup.question')}
          </ThemedText>
          <TextInput
            value={thresholdInput}
            onChangeText={setThresholdInput}
            keyboardType="numeric"
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />
          <GameButton style={[styles.confirmButton, { backgroundColor: colors.accent }]} onPress={handleConfirmThreshold}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              {t('attendance.setup.validate')}
            </ThemedText>
          </GameButton>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeAreaMap} edges={['top', 'left', 'right']}>
        <ThemedView style={styles.headerRow}>
          <ThemedView style={styles.headerTitleRow}>
            <ThemedText type="subtitle">
              {BIOMES[biomeIndex] ? t(`enums.biome.${BIOMES[biomeIndex].id}`) : t('attendance.map.tabFallback')}
            </ThemedText>
            <HelpButton title={t('attendance.help.title')} body={t('attendance.help.body')} />
          </ThemedView>
          <Link href="/attendance/settings" asChild>
            <Pressable style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.text} />
            </Pressable>
          </Link>
        </ThemedView>
        <ThemedView style={styles.mapWrapper}>
          <AttendanceMap
            biomeIndex={biomeIndex}
            pointInBiome={pointInBiome}
            animateFromPointInBiome={animateFromPointInBiome}
            onArrived={handleArrived}
          />
          {celebrate && <Confetti key={params.from ?? 'static'} />}
          {debugModeEnabled && (
            <ThemedView style={styles.debugPanel}>
              <Pressable style={[styles.debugButton, { borderColor: colors.accent }]} onPress={handleDebugAdvance}>
                <ThemedText type="small" style={{ color: colors.accent }}>
                  {t('attendance.debug.advance')}
                </ThemedText>
              </Pressable>
              <Pressable style={[styles.debugButton, { borderColor: colors.danger }]} onPress={handleDebugPenalty}>
                <ThemedText type="small" style={{ color: colors.danger }}>
                  {t('attendance.debug.penalty')}
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  safeAreaMap: { flex: 1, paddingTop: Spacing.two, gap: Spacing.two },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
  },
  settingsButton: { padding: Spacing.one },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  mapWrapper: { flex: 1 },
  debugPanel: {
    position: 'absolute',
    left: Spacing.two,
    top: '45%',
    gap: Spacing.two,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  debugButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  confirmButton: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.two },
});
