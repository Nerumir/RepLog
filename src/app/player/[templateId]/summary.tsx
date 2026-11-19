import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { playFanfare } from '@/audio/soundEffects';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AchievementUnlockedModal } from '@/components/ui/AchievementUnlockedModal';
import { Card } from '@/components/ui/Card';
import { Confetti } from '@/components/ui/Confetti';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, LevelTierInfo, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { checkAndUnlockAchievements } from '@/db/queries/achievements';
import { getAttendanceProgress, recordAttendanceSession } from '@/db/queries/attendance';
import { absolutePosition } from '@/domain/attendance';
import type { AchievementDefinition } from '@/domain/achievements';
import { getPerformanceStandards } from '@/db/queries/exercises';
import { getUserProfile } from '@/db/queries/profile';
import { getAppSettings } from '@/db/queries/settings';
import {
  getBestOneRmForExerciseExcludingLog,
  getBestRepsForExerciseExcludingLog,
  getWorkoutLogDetail,
} from '@/db/queries/workoutLogs';
import { calculateOneRm } from '@/domain/oneRepMax';
import { computeLevelScore, levelOrder, pickBracket } from '@/domain/performanceLevel';
import type { PerformanceLevel } from '@/domain/types';

interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  bestValue: number;
  metric: 'one_rm_kg' | 'reps';
  levelLabel: string;
  tier: PerformanceLevel | null;
  leveledUp: boolean;
}

function tierIndex(tier: PerformanceLevel | null) {
  return tier ? levelOrder.indexOf(tier) : -1;
}

export default function SessionSummaryScreen() {
  const { t } = useTranslation();
  const { workoutLogId } = useLocalSearchParams<{ templateId: string; workoutLogId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [summaries, setSummaries] = useState<ExerciseSummary[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [attendanceFrom, setAttendanceFrom] = useState<number | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementDefinition[]>([]);

  useEffect(() => {
    if (!workoutLogId) return;
    (async () => {
      const [detail, profile, settings] = await Promise.all([
        getWorkoutLogDetail(Number(workoutLogId)),
        getUserProfile(),
        getAppSettings(),
      ]);
      if (!detail || !profile) return;
      const formula = settings?.oneRmFormula ?? 'epley';

      const results: ExerciseSummary[] = [];
      for (const exercise of detail.exercises) {
        const completedSets = exercise.sets.filter((set) => set.isCompleted && set.actualWeightKg !== null && set.actualReps !== null);
        if (completedSets.length === 0) continue;

        const standards = await getPerformanceStandards(exercise.exerciseId);
        const metric: 'one_rm_kg' | 'reps' = standards[0]?.metric ?? 'one_rm_kg';

        let bestValue = 0;
        for (const set of completedSets) {
          const value =
            metric === 'reps' ? (set.actualReps ?? 0) : calculateOneRm(set.actualWeightKg ?? 0, set.actualReps ?? 0, formula);
          if (value > bestValue) bestValue = value;
        }

        const bracket = pickBracket(standards, profile.sex, profile.bodyWeightKg);
        const result = computeLevelScore(bestValue, bracket);
        const levelLabel =
          result.tier && result.score !== null
            ? t('exerciseDetail.levelLabel', { tier: t(`enums.levelTier.${result.tier}`), score: result.score.toFixed(1) })
            : t('exerciseDetail.noDataYet');

        const previousBest =
          metric === 'reps'
            ? await getBestRepsForExerciseExcludingLog(exercise.exerciseId, Number(workoutLogId), profile.performanceResetAt)
            : await getBestOneRmForExerciseExcludingLog(exercise.exerciseId, formula, Number(workoutLogId), profile.performanceResetAt);
        const previousTier = previousBest !== null ? computeLevelScore(previousBest, bracket).tier : null;
        const leveledUp = tierIndex(result.tier) > tierIndex(previousTier);

        results.push({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseNameSnapshot,
          bestValue,
          metric,
          levelLabel,
          tier: result.tier,
          leveledUp,
        });
      }
      setSummaries(results);
      if (results.some((r) => r.leveledUp)) {
        setCelebrate(true);
        playFanfare();
      }

      const progressBefore = await getAttendanceProgress();
      setAttendanceFrom(absolutePosition({ biomeIndex: progressBefore.biomeIndex, pointInBiome: progressBefore.pointInBiome }));
      await recordAttendanceSession();

      const newlyUnlocked = await checkAndUnlockAchievements();
      if (newlyUnlocked.length > 0) setUnlockedAchievements(newlyUnlocked);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne doit s'exécuter qu'une fois par séance (pas à chaque changement de langue, pour ne pas enregistrer deux fois la séance).
  }, [workoutLogId]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {celebrate && <Confetti />}
        <ThemedText type="subtitle">{t('sessionSummary.title')}</ThemedText>
        <FlatList
          data={summaries}
          keyExtractor={(item) => item.exerciseId}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <ThemedView style={styles.cardHeader}>
                <ThemedText type="smallBold" style={styles.cardHeaderTitle} numberOfLines={1}>
                  {item.exerciseName}
                </ThemedText>
                {item.leveledUp && (
                  <ThemedText type="small" themeColor="accentSecondary">
                    {t('sessionSummary.leveledUp')}
                  </ThemedText>
                )}
              </ThemedView>
              <ThemedText type="small">
                {item.metric === 'reps' ? t('sessionSummary.repRecord') : t('sessionSummary.estimatedOneRm')}
                <CountUpNumber type="small" value={item.bestValue} suffix={item.metric === 'reps' ? ` ${t('metric.repSuffix')}` : 'kg'} />
              </ThemedText>
              <ThemedView style={styles.levelRow}>
                {item.tier && <Ionicons name="medal" size={16} color={LevelTierInfo[item.tier].color} />}
                <ThemedText type="small" themeColor="textSecondary">
                  {item.levelLabel}
                </ThemedText>
              </ThemedView>
            </Card>
          )}
        />
        <GameButton
          style={[styles.doneButton, { backgroundColor: colors.accent }]}
          onPress={() =>
            router.replace(
              attendanceFrom !== null ? { pathname: '/attendance', params: { from: String(attendanceFrom) } } : '/attendance',
            )
          }>
          <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
            {t('sessionSummary.viewProgress')}
          </ThemedText>
        </GameButton>
      </SafeAreaView>
      <AchievementUnlockedModal queue={unlockedAchievements} onDismissAll={() => setUnlockedAchievements([])} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  card: { marginBottom: Spacing.two, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  cardHeaderTitle: { flexShrink: 1 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent' },
  doneButton: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.two },
});
