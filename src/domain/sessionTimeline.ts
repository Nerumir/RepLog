const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function startOfIsoWeekUtcMs(timestampMs: number): number {
  const date = new Date(timestampMs);
  const dayIndex = (date.getUTCDay() + 6) % 7; // Lundi = 0
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - dayIndex);
  return date.getTime();
}

export interface WeekStats {
  maxSessionsInOneWeek: number;
  longestWeekStreak: number;
}

/**
 * À partir des horodatages de séances terminées : le plus grand nombre de séances faites dans
 * une même semaine (lundi-dimanche), et la plus longue série de semaines consécutives ayant
 * eu au moins une séance.
 */
export function computeWeekStats(completedAtMs: number[]): WeekStats {
  if (completedAtMs.length === 0) return { maxSessionsInOneWeek: 0, longestWeekStreak: 0 };

  const countByWeekStart = new Map<number, number>();
  for (const ts of completedAtMs) {
    const weekStart = startOfIsoWeekUtcMs(ts);
    countByWeekStart.set(weekStart, (countByWeekStart.get(weekStart) ?? 0) + 1);
  }

  const maxSessionsInOneWeek = Math.max(...countByWeekStart.values());

  const sortedWeeks = Array.from(countByWeekStart.keys()).sort((a, b) => a - b);
  let longestWeekStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < sortedWeeks.length; i += 1) {
    currentStreak = sortedWeeks[i] - sortedWeeks[i - 1] === WEEK_MS ? currentStreak + 1 : 1;
    longestWeekStreak = Math.max(longestWeekStreak, currentStreak);
  }

  return { maxSessionsInOneWeek, longestWeekStreak };
}

export function hasEarlyBirdSession(completedAtMs: number[]): boolean {
  return completedAtMs.some((ts) => new Date(ts).getHours() < 7);
}

export function hasNightOwlSession(completedAtMs: number[]): boolean {
  return completedAtMs.some((ts) => new Date(ts).getHours() >= 22);
}

export function hasNewYearSession(completedAtMs: number[]): boolean {
  return completedAtMs.some((ts) => {
    const date = new Date(ts);
    return date.getMonth() === 0 && date.getDate() === 1;
  });
}
