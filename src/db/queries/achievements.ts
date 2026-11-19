import { db } from '@/db/client';
import { unlockedAchievements } from '@/db/schema';
import { getAttendanceProgress, getBiomeSessionCounts } from '@/db/queries/attendance';
import { listMuscleGroups } from '@/db/queries/exercises';
import { gatherExercisePerformanceInputs } from '@/db/queries/performanceSummary';
import { getUserProfile } from '@/db/queries/profile';
import { getAppSettings } from '@/db/queries/settings';
import { countCompletedSessions, countCompletedSets, getCompletedSessionTimestamps } from '@/db/queries/workoutLogs';
import {
  ACHIEVEMENTS,
  achievementById,
  evaluateAchievements,
  type AchievementDefinition,
  type AchievementStats,
  type AchievementTier,
} from '@/domain/achievements';
import { aggregateByEquipmentBucket } from '@/domain/equipmentBucketAggregation';
import { aggregateByMuscleGroup } from '@/domain/muscleAggregation';
import { levelOrder, tierFromScore } from '@/domain/performanceLevel';
import { computeWeekStats, hasEarlyBirdSession, hasNewYearSession, hasNightOwlSession } from '@/domain/sessionTimeline';

const EQUIPMENT_BUCKET_IDS = ['bodyweight', 'free-weight', 'machine'] as const;

export async function listUnlockedAchievementIds(): Promise<Set<string>> {
  const rows = await db.select({ id: unlockedAchievements.id }).from(unlockedAchievements);
  return new Set(rows.map((row) => row.id));
}

/** Efface tous les trophées débloqués (appelé avec resetPerformances : les succès se recalculeront depuis zéro). */
export async function resetAchievements() {
  await db.delete(unlockedAchievements);
}

async function buildAchievementStats(): Promise<AchievementStats | null> {
  const [profile, settings] = await Promise.all([getUserProfile(), getAppSettings()]);
  if (!profile) return null;

  const [muscleGroups, perExercise, attendanceProgress, biomeSessionCounts, sessionTimestamps, totalCompletedSets, lifetimeCompletedSessions] =
    await Promise.all([
      listMuscleGroups(),
      gatherExercisePerformanceInputs(profile, settings?.oneRmFormula ?? 'epley'),
      getAttendanceProgress(),
      getBiomeSessionCounts(),
      getCompletedSessionTimestamps(profile.performanceResetAt),
      countCompletedSets(profile.performanceResetAt),
      countCompletedSessions(profile.performanceResetAt),
    ]);

  const muscleSummaries = aggregateByMuscleGroup(perExercise, muscleGroups);
  const muscleGroupTierIndex: Record<string, number> = {};
  for (const summary of muscleSummaries) {
    if (summary.averageScore !== null) {
      muscleGroupTierIndex[summary.muscleGroupId] = levelOrder.indexOf(tierFromScore(summary.averageScore));
    }
  }

  const bucketAverages = aggregateByEquipmentBucket(perExercise);
  const bucketTierIndex: AchievementStats['bucketTierIndex'] = {};
  for (const bucket of EQUIPMENT_BUCKET_IDS) {
    const average = bucketAverages[bucket];
    if (average !== null) bucketTierIndex[bucket] = levelOrder.indexOf(tierFromScore(average));
  }

  const { maxSessionsInOneWeek, longestWeekStreak } = computeWeekStats(sessionTimestamps);

  return {
    allMuscleGroupIds: muscleGroups.map((m) => m.id),
    muscleGroupTierIndex,
    bucketTierIndex,
    biomeReached: biomeSessionCounts.map((sessionsInBiome) => sessionsInBiome > 0),
    everPenalized: attendanceProgress.everPenalized,
    maxSessionsInOneWeek,
    longestWeekStreak,
    lifetimeCompletedSessions,
    totalCompletedSets,
    distinctExercisesPracticed: perExercise.length,
    earlyBirdSessionDone: hasEarlyBirdSession(sessionTimestamps),
    nightOwlSessionDone: hasNightOwlSession(sessionTimestamps),
    newYearSessionDone: hasNewYearSession(sessionTimestamps),
  };
}

/** À appeler après chaque séance terminée : recalcule tous les succès et débloque les nouveaux. */
export async function checkAndUnlockAchievements(): Promise<AchievementDefinition[]> {
  const stats = await buildAchievementStats();
  if (!stats) return [];

  const satisfiedIds = evaluateAchievements(stats);
  const alreadyUnlocked = await listUnlockedAchievementIds();
  const newlyUnlockedIds = [...satisfiedIds].filter((id) => !alreadyUnlocked.has(id));
  if (newlyUnlockedIds.length === 0) return [];

  const now = Date.now();
  await db
    .insert(unlockedAchievements)
    .values(newlyUnlockedIds.map((id) => ({ id, unlockedAt: now })))
    .onConflictDoNothing();

  return newlyUnlockedIds.map((id) => achievementById.get(id)).filter((a): a is AchievementDefinition => a !== undefined);
}

export async function getTrophyCountsByTier(): Promise<Record<AchievementTier, number>> {
  const unlockedIds = await listUnlockedAchievementIds();
  const counts: Record<AchievementTier, number> = { bronze: 0, silver: 0, gold: 0, diamond: 0, ruby: 0 };
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) counts[achievement.tier] += 1;
  }
  return counts;
}

export interface AchievementWithStatus extends AchievementDefinition {
  unlocked: boolean;
  unlockedAt: number | null;
}

export async function listAchievementsWithStatus(): Promise<AchievementWithStatus[]> {
  const rows = await db.select().from(unlockedAchievements);
  const unlockedAtById = new Map(rows.map((row) => [row.id, row.unlockedAt]));
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: unlockedAtById.has(a.id), unlockedAt: unlockedAtById.get(a.id) ?? null }));
}
