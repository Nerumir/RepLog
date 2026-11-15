import { eq, inArray } from 'drizzle-orm';

import {
  equipment,
  exerciseEquipment,
  exerciseMuscles,
  exercises,
  muscleGroups,
  performanceStandards,
  programs,
  programSessionTemplates,
  sessionTemplateExercises,
  sessionTemplates,
  sessionTemplateSets,
  workoutLogExercises,
} from '@/db/schema';
import type { db as Db } from '@/db/client';

import { equipmentSeed } from './equipment.seed';
import { exercisesSeed } from './exercises.seed';
import { muscleGroupsSeed } from './muscleGroups.seed';
import { performanceStandardsSeed } from './performanceStandards.seed';
import { programsSeed } from './programs.seed';
import { sessionTemplatesSeed } from './sessionTemplates.seed';

/**
 * Les standards de performance sont des données de référence pilotées par le code (pas une
 * donnée utilisateur) : on les resynchronise à chaque démarrage pour qu'une mise à jour du
 * barème (nouveaux paliers, nouveaux chiffres) s'applique sans avoir à réinstaller l'app.
 */
export async function syncPerformanceStandards(db: typeof Db) {
  await db.delete(performanceStandards);
  const rows = performanceStandardsSeed.map((s) => ({
    exerciseId: s.exerciseId,
    sex: s.sex,
    bodyWeightMinKg: s.bodyWeightMinKg,
    bodyWeightMaxKg: s.bodyWeightMaxKg,
    level: s.level,
    metric: s.metric,
    minOneRmKg: s.minOneRmKg,
  }));
  // SQLite plafonne le nombre de paramètres liés par requête (~999) : avec plusieurs centaines
  // d'exercices à 7 colonnes chacun, un insert en un seul bloc le dépasse ("too many SQL
  // variables"). On découpe en lots de 100 lignes (700 paramètres, large marge).
  const CHUNK_SIZE = 100;
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    await db.insert(performanceStandards).values(rows.slice(i, i + CHUNK_SIZE));
  }
}

/**
 * Exercices retirés du catalogue après coup (ex: tous les exercices à élastique, retirés faute de
 * standards de performance fiables). syncExerciseCatalog n'upsert plus ces id, mais ne les
 * supprime pas non plus de la base déjà synchronisée sur un appareil : on le fait ici, en se
 * limitant aux exercices n'ayant jamais été loggés dans une séance (pour ne jamais perdre
 * d'historique utilisateur).
 */
const REMOVED_EXERCISE_IDS = [
  'band-assisted-pull-up', 'band-curl', 'band-external-rotation', 'band-glute-bridge',
  'band-good-morning', 'band-high-face-pull', 'band-hip-abduction', 'band-kneeling-pulldown',
  'band-lateral-raise', 'band-leg-curl', 'band-overhead-press', 'band-pull-through',
  'band-pullover', 'band-romanian-deadlift', 'band-row', 'band-seated-pulldown', 'band-shrug',
  'band-single-arm-lateral-raise', 'band-squat', 'band-straight-arm-pulldown',
  'band-tricep-kickbacks', 'band-wood-chopper', 'banded-clamshell', 'banded-eccentric-tibialis-raise',
  'barbell-banded-back-squat',
];

export async function removeDeprecatedExercises(db: typeof Db) {
  const loggedRows = await db.selectDistinct({ exerciseId: workoutLogExercises.exerciseId }).from(workoutLogExercises);
  const loggedIds = new Set(loggedRows.map((r) => r.exerciseId));
  const safeToRemove = REMOVED_EXERCISE_IDS.filter((id) => !loggedIds.has(id));
  if (safeToRemove.length > 0) {
    await db.delete(exercises).where(inArray(exercises.id, safeToRemove));
  }
}

/**
 * Le catalogue d'exercices (movekit.com + traductions/muscles/matériel déduits) est une donnée
 * pilotée par le code, comme les standards de performance : on la resynchronise à chaque
 * démarrage pour qu'une mise à jour du catalogue s'applique sans réinstaller l'app. À la
 * différence de syncPerformanceStandards, on ne supprime jamais une ligne `exercises` (des
 * séances déjà loggées y font référence sans cascade) : chaque exercice est upserté, seules ses
 * tables de jonction (muscles/équipement) sont remises à plat.
 */
