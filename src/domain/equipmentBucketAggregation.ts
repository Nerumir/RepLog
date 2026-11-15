import type { ExerciseEquipmentBucket } from '@/domain/exerciseEquipmentBucket';

/** Moyenne les scores de performance (1..5) par catégorie de matériel, en ignorant les exercices jamais pratiqués. */
export function aggregateByEquipmentBucket(
  perExercise: { equipmentBucket: ExerciseEquipmentBucket; score: number | null }[],
): Record<ExerciseEquipmentBucket, number | null> {
  const scores: Record<ExerciseEquipmentBucket, number[]> = { bodyweight: [], 'free-weight': [], machine: [] };
  for (const entry of perExercise) {
    if (entry.score !== null) scores[entry.equipmentBucket].push(entry.score);
  }

  const average = (values: number[]) => (values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null);

  return {
    bodyweight: average(scores.bodyweight),
    'free-weight': average(scores['free-weight']),
    machine: average(scores.machine),
  };
}
