import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-gifted-charts';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { MuscleBodyDiagram, type MuscleHighlights } from '@/components/exercise/MuscleBodyDiagram';
import { ExerciseMediaView } from '@/components/exercise/ExerciseMediaView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LevelProgressBar } from '@/components/ui/LevelProgressBar';
import { Colors, LevelTierInfo, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalize } from '@/i18n/localize';
import {
  getExerciseById,
  getExerciseEquipment,
  getExerciseMuscles,
  getPerformanceStandards,
} from '@/db/queries/exercises';
import { getUserProfile } from '@/db/queries/profile';
import { getAppSettings } from '@/db/queries/settings';
import {
  getBestOneRmForExercise,
  getBestRepsForExercise,
  getOneRmHistoryForExercise,
  getRepsHistoryForExercise,
} from '@/db/queries/workoutLogs';
import {
  computeLevelScore,
  levelOrder,
  pickBracket,
  progressWithinTier,
  type LevelScoreResult,
  type PerformanceStandardRow,
} from '@/domain/performanceLevel';

type ExerciseDetailData = {
  exercise: NonNullable<Awaited<ReturnType<typeof getExerciseById>>>;
  muscles: Awaited<ReturnType<typeof getExerciseMuscles>>;
  equipment: Awaited<ReturnType<typeof getExerciseEquipment>>;
  bestOneRm: number | null;
  metric: 'one_rm_kg' | 'reps';
  level: LevelScoreResult | null;
  history: { value: number; label?: string }[];
  thresholds: PerformanceStandardRow[];
};

