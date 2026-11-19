import { levelOrder } from '@/domain/performanceLevel';
import type { ExerciseEquipmentBucket } from '@/domain/exerciseEquipmentBucket';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'ruby';

export interface AchievementDefinition {
  id: string;
  tier: AchievementTier;
}

// Les noms/descriptions affichés viennent de i18n (clé achievements.<id>.name / .description), pas de ce fichier.
const MUSCLE_ACHIEVEMENTS: Omit<AchievementDefinition, 'tier'>[] = [
  { id: 'abs-confirmed' },
  { id: 'back-confirmed' },
  { id: 'biceps-confirmed' },
  { id: 'calves-confirmed' },
  { id: 'chest-confirmed' },
  { id: 'forearms-confirmed' },
  { id: 'glutes-confirmed' },
  { id: 'hamstrings-confirmed' },
  { id: 'lats-confirmed' },
  { id: 'quads-confirmed' },
  { id: 'shoulders-confirmed' },
  { id: 'traps-confirmed' },
  { id: 'triceps-confirmed' },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  ...MUSCLE_ACHIEVEMENTS.map((a) => ({ ...a, tier: 'gold' as const })),

  { id: 'all-muscles-novice', tier: 'bronze' },
  { id: 'all-muscles-intermediate', tier: 'silver' },
  { id: 'all-muscles-advanced', tier: 'diamond' },
  { id: 'all-muscles-elite', tier: 'ruby' },

  { id: 'bodyweight-master', tier: 'gold' },
  { id: 'free-weight-master', tier: 'gold' },
  { id: 'machine-master', tier: 'gold' },
  { id: 'triathlon-master', tier: 'ruby' },

  { id: 'biome-forest', tier: 'bronze' },
  { id: 'biome-tundra', tier: 'bronze' },
  { id: 'biome-desert', tier: 'silver' },
  { id: 'biome-volcano', tier: 'gold' },
  { id: 'biome-valhalla', tier: 'diamond' },
  { id: 'biome-valhalla-flawless', tier: 'ruby' },

  { id: 'weekly-3', tier: 'bronze' },
  { id: 'weekly-4', tier: 'silver' },
  { id: 'weekly-5', tier: 'gold' },
  { id: 'weekly-6', tier: 'diamond' },

  { id: 'sessions-10', tier: 'bronze' },
  { id: 'sessions-50', tier: 'silver' },
  { id: 'sessions-100', tier: 'gold' },
  { id: 'sessions-250', tier: 'diamond' },
  { id: 'sessions-500', tier: 'ruby' },

  { id: 'streak-4', tier: 'bronze' },
  { id: 'streak-12', tier: 'silver' },
  { id: 'streak-26', tier: 'gold' },
  { id: 'streak-52', tier: 'diamond' },

  { id: 'first-session', tier: 'bronze' },
  { id: 'sets-50', tier: 'bronze' },
  { id: 'sets-500', tier: 'silver' },
  { id: 'exercises-20', tier: 'bronze' },
  { id: 'exercises-75', tier: 'silver' },
  { id: 'early-bird', tier: 'bronze' },
  { id: 'night-owl', tier: 'bronze' },
  { id: 'new-year', tier: 'bronze' },
];

export const achievementById = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

export interface AchievementStats {
  allMuscleGroupIds: string[];
  /** Index (0 Débutant .. 4 Élite) du niveau moyen par groupe musculaire ; absent si jamais pratiqué. */
  muscleGroupTierIndex: Record<string, number>;
  bucketTierIndex: Partial<Record<ExerciseEquipmentBucket, number>>;
  /** biomeReached[i] = le biome i (0 Prairie .. 5 Valhalla) a déjà été atteint au moins une fois. */
  biomeReached: boolean[];
  everPenalized: boolean;
  maxSessionsInOneWeek: number;
  longestWeekStreak: number;
  lifetimeCompletedSessions: number;
  totalCompletedSets: number;
  distinctExercisesPracticed: number;
  earlyBirdSessionDone: boolean;
  nightOwlSessionDone: boolean;
  newYearSessionDone: boolean;
}

const ADVANCED_INDEX = levelOrder.indexOf('advanced');
const ELITE_INDEX = levelOrder.indexOf('elite');
const NOVICE_INDEX = levelOrder.indexOf('novice');
const INTERMEDIATE_INDEX = levelOrder.indexOf('intermediate');

