import { useCallback, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseMediaView } from '@/components/exercise/ExerciseMediaView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { attachSessionTemplateToProgram, createProgram } from '@/db/queries/programs';
import { listExercisesForGeneration } from '@/db/queries/exerciseGenerationCatalog';
import { addExerciseToSessionTemplate, createSessionTemplate } from '@/db/queries/sessionTemplates';
import {
  generateProgram,
  type ExperienceLevel,
  type GenerationExerciseRow,
  type ProgramGeneratorInput,
  type ProgramGeneratorResult,
  type ProgramGoal,
} from '@/domain/programGenerator';
import type { SplitType } from '@/domain/splitTypes';
import type { EquipmentId } from '@/domain/types';

export default function GeneratedProgramPreviewScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const params = useLocalSearchParams<{
    sessionsPerWeek: string;
    availableEquipment: string;
    goal: string;
    experience: string;
    minutesPerSession: string;
    splitType: string;
  }>();

  const [catalog, setCatalog] = useState<GenerationExerciseRow[] | null>(null);
  const [result, setResult] = useState<ProgramGeneratorResult | null>(null);
  const [saving, setSaving] = useState(false);

  const input: ProgramGeneratorInput = {
    sessionsPerWeek: Number(params.sessionsPerWeek) || 3,
    availableEquipment: params.availableEquipment.split(',').filter(Boolean) as EquipmentId[],
    goal: params.goal as ProgramGoal,
    experience: params.experience as ExperienceLevel,
    minutesPerSession: Number(params.minutesPerSession) || 40,
    splitType: params.splitType as SplitType,
  };

  useEffect(() => {
    listExercisesForGeneration().then((rows) => {
      setCatalog(rows);
      setResult(generateProgram(input, rows));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- input dérive des params de l'URL, stables pour la durée de vie de l'écran.
  }, []);

  const regenerate = useCallback(() => {
    if (!catalog) return;
    setResult(generateProgram(input, catalog));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idem : on régénère volontairement avec le même input figé.
  }, [catalog]);

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      const program = await createProgram({
        name: result.programName,
        splitType: result.splitType,
        sessionsPerWeek: result.sessionsPerWeek,
        source: 'generated',
      });

      for (const [index, session] of result.sessions.entries()) {
        const template = await createSessionTemplate({ name: session.name, defaultRestSeconds: session.defaultRestSeconds });
        for (const [exerciseIndex, exercise] of session.exercises.entries()) {
          const weight = exercise.isBodyweight ? 0 : 20;
          await addExerciseToSessionTemplate({
            sessionTemplateId: template.id,
            exerciseId: exercise.exerciseId,
            orderIndex: exerciseIndex,
            sets: [
              { setIndex: 0, targetReps: 8, targetWeightKg: weight },
              { setIndex: 1, targetReps: 8, targetWeightKg: weight },
              { setIndex: 2, targetReps: 8, targetWeightKg: weight },
            ],
          });
        }
        await attachSessionTemplateToProgram(program.id, template.id, index, session.name);
      }

      router.replace(`/programs/${program.id}`);
    } finally {
      setSaving(false);
    }
  }

  if (!result) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText themeColor="textSecondary">Génération du programme...</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">{result.programName}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {result.sessionsPerWeek} séance(s)/semaine
          </ThemedText>

          {result.warnings.map((warning) => (
            <ThemedText key={warning} type="small" themeColor="textSecondary">
              ⚠ {warning}
            </ThemedText>
          ))}

          {result.sessions.map((session) => (
            <Card key={session.name} style={styles.sessionCard}>
              <ThemedText type="smallBold">{session.name}</ThemedText>
              {session.exercises.length === 0 ? (
                <ThemedText type="small" themeColor="textSecondary">
                  Aucun exercice ne correspond à tes critères pour cette séance.
                </ThemedText>
              ) : (
                session.exercises.map((exercise) => (
                  <ThemedView key={exercise.exerciseId} style={styles.exerciseRow}>
                    <ExerciseMediaView exerciseId={exercise.exerciseId} width={48} height={48} autoPlay={false} />
                    <ThemedText type="default" style={styles.exerciseName} numberOfLines={1}>
                      {exercise.exerciseName}
                    </ThemedText>
                  </ThemedView>
                ))
              )}
            </Card>
          ))}

          <GameButton
            style={StyleSheet.flatten([styles.regenerateButton, { borderColor: colors.accent }])}
            onPress={regenerate}>
            <ThemedText type="smallBold" themeColor="accent">
              🎲 Régénérer
            </ThemedText>
          </GameButton>

          <GameButton style={[styles.submit, { backgroundColor: colors.accent }]} onPress={handleSave} disabled={saving}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              {saving ? 'Enregistrement...' : 'Enregistrer ce programme'}
            </ThemedText>
          </GameButton>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.two },
  sessionCard: { gap: Spacing.two },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  exerciseName: { flexShrink: 1, flex: 1 },
  regenerateButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  submit: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.two, marginBottom: Spacing.four },
});