export default function ExerciseDetailScreen() {
  const { t } = useTranslation();
  const localize = useLocalize();
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [data, setData] = useState<ExerciseDetailData | null>(null);

  useEffect(() => {
    (async () => {
      const exercise = await getExerciseById(exerciseId);
      if (!exercise) return;

      const [muscles, equipment, standards, profile, settings] = await Promise.all([
        getExerciseMuscles(exerciseId),
        getExerciseEquipment(exerciseId),
        getPerformanceStandards(exerciseId),
        getUserProfile(),
        getAppSettings(),
      ]);

      let bestOneRm: number | null = null;
      let level: LevelScoreResult | null = null;
      let history: { value: number; label?: string }[] = [];
      let thresholds: PerformanceStandardRow[] = [];
      const metric: 'one_rm_kg' | 'reps' = standards[0]?.metric ?? 'one_rm_kg';

      if (profile) {
        const bracket = pickBracket(standards, profile.sex, profile.bodyWeightKg);
        thresholds = [...bracket].sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level));

        const formula = settings?.oneRmFormula ?? 'epley';
        bestOneRm =
          metric === 'reps'
            ? await getBestRepsForExercise(exerciseId, profile.performanceResetAt)
            : await getBestOneRmForExercise(exerciseId, formula, profile.performanceResetAt);
        if (bestOneRm !== null) {
          level = computeLevelScore(bestOneRm, bracket);
        }
        const rawHistory =
          metric === 'reps'
            ? await getRepsHistoryForExercise(exerciseId, profile.performanceResetAt)
            : await getOneRmHistoryForExercise(exerciseId, formula, profile.performanceResetAt);
        history = rawHistory.map((point, index) => ({
          value: point.oneRm,
          label: index === 0 || index === rawHistory.length - 1 ? new Date(point.completedAt).toLocaleDateString() : undefined,
        }));
      }

      setData({ exercise, muscles, equipment, bestOneRm, metric, level, history, thresholds });
    })();
  }, [exerciseId]);

  if (!data) return null;

  function formatMetricValue(value: number, metric: 'one_rm_kg' | 'reps'): string {
    return metric === 'reps' ? t('metric.reps', { count: value }) : t('metric.kg', { value });
  }

  const highlights: MuscleHighlights = {};
  for (const muscle of data.muscles) {
    highlights[muscle.muscleGroupId] = muscle.role;
  }

  const levelLabel =
    data.level?.tier && data.level.score !== null
      ? t('exerciseDetail.levelLabel', { tier: t(`enums.levelTier.${data.level.tier}`), score: data.level.score.toFixed(1) })
      : t('exerciseDetail.noDataYet');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">{localize(data.exercise.name, data.exercise.nameEn)}</ThemedText>
          <ThemedView style={styles.mediaWrapper}>
            <ExerciseMediaView exerciseId={data.exercise.id} width={300} height={200} />
          </ThemedView>
          <ThemedText themeColor="textSecondary">{localize(data.exercise.description ?? '', data.exercise.descriptionEn)}</ThemedText>

          <ThemedView style={styles.silhouetteRow}>
            <MuscleBodyDiagram view="front" highlights={highlights} />
            <MuscleBodyDiagram view="back" highlights={highlights} />
          </ThemedView>

          <ThemedText type="smallBold">{t('exerciseDetail.targetedMuscles')}</ThemedText>
          {data.muscles.map((m) => (
            <ThemedText key={m.muscleGroupId} type="small">
              {localize(m.name, m.nameEn)} ({m.role === 'primary' ? t('exerciseDetail.primary') : t('exerciseDetail.secondary')})
            </ThemedText>
          ))}

          <ThemedText type="smallBold" style={styles.sectionSpacing}>
            {t('exerciseDetail.equipment')}
          </ThemedText>
          <ThemedText type="small">
            {data.equipment.map((e) => localize(e.name, e.nameEn)).join(', ') || t('exerciseDetail.equipmentNone')}
          </ThemedText>

          <ThemedText type="smallBold" style={styles.sectionSpacing}>
            {t('exerciseDetail.performance')}
          </ThemedText>
          <ThemedView style={styles.oneRmRow}>
            <ThemedView style={styles.oneRmColumn}>
              <ThemedText type="small" themeColor="textSecondary">
                {data.metric === 'reps' ? t('exerciseDetail.repRecord') : t('exerciseDetail.currentOneRm')}
              </ThemedText>
              <ThemedText type="smallBold">
                {data.bestOneRm !== null ? formatMetricValue(data.bestOneRm, data.metric) : '—'}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles.oneRmColumn, styles.oneRmColumnRight]}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('exerciseDetail.nextLevelGoal')}
              </ThemedText>
              <ThemedText type="smallBold">
                {data.level?.nextThresholdKg != null
                  ? formatMetricValue(data.level.nextThresholdKg, data.metric)
                  : data.level?.tier === 'elite'
                    ? t('exerciseDetail.maxLevel')
                    : '—'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText type="small" themeColor="textSecondary">
            {levelLabel}
          </ThemedText>
          {data.level?.score !== null && data.level?.score !== undefined && (
            <LevelProgressBar progress={progressWithinTier(data.level.score)} level={data.level.tier} />
          )}

          {data.thresholds.length > 0 && (
            <>
              <ThemedText type="smallBold" style={styles.sectionSpacing}>
                {t('exerciseDetail.levelGoalsTitle')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t('exerciseDetail.levelGoalsHint')}
              </ThemedText>
              {data.thresholds.map((threshold) => {
                const isCurrent = threshold.level === data.level?.tier;
                const tierColor = LevelTierInfo[threshold.level].color;
                return (
                  <ThemedView key={threshold.level} style={styles.thresholdRow}>
                    <ThemedText type="small" style={{ color: tierColor, fontWeight: isCurrent ? '700' : '500' }}>
                      {t(`enums.levelTier.${threshold.level}`)}
                    </ThemedText>
                    <ThemedText type="smallBold" style={!isCurrent && styles.thresholdValueDimmed}>
                      {formatMetricValue(threshold.minOneRmKg, data.metric)}
                    </ThemedText>
                  </ThemedView>
                );
              })}
            </>
          )}

          {data.history.length > 1 && (
            <>
              <ThemedText type="smallBold" style={styles.sectionSpacing}>
                {t('exerciseDetail.oneRmEvolution')}
              </ThemedText>
              <LineChart
                data={data.history}
                height={160}
                color={colors.text}
                thickness={2}
                yAxisTextStyle={{ color: colors.textSecondary }}
                xAxisLabelTextStyle={{ color: colors.textSecondary }}
                hideRules
                areaChart
                startFillColor={colors.text}
                startOpacity={0.15}
                endOpacity={0}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.two },
  mediaWrapper: { alignItems: 'center', backgroundColor: 'transparent' },
  silhouetteRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.three },
  sectionSpacing: { marginTop: Spacing.three },
  oneRmRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' },
  oneRmColumn: { gap: 2, backgroundColor: 'transparent' },
  oneRmColumnRight: { alignItems: 'flex-end' },
  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 2,
  },
  thresholdValueDimmed: { opacity: 0.6 },
});
