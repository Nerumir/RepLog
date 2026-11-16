export type SplitType =
  | 'full_body'
  | 'upper_lower'
  | 'push_pull_legs'
  | 'body_part_split'
  | 'antagonist_split'
  | 'custom';

function rotate(labels: string[], sessionsPerWeek: number): string[] {
  return Array.from({ length: sessionsPerWeek }, (_, i) => {
    const base = labels[i % labels.length];
    const cycle = Math.floor(i / labels.length);
    return cycle > 0 ? `${base} (${cycle + 1})` : base;
  });
}

export const splitTypeInfo: Record<
  SplitType,
  { label: string; description: string; dayLabels: (sessionsPerWeek: number) => string[] }
> = {
  full_body: {
    label: 'Full Body',
    description: 'Tout le corps à chaque séance. Idéal pour débuter ou pour 2-3 séances/semaine.',
    dayLabels: (n) => Array.from({ length: n }, (_, i) => `Full Body ${i + 1}`),
  },
  upper_lower: {
    label: 'Haut / Bas',
    description: 'Alterne le haut et le bas du corps. Bon compromis fréquence/récupération.',
    dayLabels: (n) => rotate(['Haut A', 'Bas A', 'Haut B', 'Bas B'], n),
  },
  push_pull_legs: {
    label: 'Push / Pull / Legs',
    description: 'Pousser (pecs/épaules/triceps), Tirer (dos/biceps), Jambes. Très répandu à 3-6 séances/semaine.',
    dayLabels: (n) => rotate(['Push', 'Pull', 'Legs'], n),
  },
  body_part_split: {
    label: 'Split par groupe musculaire',
    description: 'Un ou deux groupes musculaires ciblés par séance ("bro split"). Demande un volume de séances élevé.',
    dayLabels: (n) => rotate(['Pecs', 'Dos', 'Jambes', 'Épaules', 'Bras'], n),
  },
  antagonist_split: {
    label: 'Antagonistes',
    description: 'Associe des groupes musculaires opposés dans la même séance (ex: pecs/dos).',
    dayLabels: (n) => rotate(['Pecs / Dos', 'Jambes', 'Épaules / Bras'], n),
  },
  custom: {
    label: 'Personnalisé',
    description: 'Structure libre, sans schéma de split imposé.',
    dayLabels: (n) => Array.from({ length: n }, (_, i) => `Séance ${i + 1}`),
  },
};

const ALL_MUSCLE_GROUPS = [
  'chest', 'back', 'lats', 'shoulders', 'biceps', 'triceps', 'forearms', 'traps',
  'abs', 'quads', 'hamstrings', 'glutes', 'calves',
];

/** Groupes musculaires ciblés par séance pour chaque split, dans l'ordre des dayLabels (cycle si sessionsPerWeek > longueur). */
const SPLIT_MUSCLE_GROUPS: Record<SplitType, string[][]> = {
  full_body: [ALL_MUSCLE_GROUPS],
  upper_lower: [
    ['chest', 'back', 'lats', 'shoulders', 'biceps', 'triceps', 'forearms', 'traps'],
    ['quads', 'hamstrings', 'glutes', 'calves', 'abs'],
  ],
  push_pull_legs: [
    ['chest', 'shoulders', 'triceps'],
    ['back', 'lats', 'biceps', 'traps', 'forearms'],
    ['quads', 'hamstrings', 'glutes', 'calves', 'abs'],
  ],
  body_part_split: [
    ['chest'],
    ['back', 'lats', 'traps'],
    ['quads', 'hamstrings', 'glutes', 'calves'],
    ['shoulders'],
    ['biceps', 'triceps', 'forearms'],
  ],
  antagonist_split: [
    ['chest', 'back', 'lats', 'traps'],
    ['quads', 'hamstrings', 'glutes', 'calves'],
    ['shoulders', 'biceps', 'triceps', 'forearms'],
  ],
  custom: [ALL_MUSCLE_GROUPS],
};

/**
 * Groupes musculaires à cibler pour la N-ième séance (0-indexée) d'un split donné. Les
 * abdominaux sont toujours inclus en complément (travail léger qui trouve sa place partout),
 * même quand le split ne les mentionne pas explicitement.
 */
export function muscleTargetsForSession(splitType: SplitType, sessionIndex: number): string[] {
  const groups = SPLIT_MUSCLE_GROUPS[splitType];
  const base = groups[sessionIndex % groups.length];
  return Array.from(new Set([...base, 'abs']));
}
