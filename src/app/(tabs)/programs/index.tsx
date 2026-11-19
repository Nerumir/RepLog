import { useCallback, useState } from 'react';
import { Link, router, useFocusEffect } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog, type ConfirmDialogRequest } from '@/components/ui/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { HelpButton } from '@/components/ui/HelpButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { listPrograms } from '@/db/queries/programs';
import { deleteSessionTemplate, listSessionTemplatesWithProgramInfo } from '@/db/queries/sessionTemplates';
import { getActiveWorkoutLog } from '@/db/queries/workoutLogs';

export default function ProgramsScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [programs, setPrograms] = useState<Awaited<ReturnType<typeof listPrograms>>>([]);
  const [templates, setTemplates] = useState<Awaited<ReturnType<typeof listSessionTemplatesWithProgramInfo>>>([]);
  const [activeLog, setActiveLog] = useState<Awaited<ReturnType<typeof getActiveWorkoutLog>> | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmDialogRequest | null>(null);

  const load = useCallback(() => {
    listPrograms().then(setPrograms);
    listSessionTemplatesWithProgramInfo().then(setTemplates);
    getActiveWorkoutLog().then(setActiveLog);
  }, []);

  useFocusEffect(load);

  function handleDeleteOrphan(sessionTemplateId: number, name: string) {
    setConfirmRequest({
      title: t('programs.deleteOrphanDialog.title'),
      message: t('programs.deleteOrphanDialog.message', { name }),
      confirmLabel: t('common.delete'),
      onConfirm: async () => {
        await deleteSessionTemplate(sessionTemplateId);
        load();
      },
    });
  }

  const orphans = templates.filter((tmpl) => tmpl.isOrphan);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.headerRow}>
          <ThemedView style={styles.headerTitleRow}>
            <ThemedText type="subtitle">{t('tabs.training')}</ThemedText>
            <HelpButton title={t('programs.help.title')} body={t('programs.help.body')} />
          </ThemedView>
          <ThemedView style={styles.headerActions}>
            <Link href="/programs/generate" asChild>
              <GameButton style={StyleSheet.flatten([styles.pillButtonOutline, { borderColor: colors.accent }])}>
                <ThemedText type="small" themeColor="accent">
                  {t('programs.generate')}
                </ThemedText>
              </GameButton>
            </Link>
            <Link href="/programs/new" asChild>
              <GameButton style={StyleSheet.flatten([styles.pillButton, { backgroundColor: colors.accent }])}>
                <ThemedText type="small" style={styles.pillButtonText}>
                  {t('programs.newProgram')}
                </ThemedText>
              </GameButton>
            </Link>
          </ThemedView>
        </ThemedView>

        {activeLog && activeLog.sessionTemplateId && (
          <GameButton
            onPress={() => router.push(`/player/${activeLog.sessionTemplateId}?workoutLogId=${activeLog.id}`)}>
            <Card glow="gold" style={styles.activeCard}>
              <ThemedText type="smallBold" style={styles.activeSessionText}>
                {t('programs.resumeActiveSession', { name: activeLog.templateNameSnapshot })}
              </ThemedText>
            </Card>
          </GameButton>
        )}

        <FlatList
          data={programs}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('programs.empty')}</ThemedText>}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(16)}>
              <Link href={`/programs/${item.id}`} asChild>
                <Pressable>
                  <Card style={styles.card}>
                    <ThemedText type="smallBold">{item.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {t('programs.sessionsPerWeek', { count: item.sessionsPerWeek })}
                    </ThemedText>
                  </Card>
                </Pressable>
              </Link>
            </Animated.View>
          )}
          ListFooterComponent={
            orphans.length > 0 ? (
              <ThemedView style={styles.orphanSection}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  {t('programs.orphanSessions')}
                </ThemedText>
                {orphans.map((item) => (
                  <Card key={item.id} style={[styles.card, { borderColor: colors.danger, borderWidth: 1.5 }]}>
                    <ThemedText type="smallBold">{item.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {t('programs.defaultRest', { seconds: item.defaultRestSeconds })}
                    </ThemedText>
                    <ThemedView style={styles.orphanActions}>
                      <Link href={`/programs/templates/${item.id}`} asChild>
                        <GameButton style={StyleSheet.flatten([styles.smallPillOutline, { borderColor: colors.accent }])}>
                          <ThemedText type="small" themeColor="accent">
                            {t('programs.details')}
                          </ThemedText>
                        </GameButton>
                      </Link>
                      <GameButton
                        silent
                        onPress={() => handleDeleteOrphan(item.id, item.name)}
                        style={StyleSheet.flatten([styles.smallPillOutline, { borderColor: colors.danger }])}>
                        <ThemedText type="small" style={{ color: colors.danger }}>
                          {t('common.delete')}
                        </ThemedText>
                      </GameButton>
                    </ThemedView>
                  </Card>
                ))}
              </ThemedView>
            ) : undefined
          }
        />
      </SafeAreaView>
      <ConfirmDialog request={confirmRequest} onDismiss={() => setConfirmRequest(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  headerRow: { gap: Spacing.two },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  headerActions: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  pillButton: { borderRadius: 999, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three },
  pillButtonOutline: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  pillButtonText: { color: '#FFFFFF', fontWeight: '700' },
  activeCard: { gap: 0 },
  activeSessionText: { color: '#1C1203' },
  card: { marginBottom: Spacing.two, gap: 4 },
  orphanSection: { gap: Spacing.two, marginTop: Spacing.three, backgroundColor: 'transparent' },
  orphanActions: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  smallPillOutline: { borderRadius: 999, borderWidth: 1.5, paddingVertical: Spacing.one, paddingHorizontal: Spacing.three },
});
