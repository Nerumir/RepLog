import { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog, type ConfirmDialogRequest } from '@/components/ui/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { PremiumGateModal } from '@/components/ui/PremiumGateModal';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalize } from '@/i18n/localize';
import { usePremiumSessionGate } from '@/hooks/use-premium-session-gate';
import { listBodyweightOnlyExerciseIds } from '@/db/queries/exercises';
import { getSessionTemplateDetail } from '@/db/queries/sessionTemplates';
import { finishWorkoutLog, getActiveWorkoutLog, startWorkoutLog } from '@/db/queries/workoutLogs';

export default function SessionTemplateDetailScreen() {
  const { t } = useTranslation();
  const localize = useLocalize();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [template, setTemplate] = useState<Awaited<ReturnType<typeof getSessionTemplateDetail>>>(null);
  const [bodyweightIds, setBodyweightIds] = useState<Set<string>>(new Set());
  const [confirmRequest, setConfirmRequest] = useState<ConfirmDialogRequest | null>(null);
  const { gate, runGated, dismiss: dismissGate, retryAfterUnlock } = usePremiumSessionGate();

  useEffect(() => {
    getSessionTemplateDetail(Number(templateId)).then(setTemplate);
    listBodyweightOnlyExerciseIds().then(setBodyweightIds);
  }, [templateId]);

  async function startNewLog() {
    const log = await startWorkoutLog(Number(templateId));
    router.push(`/player/${templateId}?workoutLogId=${log.id}`);
  }

  async function handleStart() {
    const active = await getActiveWorkoutLog();
    if (active && active.sessionTemplateId === Number(templateId)) {
      router.push(`/player/${templateId}?workoutLogId=${active.id}`);
      return;
    }
    await runGated(async () => {
      if (!active) {
        await startNewLog();
        return;
      }
      setConfirmRequest({
        title: t('programDetail.activeSessionDialog.title'),
        message: t('programDetail.activeSessionDialog.message', { name: active.templateNameSnapshot }),
        confirmLabel: t('programDetail.activeSessionDialog.confirmLabel'),
        onConfirm: async () => {
          await finishWorkoutLog(active.id, 'aborted');
          await startNewLog();
        },
      });
    });
  }

  if (!template) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.headerRow}>
          <ThemedText type="subtitle" style={styles.headerTitle} numberOfLines={1}>
            {template.name}
          </ThemedText>
          <Link href={`/programs/templates/${templateId}/edit`} asChild>
            <GameButton style={StyleSheet.flatten([styles.editButton, { borderColor: colors.accent }])}>
              <ThemedText type="small" themeColor="accent">
                {t('sessionDetail.edit')}
              </ThemedText>
            </GameButton>
          </Link>
        </ThemedView>
        <ThemedText type="small" themeColor="textSecondary">
          {t('sessionDetail.defaultRest', { seconds: template.defaultRestSeconds })}
        </ThemedText>

        <GameButton style={[styles.startButton, { backgroundColor: colors.accent }]} onPress={handleStart}>
          <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
            {t('sessionDetail.startSession')}
          </ThemedText>
        </GameButton>

        <FlatList
          data={template.exercises}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <ThemedView style={styles.exerciseCardHeader}>
                <ThemedText type="smallBold" style={styles.exerciseCardTitle} numberOfLines={1}>
                  {localize(item.exerciseName, item.exerciseNameEn)}
                </ThemedText>
                <Link href={`/exercises/${item.exerciseId}`} asChild>
                  <GameButton style={StyleSheet.flatten([styles.detailsButton, { borderColor: colors.accent }])}>
                    <ThemedText type="small" themeColor="accent">
                      {t('programs.details')}
                    </ThemedText>
                  </GameButton>
                </Link>
              </ThemedView>
              <ThemedText type="small" themeColor="textSecondary">
                {t('sessionDetail.setsAndRest', {
                  count: item.sets.length,
                  seconds: item.restSecondsOverride ?? template.defaultRestSeconds,
                })}
              </ThemedText>
              {item.sets.map((set) => (
                <ThemedText key={set.id} type="small">
                  {t('sessionDetail.setLine', {
                    index: set.setIndex + 1,
                    detail: bodyweightIds.has(item.exerciseId)
                      ? t('sessionDetail.repsOnly', { count: set.targetReps })
                      : t('sessionDetail.weightReps', { weight: set.targetWeightKg, count: set.targetReps }),
                  })}
                </ThemedText>
              ))}
            </Card>
          )}
        />
      </SafeAreaView>
      <ConfirmDialog request={confirmRequest} onDismiss={() => setConfirmRequest(null)} />
      <PremiumGateModal
        visible={gate !== null}
        limitReached
        completedSessions={gate?.completedSessions ?? 0}
        onDismiss={dismissGate}
        onUnlocked={retryAfterUnlock}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  headerTitle: { flexShrink: 1 },
  editButton: { borderRadius: 999, borderWidth: 1.5, paddingVertical: Spacing.one, paddingHorizontal: Spacing.three },
  startButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  card: { marginBottom: Spacing.two, gap: 4 },
  exerciseCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  exerciseCardTitle: { flexShrink: 1 },
  detailsButton: { borderRadius: 999, borderWidth: 1.5, paddingVertical: 2, paddingHorizontal: Spacing.two },
});
