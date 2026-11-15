import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { attendanceBiomeSessions, attendanceProgress } from '@/db/schema';
import { advanceOnePoint, applyOneManualPenalty, applyPendingPenalties, BIOMES, type AttendanceState } from '@/domain/attendance';

const PROGRESS_ID = 1;

export async function getAttendanceProgress() {
  const rows = await db.select().from(attendanceProgress).where(eq(attendanceProgress.id, PROGRESS_ID));
  if (rows[0]) return rows[0];

  await db.insert(attendanceProgress).values({ id: PROGRESS_ID });
  const created = await db.select().from(attendanceProgress).where(eq(attendanceProgress.id, PROGRESS_ID));
  return created[0];
}

export async function getBiomeSessionCounts(): Promise<number[]> {
  const rows = await db.select().from(attendanceBiomeSessions);
  const countByIndex = new Map(rows.map((row) => [row.biomeIndex, row.totalSessions]));
  return BIOMES.map((_, index) => countByIndex.get(index) ?? 0);
}

export async function setPenaltyThresholdDays(days: number) {
  await db
    .insert(attendanceProgress)
    .values({ id: PROGRESS_ID, penaltyThresholdDays: days })
    .onConflictDoUpdate({ target: attendanceProgress.id, set: { penaltyThresholdDays: days } });
}

async function incrementBiomeSessionCount(biomeIndex: number) {
  const rows = await db
    .select()
    .from(attendanceBiomeSessions)
    .where(eq(attendanceBiomeSessions.biomeIndex, biomeIndex));
  const current = rows[0]?.totalSessions ?? 0;
  await db
    .insert(attendanceBiomeSessions)
    .values({ biomeIndex, totalSessions: current + 1 })
    .onConflictDoUpdate({ target: attendanceBiomeSessions.biomeIndex, set: { totalSessions: current + 1 } });
}

/**
 * Applique les pénalités de pause en retard à partir de l'état stocké, sans faire avancer la
 * position. À appeler à chaque ouverture de l'onglet Assiduité ou de l'écran Profil.
 */
export async function applyLazyPenaltiesIfNeeded(nowMs = Date.now()) {
  const progress = await getAttendanceProgress();
  if (progress.penaltyThresholdDays == null) return progress;

  const anchorMs = progress.lastPenaltyCheckAt ?? progress.lastSessionCompletedAt ?? nowMs;
  const state: AttendanceState = { biomeIndex: progress.biomeIndex, pointInBiome: progress.pointInBiome };
  const result = applyPendingPenalties(state, anchorMs, nowMs, progress.penaltyThresholdDays);

  if (result.penaltiesApplied === 0) return progress;

  await db
    .update(attendanceProgress)
    .set({
      biomeIndex: result.state.biomeIndex,
      pointInBiome: result.state.pointInBiome,
      lastPenaltyCheckAt: result.newDeadlineAnchorMs,
      everPenalized: true,
    })
    .where(eq(attendanceProgress.id, PROGRESS_ID));

  return { ...progress, biomeIndex: result.state.biomeIndex, pointInBiome: result.state.pointInBiome, everPenalized: true };
}

/** À appeler à la fin d'une séance : applique les pénalités en retard puis avance d'un point. */
export async function recordAttendanceSession(nowMs = Date.now()) {
  const progress = await getAttendanceProgress();
  const anchorMs = progress.lastPenaltyCheckAt ?? progress.lastSessionCompletedAt ?? nowMs;
  const stateBefore: AttendanceState = { biomeIndex: progress.biomeIndex, pointInBiome: progress.pointInBiome };

  const afterPenalties =
    progress.penaltyThresholdDays != null
      ? applyPendingPenalties(stateBefore, anchorMs, nowMs, progress.penaltyThresholdDays).state
      : stateBefore;

  const afterAdvance = advanceOnePoint(afterPenalties);
  const penalized = afterPenalties.biomeIndex !== stateBefore.biomeIndex || afterPenalties.pointInBiome !== stateBefore.pointInBiome;

  await db
    .update(attendanceProgress)
    .set({
      biomeIndex: afterAdvance.biomeIndex,
      pointInBiome: afterAdvance.pointInBiome,
      lastSessionCompletedAt: nowMs,
      lastPenaltyCheckAt: nowMs,
      ...(penalized ? { everPenalized: true } : {}),
    })
    .where(eq(attendanceProgress.id, PROGRESS_ID));

  await incrementBiomeSessionCount(afterAdvance.biomeIndex);

  return afterAdvance;
}

/** Remet la progression à zéro (biome 0, point 0) et efface le compteur de séances de chaque biome. Conserve le seuil de pénalité réglé par l'utilisateur. */
export async function resetAttendanceProgress() {
  await db
    .update(attendanceProgress)
    .set({ biomeIndex: 0, pointInBiome: 0, lastSessionCompletedAt: null, lastPenaltyCheckAt: null, everPenalized: false })
    .where(eq(attendanceProgress.id, PROGRESS_ID));
  await db.delete(attendanceBiomeSessions);
}

/** Debug : force une pénalité immédiate (retombe au point 0 du biome précédent), sans attendre le délai réel. */
export async function applyDebugPenalty() {
  const progress = await getAttendanceProgress();
  const next = applyOneManualPenalty({ biomeIndex: progress.biomeIndex, pointInBiome: progress.pointInBiome });

  await db
    .update(attendanceProgress)
    .set({ biomeIndex: next.biomeIndex, pointInBiome: next.pointInBiome, everPenalized: true })
    .where(eq(attendanceProgress.id, PROGRESS_ID));

  return next;
}
