import { db } from '@/db/client';
import { exerciseEquipment, exerciseMuscles, exercises } from '@/db/schema';
import type { GenerationExerciseRow } from '@/domain/programGenerator';
import type { EquipmentId } from '@/domain/types';

/**
 * Vue aplatie du catalogue pour le générateur de programme : une seule passe (3 requêtes, pas de
 * N+1) pour récupérer tout ce dont l'algorithme a besoin par exercice.
 */
export async function listExercisesForGeneration(): Promise<GenerationExerciseRow[]> {
  const [exerciseRows, muscleRows, equipmentRows] = await Promise.all([
    db.select({ id: exercises.id, name: exercises.name, isAdvanced: exercises.isAdvanced }).from(exercises),
    db
      .select({ exerciseId: exerciseMuscles.exerciseId, muscleGroupId: exerciseMuscles.muscleGroupId, role: exerciseMuscles.role })
      .from(exerciseMuscles),
    db.select({ exerciseId: exerciseEquipment.exerciseId, equipmentId: exerciseEquipment.equipmentId }).from(exerciseEquipment),
  ]);

  const musclesByExercise = new Map<string, { primary: Set<string>; all: Set<string> }>();
  for (const row of muscleRows) {
    const entry = musclesByExercise.get(row.exerciseId) ?? { primary: new Set<string>(), all: new Set<string>() };
    entry.all.add(row.muscleGroupId);
    if (row.role === 'primary') entry.primary.add(row.muscleGroupId);
    musclesByExercise.set(row.exerciseId, entry);
  }

  const equipmentByExercise = new Map<string, EquipmentId[]>();
  for (const row of equipmentRows) {
    const arr = equipmentByExercise.get(row.exerciseId) ?? [];
    arr.push(row.equipmentId as EquipmentId);
    equipmentByExercise.set(row.exerciseId, arr);
  }

  return exerciseRows.map((exercise) => {
    const muscles = musclesByExercise.get(exercise.id) ?? { primary: new Set<string>(), all: new Set<string>() };
    return {
      id: exercise.id,
      name: exercise.name,
      isAdvanced: exercise.isAdvanced,
      primaryMuscleIds: [...muscles.primary],
      allMuscleIds: [...muscles.all],
      equipmentIds: equipmentByExercise.get(exercise.id) ?? [],
    };
  });
}