export async function syncExerciseCatalog(db: typeof Db) {
  await db.insert(equipment).values(equipmentSeed).onConflictDoNothing();
  await db.insert(muscleGroups).values(muscleGroupsSeed).onConflictDoNothing();

  for (const exercise of exercisesSeed) {
    await db
      .insert(exercises)
      .values({
        id: exercise.id,
        name: exercise.name,
        nameEn: exercise.nameEn,
        description: exercise.description,
        mediaType: exercise.mediaType,
        mediaKey: exercise.mediaKey,
        createdAt: Date.now(),
      })
      .onConflictDoUpdate({
        target: exercises.id,
        set: {
          name: exercise.name,
          nameEn: exercise.nameEn,
          description: exercise.description,
          mediaType: exercise.mediaType,
          mediaKey: exercise.mediaKey,
        },
      });

    await db.delete(exerciseMuscles).where(eq(exerciseMuscles.exerciseId, exercise.id));
    if (exercise.muscles.length > 0) {
      await db
        .insert(exerciseMuscles)
        .values(exercise.muscles.map((m) => ({ exerciseId: exercise.id, muscleGroupId: m.muscleGroupId, role: m.role })));
    }

    await db.delete(exerciseEquipment).where(eq(exerciseEquipment.exerciseId, exercise.id));
    if (exercise.equipmentIds.length > 0) {
      await db
        .insert(exerciseEquipment)
        .values(exercise.equipmentIds.map((equipmentId) => ({ exerciseId: exercise.id, equipmentId })));
    }
  }
}

export async function runSeedIfEmpty(db: typeof Db) {
  const existing = await db.select({ id: exercises.id }).from(exercises).limit(1);
  if (existing.length > 0) return;

  await db.insert(muscleGroups).values(muscleGroupsSeed);
  await db.insert(equipment).values(equipmentSeed);

  for (const exercise of exercisesSeed) {
    await db.insert(exercises).values({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      mediaType: exercise.mediaType,
      mediaKey: exercise.mediaKey,
      createdAt: Date.now(),
    });

    await db
      .insert(exerciseMuscles)
      .values(exercise.muscles.map((m) => ({ exerciseId: exercise.id, muscleGroupId: m.muscleGroupId, role: m.role })));

    await db
      .insert(exerciseEquipment)
      .values(exercise.equipmentIds.map((equipmentId) => ({ exerciseId: exercise.id, equipmentId })));
  }

  await syncPerformanceStandards(db);

  const sessionTemplateIdByName = new Map<string, number>();
  for (const template of sessionTemplatesSeed) {
    const [templateRow] = await db
      .insert(sessionTemplates)
      .values({ name: template.name, defaultRestSeconds: template.defaultRestSeconds })
      .returning();
    sessionTemplateIdByName.set(template.name, templateRow.id);

    for (const exercise of template.exercises) {
      const [exerciseRow] = await db
        .insert(sessionTemplateExercises)
        .values({
          sessionTemplateId: templateRow.id,
          exerciseId: exercise.exerciseId,
          orderIndex: exercise.orderIndex,
          restSecondsOverride: exercise.restSecondsOverride,
        })
        .returning();

      await db
        .insert(sessionTemplateSets)
        .values(exercise.sets.map((set) => ({ ...set, sessionTemplateExerciseId: exerciseRow.id })));
    }
  }

  for (const program of programsSeed) {
    const [programRow] = await db
      .insert(programs)
      .values({
        name: program.name,
        splitType: program.splitType,
        sessionsPerWeek: program.sessionsPerWeek,
        source: 'manual',
        createdAt: Date.now(),
      })
      .returning();

    for (const [index, templateName] of program.sessionTemplateNames.entries()) {
      const sessionTemplateId = sessionTemplateIdByName.get(templateName);
      if (!sessionTemplateId) continue;
      await db.insert(programSessionTemplates).values({
        programId: programRow.id,
        sessionTemplateId,
        orderIndex: index,
      });
    }
  }
}
