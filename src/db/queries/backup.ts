import { db } from '@/db/client';
import {
  appSettings,
  attendanceBiomeSessions,
  attendanceProgress,
  programs,
  programSessionTemplates,
  sessionTemplateExercises,
  sessionTemplateSets,
  sessionTemplates,
  unlockedAchievements,
  userProfile,
  workoutLogExercises,
  workoutLogs,
  workoutLogSets,
} from '@/db/schema';

export const BACKUP_FORMAT_VERSION = 1;

export interface BackupPayload {
  formatVersion: number;
  exportedAt: number;
  tables: {
    userProfile: (typeof userProfile.$inferSelect)[];
    appSettings: (typeof appSettings.$inferSelect)[];
    attendanceProgress: (typeof attendanceProgress.$inferSelect)[];
    attendanceBiomeSessions: (typeof attendanceBiomeSessions.$inferSelect)[];
    unlockedAchievements: (typeof unlockedAchievements.$inferSelect)[];
    programs: (typeof programs.$inferSelect)[];
    sessionTemplates: (typeof sessionTemplates.$inferSelect)[];
    programSessionTemplates: (typeof programSessionTemplates.$inferSelect)[];
    sessionTemplateExercises: (typeof sessionTemplateExercises.$inferSelect)[];
    sessionTemplateSets: (typeof sessionTemplateSets.$inferSelect)[];
    workoutLogs: (typeof workoutLogs.$inferSelect)[];
    workoutLogExercises: (typeof workoutLogExercises.$inferSelect)[];
    workoutLogSets: (typeof workoutLogSets.$inferSelect)[];
  };
}

const CHUNK_SIZE = 100;

async function chunkedInsert<T extends Record<string, unknown>>(table: Parameters<typeof db.insert>[0], rows: T[]) {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    await db.insert(table).values(rows.slice(i, i + CHUNK_SIZE));
  }
}

/**
 * Exporte toutes les données propres à l'utilisateur (profil, réglages, assiduité, trophées,
 * programmes, séances, historique). Le catalogue d'exercices et les barèmes de performance ne
 * sont pas inclus : ce sont des données pilotées par le code, resynchronisées à chaque démarrage.
 */
export async function exportAllData(): Promise<BackupPayload> {
  const [
    userProfileRows,
    appSettingsRows,
    attendanceProgressRows,
    attendanceBiomeSessionsRows,
    unlockedAchievementsRows,
    programsRows,
    sessionTemplatesRows,
    programSessionTemplatesRows,
    sessionTemplateExercisesRows,
    sessionTemplateSetsRows,
    workoutLogsRows,
    workoutLogExercisesRows,
    workoutLogSetsRows,
  ] = await Promise.all([
    db.select().from(userProfile),
    db.select().from(appSettings),
    db.select().from(attendanceProgress),
    db.select().from(attendanceBiomeSessions),
    db.select().from(unlockedAchievements),
    db.select().from(programs),
    db.select().from(sessionTemplates),
    db.select().from(programSessionTemplates),
    db.select().from(sessionTemplateExercises),
    db.select().from(sessionTemplateSets),
    db.select().from(workoutLogs),
    db.select().from(workoutLogExercises),
    db.select().from(workoutLogSets),
  ]);

  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: Date.now(),
    tables: {
      userProfile: userProfileRows,
      appSettings: appSettingsRows,
      attendanceProgress: attendanceProgressRows,
      attendanceBiomeSessions: attendanceBiomeSessionsRows,
      unlockedAchievements: unlockedAchievementsRows,
      programs: programsRows,
      sessionTemplates: sessionTemplatesRows,
      programSessionTemplates: programSessionTemplatesRows,
      sessionTemplateExercises: sessionTemplateExercisesRows,
      sessionTemplateSets: sessionTemplateSetsRows,
      workoutLogs: workoutLogsRows,
      workoutLogExercises: workoutLogExercisesRows,
      workoutLogSets: workoutLogSetsRows,
    },
  };
}

/**
 * Remplace entièrement les données utilisateur actuelles par celles du fichier importé (pas une
 * fusion : tout ce qui existe déjà est effacé). Les identifiants d'origine sont conservés pour
 * que les références entre tables (programme -> séance -> exercice -> série) restent cohérentes.
 */
export async function importAllData(payload: BackupPayload): Promise<void> {
  if (payload.formatVersion !== BACKUP_FORMAT_VERSION) {
    throw new Error('Format de sauvegarde non reconnu.');
  }

  // Ordre feuille -> racine, indépendant des cascades FK, pour un nettoyage toujours cohérent.
  await db.delete(workoutLogSets);
  await db.delete(workoutLogExercises);
  await db.delete(workoutLogs);
  await db.delete(sessionTemplateSets);
  await db.delete(sessionTemplateExercises);
  await db.delete(programSessionTemplates);
  await db.delete(sessionTemplates);
  await db.delete(programs);
  await db.delete(unlockedAchievements);
  await db.delete(attendanceBiomeSessions);
  await db.delete(attendanceProgress);
  await db.delete(appSettings);
  await db.delete(userProfile);

  const t = payload.tables;
  // Ordre racine -> feuille pour l'insertion.
  if (t.userProfile.length) await chunkedInsert(userProfile, t.userProfile);
  if (t.appSettings.length) await chunkedInsert(appSettings, t.appSettings);
  if (t.attendanceProgress.length) await chunkedInsert(attendanceProgress, t.attendanceProgress);
  if (t.attendanceBiomeSessions.length) await chunkedInsert(attendanceBiomeSessions, t.attendanceBiomeSessions);
  if (t.unlockedAchievements.length) await chunkedInsert(unlockedAchievements, t.unlockedAchievements);
  if (t.programs.length) await chunkedInsert(programs, t.programs);
  if (t.sessionTemplates.length) await chunkedInsert(sessionTemplates, t.sessionTemplates);
  if (t.programSessionTemplates.length) await chunkedInsert(programSessionTemplates, t.programSessionTemplates);
  if (t.sessionTemplateExercises.length) await chunkedInsert(sessionTemplateExercises, t.sessionTemplateExercises);
  if (t.sessionTemplateSets.length) await chunkedInsert(sessionTemplateSets, t.sessionTemplateSets);
  if (t.workoutLogs.length) await chunkedInsert(workoutLogs, t.workoutLogs);
  if (t.workoutLogExercises.length) await chunkedInsert(workoutLogExercises, t.workoutLogExercises);
  if (t.workoutLogSets.length) await chunkedInsert(workoutLogSets, t.workoutLogSets);
}
