import { asc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises, programSessionTemplates, sessionTemplateExercises, sessionTemplates, sessionTemplateSets } from '@/db/schema';

export async function listSessionTemplates() {
  return db.select().from(sessionTemplates);
}

/** Séances avec un indicateur "orphan" : pas rattachées à un seul programme (ne devrait normalement pas arriver, sauf anciennes données). */
export async function listSessionTemplatesWithProgramInfo() {
  const templates = await db.select().from(sessionTemplates);
  const attachedRows = await db.select({ sessionTemplateId: programSessionTemplates.sessionTemplateId }).from(programSessionTemplates);
  const attachedIds = new Set(attachedRows.map((row) => row.sessionTemplateId));
  return templates.map((template) => ({ ...template, isOrphan: !attachedIds.has(template.id) }));
}

/** Supprime complètement une séance (exercices/séries en cascade). Les logs déjà effectués gardent leur snapshot. */
export async function deleteSessionTemplate(sessionTemplateId: number) {
  await db.delete(sessionTemplates).where(eq(sessionTemplates.id, sessionTemplateId));
}

export async function getSessionTemplateDetail(sessionTemplateId: number) {
  const [template] = await db.select().from(sessionTemplates).where(eq(sessionTemplates.id, sessionTemplateId));
  if (!template) return null;

  const exerciseRows = await db
    .select({
      id: sessionTemplateExercises.id,
      exerciseId: sessionTemplateExercises.exerciseId,
      exerciseName: exercises.name,
      exerciseNameEn: exercises.nameEn,
      orderIndex: sessionTemplateExercises.orderIndex,
      restSecondsOverride: sessionTemplateExercises.restSecondsOverride,
    })
    .from(sessionTemplateExercises)
    .innerJoin(exercises, eq(exercises.id, sessionTemplateExercises.exerciseId))
    .where(eq(sessionTemplateExercises.sessionTemplateId, sessionTemplateId))
    .orderBy(asc(sessionTemplateExercises.orderIndex));

  const exercisesWithSets = await Promise.all(
    exerciseRows.map(async (exerciseRow) => {
      const sets = await db
        .select()
        .from(sessionTemplateSets)
        .where(eq(sessionTemplateSets.sessionTemplateExerciseId, exerciseRow.id))
        .orderBy(asc(sessionTemplateSets.setIndex));
      return { ...exerciseRow, sets };
    }),
  );

  return { ...template, exercises: exercisesWithSets };
}

export interface NewSessionTemplateInput {
  name: string;
  defaultRestSeconds: number;
  notes?: string;
}

export async function createSessionTemplate(input: NewSessionTemplateInput) {
  const [row] = await db.insert(sessionTemplates).values(input).returning();
  return row;
}

export async function updateSessionTemplate(sessionTemplateId: number, input: NewSessionTemplateInput) {
  const [row] = await db
    .update(sessionTemplates)
    .set(input)
    .where(eq(sessionTemplates.id, sessionTemplateId))
    .returning();
  return row;
}

export interface NewSessionTemplateExerciseInput {
  sessionTemplateId: number;
  exerciseId: string;
  orderIndex: number;
  restSecondsOverride?: number;
  sets: { setIndex: number; targetReps: number; targetWeightKg: number }[];
}

/**
 * Remplace entièrement les exercices/séries d'une séance (vide puis reconstruit).
 * Les logs de séances déjà effectuées gardent un snapshot indépendant (exerciseNameSnapshot),
 * donc ça ne touche pas l'historique.
 */
export async function replaceSessionTemplateExercises(
  sessionTemplateId: number,
  exercises: Omit<NewSessionTemplateExerciseInput, 'sessionTemplateId'>[],
) {
  await db.delete(sessionTemplateExercises).where(eq(sessionTemplateExercises.sessionTemplateId, sessionTemplateId));

  for (const exercise of exercises) {
    await addExerciseToSessionTemplate({ ...exercise, sessionTemplateId });
  }
}

export async function addExerciseToSessionTemplate(input: NewSessionTemplateExerciseInput) {
  const [exerciseRow] = await db
    .insert(sessionTemplateExercises)
    .values({
      sessionTemplateId: input.sessionTemplateId,
      exerciseId: input.exerciseId,
      orderIndex: input.orderIndex,
      restSecondsOverride: input.restSecondsOverride,
    })
    .returning();

  if (input.sets.length > 0) {
    await db
      .insert(sessionTemplateSets)
      .values(input.sets.map((set) => ({ ...set, sessionTemplateExerciseId: exerciseRow.id })));
  }

  return exerciseRow;
}
