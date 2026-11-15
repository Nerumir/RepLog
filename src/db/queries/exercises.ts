import { and, eq, inArray, ne } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  equipment,
  exerciseEquipment,
  exerciseMuscles,
  exercises,
  muscleGroups,
  performanceStandards,
} from '@/db/schema';

export async function listMuscleGroups() {
  return db.select().from(muscleGroups);
}

export async function getMuscleGroupById(muscleGroupId: string) {
  const rows = await db.select().from(muscleGroups).where(eq(muscleGroups.id, muscleGroupId));
  return rows[0] ?? null;
}

export async function listEquipment() {
  return db.select().from(equipment);
}

/** Ids des exercices dont le seul équipement est le poids du corps : pas de poids à renseigner. */
export async function listBodyweightOnlyExerciseIds(): Promise<Set<string>> {
  const [bodyweightRows, otherRows] = await Promise.all([
    db.select({ exerciseId: exerciseEquipment.exerciseId }).from(exerciseEquipment).where(eq(exerciseEquipment.equipmentId, 'bodyweight')),
    db.select({ exerciseId: exerciseEquipment.exerciseId }).from(exerciseEquipment).where(ne(exerciseEquipment.equipmentId, 'bodyweight')),
  ]);
  const otherIds = new Set(otherRows.map((r) => r.exerciseId));
  return new Set(bodyweightRows.map((r) => r.exerciseId).filter((id) => !otherIds.has(id)));
}

export async function listExercises() {
  return db.select().from(exercises);
}

export async function getExerciseById(exerciseId: string) {
  const rows = await db.select().from(exercises).where(eq(exercises.id, exerciseId));
  return rows[0] ?? null;
}

export async function getExerciseMuscles(exerciseId: string) {
  return db
    .select({ muscleGroupId: exerciseMuscles.muscleGroupId, role: exerciseMuscles.role, name: muscleGroups.name })
    .from(exerciseMuscles)
    .innerJoin(muscleGroups, eq(muscleGroups.id, exerciseMuscles.muscleGroupId))
    .where(eq(exerciseMuscles.exerciseId, exerciseId));
}

export async function getExerciseEquipment(exerciseId: string) {
  return db
    .select({ equipmentId: exerciseEquipment.equipmentId, name: equipment.name })
    .from(exerciseEquipment)
    .innerJoin(equipment, eq(equipment.id, exerciseEquipment.equipmentId))
    .where(eq(exerciseEquipment.exerciseId, exerciseId));
}

export async function getPerformanceStandards(exerciseId: string) {
  return db.select().from(performanceStandards).where(eq(performanceStandards.exerciseId, exerciseId));
}

/** Tous les exercices ayant ce groupe musculaire en rôle "primary". */
export async function listExercisesByPrimaryMuscle(muscleGroupId: string) {
  return db
    .select({ exerciseId: exerciseMuscles.exerciseId, exerciseName: exercises.name })
    .from(exerciseMuscles)
    .innerJoin(exercises, eq(exercises.id, exerciseMuscles.exerciseId))
    .where(and(eq(exerciseMuscles.muscleGroupId, muscleGroupId), eq(exerciseMuscles.role, 'primary')));
}

/**
 * Comme listExercisesByPrimaryMuscle, avec le matériel de chaque exercice (pour le classer dans
 * une des 3 catégories de l'onglet Exercices). Une seule requête supplémentaire (pas de N+1).
 */
export async function listExercisesByPrimaryMuscleWithEquipment(muscleGroupId: string) {
  const rows = await listExercisesByPrimaryMuscle(muscleGroupId);
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.exerciseId);
  const equipRows = await db
    .select({ exerciseId: exerciseEquipment.exerciseId, equipmentId: exerciseEquipment.equipmentId })
    .from(exerciseEquipment)
    .where(inArray(exerciseEquipment.exerciseId, ids));

  const equipByExercise = new Map<string, string[]>();
  for (const row of equipRows) {
    const arr = equipByExercise.get(row.exerciseId) ?? [];
    arr.push(row.equipmentId);
    equipByExercise.set(row.exerciseId, arr);
  }

  return rows.map((r) => ({ ...r, equipmentIds: equipByExercise.get(r.exerciseId) ?? [] }));
}
