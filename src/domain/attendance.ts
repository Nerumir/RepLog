export interface BiomeInfo {
  id: string;
  label: string;
}

export const BIOMES: BiomeInfo[] = [
  { id: 'prairie', label: 'Prairie' },
  { id: 'forest', label: 'Forêt' },
  { id: 'tundra', label: 'Toundra' },
  { id: 'desert', label: 'Désert' },
  { id: 'volcano', label: 'Volcan' },
  { id: 'valhalla', label: 'Valhalla' },
];

export const POINTS_PER_BIOME = 20;

export interface AttendanceState {
  biomeIndex: number;
  pointInBiome: number;
}

export function advanceOnePoint(state: AttendanceState): AttendanceState {
  const maxBiomeIndex = BIOMES.length - 1;
  if (state.biomeIndex >= maxBiomeIndex && state.pointInBiome >= POINTS_PER_BIOME - 1) {
    return state;
  }
  if (state.pointInBiome + 1 >= POINTS_PER_BIOME) {
    return { biomeIndex: Math.min(state.biomeIndex + 1, maxBiomeIndex), pointInBiome: 0 };
  }
  return { ...state, pointInBiome: state.pointInBiome + 1 };
}

export interface PendingPenaltiesResult {
  state: AttendanceState;
  penaltiesApplied: number;
  /** Horodatage (ms) à partir duquel repartir pour le prochain calcul de délai écoulé. */
  newDeadlineAnchorMs: number;
}

/**
 * Applique les pénalités de pause en cascade : chaque pénalité fait retomber au point 0
 * du biome précédent. On avance une "deadline" de thresholdDays à chaque pénalité pour
 * détecter correctement plusieurs pénalités d'affilée dans une seule longue pause.
 */
export function applyPendingPenalties(
  state: AttendanceState,
  lastAnchorMs: number,
  nowMs: number,
  thresholdDays: number,
): PendingPenaltiesResult {
  const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;
  let current = state;
  let deadline = lastAnchorMs + thresholdMs;
  let penaltiesApplied = 0;

  while (nowMs > deadline && current.biomeIndex > 0) {
    current = { biomeIndex: current.biomeIndex - 1, pointInBiome: 0 };
    penaltiesApplied += 1;
    deadline += thresholdMs;
  }

  return {
    state: current,
    penaltiesApplied,
    newDeadlineAnchorMs: penaltiesApplied > 0 ? lastAnchorMs + penaltiesApplied * thresholdMs : lastAnchorMs,
  };
}

/** Applique une unique pénalité immédiate (retombe au point 0 du biome précédent), sans notion de délai. */
export function applyOneManualPenalty(state: AttendanceState): AttendanceState {
  if (state.biomeIndex <= 0) return { biomeIndex: 0, pointInBiome: 0 };
  return { biomeIndex: state.biomeIndex - 1, pointInBiome: 0 };
}

export function absolutePosition(state: AttendanceState): number {
  return state.biomeIndex * POINTS_PER_BIOME + state.pointInBiome;
}

export function stateFromAbsolute(absolute: number): AttendanceState {
  const maxBiomeIndex = BIOMES.length - 1;
  const biomeIndex = Math.max(0, Math.min(Math.floor(absolute / POINTS_PER_BIOME), maxBiomeIndex));
  const pointInBiome = Math.max(0, absolute - biomeIndex * POINTS_PER_BIOME);
  return { biomeIndex, pointInBiome };
}
