import i18n from '@/i18n';

export type SplitType =
  | 'full_body'
  | 'upper_lower'
  | 'push_pull_legs'
  | 'body_part_split'
  | 'antagonist_split'
  | 'custom';

export const SPLIT_TYPES: SplitType[] = ['full_body', 'upper_lower', 'push_pull_legs', 'body_part_split', 'antagonist_split', 'custom'];

function rotate(labels: string[], sessionsPerWeek: number): string[] {
  return Array.from({ length: sessionsPerWeek }, (_, i) => {
    const base = labels[i % labels.length];
    const cycle = Math.floor(i / labels.length);
    return cycle > 0 ? `${base} (${cycle + 1})` : base;
  });
}

function numbered(base: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => `${base} ${i + 1}`);
}

/**
 * Noms de séance générés pour chaque split type, dans la langue active au moment de l'appel
 * (i18n.t statique : ces noms sont enregistrés tels quels en base, comme un instantané, et ne se
 * retraduisent pas rétroactivement si l'utilisateur change de langue après coup).
 */
export const splitTypeInfo: Record<SplitType, { dayLabels: (sessionsPerWeek: number) => string[] }> = {
  full_body: { dayLabels: (n) => numbered(i18n.t('enums.splitType.full_body.dayBase'), n) },
  upper_lower: { dayLabels: (n) => rotate(i18n.t('enums.splitType.upper_lower.dayBases', { returnObjects: true }) as string[], n) },
  push_pull_legs: { dayLabels: (n) => rotate(i18n.t('enums.splitType.push_pull_legs.dayBases', { returnObjects: true }) as string[], n) },
  body_part_split: { dayLabels: (n) => rotate(i18n.t('enums.splitType.body_part_split.dayBases', { returnObjects: true }) as string[], n) },
  antagonist_split: { dayLabels: (n) => rotate(i18n.t('enums.splitType.antagonist_split.dayBases', { returnObjects: true }) as string[], n) },
  custom: { dayLabels: (n) => numbered(i18n.t('enums.splitType.custom.dayBase'), n) },
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
