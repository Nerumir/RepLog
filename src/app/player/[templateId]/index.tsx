import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { playTick } from '@/audio/soundEffects';
import { MuscleBodyDiagram, type MuscleHighlights } from '@/components/exercise/MuscleBodyDiagram';
import { ExerciseMediaView } from '@/components/exercise/ExerciseMediaView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameButton } from '@/components/ui/GameButton';
import { RestCountdownRing } from '@/components/ui/RestCountdownRing';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getExerciseEquipment, getExerciseMuscles } from '@/db/queries/exercises';
import { useWorkoutSessionStore } from '@/state/useWorkoutSessionStore';

interface SetResultInputsProps {
  defaultWeightKg: number;
  defaultReps: number;
  isBodyweight: boolean;
  onSubmit: (weightKg: number, reps: number) => void;
}

function SetResultInputs({ defaultWeightKg, defaultReps, isBodyweight, onSubmit }: SetResultInputsProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [weightInput, setWeightInput] = useState(String(defaultWeightKg));
  const [repsInput, setRepsInput] = useState(String(defaultReps));

  return (
    <>
      <ThemedView style={styles.inputRow}>
        {!isBodyweight && (
          <>
            <TextInput
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="numeric"
              style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
            />
            <ThemedText type="default">kg ×</ThemedText>
          </>
        )}
        <TextInput
          value={repsInput}
          onChangeText={setRepsInput}
          keyboardType="numeric"
          style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
        />
        <ThemedText type="default">reps</ThemedText>
      </ThemedView>

      <GameButton
        style={[styles.primaryButton, { backgroundColor: colors.accent }]}
        onPress={() => onSubmit(isBodyweight ? 0 : Number(weightInput) || 0, Number(repsInput) || 0)}>
        <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
          Terminé
        </ThemedText>
      </GameButton>
    </>
  );
}

export default function SessionPlayerScreen() {
  useKeepAwake();
  const { templateId, workoutLogId } = useLocalSearchParams<{ templateId: string; workoutLogId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { detail, phase, hydrate, completeSet, skipSet, skipRest, completeRestIfElapsed, abandon } = useWorkoutSessionStore();

  const [highlights, setHighlights] = useState<MuscleHighlights>({});
  const [nowTick, setNowTick] = useState(0);
  const [isBodyweight, setIsBodyweight] = useState(false);

  useEffect(() => {
    if (workoutLogId) hydrate(Number(workoutLogId));
  }, [workoutLogId, hydrate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
      const currentPhase = useWorkoutSessionStore.getState().phase;
      if (currentPhase.kind === 'resting') {
        const remaining = currentPhase.restEndsAt - Date.now();
        if (remaining > 0 && remaining <= 3000) playTick();
      }
      completeRestIfElapsed();
    }, 1000);
    return () => clearInterval(interval);
  }, [completeRestIfElapsed]);

  useEffect(() => {
    if (phase.kind === 'summary') {
      router.replace(`/player/${templateId}/summary?workoutLogId=${workoutLogId}`);
    }
  }, [phase, templateId, workoutLogId]);

  const currentExercise = phase.kind === 'performing' ? detail?.exercises[phase.exerciseIndex] : null;
  const currentSet = currentExercise && phase.kind === 'performing' ? currentExercise.sets[phase.setIndex] : null;

  useEffect(() => {
    if (!currentExercise) return;
    getExerciseMuscles(currentExercise.exerciseId).then((muscles) => {
      const next: MuscleHighlights = {};
      for (const muscle of muscles) next[muscle.muscleGroupId] = muscle.role;
      setHighlights(next);
    });
    getExerciseEquipment(currentExercise.exerciseId).then((equipmentRows) => {
      setIsBodyweight(equipmentRows.length === 1 && equipmentRows[0].equipmentId === 'bodyweight');
    });
  }, [currentExercise]);

  async function handleAbandon() {
    await abandon();
    router.back();
  }

  if (!detail || phase.kind === 'idle') return null;

  if (phase.kind === 'resting') {
    const restExercise = detail.exercises[phase.exerciseIndex];
    const remainingSeconds = nowTick === 0 ? null : Math.max(0, Math.ceil((phase.restEndsAt - nowTick) / 1000));
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.restContent}>
            <ThemedText type="subtitle">Repos</ThemedText>
            <RestCountdownRing remainingSeconds={remainingSeconds} totalSeconds={phase.totalRestSeconds} />
            <ThemedText type="default" themeColor="textSecondary">
              Prochaine série : {restExercise.exerciseNameSnapshot}
            </ThemedText>
            <GameButton style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={skipRest}>
              <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
                Passer le repos
              </ThemedText>
            </GameButton>
            <GameButton silent onPress={handleAbandon} style={[styles.abandonButton, { borderColor: colors.danger }]}>
              <ThemedText type="small" style={{ color: colors.danger }}>
                Abandonner la séance
              </ThemedText>
            </GameButton>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!currentExercise || !currentSet || phase.kind !== 'performing') return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Exercice {phase.exerciseIndex + 1}/{detail.exercises.length} · Série {phase.setIndex + 1}/
            {currentExercise.sets.length}
          </ThemedText>
          <ThemedText type="subtitle">{currentExercise.exerciseNameSnapshot}</ThemedText>

          <ExerciseMediaView exerciseId={currentExercise.exerciseId} width={260} height={170} />

          <ThemedView style={styles.silhouetteRow}>
            <MuscleBodyDiagram view="front" highlights={highlights} />
            <MuscleBodyDiagram view="back" highlights={highlights} />
          </ThemedView>

          <ThemedText type="default">
            Cible : {isBodyweight ? `${currentSet.targetReps} reps` : `${currentSet.targetWeightKg}kg × ${currentSet.targetReps}`}
          </ThemedText>

          <SetResultInputs
            key={`${phase.exerciseIndex}-${phase.setIndex}`}
            defaultWeightKg={currentSet.targetWeightKg}
            defaultReps={currentSet.targetReps}
            isBodyweight={isBodyweight}
            onSubmit={(weightKg, reps) => completeSet(weightKg, reps)}
          />

          <GameButton silent onPress={skipSet} style={styles.skipButton}>
            <ThemedText type="small" themeColor="textSecondary">
              Passer cette série
            </ThemedText>
          </GameButton>

          <GameButton silent onPress={handleAbandon} style={[styles.abandonButton, { borderColor: colors.danger }]}>
            <ThemedText type="small" style={{ color: colors.danger }}>
              Abandonner la séance
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
  content: { padding: Spacing.four, gap: Spacing.two, alignItems: 'center' },
  restContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  silhouetteRow: { flexDirection: 'row', gap: Spacing.three, justifyContent: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    width: 80,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  skipButton: {
    marginTop: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  abandonButton: {
    marginTop: Spacing.two,
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
