import { levelOrder } from '@/domain/performanceLevel';
import type { ExerciseEquipmentBucket } from '@/domain/exerciseEquipmentBucket';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'ruby';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
}

const MUSCLE_ACHIEVEMENTS: Omit<AchievementDefinition, 'tier'>[] = [
  { id: 'abs-confirmed', name: 'Tablette de chocolat', description: 'Atteindre le niveau Confirmé aux abdominaux.' },
  { id: 'back-confirmed', name: "Dos d'acier", description: 'Atteindre le niveau Confirmé au dos.' },
  { id: 'biceps-confirmed', name: 'Bras de fer', description: 'Atteindre le niveau Confirmé aux biceps.' },
  { id: 'calves-confirmed', name: 'Mollets de gazelle', description: 'Atteindre le niveau Confirmé aux mollets.' },
  { id: 'chest-confirmed', name: 'Torse bombé', description: 'Atteindre le niveau Confirmé aux pectoraux.' },
  { id: 'forearms-confirmed', name: 'Poigne de crabe', description: 'Atteindre le niveau Confirmé aux avant-bras.' },
  { id: 'glutes-confirmed', name: 'Fessiers de béton', description: 'Atteindre le niveau Confirmé aux fessiers.' },
  { id: 'hamstrings-confirmed', name: 'Ischios en titane', description: 'Atteindre le niveau Confirmé aux ischio-jambiers.' },
  { id: 'lats-confirmed', name: 'Envergure de condor', description: 'Atteindre le niveau Confirmé aux dorsaux.' },
  { id: 'quads-confirmed', name: 'Quadriceps de sprinteur', description: 'Atteindre le niveau Confirmé aux quadriceps.' },
  { id: 'shoulders-confirmed', name: 'Épaules de déménageur', description: 'Atteindre le niveau Confirmé aux épaules.' },
  { id: 'traps-confirmed', name: 'Cou de taureau', description: 'Atteindre le niveau Confirmé aux trapèzes.' },
  { id: 'triceps-confirmed', name: 'Triceps qui claquent', description: 'Atteindre le niveau Confirmé aux triceps.' },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  ...MUSCLE_ACHIEVEMENTS.map((a) => ({ ...a, tier: 'gold' as const })),

  { id: 'all-muscles-novice', name: 'Tout-terrain', description: 'Atteindre au moins le niveau Novice sur les 13 groupes musculaires.', tier: 'bronze' },
  { id: 'all-muscles-intermediate', name: 'Corps harmonieux', description: 'Atteindre au moins le niveau Intermédiaire sur les 13 groupes musculaires.', tier: 'silver' },
  { id: 'all-muscles-advanced', name: 'Spécimen complet', description: 'Atteindre au moins le niveau Confirmé sur les 13 groupes musculaires.', tier: 'diamond' },
  { id: 'all-muscles-elite', name: 'Demi-dieu de la fonte', description: 'Atteindre le niveau Élite sur les 13 groupes musculaires.', tier: 'ruby' },

  { id: 'bodyweight-master', name: 'Maître du corps', description: 'Atteindre en moyenne le niveau Confirmé sur les exercices au poids du corps.', tier: 'gold' },
  { id: 'free-weight-master', name: 'Roi de la fonte', description: 'Atteindre en moyenne le niveau Confirmé sur les exercices avec poids, haltères et barres.', tier: 'gold' },
  { id: 'machine-master', name: 'As de la machine', description: 'Atteindre en moyenne le niveau Confirmé sur les exercices à la machine.', tier: 'gold' },
  { id: 'triathlon-master', name: 'Triathlète de la fonte', description: 'Atteindre en moyenne le niveau Élite dans les 3 catégories de matériel à la fois.', tier: 'ruby' },

  { id: 'biome-forest', name: 'Dans les bois', description: 'Atteindre le biome Forêt sur la carte d\'assiduité.', tier: 'bronze' },
  { id: 'biome-tundra', name: 'Grand froid', description: 'Atteindre le biome Toundra.', tier: 'bronze' },
  { id: 'biome-desert', name: 'Traversée du désert', description: 'Atteindre le biome Désert.', tier: 'silver' },
  { id: 'biome-volcano', name: 'Enfer sur terre', description: 'Atteindre le biome Volcan.', tier: 'gold' },
  { id: 'biome-valhalla', name: 'Aux portes du Valhalla', description: 'Atteindre le biome Valhalla.', tier: 'diamond' },
  { id: 'biome-valhalla-flawless', name: 'Einherjar', description: 'Atteindre le Valhalla sans jamais avoir subi de pénalité.', tier: 'ruby' },

  { id: 'weekly-3', name: 'Trio de la semaine', description: 'Faire 3 séances au cours d\'une même semaine.', tier: 'bronze' },
  { id: 'weekly-4', name: 'Quatuor imparable', description: 'Faire 4 séances au cours d\'une même semaine.', tier: 'silver' },
  { id: 'weekly-5', name: 'Cinq sur cinq', description: 'Faire 5 séances au cours d\'une même semaine.', tier: 'gold' },
  { id: 'weekly-6', name: 'Workaholic de la fonte', description: 'Faire 6 séances ou plus au cours d\'une même semaine.', tier: 'diamond' },

  { id: 'sessions-10', name: 'Dixième séance', description: 'Terminer 10 séances au total.', tier: 'bronze' },
  { id: 'sessions-50', name: 'Cinquantenaire', description: 'Terminer 50 séances au total.', tier: 'silver' },
  { id: 'sessions-100', name: 'Centurion', description: 'Terminer 100 séances au total.', tier: 'gold' },
  { id: 'sessions-250', name: 'Vétéran', description: 'Terminer 250 séances au total.', tier: 'diamond' },
  { id: 'sessions-500', name: 'Légende vivante', description: 'Terminer 500 séances au total.', tier: 'ruby' },

  { id: 'streak-4', name: 'Un mois sans faillir', description: 'S\'entraîner au moins une fois par semaine pendant 4 semaines consécutives.', tier: 'bronze' },
  { id: 'streak-12', name: 'Saison complète', description: 'S\'entraîner au moins une fois par semaine pendant 12 semaines consécutives.', tier: 'silver' },
  { id: 'streak-26', name: 'Semestre de fonte', description: 'S\'entraîner au moins une fois par semaine pendant 26 semaines consécutives.', tier: 'gold' },
  { id: 'streak-52', name: 'Une année sans craquer', description: 'S\'entraîner au moins une fois par semaine pendant 52 semaines consécutives.', tier: 'diamond' },

  { id: 'first-session', name: 'Premiers pas', description: 'Terminer sa première séance.', tier: 'bronze' },
  { id: 'sets-50', name: 'Carnet bien rempli', description: 'Enregistrer 50 séries au total.', tier: 'bronze' },
  { id: 'sets-500', name: 'Carnet légendaire', description: 'Enregistrer 500 séries au total.', tier: 'silver' },
  { id: 'exercises-20', name: 'Touche-à-tout', description: 'Pratiquer au moins 20 exercices différents.', tier: 'bronze' },
  { id: 'exercises-75', name: 'Encyclopédie vivante', description: 'Pratiquer au moins 75 exercices différents.', tier: 'silver' },
  { id: 'early-bird', name: 'Lève-tôt', description: 'Terminer une séance avant 7h du matin.', tier: 'bronze' },
  { id: 'night-owl', name: 'Oiseau de nuit', description: 'Terminer une séance après 22h.', tier: 'bronze' },
  { id: 'new-year', name: 'Résolution tenue', description: 'Terminer une séance le 1ᵉʳ janvier.', tier: 'bronze' },
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
