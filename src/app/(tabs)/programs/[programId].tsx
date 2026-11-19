import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Link, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog, type ConfirmDialogRequest } from '@/components/ui/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { PremiumGateModal } from '@/components/ui/PremiumGateModal';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremiumSessionGate } from '@/hooks/use-premium-session-gate';
import { deleteProgram, getProgramWithSessions, removeSessionFromProgram } from '@/db/queries/programs';
import { finishWorkoutLog, getActiveWorkoutLog, startWorkoutLog } from '@/db/queries/workoutLogs';

export default function ProgramDetailScreen() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [program, setProgram] = useState<Awaited<ReturnType<typeof getProgramWithSessions>>>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmDialogRequest | null>(null);
  const { gate, runGated, dismiss: dismissGate, retryAfterUnlock } = usePremiumSessionGate();

  const load = useCallback(() => {
    getProgramWithSessions(Number(programId)).then(setProgram);
  }, [programId]);

  useFocusEffect(load);

  async function startNewLog(sessionTemplateId: number) {
    const log = await startWorkoutLog(sessionTemplateId, Number(programId));
    router.push(`/player/${sessionTemplateId}?workoutLogId=${log.id}`);
  }

  async function handleStart(sessionTemplateId: number) {
    const active = await getActiveWorkoutLog();
    if (active && active.sessionTemplateId === sessionTemplateId) {
      router.push(`/player/${sessionTemplateId}?workoutLogId=${active.id}`);
      return;
    }
    await runGated(async () => {
      if (!active) {
        await startNewLog(sessionTemplateId);
        return;
      }
      setConfirmRequest({
        title: 'Une séance est déjà en cours',
        message: `« ${active.templateNameSnapshot} » est en cours. L'abandonner pour démarrer celle-ci à la place ?`,
        confirmLabel: 'Abandonner et démarrer',
        onConfirm: async () => {
          await finishWorkoutLog(active.id, 'aborted');
          await startNewLog(sessionTemplateId);
        },
      });
    });
  }

  function handleRemoveSession(sessionTemplateId: number, name: string) {
    setConfirmRequest({
      title: 'Retirer cette séance ?',
      message: `« ${name} » sera retirée de ce programme (la séance elle-même n'est pas supprimée).`,
      confirmLabel: 'Retirer',
      onConfirm: async () => {
        await removeSessionFromProgram(Number(programId), sessionTemplateId);
        load();
      },
    });
  }

  function handleDeleteProgram() {
    if (!program) return;
    setConfirmRequest({
      title: 'Supprimer ce programme ?',
      message: `« ${program.name} » sera supprimé. Les séances qu'il contient resteront disponibles.`,
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        await deleteProgram(Number(programId));
        router.replace('/programs');
      },
    });
  }

  if (!program) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.headerRow}>
          <ThemedText type="subtitle" style={styles.headerTitle} numberOfLines={1}>
            {program.name}
          </ThemedText>
          <GameButton silent onPress={handleDeleteProgram} style={[styles.deleteProgramButton, { borderColor: colors.danger }]}>
            <ThemedText type="small" style={{ color: colors.danger }}>
              Supprimer
            </ThemedText>
          </GameButton>
        </ThemedView>
        <ThemedText type="small" themeColor="textSecondary">
          {program.sessionsPerWeek} séance(s)/semaine
        </ThemedText>

        <FlatList
          data={program.sessions}
          keyExtractor={(item) => String(item.id)}
          style={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <ThemedText type="smallBold" numberOfLines={1}>
                {item.dayLabel ?? item.name}
              </ThemedText>
              <ThemedView style={styles.cardActions}>
                <GameButton
                  onPress={() => handleStart(item.id)}
                  style={[styles.actionButton, { backgroundColor: colors.accent }]}>
                  <ThemedText type="small" style={{ color: '#FFFFFF' }}>
                    Lancer
                  </ThemedText>
                </GameButton>
                <Link href={`/programs/templates/${item.id}`} asChild>
                  <GameButton
                    style={StyleSheet.flatten([styles.actionButton, styles.actionButtonOutline, { borderColor: colors.accent }])}>
                    <ThemedText type="small" themeColor="accent">
                      Détails
                    </ThemedText>
                  </GameButton>
                </Link>
                <GameButton
                  silent
                  onPress={() => handleRemoveSession(item.id, item.dayLabel ?? item.name)}
                  style={[styles.actionButton, styles.actionButtonOutline, { borderColor: colors.danger }]}>
                  <ThemedText type="small" style={{ color: colors.danger }}>
                    Supprimer
                  </ThemedText>
                </GameButton>
              </ThemedView>
            </Card>
          )}
          ListFooterComponent={
            <ThemedView style={styles.footer}>
              <Link href={{ pathname: '/programs/templates/new', params: { programId } }} asChild>
                <GameButton style={StyleSheet.flatten([styles.addSessionButton, { borderColor: colors.accent }])}>
                  <ThemedText type="small" themeColor="accent">
                    + Ajouter une séance
                  </ThemedText>
                </GameButton>
              </Link>
            </ThemedView>
          }
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
  list: { flex: 1 },
  footer: { marginTop: Spacing.two, backgroundColor: 'transparent' },
  deleteProgramButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  card: { marginBottom: Spacing.two, gap: Spacing.two },
  cardActions: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap', backgroundColor: 'transparent' },
  actionButton: { borderRadius: 999, paddingVertical: Spacing.one, paddingHorizontal: Spacing.three },
  actionButtonOutline: { borderWidth: 1.5 },
  addSessionButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
});
