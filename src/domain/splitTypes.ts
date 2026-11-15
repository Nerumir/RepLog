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