const BIOME_ACHIEVEMENT_BY_INDEX = ['', 'biome-forest', 'biome-tundra', 'biome-desert', 'biome-volcano', 'biome-valhalla'];

/** Calcule l'ensemble des succès satisfaits par un état donné de l'app (pur, sans DB). */
export function evaluateAchievements(stats: AchievementStats): Set<string> {
  const unlocked = new Set<string>();

  for (const muscleId of stats.allMuscleGroupIds) {
    if ((stats.muscleGroupTierIndex[muscleId] ?? -1) >= ADVANCED_INDEX) unlocked.add(`${muscleId}-confirmed`);
  }

  const muscleTierIndices = stats.allMuscleGroupIds.map((id) => stats.muscleGroupTierIndex[id] ?? -1);
  const minMuscleTier = muscleTierIndices.length > 0 ? Math.min(...muscleTierIndices) : -1;
  if (minMuscleTier >= NOVICE_INDEX) unlocked.add('all-muscles-novice');
  if (minMuscleTier >= INTERMEDIATE_INDEX) unlocked.add('all-muscles-intermediate');
  if (minMuscleTier >= ADVANCED_INDEX) unlocked.add('all-muscles-advanced');
  if (minMuscleTier >= ELITE_INDEX) unlocked.add('all-muscles-elite');

  const bodyweightTier = stats.bucketTierIndex.bodyweight ?? -1;
  const freeWeightTier = stats.bucketTierIndex['free-weight'] ?? -1;
  const machineTier = stats.bucketTierIndex.machine ?? -1;
  if (bodyweightTier >= ADVANCED_INDEX) unlocked.add('bodyweight-master');
  if (freeWeightTier >= ADVANCED_INDEX) unlocked.add('free-weight-master');
  if (machineTier >= ADVANCED_INDEX) unlocked.add('machine-master');
  if (bodyweightTier >= ELITE_INDEX && freeWeightTier >= ELITE_INDEX && machineTier >= ELITE_INDEX) {
    unlocked.add('triathlon-master');
  }

  for (let i = 1; i < stats.biomeReached.length; i += 1) {
    if (stats.biomeReached[i]) unlocked.add(BIOME_ACHIEVEMENT_BY_INDEX[i]);
  }
  if (stats.biomeReached[5] && !stats.everPenalized) unlocked.add('biome-valhalla-flawless');

  if (stats.maxSessionsInOneWeek >= 3) unlocked.add('weekly-3');
  if (stats.maxSessionsInOneWeek >= 4) unlocked.add('weekly-4');
  if (stats.maxSessionsInOneWeek >= 5) unlocked.add('weekly-5');
  if (stats.maxSessionsInOneWeek >= 6) unlocked.add('weekly-6');

  if (stats.lifetimeCompletedSessions >= 10) unlocked.add('sessions-10');
  if (stats.lifetimeCompletedSessions >= 50) unlocked.add('sessions-50');
  if (stats.lifetimeCompletedSessions >= 100) unlocked.add('sessions-100');
  if (stats.lifetimeCompletedSessions >= 250) unlocked.add('sessions-250');
  if (stats.lifetimeCompletedSessions >= 500) unlocked.add('sessions-500');

  if (stats.longestWeekStreak >= 4) unlocked.add('streak-4');
  if (stats.longestWeekStreak >= 12) unlocked.add('streak-12');
  if (stats.longestWeekStreak >= 26) unlocked.add('streak-26');
  if (stats.longestWeekStreak >= 52) unlocked.add('streak-52');

  if (stats.lifetimeCompletedSessions >= 1) unlocked.add('first-session');
  if (stats.totalCompletedSets >= 50) unlocked.add('sets-50');
  if (stats.totalCompletedSets >= 500) unlocked.add('sets-500');
  if (stats.distinctExercisesPracticed >= 20) unlocked.add('exercises-20');
  if (stats.distinctExercisesPracticed >= 75) unlocked.add('exercises-75');
  if (stats.earlyBirdSessionDone) unlocked.add('early-bird');
  if (stats.nightOwlSessionDone) unlocked.add('night-owl');
  if (stats.newYearSessionDone) unlocked.add('new-year');

  return unlocked;
}
