import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- Référentiel statique ---

export const muscleGroups = sqliteTable('muscle_groups', {
  id: text('id').primaryKey(), // 'chest', 'lats', 'quads'...
  name: text('name').notNull(),
  nameEn: text('name_en').notNull().default(''),
  bodyRegion: text('body_region', { enum: ['upper', 'lower', 'core'] }).notNull(),
});

export const equipment = sqliteTable('equipment', {
  id: text('id').primaryKey(), // 'bodyweight' | 'dumbbell' | 'barbell' | 'bench' | 'machine' | 'other'
  name: text('name').notNull(),
  nameEn: text('name_en').notNull().default(''),
});

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(), // slug, ex: 'bench-press'
  name: text('name').notNull(),
  /** Nom anglais : utilisé pour la recherche, et affiché quand la langue de l'app est 'en'. */
  nameEn: text('name_en').notNull().default(''),
  description: text('description'),
  descriptionEn: text('description_en'),
  mediaType: text('media_type', { enum: ['gif', 'image', 'none', 'video'] }).notNull(),
  mediaKey: text('media_key').notNull(),
  /** true si le mouvement est technique/risqué (exclu des programmes générés pour débutant). */
  isAdvanced: integer('is_advanced', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at').notNull(),
});

export const exerciseMuscles = sqliteTable(
  'exercise_muscles',
  {
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    muscleGroupId: text('muscle_group_id')
      .notNull()
      .references(() => muscleGroups.id),
    role: text('role', { enum: ['primary', 'secondary'] }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.exerciseId, t.muscleGroupId] }),
    index('exercise_muscles_muscle_group_idx').on(t.muscleGroupId),
  ],
);

export const exerciseEquipment = sqliteTable(
  'exercise_equipment',
  {
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    equipmentId: text('equipment_id')
      .notNull()
      .references(() => equipment.id),
  },
  (t) => [primaryKey({ columns: [t.exerciseId, t.equipmentId] })],
);

// Seuils de performance : une ligne par (exercice, sexe, bracket de poids de corps, niveau)
export const performanceStandards = sqliteTable(
  'performance_standards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    sex: text('sex', { enum: ['male', 'female'] }).notNull(),
    bodyWeightMinKg: real('body_weight_min_kg').notNull(),
    bodyWeightMaxKg: real('body_weight_max_kg').notNull(),
    level: text('level', { enum: ['beginner', 'novice', 'intermediate', 'advanced', 'elite'] }).notNull(),
    // 'reps' pour les exercices au poids du corps : minOneRmKg contient alors un nombre de
    // répétitions, pas un poids.
    metric: text('metric', { enum: ['one_rm_kg', 'reps'] }).notNull().default('one_rm_kg'),
    minOneRmKg: real('min_one_rm_kg').notNull(),
  },
  (t) => [index('performance_standards_exercise_sex_idx').on(t.exerciseId, t.sex)],
);

// --- Profil & réglages (singleton, id = 1) ---

export const userProfile = sqliteTable('user_profile', {
  id: integer('id').primaryKey(),
  nickname: text('nickname').notNull(),
  birthDate: text('birth_date').notNull(), // ISO yyyy-mm-dd
  sex: text('sex', { enum: ['male', 'female'] }).notNull(),
  heightCm: real('height_cm').notNull(),
  bodyWeightKg: real('body_weight_kg').notNull(),
  onboardingCompletedAt: integer('onboarding_completed_at'),
  /** Horodatage de la dernière réinitialisation des performances ; les séances antérieures sont ignorées des calculs de niveau. */
  performanceResetAt: integer('performance_reset_at'),
});

// --- Assiduité (carte de progression par biomes) ---

export const attendanceProgress = sqliteTable('attendance_progress', {
  id: integer('id').primaryKey(),
  biomeIndex: integer('biome_index').notNull().default(0), // 0..5
  pointInBiome: integer('point_in_biome').notNull().default(0), // 0..19
  /** null tant que l'utilisateur n'a pas choisi son seuil lors du premier accès à l'onglet. */
  penaltyThresholdDays: integer('penalty_threshold_days'),
  lastSessionCompletedAt: integer('last_session_completed_at'),
  /** Horodatage de référence pour le calcul des pénalités en cascade (avance par palier de penaltyThresholdDays). */
  lastPenaltyCheckAt: integer('last_penalty_check_at'),
  /** true dès la première pénalité subie, pour toujours (sert au succès "sans faute" du Valhalla). */
  everPenalized: integer('ever_penalized', { mode: 'boolean' }).notNull().default(false),
});

/** Compteur cumulatif de séances par biome, jamais décrémenté par une pénalité. */
export const attendanceBiomeSessions = sqliteTable('attendance_biome_sessions', {
  biomeIndex: integer('biome_index').primaryKey(), // 0..5
  totalSessions: integer('total_sessions').notNull().default(0),
});

// --- Succès / trophées ---

/** Un succès débloqué = une ligne. Jamais supprimée (les trophées ne se reprennent pas). */
export const unlockedAchievements = sqliteTable('unlocked_achievements', {
  id: text('id').primaryKey(), // slug d'AchievementDefinition.id
  unlockedAt: integer('unlocked_at').notNull(),
});

