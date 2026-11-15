import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { ExercisePicker } from '@/components/exercise/ExercisePicker';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { playError } from '@/audio/soundEffects';
import { getExerciseMuscles, listBodyweightOnlyExerciseIds, listExercises } from '@/db/queries/exercises';
import { getSessionTemplateDetail, replaceSessionTemplateExercises, updateSessionTemplate } from '@/db/queries/sessionTemplates';
import { buildSessionLabel } from '@/domain/sessionLabel';

interface DraftSet {
  targetReps: string;
  targetWeightKg: string;
}

interface DraftExercise {
  exerciseId: string;
  exerciseName: string;
  restSecondsOverride: string;
  sets: DraftSet[];
}

export default function EditSessionTemplateScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [loaded, setLoaded] = useState(false);
  const [defaultRestSeconds, setDefaultRestSeconds] = useState('90');
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [catalog, setCatalog] = useState<Awaited<ReturnType<typeof listExercises>>>([]);
  const [bodyweightIds, setBodyweightIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listExercises().then(setCatalog);
    listBodyweightOnlyExerciseIds().then(setBodyweightIds);
    getSessionTemplateDetail(Number(templateId)).then((template) => {
      if (!template) return;
      setDefaultRestSeconds(String(template.defaultRestSeconds));
      setExercises(
        template.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          restSecondsOverride: exercise.restSecondsOverride ? String(exercise.restSecondsOverride) : '',
          sets: exercise.sets.map((set) => ({
            targetReps: String(set.targetReps),
            targetWeightKg: String(set.targetWeightKg),
          })),
        })),
      );
      setLoaded(true);
    });
  }, [templateId]);

  function addExercise(exerciseId: string, exerciseName: string) {
    const defaultWeight = bodyweightIds.has(exerciseId) ? '0' : '20';
    setExercises((prev) => [
      ...prev,
      {
        exerciseId,
        exerciseName,
        restSecondsOverride: '',
        sets: [
          { targetReps: '8', targetWeightKg: defaultWeight },
          { targetReps: '8', targetWeightKg: defaultWeight },
          { targetReps: '8', targetWeightKg: defaultWeight },
        ],
      },
    ]);
    setPickerOpen(false);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setExercises((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateExerciseField(index: number, field: 'restSecondsOverride', value: string) {
    setExercises((prev) => prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)));
  }

  function addSet(exerciseIndex: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? { ...ex, sets: [...ex.sets, { targetReps: '8', targetWeightKg: bodyweightIds.has(ex.exerciseId) ? '0' : '20' }] }
          : ex,
      ),
    );
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === exerciseIndex ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIndex) } : ex)),
    );
  }

  function updateSetField(exerciseIndex: number, setIndex: number, field: keyof DraftSet, value: string) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? { ...ex, sets: ex.sets.map((set, si) => (si === setIndex ? { ...set, [field]: value } : set)) }
          : ex,
      ),
    );
  }

  async function handleSave() {
    if (exercises.length === 0) {
      playError();
      setError('Ajoute au moins un exercice.');
      return;
    }

    const primaryMuscleNames: string[] = [];
    for (const exercise of exercises) {
      const muscles = await getExerciseMuscles(exercise.exerciseId);
      for (const muscle of muscles) {
        if (muscle.role === 'primary') primaryMuscleNames.push(muscle.name);
      }
    }

    const id = Number(templateId);
    await updateSessionTemplate(id, {
      name: buildSessionLabel(primaryMuscleNames),
      defaultRestSeconds: Number(defaultRestSeconds) || 90,
    });
    await replaceSessionTemplateExercises(
      id,
      exercises.map((exercise, index) => ({
        exerciseId: exercise.exerciseId,
        orderIndex: index,
        restSecondsOverride: exercise.restSecondsOverride ? Number(exercise.restSecondsOverride) : undefined,
        sets: exercise.sets.map((set, setIndex) => ({
          setIndex,
          targetReps: Number(set.targetReps) || 0,
          targetWeightKg: bodyweightIds.has(exercise.exerciseId) ? 0 : Number(set.targetWeightKg) || 0,
        })),
      })),
    );

    router.replace(`/programs/templates/${id}`);
  }

  if (!loaded) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Modifier la séance</ThemedText>

          <ThemedText type="small">Repos par défaut entre séries (s)</ThemedText>
          <TextInput
            value={defaultRestSeconds}
            onChangeText={setDefaultRestSeconds}
            keyboardType="numeric"
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />

          {exercises.map((exercise, exerciseIndex) => (
            <Card key={`${exercise.exerciseId}-${exerciseIndex}`} style={styles.card}>
              <ThemedView style={styles.cardHeader}>
                <ThemedText type="smallBold" style={styles.cardHeaderTitle} numberOfLines={1}>
                  {exercise.exerciseName}
                </ThemedText>
                <ThemedView style={styles.cardHeaderActions}>
                  <GameButton
                    silent
                    onPress={() => moveExercise(exerciseIndex, -1)}
                    style={StyleSheet.flatten([styles.iconButton, { borderColor: colors.accent }])}>
                    <ThemedText type="small" themeColor="accent">
                      ↑
                    </ThemedText>
                  </GameButton>
                  <GameButton
                    silent
                    onPress={() => moveExercise(exerciseIndex, 1)}
                    style={StyleSheet.flatten([styles.iconButton, { borderColor: colors.accent }])}>
                    <ThemedText type="small" themeColor="accent">
                      ↓
                    </ThemedText>
                  </GameButton>
                  <GameButton
                    silent
                    onPress={() => removeExercise(exerciseIndex)}
                    style={StyleSheet.flatten([styles.smallPillOutline, { borderColor: colors.danger }])}>
                    <ThemedText type="small" style={{ color: colors.danger }}>
                      Retirer
                    </ThemedText>
                  </GameButton>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.restOverrideRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Repos (sec)
                </ThemedText>
                <TextInput
                  value={exercise.restSecondsOverride}
                  onChangeText={(value) => updateExerciseField(exerciseIndex, 'restSecondsOverride', value)}
                  keyboardType="numeric"
                  placeholder="défaut"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.restOverrideInput, { color: colors.text, borderColor: colors.backgroundSelected }]}
                />
              </ThemedView>

              {exercise.sets.map((set, setIndex) => (
                <ThemedView key={setIndex} style={styles.setRow}>
                  <ThemedText type="small" style={styles.setLabel}>
                    Série {setIndex + 1}
                  </ThemedText>
                  {!bodyweightIds.has(exercise.exerciseId) && (
                    <>
                      <TextInput
                        value={set.targetWeightKg}
                        onChangeText={(value) => updateSetField(exerciseIndex, setIndex, 'targetWeightKg', value)}
                        keyboardType="numeric"
                        style={[styles.setInput, { color: colors.text, borderColor: colors.backgroundSelected }]}
                      />
                      <ThemedText type="small">kg ×</ThemedText>
                    </>
                  )}
                  <TextInput
                    value={set.targetReps}
                    onChangeText={(value) => updateSetField(exerciseIndex, setIndex, 'targetReps', value)}
                    keyboardType="numeric"
                    maxLength={2}
                    style={[styles.setInputReps, { color: colors.text, borderColor: colors.backgroundSelected }]}
                  />
                  <ThemedText type="small">reps</ThemedText>
                  <GameButton
                    silent
                    onPress={() => removeSet(exerciseIndex, setIndex)}
                    style={StyleSheet.flatten([styles.iconButton, styles.removeSetButton, { borderColor: colors.danger }])}>
                    <ThemedText type="small" style={{ color: colors.danger }}>
                      ✕
                    </ThemedText>
                  </GameButton>
                </ThemedView>
              ))}
              <GameButton
                silent
                onPress={() => addSet(exerciseIndex)}
                style={StyleSheet.flatten([styles.smallPillOutline, { borderColor: colors.accent, alignSelf: 'flex-start' }])}>
                <ThemedText type="small" themeColor="accent">
                  + Série
                </ThemedText>
              </GameButton>
            </Card>
          ))}

          <GameButton
            style={StyleSheet.flatten([styles.addExerciseButton, { borderColor: colors.accent }])}
            onPress={() => setPickerOpen(true)}>
            <ThemedText type="smallBold" themeColor="accent">
              + Ajouter un exercice
            </ThemedText>
          </GameButton>


          {error && (
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          )}

          <GameButton style={[styles.submit, { backgroundColor: colors.accent }]} onPress={handleSave}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              Enregistrer les modifications
            </ThemedText>
          </GameButton>
        </ScrollView>

        {pickerOpen && (
          <Pressable style={styles.pickerBackdrop} onPress={() => setPickerOpen(false)}>
            <Pressable style={[styles.pickerOverlay, { backgroundColor: colors.background }]} onPress={() => {}}>
              <ThemedView style={styles.pickerOverlayHeader}>
                <ThemedText type="smallBold">Choisir un exercice</ThemedText>
                <GameButton
                  silent
                  onPress={() => setPickerOpen(false)}
                  style={StyleSheet.flatten([styles.smallPillOutline, { borderColor: colors.accent }])}>
                  <ThemedText type="small" themeColor="accent">
                    Fermer
                  </ThemedText>
                </GameButton>
              </ThemedView>
              <ExercisePicker catalog={catalog} onSelect={addExercise} />
            </Pressable>
          </Pressable>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  pickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: '12%',
  },
  pickerOverlay: {
    marginHorizontal: Spacing.four,
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pickerOverlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  content: { padding: Spacing.four, gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  card: { gap: Spacing.two, marginTop: Spacing.two },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' },
  cardHeaderTitle: { flexShrink: 1 },
  cardHeaderActions: { flexDirection: 'row', gap: Spacing.two, backgroundColor: 'transparent' },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  setLabel: { width: 70 },
  removeSetButton: { marginLeft: 'auto' },
  restOverrideRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' },
  restOverrideInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: Spacing.two, paddingVertical: 4, width: 72, textAlign: 'center' },
  setInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: Spacing.two, paddingVertical: 4, width: 56 },
  setInputReps: { borderWidth: 1, borderRadius: 8, paddingHorizontal: Spacing.two, paddingVertical: 4, width: 36, textAlign: 'center' },
  addExerciseButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
  },
  iconButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallPillOutline: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  submit: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.three },
});
