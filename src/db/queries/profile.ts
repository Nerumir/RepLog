import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { userProfile } from '@/db/schema';
import type { Sex } from '@/domain/types';

const PROFILE_ID = 1;

export async function getUserProfile() {
  const rows = await db.select().from(userProfile).where(eq(userProfile.id, PROFILE_ID));
  return rows[0] ?? null;
}

export interface OnboardingInput {
  nickname: string;
  birthDate: string;
  sex: Sex;
  heightCm: number;
  bodyWeightKg: number;
}

export async function completeOnboarding(input: OnboardingInput) {
  await db
    .insert(userProfile)
    .values({ id: PROFILE_ID, ...input, onboardingCompletedAt: Date.now() })
    .onConflictDoUpdate({
      target: userProfile.id,
      set: { ...input, onboardingCompletedAt: Date.now() },
    });
}

export async function updateProfile(input: Partial<OnboardingInput>) {
  await db.update(userProfile).set(input).where(eq(userProfile.id, PROFILE_ID));
}

/** Les séances antérieures à cet horodatage ne compteront plus dans les calculs de niveau/1RM. */
export async function resetPerformances() {
  await db.update(userProfile).set({ performanceResetAt: Date.now() }).where(eq(userProfile.id, PROFILE_ID));
}
