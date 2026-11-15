import type { Slug } from 'react-native-body-highlighter';

/**
 * Correspondance entre nos muscleGroupId (data/seed/muscleGroups.seed.ts) et les slugs
 * de react-native-body-highlighter. `back` et `lats` convergent vers le même slug
 * (la librairie n'a pas de région "grand dorsal" séparée) : acceptable pour une visualisation.
 */
export const muscleHighlighterSlugs: Record<string, Slug> = {
  chest: 'chest',
  back: 'upper-back',
  lats: 'upper-back',
  shoulders: 'deltoids',
  biceps: 'biceps',
  triceps: 'triceps',
  forearms: 'forearm',
  traps: 'trapezius',
  abs: 'abs',
  quads: 'quadriceps',
  hamstrings: 'hamstring',
  glutes: 'gluteal',
  calves: 'calves',
};