export const appSettings = sqliteTable('app_settings', {
  id: integer('id').primaryKey(),
  themeMode: text('theme_mode', { enum: ['light', 'dark', 'system'] }).notNull().default('system'),
  language: text('language', { enum: ['fr', 'en'] }).notNull().default('fr'),
  oneRmFormula: text('one_rm_formula', { enum: ['epley', 'brzycki', 'lombardi'] })
    .notNull()
    .default('epley'),
  defaultRestSeconds: integer('default_rest_seconds').notNull().default(90),
  debugModeEnabled: integer('debug_mode_enabled', { mode: 'boolean' }).notNull().default(false),
  premiumUnlocked: integer('premium_unlocked', { mode: 'boolean' }).notNull().default(false),
  premiumUnlockedAt: integer('premium_unlocked_at'),
  premiumSource: text('premium_source', { enum: ['code', 'purchase'] }),
});

// --- Programmes / séances (templates) ---

export const programs = sqliteTable('programs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  splitType: text('split_type', {
    enum: ['full_body', 'upper_lower', 'push_pull_legs', 'body_part_split', 'antagonist_split', 'custom'],
  }).notNull(),
  sessionsPerWeek: integer('sessions_per_week').notNull(),
  source: text('source', { enum: ['manual', 'generated'] }).notNull(),
  notes: text('notes'),
  createdAt: integer('created_at').notNull(),
});

export const sessionTemplates = sqliteTable('session_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  defaultRestSeconds: integer('default_rest_seconds').notNull(),
  notes: text('notes'),
});

export const programSessionTemplates = sqliteTable(
  'program_session_templates',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    programId: integer('program_id')
      .notNull()
      .references(() => programs.id, { onDelete: 'cascade' }),
    sessionTemplateId: integer('session_template_id')
      .notNull()
      .references(() => sessionTemplates.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    dayLabel: text('day_label'), // ex: "Push A", "Lundi"
  },
  (t) => [index('program_session_templates_program_idx').on(t.programId)],
);

export const sessionTemplateExercises = sqliteTable(
  'session_template_exercises',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionTemplateId: integer('session_template_id')
      .notNull()
      .references(() => sessionTemplates.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id),
    orderIndex: integer('order_index').notNull(),
    restSecondsOverride: integer('rest_seconds_override'),
  },
  (t) => [index('session_template_exercises_template_idx').on(t.sessionTemplateId)],
);

export const sessionTemplateSets = sqliteTable(
  'session_template_sets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sessionTemplateExerciseId: integer('session_template_exercise_id')
      .notNull()
      .references(() => sessionTemplateExercises.id, { onDelete: 'cascade' }),
    setIndex: integer('set_index').notNull(),
    targetReps: integer('target_reps').notNull(),
    targetWeightKg: real('target_weight_kg').notNull(),
  },
  (t) => [index('session_template_sets_exercise_idx').on(t.sessionTemplateExerciseId)],
);

// --- Historique réel des séances effectuées ---

export const workoutLogs = sqliteTable('workout_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionTemplateId: integer('session_template_id').references(() => sessionTemplates.id, {
    onDelete: 'set null',
  }),
  templateNameSnapshot: text('template_name_snapshot').notNull(),
  programId: integer('program_id').references(() => programs.id, { onDelete: 'set null' }),
  status: text('status', { enum: ['in_progress', 'completed', 'aborted'] }).notNull(),
  startedAt: integer('started_at').notNull(),
  completedAt: integer('completed_at'),
  // JSON sérialisé de la machine à états (phase/index/restEndsAt/notificationId).
  // Etat technique transitoire, pas une donnée métier dérivée : nécessaire pour
  // reprendre une séance après un kill de l'app pendant un repos.
  runtimeState: text('runtime_state'),
});

export const workoutLogExercises = sqliteTable(
  'workout_log_exercises',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    workoutLogId: integer('workout_log_id')
      .notNull()
      .references(() => workoutLogs.id, { onDelete: 'cascade' }),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id),
    exerciseNameSnapshot: text('exercise_name_snapshot').notNull(),
    orderIndex: integer('order_index').notNull(),
    restSecondsUsed: integer('rest_seconds_used').notNull(),
  },
  (t) => [index('workout_log_exercises_log_idx').on(t.workoutLogId)],
);

export const workoutLogSets = sqliteTable(
  'workout_log_sets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    workoutLogExerciseId: integer('workout_log_exercise_id')
      .notNull()
      .references(() => workoutLogExercises.id, { onDelete: 'cascade' }),
    setIndex: integer('set_index').notNull(),
    targetReps: integer('target_reps').notNull(),
    targetWeightKg: real('target_weight_kg').notNull(),
    actualReps: integer('actual_reps'),
    actualWeightKg: real('actual_weight_kg'),
    isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
    completedAt: integer('completed_at'),
  },
  (t) => [index('workout_log_sets_exercise_idx').on(t.workoutLogExerciseId)],
);
