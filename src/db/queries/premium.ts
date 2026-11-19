import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { appSettings } from '@/db/schema';
import { countCompletedSessions } from '@/db/queries/workoutLogs';
import { FREE_SESSION_LIMIT, isValidPremiumCode } from '@/domain/premium';

const SETTINGS_ID = 1;

export async function isPremiumUnlocked(): Promise<boolean> {
  const rows = await db.select({ premiumUnlocked: appSettings.premiumUnlocked }).from(appSettings).where(eq(appSettings.id, SETTINGS_ID));
  return rows[0]?.premiumUnlocked ?? false;
}

/** Valide un code cadeau/perso et débloque la version illimitée si il est correct. */
export async function redeemPremiumCode(rawCode: string): Promise<boolean> {
  if (!isValidPremiumCode(rawCode)) return false;
  await db
    .insert(appSettings)
    .values({ id: SETTINGS_ID, premiumUnlocked: true, premiumUnlockedAt: Date.now(), premiumSource: 'code' })
    .onConflictDoUpdate({
      target: appSettings.id,
      set: { premiumUnlocked: true, premiumUnlockedAt: Date.now(), premiumSource: 'code' },
    });
  return true;
}

/**
 * Nombre de séances gratuites déjà consommées et limite atteinte ou non. Le total est le nombre
 * de séances terminées depuis toujours (indépendant d'une réinitialisation des performances, pour
 * éviter qu'un reset ne redonne des séances gratuites).
 */
export async function getFreeTierStatus(): Promise<{ unlocked: boolean; completedSessions: number; limitReached: boolean }> {
  const [unlocked, completedSessions] = await Promise.all([isPremiumUnlocked(), countCompletedSessions()]);
  return { unlocked, completedSessions, limitReached: !unlocked && completedSessions >= FREE_SESSION_LIMIT };
}
