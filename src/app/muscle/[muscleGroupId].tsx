import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { LevelProgressBar } from '@/components/ui/LevelProgressBar';
import { LevelTierInfo, Spacing } from '@/constants/theme';
import { useLocalize } from '@/i18n/localize';
import { getMuscleGroupById, getPerformanceStandards, listExercisesByPrimaryMuscle } from '@/db/queries/exercises';
import { getUserProfile } from '@/db/queries/profile';
import { getAppSettings } from '@/db/queries/settings';
import { getBestOneRmForExercise, getBestRepsForExercise, listExerciseIdsWithLoggedSets } from '@/db/queries/workoutLogs';
import { computeLevelScore, levelOrder, pickBracket, progressWithinTier, type PerformanceStandardRow } from '@/domain/performanceLevel';
import type { PerformanceLevel } from '@/domain/types';

interface ExerciseRow {
  exerciseId: string;
  exerciseName: string;
  exerciseNameEn: string;
  bestOneRm: number;
  metric: 'one_rm_kg' | 'reps';
  score: number;
  tier: PerformanceLevel;
  thresholds: PerformanceStandardRow[];
}

export default function MuscleGroupDetailScreen() {
  const { t } = useTranslation();
  const localize = useLocalize();
  const { muscleGroupId } = useLocalSearchParams<{ muscleGroupId: string }>();

  function formatMetricValue(value: number, metric: 'one_rm_kg' | 'reps'): string {
    return metric === 'reps' ? t('metric.reps', { count: value }) : t('metric.kg', { value });
  }

  const [muscle, setMuscle] = useState<Awaited<ReturnType<typeof getMuscleGroupById>> | null>(null);
  const [rows, setRows] = useState<ExerciseRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [muscleRow, profile, settings, exercisesForMuscle] = await Promise.all([
        getMuscleGroupById(muscleGroupId),
        getUserProfile(),
        getAppSettings(),
        listExercisesByPrimaryMuscle(muscleGroupId),
      ]);
      if (!muscleRow || !profile) {
        setLoaded(true);
        return;
      }
      setMuscle(muscleRow);
      const formula = settings?.oneRmFormula ?? 'epley';

      // Ne garder que les exercices déjà pratiqués : le catalogue peut compter des dizaines
      // d'exercices par groupe musculaire, mais seuls ceux loggés valent la peine d'une requête.
      const loggedExerciseIds = new Set(await listExerciseIdsWithLoggedSets(profile.performanceResetAt));
      const results: ExerciseRow[] = [];
      for (const exercise of exercisesForMuscle) {
        if (!loggedExerciseIds.has(exercise.exerciseId)) continue;
        const standards = await getPerformanceStandards(exercise.exerciseId);
        const metric: 'one_rm_kg' | 'reps' = standards[0]?.metric ?? 'one_rm_kg';
        const bestOneRm =
          metric === 'reps'
            ? await getBestRepsForExercise(exercise.exerciseId, profile.performanceResetAt)
            : await getBestOneRmForExercise(exercise.exerciseId, formula, profile.performanceResetAt);
        if (bestOneRm === null) continue;

        const bracket = pickBracket(standards, profile.sex, profile.bodyWeightKg);
        const result = computeLevelScore(bestOneRm, bracket);
        if (result.score === null || !result.tier) continue;

        const thresholds = [...bracket].sort(
          (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level),
        );

        results.push({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          exerciseNameEn: exercise.exerciseNameEn,
          bestOneRm,
          metric,
          score: result.score,
          tier: result.tier,
          thresholds,
        });
      }
      setRows(results);
      setLoaded(true);
    })();
  }, [muscleGroupId]);

  if (!loaded) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">{muscle ? localize(muscle.name, muscle.nameEn) : t('muscleDetail.fallbackTitle')}</ThemedText>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.exerciseId}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('muscleDetail.empty')}</ThemedText>}
          renderItem={({ item }) => (
            <Link href={`/exercises/${item.exerciseId}`} asChild>
              <Pressable>
                <Card style={styles.card}>
                  <ThemedView style={styles.cardHeader}>
                    <ThemedText type="smallBold" style={styles.cardTitle} numberOfLines={1}>
                      {localize(item.exerciseName, item.exerciseNameEn)}
                    </ThemedText>
                    <Ionicons name="medal" size={24} color={LevelTierInfo[item.tier].color} />
                  </ThemedView>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t('muscleDetail.rowSummary', {
                      tier: t(`enums.levelTier.${item.tier}`),
                      score: item.score.toFixed(1),
                      metricLabel: item.metric === 'reps' ? t('muscleDetail.record') : t('muscleDetail.oneRm'),
                      value: formatMetricValue(item.bestOneRm, item.metric),
                    })}
                  </ThemedText>
                  <LevelProgressBar progress={progressWithinTier(item.score)} level={item.tier} />
                  <ThemedView style={styles.thresholdRow}>
                    {item.thresholds.map((threshold) => {
                      const isCurrent = threshold.level === item.tier;
                      const tierColor = LevelTierInfo[threshold.level].color;
                      return (
                        <ThemedView
                          key={threshold.level}
                          style={[styles.thresholdChip, !isCurrent && styles.thresholdChipDimmed]}>
                          <Ionicons name="medal" size={14} color={tierColor} />
                          <ThemedText
                            type="small"
                            style={{ color: tierColor, fontWeight: isCurrent ? '700' : '500' }}>
                            {t('muscleDetail.thresholdLabel', {
                              tier: LevelTierInfo[threshold.level].tier,
                              value: formatMetricValue(threshold.minOneRmKg, item.metric),
                            })}
                          </ThemedText>
                        </ThemedView>
                      );
                    })}
                  </ThemedView>
                </Card>
              </Pressable>
            </Link>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  card: { marginBottom: Spacing.two, gap: Spacing.one },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  cardTitle: { flexShrink: 1 },
  thresholdRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap', marginTop: Spacing.one, backgroundColor: 'transparent' },
  thresholdChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  thresholdChipDimmed: { opacity: 0.6 },
});
