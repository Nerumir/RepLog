export interface MuscleGroupSummary {
  muscleGroupId: string;
  name: string;
  /** Moyenne des scores (1..5) des exercices où ce muscle est primaire ; null si jamais pratiqué. */
  averageScore: number | null;
  exerciseCount: number;
}

export interface ExercisePerformanceInput {
  exerciseId: string;
  primaryMuscleIds: string[];
  /** Score continu (1..5) issu de computeLevelScore, ou null si aucune donnée pour cet exercice. */
  score: number | null;
}

/**
 * Moyenne les scores de performance par groupe musculaire, en ne comptant que les
 * exercices où le muscle est ciblé en primaire, et en ignorant les exercices jamais pratiqués.
 */
export function aggregateByMuscleGroup(
  perExercise: ExercisePerformanceInput[],
  muscleGroups: { id: string; name: string }[],
): MuscleGroupSummary[] {
  const scoresByMuscle = new Map<string, number[]>();

  for (const entry of perExercise) {
    if (entry.score === null) continue;
    for (const muscleId of entry.primaryMuscleIds) {
      const list = scoresByMuscle.get(muscleId) ?? [];
      list.push(entry.score);
      scoresByMuscle.set(muscleId, list);
    }
  }

  return muscleGroups.map((muscle) => {
    const scores = scoresByMuscle.get(muscle.id) ?? [];
    return {
      muscleGroupId: muscle.id,
      name: muscle.name,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
      exerciseCount: scores.length,
    };
  });
}
