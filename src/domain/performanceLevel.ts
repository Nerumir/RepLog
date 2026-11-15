import type { PerformanceLevel, Sex } from '@/domain/types';

export const levelOrder: PerformanceLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];

export interface PerformanceStandardRow {
  sex: Sex;
  bodyWeightMinKg: number;
  bodyWeightMaxKg: number;
  level: PerformanceLevel;
  /** 'reps' pour les exercices au poids du corps : minOneRmKg est alors un nombre de répétitions. */
  metric: 'one_rm_kg' | 'reps';
  minOneRmKg: number;
}

export interface LevelScoreResult {
  /** Niveau continu entre 1 (Débutant) et 5 (Élite) ; null si aucune donnée de référence. */
  score: number | null;
  /** Palier correspondant à floor(score) ; null si aucune donnée. */
  tier: PerformanceLevel | null;
  /** Progression (0..1) vers le palier suivant ; null si déjà au palier max (Élite) ou si aucune donnée. */
  progressToNext: number | null;
  /** 1RM (kg) requis pour atteindre le palier suivant ; null si déjà au palier max ou si aucune donnée. */
  nextThresholdKg: number | null;
}

function distanceToBracket(row: PerformanceStandardRow, bodyWeightKg: number): number {
  if (bodyWeightKg < row.bodyWeightMinKg) return row.bodyWeightMinKg - bodyWeightKg;
  if (bodyWeightKg > row.bodyWeightMaxKg) return bodyWeightKg - row.bodyWeightMaxKg;
  return 0;
}

/**
 * Sélectionne le bracket de poids de corps correspondant au sexe de l'utilisateur.
 * Si aucun bracket ne couvre exactement son poids (données de référence incomplètes),
 * on retombe sur le bracket le plus proche plutôt que de ne renvoyer aucune donnée.
 */
export function pickBracket(
  standards: PerformanceStandardRow[],
  sex: Sex,
  bodyWeightKg: number,
): PerformanceStandardRow[] {
  const sameSex = standards.filter((s) => s.sex === sex);
  if (sameSex.length === 0) return [];

  const exactMatch = sameSex.filter(
    (s) => bodyWeightKg >= s.bodyWeightMinKg && bodyWeightKg < s.bodyWeightMaxKg,
  );
  if (exactMatch.length > 0) return exactMatch;

  let bestDistance = Infinity;
  let bestBracketKey = '';
  for (const row of sameSex) {
    const distance = distanceToBracket(row, bodyWeightKg);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestBracketKey = `${row.bodyWeightMinKg}-${row.bodyWeightMaxKg}`;
    }
  }
  return sameSex.filter((s) => `${s.bodyWeightMinKg}-${s.bodyWeightMaxKg}` === bestBracketKey);
}

/**
 * Calcule le niveau continu (1..5) atteint pour un 1RM donné, par interpolation linéaire
 * entre les seuils de paliers. En dessous du premier palier (Débutant), le score est
 * clampé à 1 ; au-delà du dernier (Élite), il est clampé à 5.
 */
export function computeLevelScore(oneRm: number, bracketStandards: PerformanceStandardRow[]): LevelScoreResult {
  if (bracketStandards.length === 0) {
    return { score: null, tier: null, progressToNext: null, nextThresholdKg: null };
  }

  const sorted = [...bracketStandards].sort(
    (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level),
  );
  const thresholds = sorted.map((row) => row.minOneRmKg);

  if (oneRm >= thresholds[thresholds.length - 1]) {
    return { score: 5, tier: 'elite', progressToNext: null, nextThresholdKg: null };
  }

  for (let i = thresholds.length - 1; i >= 1; i -= 1) {
    if (oneRm >= thresholds[i - 1]) {
      const span = thresholds[i] - thresholds[i - 1];
      const progress = span > 0 ? Math.min(1, Math.max(0, (oneRm - thresholds[i - 1]) / span)) : 0;
      return { score: i + progress, tier: sorted[i - 1].level, progressToNext: progress, nextThresholdKg: thresholds[i] };
    }
  }

  return { score: 1, tier: sorted[0].level, progressToNext: 0, nextThresholdKg: thresholds[1] ?? thresholds[0] };
}

/** Palier correspondant à un score continu (1..5). */
export function tierFromScore(score: number): PerformanceLevel {
  return levelOrder[Math.min(levelOrder.length - 1, Math.max(0, Math.floor(score) - 1))];
}

/** Progression (0..1) à l'intérieur du palier courant d'un score continu ; 1 si au maximum (score >= 5). */
export function progressWithinTier(score: number): number {
  if (score >= levelOrder.length) return 1;
  return score - Math.floor(score);
}
