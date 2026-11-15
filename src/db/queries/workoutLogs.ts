import { and, asc, count, eq, gte, isNotNull, ne } from 'drizzle-orm';

import { db } from '@/db/client';
import { workoutLogExercises, workoutLogs, workoutLogSets } from '@/db/schema';
import { calculateOneRm, type OneRmFormulaId } from '@/domain/oneRepMax';
import { getSessionTemplateDetail } from '@/db/queries/sessionTemplates';

export async function getActiveWorkoutLog() {
  const rows = await db.select().from(workoutLogs).where(eq(workoutLogs.status, 'in_progress'));
  return rows[0] ?? null;
}

/**
 * Identifiants des exercices ayant au moins une série loggée avec un résultat chiffré (depuis un
 * éventuel reset de performances). Le catalogue compte des centaines d'exercices mais seule une
 * poignée est réellement pratiquée : une seule requête ici évite de faire une passe par exercice
 * du catalogue entier sur les écrans de niveau par groupe musculaire.
 */
export async function listExerciseIdsWithLoggedSets(sinceTimestamp?: number | null): Promise<string[]> {
  const rows = await db
    .selectDistinct({ exerciseId: workoutLogExercises.exerciseId })
    .from(workoutLogSets)
    .innerJoin(workoutLogExercises, eq(workoutLogExercises.id, workoutLogSets.workoutLogExerciseId))
    .where(
      and(
        isNotNull(workoutLogSets.actualWeightKg),
        isNotNull(workoutLogSets.actualReps),
        sinceTimestamp ? gte(workoutLogSets.completedAt, sinceTimestamp) : undefined,
      ),
    );
  return rows.map((row) => row.exerciseId);
}

/** Nombre total de séances terminées (tout l'historique, indépendant d'un reset de performances). */
export async function countCompletedSessions(): Promise<number> {
  const [row] = await db.select({ n: count() }).from(workoutLogs).where(eq(workoutLogs.status, 'completed'));
  return row?.n ?? 0;
}

/** Nombre total de séries cochées comme complétées (tout l'historique). */
export async function countCompletedSets(): Promise<number> {
  const [row] = await db.select({ n: count() }).from(workoutLogSets).where(eq(workoutLogSets.isCompleted, true));
  return row?.n ?? 0;
}

/** Horodatages de fin de toutes les séances terminées (tout l'historique), pour les succès de régularité. */
export async function getCompletedSessionTimestamps(): Promise<number[]> {
  const rows = await db
    .select({ completedAt: workoutLogs.completedAt })
    .from(workoutLogs)
    .where(and(eq(workoutLogs.status, 'completed'), isNotNull(workoutLogs.completedAt)));
  return rows.map((row) => row.completedAt as number);
}

export async function startWorkoutLog(sessionTemplateId: number, programId?: number) {
  const template = await getSessionTemplateDetail(sessionTemplateId);
  if (!template) throw new Error(`Session template ${sessionTemplateId} introuvable`);

  const [log] = await db
    .insert(workoutLogs)
    .values({
      sessionTemplateId,
      templateNameSnapshot: template.name,
      programId,
      status: 'in_progress',
      startedAt: Date.now(),
    })
    .returning();

  for (const exercise of template.exercises) {
    const restSecondsUsed = exercise.restSecondsOverride ?? template.defaultRestSeconds;
    const [logExercise] = await db
      .insert(workoutLogExercises)
      .values({
        workoutLogId: log.id,
        exerciseId: exercise.exerciseId,
        exerciseNameSnapshot: exercise.exerciseName,
        orderIndex: exercise.orderIndex,
        restSecondsUsed,
      })
      .returning();

    if (exercise.sets.length > 0) {
      await db.insert(workoutLogSets).values(
        exercise.sets.map((set) => ({
          workoutLogExerciseId: logExercise.id,
          setIndex: set.setIndex,
          targetReps: set.targetReps,
          targetWeightKg: set.targetWeightKg,
        })),
      );
    }
  }

  return log;
}

export async function getWorkoutLogDetail(workoutLogId: number) {
  const [log] = await db.select().from(workoutLogs).where(eq(workoutLogs.id, workoutLogId));
  if (!log) return null;

  const exerciseRows = await db
    .select()
    .from(workoutLogExercises)
    .where(eq(workoutLogExercises.workoutLogId, workoutLogId))
    .orderBy(asc(workoutLogExercises.orderIndex));

  const exercisesWithSets = await Promise.all(
    exerciseRows.map(async (exerciseRow) => {
      const sets = await db
        .select()
        .from(workoutLogSets)
        .where(eq(workoutLogSets.workoutLogExerciseId, exerciseRow.id))
        .orderBy(asc(workoutLogSets.setIndex));
      return { ...exerciseRow, sets };
    }),
  );

  return { ...log, exercises: exercisesWithSets };
}

export async function recordSetResult(workoutLogSetId: number, actualWeightKg: number, actualReps: number) {
  await db
    .update(workoutLogSets)
    .set({ actualWeightKg, actualReps, isCompleted: true, completedAt: Date.now() })
    .where(eq(workoutLogSets.id, workoutLogSetId));
}

export async function updateRuntimeState(workoutLogId: number, runtimeState: string | null) {
  await db.update(workoutLogs).set({ runtimeState }).where(eq(workoutLogs.id, workoutLogId));
}

export async function finishWorkoutLog(workoutLogId: number, status: 'completed' | 'aborted') {
  await db
    .update(workoutLogs)
    .set({ status, completedAt: Date.now(), runtimeState: null })
    .where(eq(workoutLogs.id, workoutLogId));
}

