import type { ImageSource } from 'expo-image';

import { generatedExerciseMedia } from './exerciseMedia.generated';

export type ExerciseMedia =
  | { kind: 'gif' | 'image'; source: ImageSource }
  | { kind: 'video'; source: number };

// Metro exige des require() statiques : impossible de faire require(`.../${id}.jpg`).
// Ajouter un exercice = déposer le fichier dans assets/exercises/<slug>/ puis ajouter une entrée dans
// exerciseMedia.generated.ts (générée par data/seed/exercises.seed.ts, ne pas éditer à la main).

export const exerciseMedia: Record<string, ExerciseMedia> = {
  'bench-press': { kind: 'video', source: require('../../assets/exercises/barbell-bench-press/preview.mp4') },
  'back-squat': { kind: 'video', source: require('../../assets/exercises/barbell-squat/preview.mp4') },
  'pull-up': { kind: 'video', source: require('../../assets/exercises/pull-ups/preview.mp4') },
  ...generatedExerciseMedia,
};

export const placeholderMedia: ExerciseMedia = {
  kind: 'image',
  source: require('../../assets/images/icon.png'),
};

export function getExerciseMedia(exerciseId: string): ExerciseMedia {
  return exerciseMedia[exerciseId] ?? placeholderMedia;
}