/** Meilleur 1RM jamais loggé pour un exercice, selon la formule courante (depuis un éventuel reset de performances). */
export async function getBestOneRmForExercise(
  exerciseId: string,
  formulaId: OneRmFormulaId,
  sinceTimestamp?: number | null,
): Promise<number | null> {
  const rows = await db
    .select({ weight: workoutLogSets.actualWeightKg, reps: workoutLogSets.actualReps })
    .from(workoutLogSets)
    .innerJoin(workoutLogExercises, eq(workoutLogExercises.id, workoutLogSets.workoutLogExerciseId))
    .where(
      and(
        eq(workoutLogExercises.exerciseId, exerciseId),
        isNotNull(workoutLogSets.actualWeightKg),
        isNotNull(workoutLogSets.actualReps),
        sinceTimestamp ? gte(workoutLogSets.completedAt, sinceTimestamp) : undefined,
      ),
    );

  if (rows.length === 0) return null;

  let best = 0;
  for (const row of rows) {
    const oneRm = calculateOneRm(row.weight ?? 0, row.reps ?? 0, formulaId);
    if (oneRm > best) best = oneRm;
  }
  return best;
}

/** Meilleur nombre de répétitions en une série, pour les exercices au poids du corps (metric 'reps'). */
export async function getBestRepsForExercise(
  exerciseId: string,
  sinceTimestamp?: number | null,
): Promise<number | null> {
  const rows = await db
    .select({ reps: workoutLogSets.actualReps })
    .from(workoutLogSets)
    .innerJoin(workoutLogExercises, eq(workoutLogExercises.id, workoutLogSets.workoutLogExerciseId))
    .where(
      and(
        eq(workoutLogExercises.exerciseId, exerciseId),
        isNotNull(workoutLogSets.actualReps),
        sinceTimestamp ? gte(workoutLogSets.completedAt, sinceTimestamp) : undefined,
      ),
    );

  if (rows.length === 0) return null;
  return Math.max(...rows.map((row) => row.reps ?? 0));
}

/** Comme getBestOneRmForExercise, mais en excluant une séance donnée (pour détecter un record battu par cette séance). */
export async function getBestOneRmForExerciseExcludingLog(
  exerciseId: string,
  formulaId: OneRmFormulaId,
  excludeWorkoutLogId: number,
  sinceTimestamp?: number | null,
): Promise<number | null> {
  const rows = await db
    .select({ weight: workoutLogSets.actualWeightKg, reps: workoutLogSets.actualReps })
    .from(workoutLogSets)
    .innerJoin(workoutLogExercises, eq(workoutLogExercises.id, workoutLogSets.workoutLogExerciseId))
    .where(
      and(
        eq(workoutLogExercises.exerciseId, exerciseId),
        ne(workoutLogExercises.workoutLogId, excludeWorkoutLogId),
        isNotNull(workoutLogSets.actualWeightKg),
        isNotNull(workoutLogSets.actualReps),
        sinceTimestamp ? gte(workoutLogSets.completedAt, sinceTimestamp) : undefined,
      ),
    );

  if (rows.length === 0) return null;

  let best = 0;
  for (const row of rows) {
    const oneRm = calculateOneRm(row.weight ?? 0, row.reps ?? 0, formulaId);
    if (oneRm > best) best = oneRm;
  }
  return best;
}

/** Historique dans le temps (1RM calculé par séance) pour un exercice, du plus ancien au plus récent. */
export async function getOneRmHistoryForExercise(
  exerciseId: string,
  formulaId: OneRmFormulaId,
  sinceTimestamp?: number | null,
) {
  const rows = await db
    .select({
      completedAt: workoutLogSets.completedAt,
      weight: workoutLogSets.actualWeightKg,
      reps: workoutLogSets.actualReps,
    })
    .from(workoutLogSets)
    .innerJoin(workoutLogExercises, eq(workoutLogExercises.id, workoutLogSets.workoutLogExerciseId))
    .where(
      and(
        eq(workoutLogExercises.exerciseId, exerciseId),
        isNotNull(workoutLogSets.actualWeightKg),
        isNotNull(workoutLogSets.actualReps),
        sinceTimestamp ? gte(workoutLogSets.completedAt, sinceTimestamp) : undefined,
      ),
    )
    .orderBy(asc(workoutLogSets.completedAt));

  return rows.map((row) => ({
    completedAt: row.completedAt ?? 0,
    oneRm: calculateOneRm(row.weight ?? 0, row.reps ?? 0, formulaId),
  }));
}

/** Comme getOneRmHistoryForExercise, mais en nombre de répétitions (exercices au poids du corps). */
export async function getRepsHistoryForExercise(exerciseId: string, sinceTimestamp?: number | null) {
  const rows = await db
    .select({ completedAt: workoutLogSets.completedAt, reps: workoutLogSets.actualReps })
    .from(workoutLogSets)
    .innerJoin(workoutLogExercises, eq(workoutLogExercises.id, workoutLogSets.workoutLogExerciseId))
    .where(
      and(
        eq(workoutLogExercises.exerciseId, exerciseId),
        isNotNull(workoutLogSets.actualReps),
        sinceTimestamp ? gte(workoutLogSets.completedAt, sinceTimestamp) : undefined,
      ),
    )
    .orderBy(asc(workoutLogSets.completedAt));

  return rows.map((row) => ({ completedAt: row.completedAt ?? 0, oneRm: row.reps ?? 0 }));
}
