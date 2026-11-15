import type { PerformanceLevel, Sex } from '@/domain/types';

export type PerformanceMetric = 'one_rm_kg' | 'reps';

export interface PerformanceStandardSeed {
  exerciseId: string;
  sex: Sex;
  bodyWeightMinKg: number;
  bodyWeightMaxKg: number;
  level: PerformanceLevel;
  metric: PerformanceMetric;
  minOneRmKg: number;
}

/**
 * Seuils par palier (Débutant/Novice/Intermédiaire/Confirmé/Élite), par exercice, sexe et
 * tranche de poids de corps. Une partie vient directement de strengthlevel.com (3 tranches de
 * poids homme à 60/80/100kg, 2 tranches femme à 50/70kg) ; une autre est déduite par ratio depuis
 * un exercice proche déjà mesuré (ex: Hammer Curl pupitre = Hammer Curl × l'écart observé entre
 * Curl et Curl pupitre). Pour les exercices les plus exotiques (sans aucune donnée comparable),
 * les seuils sont estimés à vue de nez à partir de la difficulté perçue du mouvement — volontairement
 * approximatifs, à affiner si besoin plus tard.
 */
function bracket(
  exerciseId: string,
  sex: Sex,
  bodyWeightMinKg: number,
  bodyWeightMaxKg: number,
  metric: PerformanceMetric,
  thresholds: Record<PerformanceLevel, number>,
): PerformanceStandardSeed[] {
  return (Object.entries(thresholds) as [PerformanceLevel, number][]).map(([level, minOneRmKg]) => ({
    exerciseId,
    sex,
    bodyWeightMinKg,
    bodyWeightMaxKg,
    level,
    metric,
    minOneRmKg,
  }));
}

export const performanceStandardsSeed: PerformanceStandardSeed[] = [
  // 90-90-hip-switches
  ...bracket('90-90-hip-switches', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('90-90-hip-switches', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('90-90-hip-switches', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('90-90-hip-switches', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('90-90-hip-switches', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // alternating-hammer-curl
  ...bracket('alternating-hammer-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 18, advanced: 26, elite: 34 }),
  ...bracket('alternating-hammer-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 16, intermediate: 24, advanced: 33, elite: 42 }),
  ...bracket('alternating-hammer-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('alternating-hammer-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 15, elite: 20 }),
  ...bracket('alternating-hammer-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 13, advanced: 18, elite: 24 }),

  // anti-gravity-press
  ...bracket('anti-gravity-press', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('anti-gravity-press', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('anti-gravity-press', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('anti-gravity-press', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('anti-gravity-press', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // archer-push-up
  ...bracket('archer-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 6, intermediate: 16, advanced: 28, elite: 41 }),
  ...bracket('archer-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 7, intermediate: 16, advanced: 26, elite: 37 }),
  ...bracket('archer-push-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 7, intermediate: 15, advanced: 24, elite: 33 }),
  ...bracket('archer-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 2, intermediate: 12, advanced: 24, elite: 38 }),
  ...bracket('archer-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 4, intermediate: 12, advanced: 23, elite: 34 }),

  // arnold-press
  ...bracket('arnold-press', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 27, elite: 37 }),
  ...bracket('arnold-press', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 16, intermediate: 24, advanced: 34, elite: 44 }),
  ...bracket('arnold-press', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 20, intermediate: 29, advanced: 39, elite: 50 }),
  ...bracket('arnold-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 11, advanced: 15, elite: 20 }),
  ...bracket('arnold-press', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 13, advanced: 17, elite: 22 }),

  // assisted-pistol-squat
  ...bracket('assisted-pistol-squat', 'male', 0, 70, 'reps', { beginner: 0, novice: 5, intermediate: 22, advanced: 43, elite: 67 }),
  ...bracket('assisted-pistol-squat', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 23, advanced: 41, elite: 61 }),
  ...bracket('assisted-pistol-squat', 'male', 90, 999, 'reps', { beginner: 0, novice: 9, intermediate: 22, advanced: 38, elite: 54 }),
  ...bracket('assisted-pistol-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 2, intermediate: 14, advanced: 29, elite: 45 }),
  ...bracket('assisted-pistol-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 5, intermediate: 16, advanced: 27, elite: 40 }),

  // b-stance-hip-thrust
  ...bracket('b-stance-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 63, intermediate: 107, advanced: 163, elite: 227 }),
  ...bracket('b-stance-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 149, advanced: 213, elite: 285 }),
  ...bracket('b-stance-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 80, novice: 126, intermediate: 186, advanced: 257, elite: 335 }),
  ...bracket('b-stance-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 30, novice: 56, intermediate: 92, advanced: 137, elite: 187 }),
  ...bracket('b-stance-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 39, novice: 69, intermediate: 108, advanced: 155, elite: 209 }),

  // back-extension
  ...bracket('back-extension', 'male', 0, 70, 'reps', { beginner: 1, novice: 13, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('back-extension', 'male', 70, 90, 'reps', { beginner: 5, novice: 15, intermediate: 29, advanced: 46, elite: 63 }),
  ...bracket('back-extension', 'male', 90, 999, 'reps', { beginner: 6, novice: 15, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('back-extension', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 39, elite: 54 }),
  ...bracket('back-extension', 'female', 55, 999, 'reps', { beginner: 6, novice: 13, intermediate: 23, advanced: 35, elite: 46 }),

  // back-squat
  ...bracket('back-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 49, novice: 71, intermediate: 98, advanced: 129, elite: 162 }),
  ...bracket('back-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 75, novice: 101, intermediate: 132, advanced: 168, elite: 206 }),
  ...bracket('back-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 98, novice: 128, intermediate: 163, advanced: 203, elite: 244 }),
  ...bracket('back-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 26, novice: 42, intermediate: 63, advanced: 88, elite: 116 }),
  ...bracket('back-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 37, novice: 56, intermediate: 80, advanced: 109, elite: 140 }),

  // backpack-curls
  ...bracket('backpack-curls', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('backpack-curls', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('backpack-curls', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('backpack-curls', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('backpack-curls', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // backpack-row
  ...bracket('backpack-row', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('backpack-row', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('backpack-row', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('backpack-row', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('backpack-row', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // barbell-behind-the-back-30-degree-shrug
  ...bracket('barbell-behind-the-back-30-degree-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 30, novice: 55, intermediate: 89, advanced: 130, elite: 178 }),
  ...bracket('barbell-behind-the-back-30-degree-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 53, novice: 85, intermediate: 126, advanced: 175, elite: 230 }),
  ...bracket('barbell-behind-the-back-30-degree-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 76, novice: 113, intermediate: 159, advanced: 214, elite: 274 }),
  ...bracket('barbell-behind-the-back-30-degree-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 28, intermediate: 51, advanced: 82, elite: 119 }),
  ...bracket('barbell-behind-the-back-30-degree-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 42, intermediate: 71, advanced: 106, elite: 147 }),

  // barbell-bent-over-row
  ...bracket('barbell-bent-over-row', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 46, intermediate: 65, advanced: 87, elite: 111 }),
  ...bracket('barbell-bent-over-row', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 66, intermediate: 88, advanced: 114, elite: 141 }),
  ...bracket('barbell-bent-over-row', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 84, intermediate: 108, advanced: 136, elite: 166 }),
  ...bracket('barbell-bent-over-row', 'female', 0, 55, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 72 }),
  ...bracket('barbell-bent-over-row', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 46, advanced: 64, elite: 83 }),

  // barbell-bent-over-row-overhand
  ...bracket('barbell-bent-over-row-overhand', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 46, intermediate: 65, advanced: 87, elite: 111 }),
  ...bracket('barbell-bent-over-row-overhand', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 66, intermediate: 88, advanced: 114, elite: 141 }),
  ...bracket('barbell-bent-over-row-overhand', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 84, intermediate: 108, advanced: 136, elite: 166 }),
  ...bracket('barbell-bent-over-row-overhand', 'female', 0, 55, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 72 }),
  ...bracket('barbell-bent-over-row-overhand', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 46, advanced: 64, elite: 83 }),

  // barbell-box-squats
  ...bracket('barbell-box-squats', 'male', 0, 70, 'one_rm_kg', { beginner: 49, novice: 70, intermediate: 95, advanced: 125, elite: 157 }),
  ...bracket('barbell-box-squats', 'male', 70, 90, 'one_rm_kg', { beginner: 76, novice: 101, intermediate: 131, advanced: 165, elite: 201 }),
  ...bracket('barbell-box-squats', 'male', 90, 999, 'one_rm_kg', { beginner: 100, novice: 129, intermediate: 163, advanced: 200, elite: 240 }),
  ...bracket('barbell-box-squats', 'female', 0, 55, 'one_rm_kg', { beginner: 28, novice: 43, intermediate: 61, advanced: 83, elite: 107 }),
  ...bracket('barbell-box-squats', 'female', 55, 999, 'one_rm_kg', { beginner: 41, novice: 59, intermediate: 80, advanced: 105, elite: 131 }),

  // barbell-clean-and-jerk
  ...bracket('barbell-clean-and-jerk', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 49, intermediate: 69, advanced: 94, elite: 121 }),
  ...bracket('barbell-clean-and-jerk', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 67, intermediate: 91, advanced: 118, elite: 148 }),
  ...bracket('barbell-clean-and-jerk', 'male', 90, 999, 'one_rm_kg', { beginner: 61, novice: 83, intermediate: 109, advanced: 139, elite: 172 }),
  ...bracket('barbell-clean-and-jerk', 'female', 0, 55, 'one_rm_kg', { beginner: 25, novice: 35, intermediate: 49, advanced: 65, elite: 82 }),
  ...bracket('barbell-clean-and-jerk', 'female', 55, 999, 'one_rm_kg', { beginner: 30, novice: 42, intermediate: 57, advanced: 74, elite: 92 }),

  // barbell-clean-and-press
  ...bracket('barbell-clean-and-press', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 38, intermediate: 56, advanced: 77, elite: 101 }),
  ...bracket('barbell-clean-and-press', 'male', 70, 90, 'one_rm_kg', { beginner: 36, novice: 52, intermediate: 73, advanced: 97, elite: 124 }),
  ...bracket('barbell-clean-and-press', 'male', 90, 999, 'one_rm_kg', { beginner: 46, novice: 65, intermediate: 88, advanced: 114, elite: 143 }),
  ...bracket('barbell-clean-and-press', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 22, intermediate: 34, advanced: 50, elite: 68 }),
  ...bracket('barbell-clean-and-press', 'female', 55, 999, 'one_rm_kg', { beginner: 16, novice: 27, intermediate: 41, advanced: 58, elite: 77 }),

  // barbell-close-grip-bench-press
  ...bracket('barbell-close-grip-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 35, novice: 49, intermediate: 66, advanced: 86, elite: 107 }),
  ...bracket('barbell-close-grip-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 55, novice: 72, intermediate: 93, advanced: 116, elite: 140 }),
  ...bracket('barbell-close-grip-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 73, novice: 93, intermediate: 116, advanced: 142, elite: 169 }),
  ...bracket('barbell-close-grip-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 16, novice: 26, intermediate: 39, advanced: 55, elite: 72 }),
  ...bracket('barbell-close-grip-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 37, intermediate: 52, advanced: 70, elite: 90 }),

  // barbell-curl
  ...bracket('barbell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 15, novice: 24, intermediate: 36, advanced: 50, elite: 66 }),
  ...bracket('barbell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 33, intermediate: 46, advanced: 63, elite: 80 }),
  ...bracket('barbell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 40, intermediate: 55, advanced: 73, elite: 92 }),
  ...bracket('barbell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 20, advanced: 31, elite: 43 }),
  ...bracket('barbell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 26, advanced: 37, elite: 51 }),

  // barbell-deadlift
  ...bracket('barbell-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 61, novice: 86, intermediate: 117, advanced: 153, elite: 191 }),
  ...bracket('barbell-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 89, novice: 119, intermediate: 155, advanced: 196, elite: 239 }),
  ...bracket('barbell-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 114, novice: 148, intermediate: 188, advanced: 232, elite: 279 }),
  ...bracket('barbell-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 34, novice: 52, intermediate: 76, advanced: 105, elite: 136 }),
  ...bracket('barbell-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 46, novice: 68, intermediate: 95, advanced: 126, elite: 160 }),

  // barbell-drag-curl
  ...bracket('barbell-drag-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 15, novice: 24, intermediate: 36, advanced: 50, elite: 66 }),
  ...bracket('barbell-drag-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 33, intermediate: 46, advanced: 63, elite: 80 }),
  ...bracket('barbell-drag-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 40, intermediate: 55, advanced: 73, elite: 92 }),
  ...bracket('barbell-drag-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 20, advanced: 31, elite: 43 }),
  ...bracket('barbell-drag-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 26, advanced: 37, elite: 51 }),

  // barbell-floor-press
  ...bracket('barbell-floor-press', 'male', 0, 70, 'one_rm_kg', { beginner: 42, novice: 59, intermediate: 79, advanced: 102, elite: 128 }),
  ...bracket('barbell-floor-press', 'male', 70, 90, 'one_rm_kg', { beginner: 60, novice: 80, intermediate: 104, advanced: 130, elite: 158 }),
  ...bracket('barbell-floor-press', 'male', 90, 999, 'one_rm_kg', { beginner: 77, novice: 99, intermediate: 125, advanced: 155, elite: 185 }),
  ...bracket('barbell-floor-press', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 62, elite: 84 }),
  ...bracket('barbell-floor-press', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 38, intermediate: 56, advanced: 77, elite: 100 }),

  // barbell-front-rack-step-up-knee-drive
  ...bracket('barbell-front-rack-step-up-knee-drive', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('barbell-front-rack-step-up-knee-drive', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 55, elite: 74 }),
  ...bracket('barbell-front-rack-step-up-knee-drive', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 45, advanced: 64, elite: 85 }),
  ...bracket('barbell-front-rack-step-up-knee-drive', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 36 }),
  ...bracket('barbell-front-rack-step-up-knee-drive', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 31, elite: 42 }),

  // barbell-glute-bridge
  ...bracket('barbell-glute-bridge', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 50, intermediate: 94, advanced: 151, elite: 218 }),
  ...bracket('barbell-glute-bridge', 'male', 70, 90, 'one_rm_kg', { beginner: 42, novice: 81, intermediate: 135, advanced: 202, elite: 279 }),
  ...bracket('barbell-glute-bridge', 'male', 90, 999, 'one_rm_kg', { beginner: 64, novice: 110, intermediate: 172, advanced: 247, elite: 331 }),
  ...bracket('barbell-glute-bridge', 'female', 0, 55, 'one_rm_kg', { beginner: 21, novice: 46, intermediate: 83, advanced: 131, elite: 186 }),
  ...bracket('barbell-glute-bridge', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 57, intermediate: 97, advanced: 148, elite: 207 }),

  // barbell-hack-squat
  ...bracket('barbell-hack-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 34, novice: 60, intermediate: 94, advanced: 136, elite: 184 }),
  ...bracket('barbell-hack-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 87, intermediate: 128, advanced: 177, elite: 230 }),
  ...bracket('barbell-hack-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 76, novice: 113, intermediate: 158, advanced: 212, elite: 270 }),
  ...bracket('barbell-hack-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 34, intermediate: 57, advanced: 85, elite: 119 }),
  ...bracket('barbell-hack-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 44, intermediate: 69, advanced: 101, elite: 137 }),

  // barbell-high-incline-bench-press
  ...bracket('barbell-high-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 45, intermediate: 62, advanced: 82, elite: 103 }),
  ...bracket('barbell-high-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 50, novice: 66, intermediate: 87, advanced: 109, elite: 134 }),
  ...bracket('barbell-high-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 66, novice: 86, intermediate: 108, advanced: 134, elite: 160 }),
  ...bracket('barbell-high-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 49, elite: 67 }),
  ...bracket('barbell-high-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 29, intermediate: 45, advanced: 63, elite: 84 }),

  // barbell-hip-thrust
  ...bracket('barbell-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 63, intermediate: 107, advanced: 163, elite: 227 }),
  ...bracket('barbell-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 149, advanced: 213, elite: 285 }),
  ...bracket('barbell-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 80, novice: 126, intermediate: 186, advanced: 257, elite: 335 }),
  ...bracket('barbell-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 30, novice: 56, intermediate: 92, advanced: 137, elite: 187 }),
  ...bracket('barbell-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 39, novice: 69, intermediate: 108, advanced: 155, elite: 209 }),

  // barbell-incline-bench-press
  ...bracket('barbell-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 45, intermediate: 62, advanced: 82, elite: 103 }),
  ...bracket('barbell-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 50, novice: 66, intermediate: 87, advanced: 109, elite: 134 }),
  ...bracket('barbell-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 66, novice: 86, intermediate: 108, advanced: 134, elite: 160 }),
  ...bracket('barbell-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 49, elite: 67 }),
  ...bracket('barbell-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 29, intermediate: 45, advanced: 63, elite: 84 }),

  // barbell-landmine-row
  ...bracket('barbell-landmine-row', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 46, intermediate: 65, advanced: 87, elite: 111 }),
  ...bracket('barbell-landmine-row', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 66, intermediate: 88, advanced: 114, elite: 141 }),
  ...bracket('barbell-landmine-row', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 84, intermediate: 108, advanced: 136, elite: 166 }),
  ...bracket('barbell-landmine-row', 'female', 0, 55, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 72 }),
  ...bracket('barbell-landmine-row', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 46, advanced: 64, elite: 83 }),

  // barbell-lunge
  ...bracket('barbell-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 20, novice: 37, intermediate: 61, advanced: 89, elite: 122 }),
  ...bracket('barbell-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 34, novice: 55, intermediate: 82, advanced: 116, elite: 153 }),
  ...bracket('barbell-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 47, novice: 71, intermediate: 102, advanced: 138, elite: 179 }),
  ...bracket('barbell-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 64, elite: 86 }),
  ...bracket('barbell-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 36, intermediate: 53, advanced: 74, elite: 98 }),

  // barbell-muscle-snatch
  ...bracket('barbell-muscle-snatch', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 34, intermediate: 48, advanced: 65, elite: 83 }),
  ...bracket('barbell-muscle-snatch', 'male', 70, 90, 'one_rm_kg', { beginner: 33, novice: 47, intermediate: 63, advanced: 82, elite: 102 }),
  ...bracket('barbell-muscle-snatch', 'male', 90, 999, 'one_rm_kg', { beginner: 43, novice: 57, intermediate: 76, advanced: 96, elite: 118 }),
  ...bracket('barbell-muscle-snatch', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 26, intermediate: 34, advanced: 44, elite: 54 }),
  ...bracket('barbell-muscle-snatch', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 29, intermediate: 38, advanced: 48, elite: 59 }),

  // barbell-overhead-press
  ...bracket('barbell-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 32, intermediate: 45, advanced: 62, elite: 79 }),
  ...bracket('barbell-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 33, novice: 46, intermediate: 62, advanced: 81, elite: 101 }),
  ...bracket('barbell-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 44, novice: 59, intermediate: 77, advanced: 98, elite: 120 }),
  ...bracket('barbell-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 27, advanced: 38, elite: 51 }),
  ...bracket('barbell-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 15, novice: 23, intermediate: 34, advanced: 47, elite: 62 }),

  // barbell-power-snatch
  ...bracket('barbell-power-snatch', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 37, intermediate: 55, advanced: 78, elite: 102 }),
  ...bracket('barbell-power-snatch', 'male', 70, 90, 'one_rm_kg', { beginner: 34, novice: 50, intermediate: 71, advanced: 95, elite: 123 }),
  ...bracket('barbell-power-snatch', 'male', 90, 999, 'one_rm_kg', { beginner: 43, novice: 62, intermediate: 85, advanced: 111, elite: 140 }),
  ...bracket('barbell-power-snatch', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 28, intermediate: 40, advanced: 53, elite: 67 }),
  ...bracket('barbell-power-snatch', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 31, intermediate: 43, advanced: 56, elite: 71 }),

  // barbell-pullover
  ...bracket('barbell-pullover', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 35, advanced: 57, elite: 81 }),
  ...bracket('barbell-pullover', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 48, advanced: 72, elite: 100 }),
  ...bracket('barbell-pullover', 'male', 90, 999, 'one_rm_kg', { beginner: 22, novice: 38, intermediate: 59, advanced: 86, elite: 116 }),
  ...bracket('barbell-pullover', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 20, advanced: 33, elite: 47 }),
  ...bracket('barbell-pullover', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 25, advanced: 39, elite: 54 }),

  // barbell-rack-pull
  ...bracket('barbell-rack-pull', 'male', 0, 70, 'one_rm_kg', { beginner: 69, novice: 102, intermediate: 143, advanced: 191, elite: 243 }),
  ...bracket('barbell-rack-pull', 'male', 70, 90, 'one_rm_kg', { beginner: 99, novice: 138, intermediate: 185, advanced: 239, elite: 297 }),
  ...bracket('barbell-rack-pull', 'male', 90, 999, 'one_rm_kg', { beginner: 126, novice: 169, intermediate: 221, advanced: 280, elite: 342 }),
  ...bracket('barbell-rack-pull', 'female', 0, 55, 'one_rm_kg', { beginner: 45, novice: 68, intermediate: 97, advanced: 132, elite: 170 }),
  ...bracket('barbell-rack-pull', 'female', 55, 999, 'one_rm_kg', { beginner: 59, novice: 85, intermediate: 118, advanced: 156, elite: 197 }),

  // barbell-rear-delt-row
  ...bracket('barbell-rear-delt-row', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('barbell-rear-delt-row', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('barbell-rear-delt-row', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('barbell-rear-delt-row', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('barbell-rear-delt-row', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // barbell-reverse-lunge
  ...bracket('barbell-reverse-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 27, novice: 46, intermediate: 71, advanced: 101, elite: 135 }),
  ...bracket('barbell-reverse-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 46, novice: 69, intermediate: 99, advanced: 134, elite: 173 }),
  ...bracket('barbell-reverse-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 64, novice: 91, intermediate: 125, advanced: 164, elite: 206 }),
  ...bracket('barbell-reverse-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 48, advanced: 67, elite: 88 }),
  ...bracket('barbell-reverse-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 26, novice: 40, intermediate: 58, advanced: 78, elite: 101 }),

  // barbell-romanian-deadlift
  ...bracket('barbell-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 43, novice: 65, intermediate: 93, advanced: 127, elite: 163 }),
  ...bracket('barbell-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 65, novice: 92, intermediate: 125, advanced: 163, elite: 203 }),
  ...bracket('barbell-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 85, novice: 115, intermediate: 152, advanced: 194, elite: 238 }),
  ...bracket('barbell-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 27, novice: 42, intermediate: 61, advanced: 84, elite: 109 }),
  ...bracket('barbell-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 34, novice: 51, intermediate: 71, advanced: 96, elite: 122 }),

  // barbell-shrug
  ...bracket('barbell-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 30, novice: 55, intermediate: 89, advanced: 130, elite: 178 }),
  ...bracket('barbell-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 53, novice: 85, intermediate: 126, advanced: 175, elite: 230 }),
  ...bracket('barbell-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 76, novice: 113, intermediate: 159, advanced: 214, elite: 274 }),
  ...bracket('barbell-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 28, intermediate: 51, advanced: 82, elite: 119 }),
  ...bracket('barbell-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 42, intermediate: 71, advanced: 106, elite: 147 }),

  // barbell-skullcrusher
  ...bracket('barbell-skullcrusher', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 20, intermediate: 31, advanced: 45, elite: 60 }),
  ...bracket('barbell-skullcrusher', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('barbell-skullcrusher', 'male', 90, 999, 'one_rm_kg', { beginner: 27, novice: 39, intermediate: 54, advanced: 71, elite: 90 }),
  ...bracket('barbell-skullcrusher', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 27, elite: 37 }),
  ...bracket('barbell-skullcrusher', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 43 }),

  // barbell-snatch
  ...bracket('barbell-snatch', 'male', 0, 70, 'one_rm_kg', { beginner: 25, novice: 39, intermediate: 57, advanced: 79, elite: 102 }),
  ...bracket('barbell-snatch', 'male', 70, 90, 'one_rm_kg', { beginner: 37, novice: 53, intermediate: 74, advanced: 98, elite: 124 }),
  ...bracket('barbell-snatch', 'male', 90, 999, 'one_rm_kg', { beginner: 47, novice: 66, intermediate: 89, advanced: 115, elite: 143 }),
  ...bracket('barbell-snatch', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 27, intermediate: 38, advanced: 51, elite: 65 }),
  ...bracket('barbell-snatch', 'female', 55, 999, 'one_rm_kg', { beginner: 23, novice: 33, intermediate: 45, advanced: 59, elite: 74 }),

  // barbell-spinal-jefferson-curl
  ...bracket('barbell-spinal-jefferson-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('barbell-spinal-jefferson-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('barbell-spinal-jefferson-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('barbell-spinal-jefferson-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('barbell-spinal-jefferson-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // barbell-split-squat
  ...bracket('barbell-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 18, novice: 37, intermediate: 64, advanced: 100, elite: 140 }),
  ...bracket('barbell-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 32, novice: 56, intermediate: 89, advanced: 130, elite: 176 }),
  ...bracket('barbell-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 45, novice: 74, intermediate: 112, advanced: 157, elite: 207 }),
  ...bracket('barbell-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 25, intermediate: 43, advanced: 65, elite: 91 }),
  ...bracket('barbell-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 32, intermediate: 51, advanced: 76, elite: 104 }),

  // barbell-step-up-knee-drive
  ...bracket('barbell-step-up-knee-drive', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('barbell-step-up-knee-drive', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 55, elite: 74 }),
  ...bracket('barbell-step-up-knee-drive', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 45, advanced: 64, elite: 85 }),
  ...bracket('barbell-step-up-knee-drive', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 36 }),
  ...bracket('barbell-step-up-knee-drive', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 31, elite: 42 }),

  // barbell-stiff-leg-deadlifts
  ...bracket('barbell-stiff-leg-deadlifts', 'male', 0, 70, 'one_rm_kg', { beginner: 45, novice: 68, intermediate: 99, advanced: 135, elite: 175 }),
  ...bracket('barbell-stiff-leg-deadlifts', 'male', 70, 90, 'one_rm_kg', { beginner: 66, novice: 94, intermediate: 130, advanced: 170, elite: 215 }),
  ...bracket('barbell-stiff-leg-deadlifts', 'male', 90, 999, 'one_rm_kg', { beginner: 85, novice: 117, intermediate: 156, advanced: 201, elite: 248 }),
  ...bracket('barbell-stiff-leg-deadlifts', 'female', 0, 55, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 59, advanced: 84, elite: 111 }),
  ...bracket('barbell-stiff-leg-deadlifts', 'female', 55, 999, 'one_rm_kg', { beginner: 33, novice: 51, intermediate: 74, advanced: 100, elite: 130 }),

  // barbell-thruster
  ...bracket('barbell-thruster', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 37, intermediate: 56, advanced: 80, elite: 105 }),
  ...bracket('barbell-thruster', 'male', 70, 90, 'one_rm_kg', { beginner: 33, novice: 50, intermediate: 72, advanced: 98, elite: 127 }),
  ...bracket('barbell-thruster', 'male', 90, 999, 'one_rm_kg', { beginner: 43, novice: 62, intermediate: 86, advanced: 114, elite: 145 }),
  ...bracket('barbell-thruster', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 40, advanced: 54, elite: 70 }),
  ...bracket('barbell-thruster', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 33, intermediate: 46, advanced: 61, elite: 78 }),

  // barbell-upright-row
  ...bracket('barbell-upright-row', 'male', 0, 70, 'one_rm_kg', { beginner: 15, novice: 27, intermediate: 45, advanced: 66, elite: 91 }),
  ...bracket('barbell-upright-row', 'male', 70, 90, 'one_rm_kg', { beginner: 23, novice: 39, intermediate: 59, advanced: 84, elite: 111 }),
  ...bracket('barbell-upright-row', 'male', 90, 999, 'one_rm_kg', { beginner: 31, novice: 49, intermediate: 71, advanced: 98, elite: 128 }),
  ...bracket('barbell-upright-row', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 26, advanced: 38, elite: 52 }),
  ...bracket('barbell-upright-row', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),

  // barbell-walking-lunge
  ...bracket('barbell-walking-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 20, novice: 37, intermediate: 61, advanced: 89, elite: 122 }),
  ...bracket('barbell-walking-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 34, novice: 55, intermediate: 82, advanced: 116, elite: 153 }),
  ...bracket('barbell-walking-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 47, novice: 71, intermediate: 102, advanced: 138, elite: 179 }),
  ...bracket('barbell-walking-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 64, elite: 86 }),
  ...bracket('barbell-walking-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 22, novice: 36, intermediate: 53, advanced: 74, elite: 98 }),

  // barbell-wrist-curl
  ...bracket('barbell-wrist-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 14, intermediate: 33, advanced: 60, elite: 93 }),
  ...bracket('barbell-wrist-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 21, intermediate: 44, advanced: 74, elite: 110 }),
  ...bracket('barbell-wrist-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 28, intermediate: 53, advanced: 86, elite: 125 }),
  ...bracket('barbell-wrist-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 0, novice: 6, intermediate: 18, advanced: 36, elite: 60 }),
  ...bracket('barbell-wrist-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 11, intermediate: 26, advanced: 48, elite: 75 }),

  // bayesian-curl
  ...bracket('bayesian-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 25, intermediate: 41, advanced: 61, elite: 83 }),
  ...bracket('bayesian-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 33, intermediate: 51, advanced: 73, elite: 98 }),
  ...bracket('bayesian-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 41, intermediate: 60, advanced: 84, elite: 110 }),
  ...bracket('bayesian-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 22, advanced: 34, elite: 48 }),
  ...bracket('bayesian-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 27, advanced: 40, elite: 55 }),

  // behind-the-neck-press
  ...bracket('behind-the-neck-press', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 42, advanced: 59, elite: 78 }),
  ...bracket('behind-the-neck-press', 'male', 70, 90, 'one_rm_kg', { beginner: 29, novice: 43, intermediate: 60, advanced: 80, elite: 102 }),
  ...bracket('behind-the-neck-press', 'male', 90, 999, 'one_rm_kg', { beginner: 41, novice: 57, intermediate: 77, advanced: 99, elite: 123 }),
  ...bracket('behind-the-neck-press', 'female', 0, 55, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 27, advanced: 38, elite: 51 }),
  ...bracket('behind-the-neck-press', 'female', 55, 999, 'one_rm_kg', { beginner: 16, novice: 25, intermediate: 37, advanced: 50, elite: 65 }),

  // belt-squat
  ...bracket('belt-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 47, novice: 86, intermediate: 139, advanced: 204, elite: 279 }),
  ...bracket('belt-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 75, novice: 123, intermediate: 185, advanced: 260, elite: 343 }),
  ...bracket('belt-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 102, novice: 157, intermediate: 226, advanced: 308, elite: 398 }),
  ...bracket('belt-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 27, novice: 56, intermediate: 96, advanced: 147, elite: 207 }),
  ...bracket('belt-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 41, novice: 74, intermediate: 120, advanced: 176, elite: 240 }),

  // bench-dips
  ...bracket('bench-dips', 'male', 0, 70, 'reps', { beginner: 0, novice: 12, intermediate: 31, advanced: 55, elite: 80 }),
  ...bracket('bench-dips', 'male', 70, 90, 'reps', { beginner: 1, novice: 14, intermediate: 31, advanced: 51, elite: 72 }),
  ...bracket('bench-dips', 'male', 90, 999, 'reps', { beginner: 3, novice: 14, intermediate: 29, advanced: 46, elite: 65 }),
  ...bracket('bench-dips', 'female', 0, 55, 'reps', { beginner: 0, novice: 9, intermediate: 21, advanced: 35, elite: 50 }),
  ...bracket('bench-dips', 'female', 55, 999, 'reps', { beginner: 0, novice: 9, intermediate: 18, advanced: 30, elite: 42 }),

  // bench-press
  ...bracket('bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 42, novice: 59, intermediate: 79, advanced: 102, elite: 128 }),
  ...bracket('bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 60, novice: 80, intermediate: 104, advanced: 130, elite: 158 }),
  ...bracket('bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 77, novice: 99, intermediate: 125, advanced: 155, elite: 185 }),
  ...bracket('bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 62, elite: 84 }),
  ...bracket('bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 38, intermediate: 56, advanced: 77, elite: 100 }),

  // bent-knee-soleus-raise
  ...bracket('bent-knee-soleus-raise', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('bent-knee-soleus-raise', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bent-knee-soleus-raise', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('bent-knee-soleus-raise', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bent-knee-soleus-raise', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // bicycle-crunches
  ...bracket('bicycle-crunches', 'male', 0, 70, 'reps', { beginner: 0, novice: 19, intermediate: 48, advanced: 84, elite: 124 }),
  ...bracket('bicycle-crunches', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 36, advanced: 65, elite: 96 }),
  ...bracket('bicycle-crunches', 'male', 90, 999, 'reps', { beginner: 0, novice: 9, intermediate: 28, advanced: 52, elite: 78 }),
  ...bracket('bicycle-crunches', 'female', 0, 55, 'reps', { beginner: 0, novice: 18, intermediate: 45, advanced: 78, elite: 115 }),
  ...bracket('bicycle-crunches', 'female', 55, 999, 'reps', { beginner: 0, novice: 11, intermediate: 32, advanced: 57, elite: 85 }),

  // bird-dog
  ...bracket('bird-dog', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('bird-dog', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bird-dog', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('bird-dog', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bird-dog', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // bodyweight-alternating-lateral-lunge
  ...bracket('bodyweight-alternating-lateral-lunge', 'male', 0, 70, 'reps', { beginner: 3, novice: 12, intermediate: 28, advanced: 48, elite: 72 }),
  ...bracket('bodyweight-alternating-lateral-lunge', 'male', 70, 90, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-alternating-lateral-lunge', 'male', 90, 999, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),
  ...bracket('bodyweight-alternating-lateral-lunge', 'female', 0, 55, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-alternating-lateral-lunge', 'female', 55, 999, 'reps', { beginner: 1, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),

  // bodyweight-alternating-reverse-lunges
  ...bracket('bodyweight-alternating-reverse-lunges', 'male', 0, 70, 'reps', { beginner: 3, novice: 12, intermediate: 28, advanced: 48, elite: 72 }),
  ...bracket('bodyweight-alternating-reverse-lunges', 'male', 70, 90, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-alternating-reverse-lunges', 'male', 90, 999, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),
  ...bracket('bodyweight-alternating-reverse-lunges', 'female', 0, 55, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-alternating-reverse-lunges', 'female', 55, 999, 'reps', { beginner: 1, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),

  // bodyweight-box-squat
  ...bracket('bodyweight-box-squat', 'male', 0, 70, 'reps', { beginner: 3, novice: 27, intermediate: 60, advanced: 103, elite: 151 }),
  ...bracket('bodyweight-box-squat', 'male', 70, 90, 'reps', { beginner: 3, novice: 23, intermediate: 53, advanced: 86, elite: 125 }),
  ...bracket('bodyweight-box-squat', 'male', 90, 999, 'reps', { beginner: 2, novice: 20, intermediate: 45, advanced: 74, elite: 106 }),
  ...bracket('bodyweight-box-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 13, intermediate: 44, advanced: 79, elite: 120 }),
  ...bracket('bodyweight-box-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 13, intermediate: 37, advanced: 66, elite: 97 }),

  // bodyweight-deadlift
  ...bracket('bodyweight-deadlift', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('bodyweight-deadlift', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-deadlift', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('bodyweight-deadlift', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-deadlift', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // bodyweight-deficit-reverse-lunge
  ...bracket('bodyweight-deficit-reverse-lunge', 'male', 0, 70, 'reps', { beginner: 3, novice: 12, intermediate: 28, advanced: 48, elite: 72 }),
  ...bracket('bodyweight-deficit-reverse-lunge', 'male', 70, 90, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-deficit-reverse-lunge', 'male', 90, 999, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),
  ...bracket('bodyweight-deficit-reverse-lunge', 'female', 0, 55, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-deficit-reverse-lunge', 'female', 55, 999, 'reps', { beginner: 1, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),

  // bodyweight-donkey-calf-raise
  ...bracket('bodyweight-donkey-calf-raise', 'male', 0, 70, 'reps', { beginner: 7, novice: 32, intermediate: 68, advanced: 111, elite: 159 }),
  ...bracket('bodyweight-donkey-calf-raise', 'male', 70, 90, 'reps', { beginner: 6, novice: 27, intermediate: 56, advanced: 91, elite: 130 }),
  ...bracket('bodyweight-donkey-calf-raise', 'male', 90, 999, 'reps', { beginner: 5, novice: 23, intermediate: 48, advanced: 77, elite: 110 }),
  ...bracket('bodyweight-donkey-calf-raise', 'female', 0, 55, 'reps', { beginner: 0, novice: 18, intermediate: 47, advanced: 84, elite: 126 }),
  ...bracket('bodyweight-donkey-calf-raise', 'female', 55, 999, 'reps', { beginner: 0, novice: 17, intermediate: 41, advanced: 71, elite: 104 }),

  // bodyweight-elevated-push-up
  ...bracket('bodyweight-elevated-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 31, advanced: 56, elite: 83 }),
  ...bracket('bodyweight-elevated-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 52, elite: 76 }),
  ...bracket('bodyweight-elevated-push-up', 'male', 90, 999, 'reps', { beginner: 2, novice: 14, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('bodyweight-elevated-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 16, advanced: 32, elite: 49 }),
  ...bracket('bodyweight-elevated-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 31, elite: 45 }),

  // bodyweight-hip-abduction
  ...bracket('bodyweight-hip-abduction', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('bodyweight-hip-abduction', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-hip-abduction', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('bodyweight-hip-abduction', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-hip-abduction', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // bodyweight-knee-push-ups
  ...bracket('bodyweight-knee-push-ups', 'male', 0, 70, 'reps', { beginner: 6, novice: 30, intermediate: 66, advanced: 107, elite: 152 }),
  ...bracket('bodyweight-knee-push-ups', 'male', 70, 90, 'reps', { beginner: 10, novice: 32, intermediate: 61, advanced: 96, elite: 134 }),
  ...bracket('bodyweight-knee-push-ups', 'male', 90, 999, 'reps', { beginner: 10, novice: 30, intermediate: 56, advanced: 86, elite: 118 }),
  ...bracket('bodyweight-knee-push-ups', 'female', 0, 55, 'reps', { beginner: 0, novice: 11, intermediate: 30, advanced: 54, elite: 82 }),
  ...bracket('bodyweight-knee-push-ups', 'female', 55, 999, 'reps', { beginner: 0, novice: 11, intermediate: 27, advanced: 48, elite: 69 }),

  // bodyweight-reverse-lunge
  ...bracket('bodyweight-reverse-lunge', 'male', 0, 70, 'reps', { beginner: 3, novice: 12, intermediate: 28, advanced: 48, elite: 72 }),
  ...bracket('bodyweight-reverse-lunge', 'male', 70, 90, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-reverse-lunge', 'male', 90, 999, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),
  ...bracket('bodyweight-reverse-lunge', 'female', 0, 55, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('bodyweight-reverse-lunge', 'female', 55, 999, 'reps', { beginner: 1, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),

  // bodyweight-russian-twist
  ...bracket('bodyweight-russian-twist', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('bodyweight-russian-twist', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-russian-twist', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('bodyweight-russian-twist', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-russian-twist', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // bodyweight-spinal-jefferson-curl
  ...bracket('bodyweight-spinal-jefferson-curl', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('bodyweight-spinal-jefferson-curl', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-spinal-jefferson-curl', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('bodyweight-spinal-jefferson-curl', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('bodyweight-spinal-jefferson-curl', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // bodyweight-squat
  ...bracket('bodyweight-squat', 'male', 0, 70, 'reps', { beginner: 3, novice: 27, intermediate: 62, advanced: 106, elite: 156 }),
  ...bracket('bodyweight-squat', 'male', 70, 90, 'reps', { beginner: 3, novice: 23, intermediate: 53, advanced: 88, elite: 128 }),
  ...bracket('bodyweight-squat', 'male', 90, 999, 'reps', { beginner: 2, novice: 20, intermediate: 45, advanced: 75, elite: 108 }),
  ...bracket('bodyweight-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 13, intermediate: 45, advanced: 84, elite: 130 }),
  ...bracket('bodyweight-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 12, intermediate: 37, advanced: 68, elite: 104 }),

  // bodyweight-squat-to-stand
  ...bracket('bodyweight-squat-to-stand', 'male', 0, 70, 'reps', { beginner: 3, novice: 27, intermediate: 62, advanced: 106, elite: 156 }),
  ...bracket('bodyweight-squat-to-stand', 'male', 70, 90, 'reps', { beginner: 3, novice: 23, intermediate: 53, advanced: 88, elite: 128 }),
  ...bracket('bodyweight-squat-to-stand', 'male', 90, 999, 'reps', { beginner: 2, novice: 20, intermediate: 45, advanced: 75, elite: 108 }),
  ...bracket('bodyweight-squat-to-stand', 'female', 0, 55, 'reps', { beginner: 0, novice: 13, intermediate: 45, advanced: 84, elite: 130 }),
  ...bracket('bodyweight-squat-to-stand', 'female', 55, 999, 'reps', { beginner: 0, novice: 12, intermediate: 37, advanced: 68, elite: 104 }),

  // bounds
  ...bracket('bounds', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('bounds', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('bounds', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('bounds', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('bounds', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // box-jump
  ...bracket('box-jump', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('box-jump', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('box-jump', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('box-jump', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('box-jump', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // bradford-press
  ...bracket('bradford-press', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 32, intermediate: 45, advanced: 62, elite: 79 }),
  ...bracket('bradford-press', 'male', 70, 90, 'one_rm_kg', { beginner: 33, novice: 46, intermediate: 62, advanced: 81, elite: 101 }),
  ...bracket('bradford-press', 'male', 90, 999, 'one_rm_kg', { beginner: 44, novice: 59, intermediate: 77, advanced: 98, elite: 120 }),
  ...bracket('bradford-press', 'female', 0, 55, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 27, advanced: 38, elite: 51 }),
  ...bracket('bradford-press', 'female', 55, 999, 'one_rm_kg', { beginner: 15, novice: 23, intermediate: 34, advanced: 47, elite: 62 }),

  // broad-jump
  ...bracket('broad-jump', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('broad-jump', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('broad-jump', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('broad-jump', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('broad-jump', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // bulgarian-split-squat
  ...bracket('bulgarian-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 25, intermediate: 47, advanced: 77, elite: 112 }),
  ...bracket('bulgarian-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 21, novice: 41, intermediate: 68, advanced: 103, elite: 143 }),
  ...bracket('bulgarian-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 32, novice: 55, intermediate: 87, advanced: 126, elite: 170 }),
  ...bracket('bulgarian-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 18, intermediate: 32, advanced: 50, elite: 72 }),
  ...bracket('bulgarian-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 39, advanced: 59, elite: 82 }),

  // burpee
  ...bracket('burpee', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('burpee', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('burpee', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('burpee', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('burpee', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // cable-30-degree-shrug
  ...bracket('cable-30-degree-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 55, intermediate: 88, advanced: 129, elite: 176 }),
  ...bracket('cable-30-degree-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 40, novice: 67, intermediate: 103, advanced: 147, elite: 196 }),
  ...bracket('cable-30-degree-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 47, novice: 77, intermediate: 115, advanced: 161, elite: 213 }),
  ...bracket('cable-30-degree-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 26, intermediate: 48, advanced: 77, elite: 110 }),
  ...bracket('cable-30-degree-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 16, novice: 32, intermediate: 56, advanced: 87, elite: 122 }),

  // cable-bar-curl
  ...bracket('cable-bar-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 25, intermediate: 41, advanced: 61, elite: 83 }),
  ...bracket('cable-bar-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 33, intermediate: 51, advanced: 73, elite: 98 }),
  ...bracket('cable-bar-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 41, intermediate: 60, advanced: 84, elite: 110 }),
  ...bracket('cable-bar-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 22, advanced: 34, elite: 48 }),
  ...bracket('cable-bar-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 27, advanced: 40, elite: 55 }),

  // cable-bar-face-pull
  ...bracket('cable-bar-face-pull', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 21, intermediate: 37, advanced: 57, elite: 80 }),
  ...bracket('cable-bar-face-pull', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 47, advanced: 69, elite: 95 }),
  ...bracket('cable-bar-face-pull', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 55, advanced: 80, elite: 107 }),
  ...bracket('cable-bar-face-pull', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 28, advanced: 43, elite: 60 }),
  ...bracket('cable-bar-face-pull', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 22, intermediate: 35, advanced: 51, elite: 69 }),

  // cable-bar-pushdown
  ...bracket('cable-bar-pushdown', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 89 }),
  ...bracket('cable-bar-pushdown', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 36, intermediate: 56, advanced: 80, elite: 107 }),
  ...bracket('cable-bar-pushdown', 'male', 90, 999, 'one_rm_kg', { beginner: 29, novice: 46, intermediate: 67, advanced: 93, elite: 122 }),
  ...bracket('cable-bar-pushdown', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 24, advanced: 38, elite: 53 }),
  ...bracket('cable-bar-pushdown', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 31, advanced: 46, elite: 63 }),

  // cable-bench-chest-fly
  ...bracket('cable-bench-chest-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 26, advanced: 46, elite: 69 }),
  ...bracket('cable-bench-chest-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 36, advanced: 58, elite: 84 }),
  ...bracket('cable-bench-chest-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 26, intermediate: 45, advanced: 69, elite: 98 }),
  ...bracket('cable-bench-chest-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 15, advanced: 26, elite: 39 }),
  ...bracket('cable-bench-chest-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 19, advanced: 31, elite: 46 }),

  // cable-bench-press
  ...bracket('cable-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 20, intermediate: 30, advanced: 42, elite: 55 }),
  ...bracket('cable-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 28, intermediate: 40, advanced: 53, elite: 68 }),
  ...bracket('cable-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 36, intermediate: 48, advanced: 63, elite: 79 }),
  ...bracket('cable-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('cable-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 21, advanced: 30, elite: 41 }),

  // cable-bench-straight-leg-kickback
  ...bracket('cable-bench-straight-leg-kickback', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 15, intermediate: 39, advanced: 72, elite: 114 }),
  ...bracket('cable-bench-straight-leg-kickback', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 23, intermediate: 49, advanced: 86, elite: 131 }),
  ...bracket('cable-bench-straight-leg-kickback', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 29, intermediate: 59, advanced: 98, elite: 146 }),
  ...bracket('cable-bench-straight-leg-kickback', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 24, advanced: 40, elite: 60 }),
  ...bracket('cable-bench-straight-leg-kickback', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 16, intermediate: 30, advanced: 48, elite: 70 }),

  // cable-chest-press
  ...bracket('cable-chest-press', 'male', 0, 70, 'one_rm_kg', { beginner: 27, novice: 45, intermediate: 70, advanced: 100, elite: 134 }),
  ...bracket('cable-chest-press', 'male', 70, 90, 'one_rm_kg', { beginner: 39, novice: 61, intermediate: 89, advanced: 123, elite: 160 }),
  ...bracket('cable-chest-press', 'male', 90, 999, 'one_rm_kg', { beginner: 50, novice: 74, intermediate: 105, advanced: 142, elite: 181 }),
  ...bracket('cable-chest-press', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 33, advanced: 50, elite: 71 }),
  ...bracket('cable-chest-press', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 38, advanced: 57, elite: 79 }),

  // cable-chop
  ...bracket('cable-chop', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 15, intermediate: 30, advanced: 52, elite: 78 }),
  ...bracket('cable-chop', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 37, advanced: 60, elite: 88 }),
  ...bracket('cable-chop', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 23, intermediate: 42, advanced: 67, elite: 96 }),
  ...bracket('cable-chop', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('cable-chop', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 21, advanced: 33, elite: 46 }),

  // cable-decline-bench-press
  ...bracket('cable-decline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 29, advanced: 42, elite: 57 }),
  ...bracket('cable-decline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 25, intermediate: 38, advanced: 52, elite: 69 }),
  ...bracket('cable-decline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 32, intermediate: 45, advanced: 61, elite: 79 }),
  ...bracket('cable-decline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('cable-decline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 23, advanced: 34, elite: 46 }),

  // cable-external-rotation
  ...bracket('cable-external-rotation', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('cable-external-rotation', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('cable-external-rotation', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('cable-external-rotation', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('cable-external-rotation', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // cable-front-raise
  ...bracket('cable-front-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 22, elite: 32 }),
  ...bracket('cable-front-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('cable-front-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 31, elite: 44 }),
  ...bracket('cable-front-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 8, advanced: 13, elite: 18 }),
  ...bracket('cable-front-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),

  // cable-high-to-low-fly
  ...bracket('cable-high-to-low-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 26, advanced: 46, elite: 69 }),
  ...bracket('cable-high-to-low-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 36, advanced: 58, elite: 84 }),
  ...bracket('cable-high-to-low-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 26, intermediate: 45, advanced: 69, elite: 98 }),
  ...bracket('cable-high-to-low-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 15, advanced: 26, elite: 39 }),
  ...bracket('cable-high-to-low-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 19, advanced: 31, elite: 46 }),

  // cable-hip-abduction
  ...bracket('cable-hip-abduction', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('cable-hip-abduction', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('cable-hip-abduction', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('cable-hip-abduction', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('cable-hip-abduction', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // cable-incline-bench-press
  ...bracket('cable-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('cable-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 29, intermediate: 39, advanced: 50, elite: 62 }),
  ...bracket('cable-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 37, intermediate: 48, advanced: 60, elite: 73 }),
  ...bracket('cable-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 23, elite: 31 }),
  ...bracket('cable-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 21, advanced: 29, elite: 38 }),

  // cable-kickback
  ...bracket('cable-kickback', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 15, intermediate: 39, advanced: 72, elite: 114 }),
  ...bracket('cable-kickback', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 23, intermediate: 49, advanced: 86, elite: 131 }),
  ...bracket('cable-kickback', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 29, intermediate: 59, advanced: 98, elite: 146 }),
  ...bracket('cable-kickback', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 24, advanced: 40, elite: 60 }),
  ...bracket('cable-kickback', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 16, intermediate: 30, advanced: 48, elite: 70 }),

  // cable-low-single-arm-lateral-raise
  ...bracket('cable-low-single-arm-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 13, advanced: 20, elite: 29 }),
  ...bracket('cable-low-single-arm-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('cable-low-single-arm-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 39 }),
  ...bracket('cable-low-single-arm-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 12, elite: 16 }),
  ...bracket('cable-low-single-arm-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 18 }),

  // cable-low-to-high-fly
  ...bracket('cable-low-to-high-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 26, advanced: 46, elite: 69 }),
  ...bracket('cable-low-to-high-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 36, advanced: 58, elite: 84 }),
  ...bracket('cable-low-to-high-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 26, intermediate: 45, advanced: 69, elite: 98 }),
  ...bracket('cable-low-to-high-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 15, advanced: 26, elite: 39 }),
  ...bracket('cable-low-to-high-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 19, advanced: 31, elite: 46 }),

  // cable-overhead-press
  ...bracket('cable-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 17, intermediate: 25, advanced: 34, elite: 43 }),
  ...bracket('cable-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 18, novice: 25, intermediate: 34, advanced: 44, elite: 54 }),
  ...bracket('cable-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 24, novice: 32, intermediate: 41, advanced: 52, elite: 64 }),
  ...bracket('cable-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 14, advanced: 19, elite: 25 }),
  ...bracket('cable-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 13, intermediate: 18, advanced: 24, elite: 30 }),

  // cable-overhead-straight-bar-extensions
  ...bracket('cable-overhead-straight-bar-extensions', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 18, intermediate: 31, advanced: 49, elite: 70 }),
  ...bracket('cable-overhead-straight-bar-extensions', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 87 }),
  ...bracket('cable-overhead-straight-bar-extensions', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 53, advanced: 76, elite: 101 }),
  ...bracket('cable-overhead-straight-bar-extensions', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('cable-overhead-straight-bar-extensions', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 34, elite: 48 }),

  // cable-pallof-press
  ...bracket('cable-pallof-press', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('cable-pallof-press', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('cable-pallof-press', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('cable-pallof-press', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('cable-pallof-press', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // cable-pec-fly
  ...bracket('cable-pec-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 26, advanced: 46, elite: 69 }),
  ...bracket('cable-pec-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 36, advanced: 58, elite: 84 }),
  ...bracket('cable-pec-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 26, intermediate: 45, advanced: 69, elite: 98 }),
  ...bracket('cable-pec-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 15, advanced: 26, elite: 39 }),
  ...bracket('cable-pec-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 19, advanced: 31, elite: 46 }),

  // cable-pull-through
  ...bracket('cable-pull-through', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 24, intermediate: 48, advanced: 80, elite: 118 }),
  ...bracket('cable-pull-through', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 34, intermediate: 62, advanced: 98, elite: 140 }),
  ...bracket('cable-pull-through', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 43, intermediate: 74, advanced: 113, elite: 158 }),
  ...bracket('cable-pull-through', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 37, advanced: 60, elite: 87 }),
  ...bracket('cable-pull-through', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 23, intermediate: 42, advanced: 66, elite: 94 }),

  // cable-rope-hammer-curl
  ...bracket('cable-rope-hammer-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 36, advanced: 53, elite: 74 }),
  ...bracket('cable-rope-hammer-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 28, intermediate: 44, advanced: 63, elite: 85 }),
  ...bracket('cable-rope-hammer-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 33, intermediate: 50, advanced: 71, elite: 95 }),
  ...bracket('cable-rope-hammer-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 22, advanced: 33, elite: 46 }),
  ...bracket('cable-rope-hammer-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 27, advanced: 39, elite: 52 }),

  // cable-rope-kneeling-face-pull
  ...bracket('cable-rope-kneeling-face-pull', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 21, intermediate: 37, advanced: 57, elite: 80 }),
  ...bracket('cable-rope-kneeling-face-pull', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 47, advanced: 69, elite: 95 }),
  ...bracket('cable-rope-kneeling-face-pull', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 55, advanced: 80, elite: 107 }),
  ...bracket('cable-rope-kneeling-face-pull', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 28, advanced: 43, elite: 60 }),
  ...bracket('cable-rope-kneeling-face-pull', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 22, intermediate: 35, advanced: 51, elite: 69 }),

  // cable-rope-overhead-tricep-extension
  ...bracket('cable-rope-overhead-tricep-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 18, intermediate: 31, advanced: 49, elite: 70 }),
  ...bracket('cable-rope-overhead-tricep-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 87 }),
  ...bracket('cable-rope-overhead-tricep-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 53, advanced: 76, elite: 101 }),
  ...bracket('cable-rope-overhead-tricep-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('cable-rope-overhead-tricep-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 34, elite: 48 }),

  // cable-rope-pullover
  ...bracket('cable-rope-pullover', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 27, advanced: 39, elite: 53 }),
  ...bracket('cable-rope-pullover', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 24, intermediate: 35, advanced: 49, elite: 65 }),
  ...bracket('cable-rope-pullover', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 58, elite: 75 }),
  ...bracket('cable-rope-pullover', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 24, elite: 32 }),
  ...bracket('cable-rope-pullover', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 13, intermediate: 19, advanced: 27, elite: 37 }),

  // cable-rope-pushdown
  ...bracket('cable-rope-pushdown', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 89 }),
  ...bracket('cable-rope-pushdown', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 36, intermediate: 56, advanced: 80, elite: 107 }),
  ...bracket('cable-rope-pushdown', 'male', 90, 999, 'one_rm_kg', { beginner: 29, novice: 46, intermediate: 67, advanced: 93, elite: 122 }),
  ...bracket('cable-rope-pushdown', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 24, advanced: 38, elite: 53 }),
  ...bracket('cable-rope-pushdown', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 31, advanced: 46, elite: 63 }),

  // cable-row-bar-standing-row
  ...bracket('cable-row-bar-standing-row', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 49, intermediate: 68, advanced: 90, elite: 115 }),
  ...bracket('cable-row-bar-standing-row', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 65, intermediate: 87, advanced: 112, elite: 140 }),
  ...bracket('cable-row-bar-standing-row', 'male', 90, 999, 'one_rm_kg', { beginner: 59, novice: 79, intermediate: 104, advanced: 131, elite: 160 }),
  ...bracket('cable-row-bar-standing-row', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 41, advanced: 56, elite: 73 }),
  ...bracket('cable-row-bar-standing-row', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 35, intermediate: 50, advanced: 66, elite: 85 }),

  // cable-seated-rope-face-pull
  ...bracket('cable-seated-rope-face-pull', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 21, intermediate: 37, advanced: 57, elite: 80 }),
  ...bracket('cable-seated-rope-face-pull', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 47, advanced: 69, elite: 95 }),
  ...bracket('cable-seated-rope-face-pull', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 55, advanced: 80, elite: 107 }),
  ...bracket('cable-seated-rope-face-pull', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 28, advanced: 43, elite: 60 }),
  ...bracket('cable-seated-rope-face-pull', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 22, intermediate: 35, advanced: 51, elite: 69 }),

  // cable-side-bend
  ...bracket('cable-side-bend', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 15, intermediate: 29, advanced: 48, elite: 70 }),
  ...bracket('cable-side-bend', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 20, intermediate: 35, advanced: 56, elite: 80 }),
  ...bracket('cable-side-bend', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 24, intermediate: 41, advanced: 63, elite: 88 }),
  ...bracket('cable-side-bend', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 29, elite: 39 }),
  ...bracket('cable-side-bend', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 30, elite: 41 }),

  // cable-single-arm-neutral-grip-row
  ...bracket('cable-single-arm-neutral-grip-row', 'male', 0, 70, 'one_rm_kg', { beginner: 18, novice: 30, intermediate: 44, advanced: 62, elite: 82 }),
  ...bracket('cable-single-arm-neutral-grip-row', 'male', 70, 90, 'one_rm_kg', { beginner: 28, novice: 43, intermediate: 60, advanced: 81, elite: 104 }),
  ...bracket('cable-single-arm-neutral-grip-row', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 55, intermediate: 75, advanced: 97, elite: 122 }),
  ...bracket('cable-single-arm-neutral-grip-row', 'female', 0, 55, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 30, advanced: 42, elite: 55 }),
  ...bracket('cable-single-arm-neutral-grip-row', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 26, intermediate: 38, advanced: 50, elite: 65 }),

  // cable-single-arm-rear-delt-row
  ...bracket('cable-single-arm-rear-delt-row', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 16, advanced: 23, elite: 31 }),
  ...bracket('cable-single-arm-rear-delt-row', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 22, advanced: 30, elite: 38 }),
  ...bracket('cable-single-arm-rear-delt-row', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 19, intermediate: 27, advanced: 35, elite: 45 }),
  ...bracket('cable-single-arm-rear-delt-row', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 10, advanced: 14, elite: 18 }),
  ...bracket('cable-single-arm-rear-delt-row', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 12, advanced: 16, elite: 21 }),

  // cable-single-arm-rope-pushdown
  ...bracket('cable-single-arm-rope-pushdown', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 16, intermediate: 28, advanced: 44, elite: 64 }),
  ...bracket('cable-single-arm-rope-pushdown', 'male', 70, 90, 'one_rm_kg', { beginner: 13, novice: 24, intermediate: 39, advanced: 58, elite: 79 }),
  ...bracket('cable-single-arm-rope-pushdown', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 32, intermediate: 48, advanced: 69, elite: 93 }),
  ...bracket('cable-single-arm-rope-pushdown', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 29, elite: 40 }),
  ...bracket('cable-single-arm-rope-pushdown', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 24, advanced: 35, elite: 48 }),

  // cable-single-arm-underhand-grip-row
  ...bracket('cable-single-arm-underhand-grip-row', 'male', 0, 70, 'one_rm_kg', { beginner: 18, novice: 30, intermediate: 44, advanced: 62, elite: 82 }),
  ...bracket('cable-single-arm-underhand-grip-row', 'male', 70, 90, 'one_rm_kg', { beginner: 28, novice: 43, intermediate: 60, advanced: 81, elite: 104 }),
  ...bracket('cable-single-arm-underhand-grip-row', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 55, intermediate: 75, advanced: 97, elite: 122 }),
  ...bracket('cable-single-arm-underhand-grip-row', 'female', 0, 55, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 30, advanced: 42, elite: 55 }),
  ...bracket('cable-single-arm-underhand-grip-row', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 26, intermediate: 38, advanced: 50, elite: 65 }),

  // cable-single-leg-laying-leg-curl
  ...bracket('cable-single-leg-laying-leg-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 15, novice: 24, intermediate: 37, advanced: 52, elite: 68 }),
  ...bracket('cable-single-leg-laying-leg-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 21, novice: 33, intermediate: 47, advanced: 64, elite: 82 }),
  ...bracket('cable-single-leg-laying-leg-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 40, intermediate: 56, advanced: 74, elite: 94 }),
  ...bracket('cable-single-leg-laying-leg-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 23, advanced: 33, elite: 44 }),
  ...bracket('cable-single-leg-laying-leg-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 19, intermediate: 28, advanced: 39, elite: 50 }),

  // cable-standing-low-to-high-wood-chopper
  ...bracket('cable-standing-low-to-high-wood-chopper', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 15, intermediate: 30, advanced: 52, elite: 78 }),
  ...bracket('cable-standing-low-to-high-wood-chopper', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 37, advanced: 60, elite: 88 }),
  ...bracket('cable-standing-low-to-high-wood-chopper', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 23, intermediate: 42, advanced: 67, elite: 96 }),
  ...bracket('cable-standing-low-to-high-wood-chopper', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('cable-standing-low-to-high-wood-chopper', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 21, advanced: 33, elite: 46 }),

  // cable-standing-single-arm-chest-press
  ...bracket('cable-standing-single-arm-chest-press', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 27, intermediate: 45, advanced: 69, elite: 96 }),
  ...bracket('cable-standing-single-arm-chest-press', 'male', 70, 90, 'one_rm_kg', { beginner: 24, novice: 40, intermediate: 62, advanced: 89, elite: 118 }),
  ...bracket('cable-standing-single-arm-chest-press', 'male', 90, 999, 'one_rm_kg', { beginner: 33, novice: 51, intermediate: 76, advanced: 105, elite: 138 }),
  ...bracket('cable-standing-single-arm-chest-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 24, advanced: 38, elite: 54 }),
  ...bracket('cable-standing-single-arm-chest-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 29, advanced: 44, elite: 61 }),

  // cable-supinating-row
  ...bracket('cable-supinating-row', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 49, intermediate: 68, advanced: 90, elite: 115 }),
  ...bracket('cable-supinating-row', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 65, intermediate: 87, advanced: 112, elite: 140 }),
  ...bracket('cable-supinating-row', 'male', 90, 999, 'one_rm_kg', { beginner: 59, novice: 79, intermediate: 104, advanced: 131, elite: 160 }),
  ...bracket('cable-supinating-row', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 41, advanced: 56, elite: 73 }),
  ...bracket('cable-supinating-row', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 35, intermediate: 50, advanced: 66, elite: 85 }),

  // cable-tricep-kickback
  ...bracket('cable-tricep-kickback', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 15, intermediate: 39, advanced: 72, elite: 114 }),
  ...bracket('cable-tricep-kickback', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 23, intermediate: 49, advanced: 86, elite: 131 }),
  ...bracket('cable-tricep-kickback', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 29, intermediate: 59, advanced: 98, elite: 146 }),
  ...bracket('cable-tricep-kickback', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 24, advanced: 40, elite: 60 }),
  ...bracket('cable-tricep-kickback', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 16, intermediate: 30, advanced: 48, elite: 70 }),

  // cable-wood-chopper
  ...bracket('cable-wood-chopper', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 15, intermediate: 30, advanced: 52, elite: 78 }),
  ...bracket('cable-wood-chopper', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 37, advanced: 60, elite: 88 }),
  ...bracket('cable-wood-chopper', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 23, intermediate: 42, advanced: 67, elite: 96 }),
  ...bracket('cable-wood-chopper', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('cable-wood-chopper', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 21, advanced: 33, elite: 46 }),

  // cable-wrist-curl
  ...bracket('cable-wrist-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 21, advanced: 34, elite: 50 }),
  ...bracket('cable-wrist-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 27, advanced: 41, elite: 58 }),
  ...bracket('cable-wrist-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 19, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('cable-wrist-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 23, elite: 34 }),
  ...bracket('cable-wrist-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 8, intermediate: 16, advanced: 26, elite: 37 }),

  // captains-chair-knee-raise
  ...bracket('captains-chair-knee-raise', 'male', 0, 70, 'reps', { beginner: 0, novice: 8, intermediate: 20, advanced: 36, elite: 54 }),
  ...bracket('captains-chair-knee-raise', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 20, advanced: 34, elite: 49 }),
  ...bracket('captains-chair-knee-raise', 'male', 90, 999, 'reps', { beginner: 0, novice: 9, intermediate: 19, advanced: 31, elite: 44 }),
  ...bracket('captains-chair-knee-raise', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 44 }),
  ...bracket('captains-chair-knee-raise', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 15, advanced: 26, elite: 37 }),

  // chest-supported-dumbbell-row
  ...bracket('chest-supported-dumbbell-row', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 27, advanced: 41, elite: 57 }),
  ...bracket('chest-supported-dumbbell-row', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 37, advanced: 53, elite: 71 }),
  ...bracket('chest-supported-dumbbell-row', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 31, intermediate: 46, advanced: 63, elite: 82 }),
  ...bracket('chest-supported-dumbbell-row', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 27, elite: 37 }),
  ...bracket('chest-supported-dumbbell-row', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 43 }),

  // chest-supported-t-bar-row
  ...bracket('chest-supported-t-bar-row', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 60, advanced: 85, elite: 114 }),
  ...bracket('chest-supported-t-bar-row', 'male', 70, 90, 'one_rm_kg', { beginner: 38, novice: 58, intermediate: 82, advanced: 111, elite: 143 }),
  ...bracket('chest-supported-t-bar-row', 'male', 90, 999, 'one_rm_kg', { beginner: 52, novice: 74, intermediate: 102, advanced: 134, elite: 169 }),
  ...bracket('chest-supported-t-bar-row', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 37, advanced: 56, elite: 77 }),
  ...bracket('chest-supported-t-bar-row', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 30, intermediate: 46, advanced: 67, elite: 89 }),

  // chin-ups
  ...bracket('chin-ups', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 14, advanced: 23, elite: 32 }),
  ...bracket('chin-ups', 'male', 70, 90, 'reps', { beginner: 1, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),
  ...bracket('chin-ups', 'male', 90, 999, 'reps', { beginner: 1, novice: 7, intermediate: 12, advanced: 18, elite: 25 }),
  ...bracket('chin-ups', 'female', 0, 55, 'reps', { beginner: 0, novice: 1, intermediate: 7, advanced: 12, elite: 18 }),
  ...bracket('chin-ups', 'female', 55, 999, 'reps', { beginner: 0, novice: 1, intermediate: 6, advanced: 10, elite: 16 }),

  // close-grip-barbell-curl
  ...bracket('close-grip-barbell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 20, intermediate: 30, advanced: 42, elite: 55 }),
  ...bracket('close-grip-barbell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 41, advanced: 56, elite: 71 }),
  ...bracket('close-grip-barbell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 27, novice: 38, intermediate: 51, advanced: 67, elite: 84 }),
  ...bracket('close-grip-barbell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 28, elite: 37 }),
  ...bracket('close-grip-barbell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 24, advanced: 34, elite: 46 }),

  // close-grip-incline-push-up
  ...bracket('close-grip-incline-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 31, advanced: 56, elite: 83 }),
  ...bracket('close-grip-incline-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 52, elite: 76 }),
  ...bracket('close-grip-incline-push-up', 'male', 90, 999, 'reps', { beginner: 2, novice: 14, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('close-grip-incline-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 16, advanced: 32, elite: 49 }),
  ...bracket('close-grip-incline-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 31, elite: 45 }),

  // cossack-squat
  ...bracket('cossack-squat', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('cossack-squat', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('cossack-squat', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('cossack-squat', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('cossack-squat', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // cross-body-cable-tricep-extension
  ...bracket('cross-body-cable-tricep-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 18, intermediate: 31, advanced: 49, elite: 70 }),
  ...bracket('cross-body-cable-tricep-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 87 }),
  ...bracket('cross-body-cable-tricep-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 53, advanced: 76, elite: 101 }),
  ...bracket('cross-body-cable-tricep-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('cross-body-cable-tricep-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 34, elite: 48 }),

  // cross-body-hammer-curl
  ...bracket('cross-body-hammer-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 18, advanced: 26, elite: 34 }),
  ...bracket('cross-body-hammer-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 16, intermediate: 24, advanced: 33, elite: 42 }),
  ...bracket('cross-body-hammer-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('cross-body-hammer-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 15, elite: 20 }),
  ...bracket('cross-body-hammer-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 13, advanced: 18, elite: 24 }),

  // crunches
  ...bracket('crunches', 'male', 0, 70, 'reps', { beginner: 0, novice: 22, intermediate: 54, advanced: 94, elite: 139 }),
  ...bracket('crunches', 'male', 70, 90, 'reps', { beginner: 3, novice: 22, intermediate: 49, advanced: 82, elite: 119 }),
  ...bracket('crunches', 'male', 90, 999, 'reps', { beginner: 3, novice: 20, intermediate: 44, advanced: 72, elite: 103 }),
  ...bracket('crunches', 'female', 0, 55, 'reps', { beginner: 0, novice: 16, intermediate: 47, advanced: 86, elite: 131 }),
  ...bracket('crunches', 'female', 55, 999, 'reps', { beginner: 0, novice: 14, intermediate: 39, advanced: 70, elite: 105 }),

  // cuban-press
  ...bracket('cuban-press', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('cuban-press', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('cuban-press', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('cuban-press', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('cuban-press', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // dead-bug
  ...bracket('dead-bug', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('dead-bug', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dead-bug', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('dead-bug', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dead-bug', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // dead-bug-weighted
  ...bracket('dead-bug-weighted', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('dead-bug-weighted', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dead-bug-weighted', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('dead-bug-weighted', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dead-bug-weighted', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // decline-barbell-bench-press
  ...bracket('decline-barbell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 53, intermediate: 75, advanced: 99, elite: 127 }),
  ...bracket('decline-barbell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 58, novice: 79, intermediate: 104, advanced: 133, elite: 164 }),
  ...bracket('decline-barbell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 77, novice: 101, intermediate: 130, advanced: 162, elite: 197 }),
  ...bracket('decline-barbell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 42, advanced: 62, elite: 85 }),
  ...bracket('decline-barbell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 23, novice: 37, intermediate: 56, advanced: 79, elite: 104 }),

  // decline-crunch
  ...bracket('decline-crunch', 'male', 0, 70, 'reps', { beginner: 0, novice: 15, intermediate: 32, advanced: 51, elite: 72 }),
  ...bracket('decline-crunch', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 27, advanced: 43, elite: 60 }),
  ...bracket('decline-crunch', 'male', 90, 999, 'reps', { beginner: 0, novice: 11, intermediate: 23, advanced: 37, elite: 51 }),
  ...bracket('decline-crunch', 'female', 0, 55, 'reps', { beginner: 0, novice: 9, intermediate: 22, advanced: 38, elite: 55 }),
  ...bracket('decline-crunch', 'female', 55, 999, 'reps', { beginner: 0, novice: 10, intermediate: 22, advanced: 35, elite: 49 }),

  // decline-machine-chest-press
  ...bracket('decline-machine-chest-press', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 41, intermediate: 68, advanced: 100, elite: 139 }),
  ...bracket('decline-machine-chest-press', 'male', 70, 90, 'one_rm_kg', { beginner: 33, novice: 54, intermediate: 85, advanced: 121, elite: 162 }),
  ...bracket('decline-machine-chest-press', 'male', 90, 999, 'one_rm_kg', { beginner: 42, novice: 66, intermediate: 98, advanced: 137, elite: 181 }),
  ...bracket('decline-machine-chest-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 19, intermediate: 35, advanced: 54, elite: 79 }),
  ...bracket('decline-machine-chest-press', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 23, intermediate: 42, advanced: 65, elite: 89 }),

  // decline-push-up
  ...bracket('decline-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 11, intermediate: 27, advanced: 45, elite: 65 }),
  ...bracket('decline-push-up', 'male', 70, 90, 'reps', { beginner: 4, novice: 15, intermediate: 28, advanced: 44, elite: 61 }),
  ...bracket('decline-push-up', 'male', 90, 999, 'reps', { beginner: 6, novice: 15, intermediate: 28, advanced: 42, elite: 56 }),
  ...bracket('decline-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 6, intermediate: 17, advanced: 30, elite: 43 }),
  ...bracket('decline-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 8, intermediate: 17, advanced: 28, elite: 39 }),

  // decline-sit-up
  ...bracket('decline-sit-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 14, intermediate: 33, advanced: 56, elite: 81 }),
  ...bracket('decline-sit-up', 'male', 70, 90, 'reps', { beginner: 2, novice: 14, intermediate: 31, advanced: 50, elite: 71 }),
  ...bracket('decline-sit-up', 'male', 90, 999, 'reps', { beginner: 3, novice: 13, intermediate: 28, advanced: 45, elite: 62 }),
  ...bracket('decline-sit-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 11, intermediate: 27, advanced: 45, elite: 65 }),
  ...bracket('decline-sit-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 10, intermediate: 24, advanced: 39, elite: 55 }),

  // deficit-barbell-romanian-deadlift
  ...bracket('deficit-barbell-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 47, novice: 69, intermediate: 95, advanced: 128, elite: 163 }),
  ...bracket('deficit-barbell-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 70, novice: 97, intermediate: 128, advanced: 165, elite: 203 }),
  ...bracket('deficit-barbell-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 91, novice: 120, intermediate: 156, advanced: 197, elite: 239 }),
  ...bracket('deficit-barbell-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 32, novice: 46, intermediate: 62, advanced: 81, elite: 101 }),
  ...bracket('deficit-barbell-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 43, novice: 58, intermediate: 75, advanced: 98, elite: 119 }),

  // deficit-deadlift
  ...bracket('deficit-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 66, novice: 91, intermediate: 120, advanced: 154, elite: 191 }),
  ...bracket('deficit-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 96, novice: 125, intermediate: 159, advanced: 198, elite: 239 }),
  ...bracket('deficit-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 122, novice: 155, intermediate: 193, advanced: 236, elite: 280 }),
  ...bracket('deficit-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 40, novice: 57, intermediate: 77, advanced: 101, elite: 126 }),
  ...bracket('deficit-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 58, novice: 78, intermediate: 101, advanced: 128, elite: 156 }),

  // deficit-dumbbell-romanian-deadlift
  ...bracket('deficit-dumbbell-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 21, intermediate: 41, advanced: 66, elite: 97 }),
  ...bracket('deficit-dumbbell-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 17, novice: 35, intermediate: 58, advanced: 89, elite: 124 }),
  ...bracket('deficit-dumbbell-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 27, novice: 47, intermediate: 75, advanced: 109, elite: 147 }),
  ...bracket('deficit-dumbbell-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 31, advanced: 45, elite: 60 }),
  ...bracket('deficit-dumbbell-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 16, novice: 26, intermediate: 39, advanced: 55, elite: 72 }),

  // diamond-push-ups
  ...bracket('diamond-push-ups', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 24, advanced: 40, elite: 57 }),
  ...bracket('diamond-push-ups', 'male', 70, 90, 'reps', { beginner: 2, novice: 11, intermediate: 24, advanced: 37, elite: 52 }),
  ...bracket('diamond-push-ups', 'male', 90, 999, 'reps', { beginner: 4, novice: 11, intermediate: 22, advanced: 34, elite: 47 }),
  ...bracket('diamond-push-ups', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 12, advanced: 22, elite: 33 }),
  ...bracket('diamond-push-ups', 'female', 55, 999, 'reps', { beginner: 0, novice: 6, intermediate: 13, advanced: 22, elite: 32 }),

  // double-kettlebell-clean-and-press
  ...bracket('double-kettlebell-clean-and-press', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('double-kettlebell-clean-and-press', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('double-kettlebell-clean-and-press', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('double-kettlebell-clean-and-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('double-kettlebell-clean-and-press', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // dumbbell-alternating-forward-lunge
  ...bracket('dumbbell-alternating-forward-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 20, advanced: 33, elite: 47 }),
  ...bracket('dumbbell-alternating-forward-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 25, advanced: 39, elite: 55 }),
  ...bracket('dumbbell-alternating-forward-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 29, advanced: 44, elite: 61 }),
  ...bracket('dumbbell-alternating-forward-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 9, intermediate: 16, advanced: 25, elite: 36 }),
  ...bracket('dumbbell-alternating-forward-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 17, advanced: 28, elite: 39 }),

  // dumbbell-back-extension
  ...bracket('dumbbell-back-extension', 'male', 0, 70, 'reps', { beginner: 1, novice: 13, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('dumbbell-back-extension', 'male', 70, 90, 'reps', { beginner: 5, novice: 15, intermediate: 29, advanced: 46, elite: 63 }),
  ...bracket('dumbbell-back-extension', 'male', 90, 999, 'reps', { beginner: 6, novice: 15, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('dumbbell-back-extension', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 39, elite: 54 }),
  ...bracket('dumbbell-back-extension', 'female', 55, 999, 'reps', { beginner: 6, novice: 13, intermediate: 23, advanced: 35, elite: 46 }),

  // dumbbell-bench-press
  ...bracket('dumbbell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 20, intermediate: 30, advanced: 42, elite: 55 }),
  ...bracket('dumbbell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 28, intermediate: 40, advanced: 53, elite: 68 }),
  ...bracket('dumbbell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 36, intermediate: 48, advanced: 63, elite: 79 }),
  ...bracket('dumbbell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('dumbbell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 21, advanced: 30, elite: 41 }),

  // dumbbell-bulgarian-split-squat
  ...bracket('dumbbell-bulgarian-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 25, advanced: 38, elite: 52 }),
  ...bracket('dumbbell-bulgarian-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 13, novice: 22, intermediate: 33, advanced: 47, elite: 63 }),
  ...bracket('dumbbell-bulgarian-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 40, advanced: 56, elite: 72 }),
  ...bracket('dumbbell-bulgarian-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 28, elite: 38 }),
  ...bracket('dumbbell-bulgarian-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 43 }),

  // dumbbell-chest-fly
  ...bracket('dumbbell-chest-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 39 }),
  ...bracket('dumbbell-chest-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 24, advanced: 35, elite: 47 }),
  ...bracket('dumbbell-chest-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 29, advanced: 41, elite: 54 }),
  ...bracket('dumbbell-chest-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),
  ...bracket('dumbbell-chest-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 12, advanced: 18, elite: 24 }),

  // dumbbell-close-grip-push-up
  ...bracket('dumbbell-close-grip-push-up', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 41, advanced: 67, elite: 95 }),
  ...bracket('dumbbell-close-grip-push-up', 'male', 70, 90, 'reps', { beginner: 6, novice: 20, intermediate: 38, advanced: 60, elite: 84 }),
  ...bracket('dumbbell-close-grip-push-up', 'male', 90, 999, 'reps', { beginner: 6, novice: 19, intermediate: 35, advanced: 54, elite: 74 }),
  ...bracket('dumbbell-close-grip-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 51 }),
  ...bracket('dumbbell-close-grip-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 43 }),

  // dumbbell-concentration-curl
  ...bracket('dumbbell-concentration-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 17, advanced: 25, elite: 33 }),
  ...bracket('dumbbell-concentration-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 22, advanced: 30, elite: 40 }),
  ...bracket('dumbbell-concentration-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 18, intermediate: 25, advanced: 35, elite: 45 }),
  ...bracket('dumbbell-concentration-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 16, elite: 21 }),
  ...bracket('dumbbell-concentration-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 13, advanced: 18, elite: 24 }),

  // dumbbell-cossack-squat
  ...bracket('dumbbell-cossack-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('dumbbell-cossack-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('dumbbell-cossack-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('dumbbell-cossack-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('dumbbell-cossack-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // dumbbell-cross-body-romanian-deadlift
  ...bracket('dumbbell-cross-body-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 40, advanced: 66, elite: 97 }),
  ...bracket('dumbbell-cross-body-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 33, intermediate: 57, advanced: 88, elite: 124 }),
  ...bracket('dumbbell-cross-body-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 45, intermediate: 73, advanced: 107, elite: 146 }),
  ...bracket('dumbbell-cross-body-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 31, advanced: 47, elite: 65 }),
  ...bracket('dumbbell-cross-body-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 54, elite: 74 }),

  // dumbbell-curl
  ...bracket('dumbbell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 26, elite: 36 }),
  ...bracket('dumbbell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 42 }),
  ...bracket('dumbbell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 26, advanced: 36, elite: 48 }),
  ...bracket('dumbbell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 16, elite: 22 }),
  ...bracket('dumbbell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 19, elite: 26 }),

  // dumbbell-deadlift
  ...bracket('dumbbell-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 34, advanced: 52, elite: 74 }),
  ...bracket('dumbbell-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 27, intermediate: 43, advanced: 63, elite: 86 }),
  ...bracket('dumbbell-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 33, intermediate: 50, advanced: 72, elite: 97 }),
  ...bracket('dumbbell-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 22, advanced: 35, elite: 49 }),
  ...bracket('dumbbell-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 16, intermediate: 27, advanced: 41, elite: 56 }),

  // dumbbell-decline-bench-press
  ...bracket('dumbbell-decline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 29, advanced: 42, elite: 57 }),
  ...bracket('dumbbell-decline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 25, intermediate: 38, advanced: 52, elite: 69 }),
  ...bracket('dumbbell-decline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 32, intermediate: 45, advanced: 61, elite: 79 }),
  ...bracket('dumbbell-decline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('dumbbell-decline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 23, advanced: 34, elite: 46 }),

  // dumbbell-decline-chest-fly
  ...bracket('dumbbell-decline-chest-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 9, intermediate: 17, advanced: 28, elite: 40 }),
  ...bracket('dumbbell-decline-chest-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 34, elite: 48 }),
  ...bracket('dumbbell-decline-chest-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 27, advanced: 40, elite: 54 }),
  ...bracket('dumbbell-decline-chest-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 11, advanced: 17, elite: 25 }),
  ...bracket('dumbbell-decline-chest-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 20, elite: 27 }),

  // dumbbell-decline-crunch-behind-head
  ...bracket('dumbbell-decline-crunch-behind-head', 'male', 0, 70, 'reps', { beginner: 0, novice: 15, intermediate: 32, advanced: 51, elite: 72 }),
  ...bracket('dumbbell-decline-crunch-behind-head', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 27, advanced: 43, elite: 60 }),
  ...bracket('dumbbell-decline-crunch-behind-head', 'male', 90, 999, 'reps', { beginner: 0, novice: 11, intermediate: 23, advanced: 37, elite: 51 }),
  ...bracket('dumbbell-decline-crunch-behind-head', 'female', 0, 55, 'reps', { beginner: 0, novice: 9, intermediate: 22, advanced: 38, elite: 55 }),
  ...bracket('dumbbell-decline-crunch-behind-head', 'female', 55, 999, 'reps', { beginner: 0, novice: 10, intermediate: 22, advanced: 35, elite: 49 }),

  // dumbbell-decline-skullcrusher
  ...bracket('dumbbell-decline-skullcrusher', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 23, elite: 34 }),
  ...bracket('dumbbell-decline-skullcrusher', 'male', 70, 90, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 20, advanced: 29, elite: 41 }),
  ...bracket('dumbbell-decline-skullcrusher', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 24, advanced: 34, elite: 47 }),
  ...bracket('dumbbell-decline-skullcrusher', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 11, advanced: 15, elite: 21 }),
  ...bracket('dumbbell-decline-skullcrusher', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 12, advanced: 18, elite: 25 }),

  // dumbbell-feet-elevated-glute-bridge
  ...bracket('dumbbell-feet-elevated-glute-bridge', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 50, intermediate: 94, advanced: 151, elite: 218 }),
  ...bracket('dumbbell-feet-elevated-glute-bridge', 'male', 70, 90, 'one_rm_kg', { beginner: 42, novice: 81, intermediate: 135, advanced: 202, elite: 279 }),
  ...bracket('dumbbell-feet-elevated-glute-bridge', 'male', 90, 999, 'one_rm_kg', { beginner: 64, novice: 110, intermediate: 172, advanced: 247, elite: 331 }),
  ...bracket('dumbbell-feet-elevated-glute-bridge', 'female', 0, 55, 'one_rm_kg', { beginner: 21, novice: 46, intermediate: 83, advanced: 131, elite: 186 }),
  ...bracket('dumbbell-feet-elevated-glute-bridge', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 57, intermediate: 97, advanced: 148, elite: 207 }),

  // dumbbell-figure-four-heels-elevated-hip-thrust
  ...bracket('dumbbell-figure-four-heels-elevated-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 63, intermediate: 107, advanced: 163, elite: 227 }),
  ...bracket('dumbbell-figure-four-heels-elevated-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 149, advanced: 213, elite: 285 }),
  ...bracket('dumbbell-figure-four-heels-elevated-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 80, novice: 126, intermediate: 186, advanced: 257, elite: 335 }),
  ...bracket('dumbbell-figure-four-heels-elevated-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 30, novice: 56, intermediate: 92, advanced: 137, elite: 187 }),
  ...bracket('dumbbell-figure-four-heels-elevated-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 39, novice: 69, intermediate: 108, advanced: 155, elite: 209 }),

  // dumbbell-front-raise
  ...bracket('dumbbell-front-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 22, elite: 32 }),
  ...bracket('dumbbell-front-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('dumbbell-front-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 31, elite: 44 }),
  ...bracket('dumbbell-front-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 8, advanced: 13, elite: 18 }),
  ...bracket('dumbbell-front-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),

  // dumbbell-front-squat
  ...bracket('dumbbell-front-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 26, advanced: 40, elite: 57 }),
  ...bracket('dumbbell-front-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('dumbbell-front-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 53, elite: 72 }),
  ...bracket('dumbbell-front-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 38 }),
  ...bracket('dumbbell-front-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 31, elite: 42 }),

  // dumbbell-front-squat-tempo
  ...bracket('dumbbell-front-squat-tempo', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 26, advanced: 40, elite: 57 }),
  ...bracket('dumbbell-front-squat-tempo', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('dumbbell-front-squat-tempo', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 53, elite: 72 }),
  ...bracket('dumbbell-front-squat-tempo', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 38 }),
  ...bracket('dumbbell-front-squat-tempo', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 31, elite: 42 }),

  // dumbbell-goblet-alternating-curtsy-lunge
  ...bracket('dumbbell-goblet-alternating-curtsy-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 11, intermediate: 22, advanced: 40, elite: 60 }),
  ...bracket('dumbbell-goblet-alternating-curtsy-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 6, novice: 14, intermediate: 28, advanced: 46, elite: 68 }),
  ...bracket('dumbbell-goblet-alternating-curtsy-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 18, intermediate: 32, advanced: 51, elite: 75 }),
  ...bracket('dumbbell-goblet-alternating-curtsy-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('dumbbell-goblet-alternating-curtsy-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 38 }),

  // dumbbell-goblet-bulgarian-split-squat
  ...bracket('dumbbell-goblet-bulgarian-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 31, advanced: 47, elite: 63 }),
  ...bracket('dumbbell-goblet-bulgarian-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 18, novice: 27, intermediate: 40, advanced: 55, elite: 74 }),
  ...bracket('dumbbell-goblet-bulgarian-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 23, novice: 33, intermediate: 47, advanced: 65, elite: 83 }),
  ...bracket('dumbbell-goblet-bulgarian-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 16, intermediate: 24, advanced: 35, elite: 44 }),
  ...bracket('dumbbell-goblet-bulgarian-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 19, intermediate: 28, advanced: 38, elite: 50 }),

  // dumbbell-goblet-forward-lunge
  ...bracket('dumbbell-goblet-forward-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 20, advanced: 33, elite: 47 }),
  ...bracket('dumbbell-goblet-forward-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 25, advanced: 39, elite: 55 }),
  ...bracket('dumbbell-goblet-forward-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 29, advanced: 44, elite: 61 }),
  ...bracket('dumbbell-goblet-forward-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 9, intermediate: 16, advanced: 25, elite: 36 }),
  ...bracket('dumbbell-goblet-forward-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 17, advanced: 28, elite: 39 }),

  // dumbbell-goblet-reverse-lunge
  ...bracket('dumbbell-goblet-reverse-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 23, advanced: 37, elite: 52 }),
  ...bracket('dumbbell-goblet-reverse-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('dumbbell-goblet-reverse-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 36, advanced: 52, elite: 70 }),
  ...bracket('dumbbell-goblet-reverse-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 37 }),
  ...bracket('dumbbell-goblet-reverse-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),

  // dumbbell-goblet-split-squat
  ...bracket('dumbbell-goblet-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 11, intermediate: 22, advanced: 40, elite: 60 }),
  ...bracket('dumbbell-goblet-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 6, novice: 14, intermediate: 28, advanced: 46, elite: 68 }),
  ...bracket('dumbbell-goblet-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 18, intermediate: 32, advanced: 51, elite: 75 }),
  ...bracket('dumbbell-goblet-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('dumbbell-goblet-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 38 }),

  // dumbbell-goblet-squat
  ...bracket('dumbbell-goblet-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 34, advanced: 51, elite: 70 }),
  ...bracket('dumbbell-goblet-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 26, intermediate: 41, advanced: 59, elite: 80 }),
  ...bracket('dumbbell-goblet-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 31, intermediate: 47, advanced: 66, elite: 88 }),
  ...bracket('dumbbell-goblet-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 25, advanced: 36, elite: 48 }),
  ...bracket('dumbbell-goblet-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 18, intermediate: 27, advanced: 38, elite: 51 }),

  // dumbbell-good-morning
  ...bracket('dumbbell-good-morning', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 20, advanced: 32, elite: 46 }),
  ...bracket('dumbbell-good-morning', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 27, advanced: 40, elite: 56 }),
  ...bracket('dumbbell-good-morning', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('dumbbell-good-morning', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 12, advanced: 19, elite: 28 }),
  ...bracket('dumbbell-good-morning', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 9, intermediate: 15, advanced: 23, elite: 33 }),

  // dumbbell-halo
  ...bracket('dumbbell-halo', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('dumbbell-halo', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-halo', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('dumbbell-halo', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('dumbbell-halo', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // dumbbell-hammer-curl
  ...bracket('dumbbell-hammer-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 18, advanced: 26, elite: 34 }),
  ...bracket('dumbbell-hammer-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 16, intermediate: 24, advanced: 33, elite: 42 }),
  ...bracket('dumbbell-hammer-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('dumbbell-hammer-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 15, elite: 20 }),
  ...bracket('dumbbell-hammer-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 13, advanced: 18, elite: 24 }),

  // dumbbell-hammer-preacher-curl
  ...bracket('dumbbell-hammer-preacher-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 16, advanced: 24, elite: 30 }),
  ...bracket('dumbbell-hammer-preacher-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 12, novice: 17, intermediate: 23, advanced: 31, elite: 39 }),
  ...bracket('dumbbell-hammer-preacher-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 15, novice: 22, intermediate: 29, advanced: 38, elite: 45 }),
  ...bracket('dumbbell-hammer-preacher-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 10, advanced: 14, elite: 18 }),
  ...bracket('dumbbell-hammer-preacher-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 9, intermediate: 13, advanced: 17, elite: 22 }),

  // dumbbell-heels-elevated-hip-thrust
  ...bracket('dumbbell-heels-elevated-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 63, intermediate: 107, advanced: 163, elite: 227 }),
  ...bracket('dumbbell-heels-elevated-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 149, advanced: 213, elite: 285 }),
  ...bracket('dumbbell-heels-elevated-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 80, novice: 126, intermediate: 186, advanced: 257, elite: 335 }),
  ...bracket('dumbbell-heels-elevated-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 30, novice: 56, intermediate: 92, advanced: 137, elite: 187 }),
  ...bracket('dumbbell-heels-elevated-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 39, novice: 69, intermediate: 108, advanced: 155, elite: 209 }),

  // dumbbell-incline-bench-press
  ...bracket('dumbbell-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('dumbbell-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 29, intermediate: 39, advanced: 50, elite: 62 }),
  ...bracket('dumbbell-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 37, intermediate: 48, advanced: 60, elite: 73 }),
  ...bracket('dumbbell-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 23, elite: 31 }),
  ...bracket('dumbbell-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 21, advanced: 29, elite: 38 }),

  // dumbbell-incline-chest-fly
  ...bracket('dumbbell-incline-chest-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 39 }),
  ...bracket('dumbbell-incline-chest-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 26, advanced: 37, elite: 49 }),
  ...bracket('dumbbell-incline-chest-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 22, intermediate: 32, advanced: 43, elite: 56 }),
  ...bracket('dumbbell-incline-chest-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('dumbbell-incline-chest-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 14, advanced: 20, elite: 27 }),

  // dumbbell-incline-curl
  ...bracket('dumbbell-incline-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 10, intermediate: 15, advanced: 21, elite: 27 }),
  ...bracket('dumbbell-incline-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 14, intermediate: 20, advanced: 26, elite: 33 }),
  ...bracket('dumbbell-incline-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 17, intermediate: 23, advanced: 30, elite: 38 }),
  ...bracket('dumbbell-incline-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 10, advanced: 14, elite: 18 }),
  ...bracket('dumbbell-incline-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 8, intermediate: 12, advanced: 16, elite: 20 }),

  // dumbbell-incline-front-raise
  ...bracket('dumbbell-incline-front-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 8, intermediate: 14, advanced: 23, elite: 32 }),
  ...bracket('dumbbell-incline-front-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 18, advanced: 29, elite: 40 }),
  ...bracket('dumbbell-incline-front-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 23, advanced: 33, elite: 46 }),
  ...bracket('dumbbell-incline-front-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-incline-front-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 12, advanced: 17, elite: 23 }),

  // dumbbell-incline-hammer-curl
  ...bracket('dumbbell-incline-hammer-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 17, advanced: 24, elite: 31 }),
  ...bracket('dumbbell-incline-hammer-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 21, advanced: 28, elite: 37 }),
  ...bracket('dumbbell-incline-hammer-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 24, advanced: 32, elite: 41 }),
  ...bracket('dumbbell-incline-hammer-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 9, advanced: 12, elite: 16 }),
  ...bracket('dumbbell-incline-hammer-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 12, advanced: 16, elite: 20 }),

  // dumbbell-incline-row
  ...bracket('dumbbell-incline-row', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 27, advanced: 41, elite: 57 }),
  ...bracket('dumbbell-incline-row', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 37, advanced: 53, elite: 71 }),
  ...bracket('dumbbell-incline-row', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 31, intermediate: 46, advanced: 63, elite: 82 }),
  ...bracket('dumbbell-incline-row', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 27, elite: 37 }),
  ...bracket('dumbbell-incline-row', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 43 }),

  // dumbbell-lateral-lunge
  ...bracket('dumbbell-lateral-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 23, advanced: 37, elite: 52 }),
  ...bracket('dumbbell-lateral-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('dumbbell-lateral-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 36, advanced: 52, elite: 70 }),
  ...bracket('dumbbell-lateral-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 37 }),
  ...bracket('dumbbell-lateral-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),

  // dumbbell-lateral-raise
  ...bracket('dumbbell-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 13, advanced: 20, elite: 29 }),
  ...bracket('dumbbell-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('dumbbell-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 39 }),
  ...bracket('dumbbell-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 12, elite: 16 }),
  ...bracket('dumbbell-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 18 }),

  // dumbbell-laying-reverse-fly
  ...bracket('dumbbell-laying-reverse-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 13, advanced: 23, elite: 35 }),
  ...bracket('dumbbell-laying-reverse-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 9, intermediate: 17, advanced: 29, elite: 42 }),
  ...bracket('dumbbell-laying-reverse-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 12, intermediate: 21, advanced: 34, elite: 48 }),
  ...bracket('dumbbell-laying-reverse-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-laying-reverse-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),

  // dumbbell-leg-curl
  ...bracket('dumbbell-leg-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 34, intermediate: 52, advanced: 73, elite: 96 }),
  ...bracket('dumbbell-leg-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 30, novice: 46, intermediate: 66, advanced: 90, elite: 116 }),
  ...bracket('dumbbell-leg-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 57, intermediate: 79, advanced: 105, elite: 133 }),
  ...bracket('dumbbell-leg-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 13, novice: 21, intermediate: 32, advanced: 46, elite: 62 }),
  ...bracket('dumbbell-leg-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 27, intermediate: 40, advanced: 55, elite: 71 }),

  // dumbbell-lying-single-arm-rear-lateral-raise
  ...bracket('dumbbell-lying-single-arm-rear-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 13, advanced: 23, elite: 35 }),
  ...bracket('dumbbell-lying-single-arm-rear-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 9, intermediate: 17, advanced: 29, elite: 42 }),
  ...bracket('dumbbell-lying-single-arm-rear-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 12, intermediate: 21, advanced: 34, elite: 48 }),
  ...bracket('dumbbell-lying-single-arm-rear-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-lying-single-arm-rear-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),

  // dumbbell-neutral-grip-bent-over-row
  ...bracket('dumbbell-neutral-grip-bent-over-row', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 26, advanced: 40, elite: 57 }),
  ...bracket('dumbbell-neutral-grip-bent-over-row', 'male', 70, 90, 'one_rm_kg', { beginner: 12, novice: 22, intermediate: 35, advanced: 52, elite: 70 }),
  ...bracket('dumbbell-neutral-grip-bent-over-row', 'male', 90, 999, 'one_rm_kg', { beginner: 17, novice: 29, intermediate: 44, advanced: 62, elite: 82 }),
  ...bracket('dumbbell-neutral-grip-bent-over-row', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 17, advanced: 26, elite: 36 }),
  ...bracket('dumbbell-neutral-grip-bent-over-row', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 20, advanced: 30, elite: 40 }),

  // dumbbell-neutral-high-incline-bench-press
  ...bracket('dumbbell-neutral-high-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('dumbbell-neutral-high-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 29, intermediate: 39, advanced: 50, elite: 62 }),
  ...bracket('dumbbell-neutral-high-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 37, intermediate: 48, advanced: 60, elite: 73 }),
  ...bracket('dumbbell-neutral-high-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 23, elite: 31 }),
  ...bracket('dumbbell-neutral-high-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 21, advanced: 29, elite: 38 }),

  // dumbbell-overhead-squat
  ...bracket('dumbbell-overhead-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 20, elite: 28 }),
  ...bracket('dumbbell-overhead-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 24, elite: 34 }),
  ...bracket('dumbbell-overhead-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),
  ...bracket('dumbbell-overhead-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-overhead-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 16, elite: 23 }),

  // dumbbell-preacher-curl
  ...bracket('dumbbell-preacher-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 16, advanced: 24, elite: 32 }),
  ...bracket('dumbbell-preacher-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 21, advanced: 30, elite: 39 }),
  ...bracket('dumbbell-preacher-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 18, intermediate: 26, advanced: 35, elite: 44 }),
  ...bracket('dumbbell-preacher-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),
  ...bracket('dumbbell-preacher-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 18, elite: 24 }),

  // dumbbell-pullover
  ...bracket('dumbbell-pullover', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 27, advanced: 39, elite: 53 }),
  ...bracket('dumbbell-pullover', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 24, intermediate: 35, advanced: 49, elite: 65 }),
  ...bracket('dumbbell-pullover', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 58, elite: 75 }),
  ...bracket('dumbbell-pullover', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 24, elite: 32 }),
  ...bracket('dumbbell-pullover', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 13, intermediate: 19, advanced: 27, elite: 37 }),

  // dumbbell-push-press
  ...bracket('dumbbell-push-press', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 32, elite: 43 }),
  ...bracket('dumbbell-push-press', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 22, intermediate: 31, advanced: 42, elite: 54 }),
  ...bracket('dumbbell-push-press', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 28, intermediate: 39, advanced: 50, elite: 63 }),
  ...bracket('dumbbell-push-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 18, elite: 25 }),
  ...bracket('dumbbell-push-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 16, advanced: 22, elite: 29 }),

  // dumbbell-rear-delt-fly
  ...bracket('dumbbell-rear-delt-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 13, advanced: 23, elite: 35 }),
  ...bracket('dumbbell-rear-delt-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 9, intermediate: 17, advanced: 29, elite: 42 }),
  ...bracket('dumbbell-rear-delt-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 12, intermediate: 21, advanced: 34, elite: 48 }),
  ...bracket('dumbbell-rear-delt-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-rear-delt-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),

  // dumbbell-reverse-lunge
  ...bracket('dumbbell-reverse-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 23, advanced: 37, elite: 52 }),
  ...bracket('dumbbell-reverse-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('dumbbell-reverse-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 36, advanced: 52, elite: 70 }),
  ...bracket('dumbbell-reverse-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 37 }),
  ...bracket('dumbbell-reverse-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),

  // dumbbell-row-bilateral
  ...bracket('dumbbell-row-bilateral', 'male', 0, 70, 'one_rm_kg', { beginner: 22, novice: 35, intermediate: 49, advanced: 67, elite: 85 }),
  ...bracket('dumbbell-row-bilateral', 'male', 70, 90, 'one_rm_kg', { beginner: 31, novice: 45, intermediate: 62, advanced: 81, elite: 103 }),
  ...bracket('dumbbell-row-bilateral', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 55, intermediate: 74, advanced: 94, elite: 117 }),
  ...bracket('dumbbell-row-bilateral', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 16, intermediate: 26, advanced: 36, elite: 48 }),
  ...bracket('dumbbell-row-bilateral', 'female', 55, 999, 'one_rm_kg', { beginner: 14, novice: 20, intermediate: 30, advanced: 41, elite: 53 }),

  // dumbbell-row-unilateral
  ...bracket('dumbbell-row-unilateral', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),
  ...bracket('dumbbell-row-unilateral', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('dumbbell-row-unilateral', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('dumbbell-row-unilateral', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 27, elite: 36 }),
  ...bracket('dumbbell-row-unilateral', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 31, elite: 41 }),

  // dumbbell-russian-twist
  ...bracket('dumbbell-russian-twist', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('dumbbell-russian-twist', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dumbbell-russian-twist', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('dumbbell-russian-twist', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dumbbell-russian-twist', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // dumbbell-seated-full-lateral-raise
  ...bracket('dumbbell-seated-full-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 13, advanced: 20, elite: 29 }),
  ...bracket('dumbbell-seated-full-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('dumbbell-seated-full-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 39 }),
  ...bracket('dumbbell-seated-full-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 12, elite: 16 }),
  ...bracket('dumbbell-seated-full-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 18 }),

  // dumbbell-seated-lateral-raises
  ...bracket('dumbbell-seated-lateral-raises', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 13, advanced: 20, elite: 29 }),
  ...bracket('dumbbell-seated-lateral-raises', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('dumbbell-seated-lateral-raises', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 39 }),
  ...bracket('dumbbell-seated-lateral-raises', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 12, elite: 16 }),
  ...bracket('dumbbell-seated-lateral-raises', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 18 }),

  // dumbbell-seated-overhead-press
  ...bracket('dumbbell-seated-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 17, intermediate: 25, advanced: 34, elite: 43 }),
  ...bracket('dumbbell-seated-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 18, novice: 25, intermediate: 34, advanced: 44, elite: 54 }),
  ...bracket('dumbbell-seated-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 24, novice: 32, intermediate: 41, advanced: 52, elite: 64 }),
  ...bracket('dumbbell-seated-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 14, advanced: 19, elite: 25 }),
  ...bracket('dumbbell-seated-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 13, intermediate: 18, advanced: 24, elite: 30 }),

  // dumbbell-seated-overhead-tricep-extension
  ...bracket('dumbbell-seated-overhead-tricep-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 24, advanced: 35, elite: 47 }),
  ...bracket('dumbbell-seated-overhead-tricep-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 22, intermediate: 32, advanced: 45, elite: 59 }),
  ...bracket('dumbbell-seated-overhead-tricep-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 28, intermediate: 40, advanced: 54, elite: 70 }),
  ...bracket('dumbbell-seated-overhead-tricep-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 19, elite: 26 }),
  ...bracket('dumbbell-seated-overhead-tricep-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 17, advanced: 23, elite: 31 }),

  // dumbbell-seated-rear-delt-fly
  ...bracket('dumbbell-seated-rear-delt-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 13, advanced: 23, elite: 35 }),
  ...bracket('dumbbell-seated-rear-delt-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 9, intermediate: 17, advanced: 29, elite: 42 }),
  ...bracket('dumbbell-seated-rear-delt-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 12, intermediate: 21, advanced: 34, elite: 48 }),
  ...bracket('dumbbell-seated-rear-delt-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-seated-rear-delt-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),

  // dumbbell-seated-shrug
  ...bracket('dumbbell-seated-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 33, advanced: 50, elite: 69 }),
  ...bracket('dumbbell-seated-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 63, elite: 84 }),
  ...bracket('dumbbell-seated-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 23, novice: 36, intermediate: 54, advanced: 74, elite: 97 }),
  ...bracket('dumbbell-seated-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 21, advanced: 33, elite: 47 }),
  ...bracket('dumbbell-seated-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 55 }),

  // dumbbell-shrug
  ...bracket('dumbbell-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 33, advanced: 50, elite: 69 }),
  ...bracket('dumbbell-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 63, elite: 84 }),
  ...bracket('dumbbell-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 23, novice: 36, intermediate: 54, advanced: 74, elite: 97 }),
  ...bracket('dumbbell-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 21, advanced: 33, elite: 47 }),
  ...bracket('dumbbell-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 55 }),

  // dumbbell-side-bend
  ...bracket('dumbbell-side-bend', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 15, intermediate: 29, advanced: 48, elite: 70 }),
  ...bracket('dumbbell-side-bend', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 20, intermediate: 35, advanced: 56, elite: 80 }),
  ...bracket('dumbbell-side-bend', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 24, intermediate: 41, advanced: 63, elite: 88 }),
  ...bracket('dumbbell-side-bend', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 29, elite: 39 }),
  ...bracket('dumbbell-side-bend', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 30, elite: 41 }),

  // dumbbell-single-arm-chest-press
  ...bracket('dumbbell-single-arm-chest-press', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 27, intermediate: 45, advanced: 69, elite: 96 }),
  ...bracket('dumbbell-single-arm-chest-press', 'male', 70, 90, 'one_rm_kg', { beginner: 24, novice: 40, intermediate: 62, advanced: 89, elite: 118 }),
  ...bracket('dumbbell-single-arm-chest-press', 'male', 90, 999, 'one_rm_kg', { beginner: 33, novice: 51, intermediate: 76, advanced: 105, elite: 138 }),
  ...bracket('dumbbell-single-arm-chest-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 24, advanced: 38, elite: 54 }),
  ...bracket('dumbbell-single-arm-chest-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 29, advanced: 44, elite: 61 }),

  // dumbbell-single-arm-clean-and-press
  ...bracket('dumbbell-single-arm-clean-and-press', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('dumbbell-single-arm-clean-and-press', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('dumbbell-single-arm-clean-and-press', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('dumbbell-single-arm-clean-and-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('dumbbell-single-arm-clean-and-press', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // dumbbell-single-arm-incline-bench-preacher-curl
  ...bracket('dumbbell-single-arm-incline-bench-preacher-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 10, advanced: 17, elite: 23 }),
  ...bracket('dumbbell-single-arm-incline-bench-preacher-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 15, advanced: 22, elite: 29 }),
  ...bracket('dumbbell-single-arm-incline-bench-preacher-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 26, elite: 34 }),
  ...bracket('dumbbell-single-arm-incline-bench-preacher-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 15 }),
  ...bracket('dumbbell-single-arm-incline-bench-preacher-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 10, advanced: 14, elite: 18 }),

  // dumbbell-single-arm-neutral-overhead-press
  ...bracket('dumbbell-single-arm-neutral-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 24, elite: 31 }),
  ...bracket('dumbbell-single-arm-neutral-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 24, advanced: 32, elite: 40 }),
  ...bracket('dumbbell-single-arm-neutral-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 16, novice: 22, intermediate: 30, advanced: 39, elite: 49 }),
  ...bracket('dumbbell-single-arm-neutral-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 7, intermediate: 10, advanced: 14, elite: 19 }),
  ...bracket('dumbbell-single-arm-neutral-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 10, intermediate: 14, advanced: 18, elite: 23 }),

  // dumbbell-single-arm-row
  ...bracket('dumbbell-single-arm-row', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),
  ...bracket('dumbbell-single-arm-row', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('dumbbell-single-arm-row', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('dumbbell-single-arm-row', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 27, elite: 36 }),
  ...bracket('dumbbell-single-arm-row', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 31, elite: 41 }),

  // dumbbell-single-arm-upright-row
  ...bracket('dumbbell-single-arm-upright-row', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 29 }),
  ...bracket('dumbbell-single-arm-upright-row', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('dumbbell-single-arm-upright-row', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 22, advanced: 33, elite: 45 }),
  ...bracket('dumbbell-single-arm-upright-row', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 9, advanced: 13, elite: 17 }),
  ...bracket('dumbbell-single-arm-upright-row', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 11, advanced: 15, elite: 19 }),

  // dumbbell-single-leg-calf-raise
  ...bracket('dumbbell-single-leg-calf-raise', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 44, advanced: 77, elite: 114 }),
  ...bracket('dumbbell-single-leg-calf-raise', 'male', 70, 90, 'reps', { beginner: 4, novice: 18, intermediate: 39, advanced: 66, elite: 96 }),
  ...bracket('dumbbell-single-leg-calf-raise', 'male', 90, 999, 'reps', { beginner: 3, novice: 16, intermediate: 35, advanced: 57, elite: 84 }),
  ...bracket('dumbbell-single-leg-calf-raise', 'female', 0, 55, 'reps', { beginner: 0, novice: 13, intermediate: 35, advanced: 64, elite: 95 }),
  ...bracket('dumbbell-single-leg-calf-raise', 'female', 55, 999, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 54, elite: 80 }),

  // dumbbell-single-leg-hip-thrust
  ...bracket('dumbbell-single-leg-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 45, intermediate: 76, advanced: 116, elite: 161 }),
  ...bracket('dumbbell-single-leg-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 40, novice: 68, intermediate: 106, advanced: 151, elite: 202 }),
  ...bracket('dumbbell-single-leg-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 57, novice: 89, intermediate: 132, advanced: 182, elite: 238 }),
  ...bracket('dumbbell-single-leg-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 21, novice: 40, intermediate: 65, advanced: 97, elite: 133 }),
  ...bracket('dumbbell-single-leg-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 28, novice: 49, intermediate: 77, advanced: 110, elite: 148 }),

  // dumbbell-situp
  ...bracket('dumbbell-situp', 'male', 0, 70, 'reps', { beginner: 6, novice: 29, intermediate: 62, advanced: 103, elite: 148 }),
  ...bracket('dumbbell-situp', 'male', 70, 90, 'reps', { beginner: 5, novice: 24, intermediate: 52, advanced: 84, elite: 121 }),
  ...bracket('dumbbell-situp', 'male', 90, 999, 'reps', { beginner: 4, novice: 20, intermediate: 44, advanced: 71, elite: 102 }),
  ...bracket('dumbbell-situp', 'female', 0, 55, 'reps', { beginner: 0, novice: 17, intermediate: 49, advanced: 88, elite: 133 }),
  ...bracket('dumbbell-situp', 'female', 55, 999, 'reps', { beginner: 0, novice: 14, intermediate: 39, advanced: 70, elite: 104 }),

  // dumbbell-skullcrusher
  ...bracket('dumbbell-skullcrusher', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 9, intermediate: 16, advanced: 23, elite: 33 }),
  ...bracket('dumbbell-skullcrusher', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 30, elite: 40 }),
  ...bracket('dumbbell-skullcrusher', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 26, advanced: 35, elite: 47 }),
  ...bracket('dumbbell-skullcrusher', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 14, elite: 19 }),
  ...bracket('dumbbell-skullcrusher', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 16, elite: 22 }),

  // dumbbell-spinal-jefferson-curl
  ...bracket('dumbbell-spinal-jefferson-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('dumbbell-spinal-jefferson-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('dumbbell-spinal-jefferson-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('dumbbell-spinal-jefferson-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('dumbbell-spinal-jefferson-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // dumbbell-squat
  ...bracket('dumbbell-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 27, advanced: 41, elite: 58 }),
  ...bracket('dumbbell-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 34, advanced: 50, elite: 68 }),
  ...bracket('dumbbell-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 15, novice: 26, intermediate: 40, advanced: 57, elite: 76 }),
  ...bracket('dumbbell-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 19, advanced: 29, elite: 41 }),
  ...bracket('dumbbell-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 32, elite: 44 }),

  // dumbbell-standing-single-arm-curl
  ...bracket('dumbbell-standing-single-arm-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 12, advanced: 18, elite: 26 }),
  ...bracket('dumbbell-standing-single-arm-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 9, intermediate: 15, advanced: 23, elite: 31 }),
  ...bracket('dumbbell-standing-single-arm-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 27, elite: 37 }),
  ...bracket('dumbbell-standing-single-arm-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 8, advanced: 12, elite: 17 }),
  ...bracket('dumbbell-standing-single-arm-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),

  // dumbbell-standing-single-arm-hammer-curl
  ...bracket('dumbbell-standing-single-arm-hammer-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 12, advanced: 18, elite: 24 }),
  ...bracket('dumbbell-standing-single-arm-hammer-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 17, advanced: 24, elite: 31 }),
  ...bracket('dumbbell-standing-single-arm-hammer-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 21, advanced: 29, elite: 37 }),
  ...bracket('dumbbell-standing-single-arm-hammer-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 11, elite: 15 }),
  ...bracket('dumbbell-standing-single-arm-hammer-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 10, advanced: 14, elite: 18 }),

  // dumbbell-step-up-high
  ...bracket('dumbbell-step-up-high', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('dumbbell-step-up-high', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('dumbbell-step-up-high', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('dumbbell-step-up-high', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('dumbbell-step-up-high', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // dumbbell-step-up-low
  ...bracket('dumbbell-step-up-low', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('dumbbell-step-up-low', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('dumbbell-step-up-low', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('dumbbell-step-up-low', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('dumbbell-step-up-low', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // dumbbell-stiff-leg-deadlift
  ...bracket('dumbbell-stiff-leg-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 16, intermediate: 29, advanced: 46, elite: 68 }),
  ...bracket('dumbbell-stiff-leg-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 36, advanced: 55, elite: 77 }),
  ...bracket('dumbbell-stiff-leg-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 41, advanced: 62, elite: 86 }),
  ...bracket('dumbbell-stiff-leg-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 28, elite: 40 }),
  ...bracket('dumbbell-stiff-leg-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 33, elite: 46 }),

  // dumbbell-sumo-squat
  ...bracket('dumbbell-sumo-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 38, intermediate: 75, advanced: 124, elite: 183 }),
  ...bracket('dumbbell-sumo-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 30, novice: 62, intermediate: 108, advanced: 166, elite: 234 }),
  ...bracket('dumbbell-sumo-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 47, novice: 86, intermediate: 138, advanced: 203, elite: 277 }),
  ...bracket('dumbbell-sumo-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 23, intermediate: 41, advanced: 65, elite: 92 }),
  ...bracket('dumbbell-sumo-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 14, novice: 27, intermediate: 47, advanced: 71, elite: 100 }),

  // dumbbell-superman
  ...bracket('dumbbell-superman', 'male', 0, 70, 'reps', { beginner: 1, novice: 13, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('dumbbell-superman', 'male', 70, 90, 'reps', { beginner: 5, novice: 15, intermediate: 29, advanced: 46, elite: 63 }),
  ...bracket('dumbbell-superman', 'male', 90, 999, 'reps', { beginner: 6, novice: 15, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('dumbbell-superman', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 39, elite: 54 }),
  ...bracket('dumbbell-superman', 'female', 55, 999, 'reps', { beginner: 6, novice: 13, intermediate: 23, advanced: 35, elite: 46 }),

  // dumbbell-thruster
  ...bracket('dumbbell-thruster', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('dumbbell-thruster', 'male', 70, 90, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 34, advanced: 50, elite: 67 }),
  ...bracket('dumbbell-thruster', 'male', 90, 999, 'one_rm_kg', { beginner: 17, novice: 26, intermediate: 41, advanced: 56, elite: 76 }),
  ...bracket('dumbbell-thruster', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 22, advanced: 28, elite: 36 }),
  ...bracket('dumbbell-thruster', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 23, advanced: 31, elite: 40 }),

  // dumbbell-tibialis-raise
  ...bracket('dumbbell-tibialis-raise', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('dumbbell-tibialis-raise', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dumbbell-tibialis-raise', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('dumbbell-tibialis-raise', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('dumbbell-tibialis-raise', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // dumbbell-tricep-kickback
  ...bracket('dumbbell-tricep-kickback', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 14, advanced: 23, elite: 33 }),
  ...bracket('dumbbell-tricep-kickback', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('dumbbell-tricep-kickback', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 22, advanced: 33, elite: 46 }),
  ...bracket('dumbbell-tricep-kickback', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 13, elite: 18 }),
  ...bracket('dumbbell-tricep-kickback', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 15, elite: 20 }),

  // dumbbell-turkish-get-up
  ...bracket('dumbbell-turkish-get-up', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('dumbbell-turkish-get-up', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('dumbbell-turkish-get-up', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('dumbbell-turkish-get-up', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('dumbbell-turkish-get-up', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // dumbbell-upright-row
  ...bracket('dumbbell-upright-row', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('dumbbell-upright-row', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 25, advanced: 37, elite: 51 }),
  ...bracket('dumbbell-upright-row', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 30, advanced: 44, elite: 59 }),
  ...bracket('dumbbell-upright-row', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 12, advanced: 17, elite: 22 }),
  ...bracket('dumbbell-upright-row', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 14, advanced: 19, elite: 25 }),

  // dumbbell-walking-lunges
  ...bracket('dumbbell-walking-lunges', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 23, advanced: 37, elite: 52 }),
  ...bracket('dumbbell-walking-lunges', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('dumbbell-walking-lunges', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 36, advanced: 52, elite: 70 }),
  ...bracket('dumbbell-walking-lunges', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 37 }),
  ...bracket('dumbbell-walking-lunges', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),

  // dumbbell-windmill
  ...bracket('dumbbell-windmill', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('dumbbell-windmill', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-windmill', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('dumbbell-windmill', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('dumbbell-windmill', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // dumbbell-wrist-curl
  ...bracket('dumbbell-wrist-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 21, advanced: 34, elite: 50 }),
  ...bracket('dumbbell-wrist-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 27, advanced: 41, elite: 58 }),
  ...bracket('dumbbell-wrist-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 19, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('dumbbell-wrist-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 23, elite: 34 }),
  ...bracket('dumbbell-wrist-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 8, intermediate: 16, advanced: 26, elite: 37 }),

  // dumbbell-wrist-extension
  ...bracket('dumbbell-wrist-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('dumbbell-wrist-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('dumbbell-wrist-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('dumbbell-wrist-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('dumbbell-wrist-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // eccentric-calf-lowers
  ...bracket('eccentric-calf-lowers', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('eccentric-calf-lowers', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('eccentric-calf-lowers', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('eccentric-calf-lowers', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('eccentric-calf-lowers', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // ez-bar-preacher-curl
  ...bracket('ez-bar-preacher-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 23, intermediate: 35, advanced: 50, elite: 66 }),
  ...bracket('ez-bar-preacher-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 31, intermediate: 45, advanced: 61, elite: 78 }),
  ...bracket('ez-bar-preacher-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('ez-bar-preacher-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 20, advanced: 30, elite: 41 }),
  ...bracket('ez-bar-preacher-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 26, advanced: 37, elite: 50 }),

  // ez-bar-reverse-preacher-curl
  ...bracket('ez-bar-reverse-preacher-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 17, intermediate: 28, advanced: 44, elite: 61 }),
  ...bracket('ez-bar-reverse-preacher-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 39, advanced: 55, elite: 74 }),
  ...bracket('ez-bar-reverse-preacher-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 47, advanced: 65, elite: 86 }),
  ...bracket('ez-bar-reverse-preacher-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 38 }),
  ...bracket('ez-bar-reverse-preacher-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 22, advanced: 33, elite: 43 }),

  // ez-bar-skullcrusher
  ...bracket('ez-bar-skullcrusher', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 20, intermediate: 31, advanced: 45, elite: 60 }),
  ...bracket('ez-bar-skullcrusher', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('ez-bar-skullcrusher', 'male', 90, 999, 'one_rm_kg', { beginner: 27, novice: 39, intermediate: 54, advanced: 71, elite: 90 }),
  ...bracket('ez-bar-skullcrusher', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 27, elite: 37 }),
  ...bracket('ez-bar-skullcrusher', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 43 }),

  // fire-hydrants
  ...bracket('fire-hydrants', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('fire-hydrants', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('fire-hydrants', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('fire-hydrants', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('fire-hydrants', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // floor-press
  ...bracket('floor-press', 'male', 0, 70, 'one_rm_kg', { beginner: 25, novice: 42, intermediate: 65, advanced: 93, elite: 124 }),
  ...bracket('floor-press', 'male', 70, 90, 'one_rm_kg', { beginner: 42, novice: 64, intermediate: 91, advanced: 124, elite: 160 }),
  ...bracket('floor-press', 'male', 90, 999, 'one_rm_kg', { beginner: 59, novice: 84, intermediate: 115, advanced: 152, elite: 191 }),
  ...bracket('floor-press', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 39, advanced: 58, elite: 80 }),
  ...bracket('floor-press', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 31, intermediate: 49, advanced: 70, elite: 94 }),

  // forward-lunge
  ...bracket('forward-lunge', 'male', 0, 70, 'reps', { beginner: 3, novice: 12, intermediate: 28, advanced: 48, elite: 72 }),
  ...bracket('forward-lunge', 'male', 70, 90, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('forward-lunge', 'male', 90, 999, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),
  ...bracket('forward-lunge', 'female', 0, 55, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('forward-lunge', 'female', 55, 999, 'reps', { beginner: 1, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),

  // frog-pump
  ...bracket('frog-pump', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('frog-pump', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('frog-pump', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('frog-pump', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('frog-pump', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // front-foot-elevated-split-squat
  ...bracket('front-foot-elevated-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 18, novice: 37, intermediate: 64, advanced: 100, elite: 140 }),
  ...bracket('front-foot-elevated-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 32, novice: 56, intermediate: 89, advanced: 130, elite: 176 }),
  ...bracket('front-foot-elevated-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 45, novice: 74, intermediate: 112, advanced: 157, elite: 207 }),
  ...bracket('front-foot-elevated-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 25, intermediate: 43, advanced: 65, elite: 91 }),
  ...bracket('front-foot-elevated-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 32, intermediate: 51, advanced: 76, elite: 104 }),

  // front-raise-and-pullover
  ...bracket('front-raise-and-pullover', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 22, elite: 32 }),
  ...bracket('front-raise-and-pullover', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('front-raise-and-pullover', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 31, elite: 44 }),
  ...bracket('front-raise-and-pullover', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 8, advanced: 13, elite: 18 }),
  ...bracket('front-raise-and-pullover', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),

  // front-squat
  ...bracket('front-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 40, novice: 57, intermediate: 79, advanced: 104, elite: 130 }),
  ...bracket('front-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 59, novice: 79, intermediate: 104, advanced: 133, elite: 163 }),
  ...bracket('front-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 76, novice: 99, intermediate: 127, advanced: 158, elite: 190 }),
  ...bracket('front-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 26, novice: 39, intermediate: 54, advanced: 72, elite: 91 }),
  ...bracket('front-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 35, novice: 48, intermediate: 65, advanced: 85, elite: 106 }),

  // glute-bridge
  ...bracket('glute-bridge', 'male', 0, 70, 'reps', { beginner: 0, novice: 11, intermediate: 40, advanced: 77, elite: 119 }),
  ...bracket('glute-bridge', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 38, advanced: 69, elite: 104 }),
  ...bracket('glute-bridge', 'male', 90, 999, 'reps', { beginner: 0, novice: 14, intermediate: 36, advanced: 63, elite: 93 }),
  ...bracket('glute-bridge', 'female', 0, 55, 'reps', { beginner: 0, novice: 10, intermediate: 35, advanced: 66, elite: 102 }),
  ...bracket('glute-bridge', 'female', 55, 999, 'reps', { beginner: 0, novice: 11, intermediate: 32, advanced: 57, elite: 85 }),

  // glute-kickback-machine
  ...bracket('glute-kickback-machine', 'male', 0, 70, 'reps', { beginner: 0, novice: 13, intermediate: 35, advanced: 61, elite: 90 }),
  ...bracket('glute-kickback-machine', 'male', 70, 90, 'reps', { beginner: 2, novice: 16, intermediate: 36, advanced: 58, elite: 83 }),
  ...bracket('glute-kickback-machine', 'male', 90, 999, 'reps', { beginner: 5, novice: 17, intermediate: 34, advanced: 54, elite: 75 }),
  ...bracket('glute-kickback-machine', 'female', 0, 55, 'reps', { beginner: 0, novice: 14, intermediate: 32, advanced: 54, elite: 78 }),
  ...bracket('glute-kickback-machine', 'female', 55, 999, 'reps', { beginner: 3, novice: 15, intermediate: 31, advanced: 49, elite: 68 }),

  // good-mornings
  ...bracket('good-mornings', 'male', 0, 70, 'one_rm_kg', { beginner: 15, novice: 28, intermediate: 45, advanced: 65, elite: 88 }),
  ...bracket('good-mornings', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 38, intermediate: 58, advanced: 82, elite: 108 }),
  ...bracket('good-mornings', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 46, intermediate: 70, advanced: 98, elite: 128 }),
  ...bracket('good-mornings', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 56 }),
  ...bracket('good-mornings', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),

  // hammer-strength-high-row
  ...bracket('hammer-strength-high-row', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 60, advanced: 85, elite: 114 }),
  ...bracket('hammer-strength-high-row', 'male', 70, 90, 'one_rm_kg', { beginner: 38, novice: 58, intermediate: 82, advanced: 111, elite: 143 }),
  ...bracket('hammer-strength-high-row', 'male', 90, 999, 'one_rm_kg', { beginner: 52, novice: 74, intermediate: 102, advanced: 134, elite: 169 }),
  ...bracket('hammer-strength-high-row', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 37, advanced: 56, elite: 77 }),
  ...bracket('hammer-strength-high-row', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 30, intermediate: 46, advanced: 67, elite: 89 }),

  // hammer-strength-iso-lateral-row
  ...bracket('hammer-strength-iso-lateral-row', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 60, advanced: 85, elite: 114 }),
  ...bracket('hammer-strength-iso-lateral-row', 'male', 70, 90, 'one_rm_kg', { beginner: 38, novice: 58, intermediate: 82, advanced: 111, elite: 143 }),
  ...bracket('hammer-strength-iso-lateral-row', 'male', 90, 999, 'one_rm_kg', { beginner: 52, novice: 74, intermediate: 102, advanced: 134, elite: 169 }),
  ...bracket('hammer-strength-iso-lateral-row', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 37, advanced: 56, elite: 77 }),
  ...bracket('hammer-strength-iso-lateral-row', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 30, intermediate: 46, advanced: 67, elite: 89 }),

  // hamstring-curl
  ...bracket('hamstring-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 34, intermediate: 52, advanced: 73, elite: 96 }),
  ...bracket('hamstring-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 30, novice: 46, intermediate: 66, advanced: 90, elite: 116 }),
  ...bracket('hamstring-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 57, intermediate: 79, advanced: 105, elite: 133 }),
  ...bracket('hamstring-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 13, novice: 21, intermediate: 32, advanced: 46, elite: 62 }),
  ...bracket('hamstring-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 27, intermediate: 40, advanced: 55, elite: 71 }),

  // hang-clean
  ...bracket('hang-clean', 'male', 0, 70, 'one_rm_kg', { beginner: 38, novice: 52, intermediate: 67, advanced: 85, elite: 104 }),
  ...bracket('hang-clean', 'male', 70, 90, 'one_rm_kg', { beginner: 54, novice: 70, intermediate: 88, advanced: 108, elite: 129 }),
  ...bracket('hang-clean', 'male', 90, 999, 'one_rm_kg', { beginner: 69, novice: 86, intermediate: 106, advanced: 128, elite: 151 }),
  ...bracket('hang-clean', 'female', 0, 55, 'one_rm_kg', { beginner: 24, novice: 33, intermediate: 44, advanced: 57, elite: 71 }),
  ...bracket('hang-clean', 'female', 55, 999, 'one_rm_kg', { beginner: 32, novice: 43, intermediate: 56, advanced: 70, elite: 86 }),

  // hang-power-clean
  ...bracket('hang-power-clean', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 49, intermediate: 65, advanced: 84, elite: 104 }),
  ...bracket('hang-power-clean', 'male', 70, 90, 'one_rm_kg', { beginner: 50, novice: 66, intermediate: 85, advanced: 105, elite: 128 }),
  ...bracket('hang-power-clean', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 81, intermediate: 101, advanced: 124, elite: 148 }),
  ...bracket('hang-power-clean', 'female', 0, 55, 'one_rm_kg', { beginner: 25, novice: 34, intermediate: 46, advanced: 59, elite: 73 }),
  ...bracket('hang-power-clean', 'female', 55, 999, 'one_rm_kg', { beginner: 30, novice: 40, intermediate: 53, advanced: 67, elite: 82 }),

  // hang-snatch
  ...bracket('hang-snatch', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 35, intermediate: 51, advanced: 69, elite: 89 }),
  ...bracket('hang-snatch', 'male', 70, 90, 'one_rm_kg', { beginner: 35, novice: 50, intermediate: 68, advanced: 89, elite: 111 }),
  ...bracket('hang-snatch', 'male', 90, 999, 'one_rm_kg', { beginner: 46, novice: 63, intermediate: 83, advanced: 106, elite: 130 }),
  ...bracket('hang-snatch', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 27, intermediate: 36, advanced: 47, elite: 58 }),
  ...bracket('hang-snatch', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 32, intermediate: 42, advanced: 53, elite: 65 }),

  // hanging-knee-raises
  ...bracket('hanging-knee-raises', 'male', 0, 70, 'reps', { beginner: 0, novice: 8, intermediate: 20, advanced: 36, elite: 54 }),
  ...bracket('hanging-knee-raises', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 20, advanced: 34, elite: 49 }),
  ...bracket('hanging-knee-raises', 'male', 90, 999, 'reps', { beginner: 0, novice: 9, intermediate: 19, advanced: 31, elite: 44 }),
  ...bracket('hanging-knee-raises', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 44 }),
  ...bracket('hanging-knee-raises', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 15, advanced: 26, elite: 37 }),

  // heel-elevated-dumbbell-front-squat
  ...bracket('heel-elevated-dumbbell-front-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 26, advanced: 40, elite: 57 }),
  ...bracket('heel-elevated-dumbbell-front-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('heel-elevated-dumbbell-front-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 53, elite: 72 }),
  ...bracket('heel-elevated-dumbbell-front-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 38 }),
  ...bracket('heel-elevated-dumbbell-front-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 31, elite: 42 }),

  // hip-hinge-drill
  ...bracket('hip-hinge-drill', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('hip-hinge-drill', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('hip-hinge-drill', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('hip-hinge-drill', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('hip-hinge-drill', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // hip-hinge-speed-romanian-deadlift
  ...bracket('hip-hinge-speed-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('hip-hinge-speed-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('hip-hinge-speed-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('hip-hinge-speed-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('hip-hinge-speed-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // horizontal-leg-press-calf-press
  ...bracket('horizontal-leg-press-calf-press', 'male', 0, 70, 'one_rm_kg', { beginner: 51, novice: 93, intermediate: 150, advanced: 222, elite: 303 }),
  ...bracket('horizontal-leg-press-calf-press', 'male', 70, 90, 'one_rm_kg', { beginner: 84, novice: 136, intermediate: 204, advanced: 286, elite: 377 }),
  ...bracket('horizontal-leg-press-calf-press', 'male', 90, 999, 'one_rm_kg', { beginner: 115, novice: 175, intermediate: 252, advanced: 342, elite: 441 }),
  ...bracket('horizontal-leg-press-calf-press', 'female', 0, 55, 'one_rm_kg', { beginner: 31, novice: 64, intermediate: 111, advanced: 170, elite: 240 }),
  ...bracket('horizontal-leg-press-calf-press', 'female', 55, 999, 'one_rm_kg', { beginner: 46, novice: 85, intermediate: 139, advanced: 205, elite: 281 }),

  // incline-dumbbell-fly-with-twist
  ...bracket('incline-dumbbell-fly-with-twist', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 39 }),
  ...bracket('incline-dumbbell-fly-with-twist', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 26, advanced: 37, elite: 49 }),
  ...bracket('incline-dumbbell-fly-with-twist', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 22, intermediate: 32, advanced: 43, elite: 56 }),
  ...bracket('incline-dumbbell-fly-with-twist', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('incline-dumbbell-fly-with-twist', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 14, advanced: 20, elite: 27 }),

  // incline-machine-chest-press
  ...bracket('incline-machine-chest-press', 'male', 0, 70, 'one_rm_kg', { beginner: 29, novice: 47, intermediate: 68, advanced: 93, elite: 119 }),
  ...bracket('incline-machine-chest-press', 'male', 70, 90, 'one_rm_kg', { beginner: 45, novice: 63, intermediate: 87, advanced: 116, elite: 146 }),
  ...bracket('incline-machine-chest-press', 'male', 90, 999, 'one_rm_kg', { beginner: 56, novice: 76, intermediate: 105, advanced: 135, elite: 167 }),
  ...bracket('incline-machine-chest-press', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 33, advanced: 46, elite: 65 }),
  ...bracket('incline-machine-chest-press', 'female', 55, 999, 'one_rm_kg', { beginner: 14, novice: 23, intermediate: 38, advanced: 55, elite: 73 }),

  // incline-push-up
  ...bracket('incline-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 31, advanced: 56, elite: 83 }),
  ...bracket('incline-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 52, elite: 76 }),
  ...bracket('incline-push-up', 'male', 90, 999, 'reps', { beginner: 2, novice: 14, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('incline-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 16, advanced: 32, elite: 49 }),
  ...bracket('incline-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 31, elite: 45 }),

  // incline-push-up-depth-jump
  ...bracket('incline-push-up-depth-jump', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 31, advanced: 56, elite: 83 }),
  ...bracket('incline-push-up-depth-jump', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 52, elite: 76 }),
  ...bracket('incline-push-up-depth-jump', 'male', 90, 999, 'reps', { beginner: 2, novice: 14, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('incline-push-up-depth-jump', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 16, advanced: 32, elite: 49 }),
  ...bracket('incline-push-up-depth-jump', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 31, elite: 45 }),

  // inverted-row
  ...bracket('inverted-row', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 50 }),
  ...bracket('inverted-row', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 19, advanced: 32, elite: 46 }),
  ...bracket('inverted-row', 'male', 90, 999, 'reps', { beginner: 1, novice: 9, intermediate: 18, advanced: 30, elite: 42 }),
  ...bracket('inverted-row', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 12, advanced: 21, elite: 31 }),
  ...bracket('inverted-row', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),

  // jm-press
  ...bracket('jm-press', 'male', 0, 70, 'one_rm_kg', { beginner: 20, novice: 33, intermediate: 50, advanced: 71, elite: 94 }),
  ...bracket('jm-press', 'male', 70, 90, 'one_rm_kg', { beginner: 32, novice: 49, intermediate: 69, advanced: 93, elite: 120 }),
  ...bracket('jm-press', 'male', 90, 999, 'one_rm_kg', { beginner: 44, novice: 63, intermediate: 86, advanced: 113, elite: 142 }),
  ...bracket('jm-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 23, advanced: 39, elite: 58 }),
  ...bracket('jm-press', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 39, advanced: 58, elite: 81 }),

  // jump-squats
  ...bracket('jump-squats', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('jump-squats', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('jump-squats', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('jump-squats', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('jump-squats', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // jumping-jack
  ...bracket('jumping-jack', 'male', 0, 70, 'reps', { beginner: 0, novice: 27, intermediate: 69, advanced: 123, elite: 186 }),
  ...bracket('jumping-jack', 'male', 70, 90, 'reps', { beginner: 0, novice: 19, intermediate: 53, advanced: 96, elite: 144 }),
  ...bracket('jumping-jack', 'male', 90, 999, 'reps', { beginner: 0, novice: 14, intermediate: 42, advanced: 78, elite: 118 }),
  ...bracket('jumping-jack', 'female', 0, 55, 'reps', { beginner: 0, novice: 22, intermediate: 64, advanced: 119, elite: 184 }),
  ...bracket('jumping-jack', 'female', 55, 999, 'reps', { beginner: 0, novice: 9, intermediate: 40, advanced: 80, elite: 127 }),

  // kettlebell-alternating-curtsy-lunge
  ...bracket('kettlebell-alternating-curtsy-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 11, intermediate: 22, advanced: 40, elite: 60 }),
  ...bracket('kettlebell-alternating-curtsy-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 6, novice: 14, intermediate: 28, advanced: 46, elite: 68 }),
  ...bracket('kettlebell-alternating-curtsy-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 18, intermediate: 32, advanced: 51, elite: 75 }),
  ...bracket('kettlebell-alternating-curtsy-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('kettlebell-alternating-curtsy-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 38 }),

  // kettlebell-assisted-bulgarian-split-squat
  ...bracket('kettlebell-assisted-bulgarian-split-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 35, advanced: 53, elite: 73 }),
  ...bracket('kettlebell-assisted-bulgarian-split-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 18, novice: 31, intermediate: 46, advanced: 66, elite: 88 }),
  ...bracket('kettlebell-assisted-bulgarian-split-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 39, intermediate: 56, advanced: 78, elite: 101 }),
  ...bracket('kettlebell-assisted-bulgarian-split-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 25, advanced: 39, elite: 53 }),
  ...bracket('kettlebell-assisted-bulgarian-split-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 31, advanced: 45, elite: 60 }),

  // kettlebell-bench-press
  ...bracket('kettlebell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 20, intermediate: 30, advanced: 42, elite: 55 }),
  ...bracket('kettlebell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 28, intermediate: 40, advanced: 53, elite: 68 }),
  ...bracket('kettlebell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 36, intermediate: 48, advanced: 63, elite: 79 }),
  ...bracket('kettlebell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('kettlebell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 21, advanced: 30, elite: 41 }),

  // kettlebell-calf-raise
  ...bracket('kettlebell-calf-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 20, novice: 41, intermediate: 73, advanced: 112, elite: 158 }),
  ...bracket('kettlebell-calf-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 31, novice: 57, intermediate: 93, advanced: 138, elite: 188 }),
  ...bracket('kettlebell-calf-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 42, novice: 71, intermediate: 111, advanced: 159, elite: 213 }),
  ...bracket('kettlebell-calf-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 29, intermediate: 56, advanced: 93, elite: 137 }),
  ...bracket('kettlebell-calf-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 38, intermediate: 69, advanced: 109, elite: 156 }),

  // kettlebell-curl
  ...bracket('kettlebell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 26, elite: 36 }),
  ...bracket('kettlebell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 42 }),
  ...bracket('kettlebell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 26, advanced: 36, elite: 48 }),
  ...bracket('kettlebell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 16, elite: 22 }),
  ...bracket('kettlebell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 19, elite: 26 }),

  // kettlebell-front-raise
  ...bracket('kettlebell-front-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 22, elite: 32 }),
  ...bracket('kettlebell-front-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('kettlebell-front-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 31, elite: 44 }),
  ...bracket('kettlebell-front-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 8, advanced: 13, elite: 18 }),
  ...bracket('kettlebell-front-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),

  // kettlebell-goblet-curl
  ...bracket('kettlebell-goblet-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 26, elite: 36 }),
  ...bracket('kettlebell-goblet-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 32, elite: 42 }),
  ...bracket('kettlebell-goblet-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 26, advanced: 36, elite: 48 }),
  ...bracket('kettlebell-goblet-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 16, elite: 22 }),
  ...bracket('kettlebell-goblet-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 19, elite: 26 }),

  // kettlebell-goblet-squat
  ...bracket('kettlebell-goblet-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 34, advanced: 51, elite: 70 }),
  ...bracket('kettlebell-goblet-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 26, intermediate: 41, advanced: 59, elite: 80 }),
  ...bracket('kettlebell-goblet-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 31, intermediate: 47, advanced: 66, elite: 88 }),
  ...bracket('kettlebell-goblet-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 25, advanced: 36, elite: 48 }),
  ...bracket('kettlebell-goblet-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 18, intermediate: 27, advanced: 38, elite: 51 }),

  // kettlebell-gorilla-row
  ...bracket('kettlebell-gorilla-row', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),
  ...bracket('kettlebell-gorilla-row', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('kettlebell-gorilla-row', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('kettlebell-gorilla-row', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 27, elite: 36 }),
  ...bracket('kettlebell-gorilla-row', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 31, elite: 41 }),

  // kettlebell-halo
  ...bracket('kettlebell-halo', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('kettlebell-halo', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('kettlebell-halo', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('kettlebell-halo', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('kettlebell-halo', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // kettlebell-hip-thrust
  ...bracket('kettlebell-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 63, intermediate: 107, advanced: 163, elite: 227 }),
  ...bracket('kettlebell-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 149, advanced: 213, elite: 285 }),
  ...bracket('kettlebell-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 80, novice: 126, intermediate: 186, advanced: 257, elite: 335 }),
  ...bracket('kettlebell-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 30, novice: 56, intermediate: 92, advanced: 137, elite: 187 }),
  ...bracket('kettlebell-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 39, novice: 69, intermediate: 108, advanced: 155, elite: 209 }),

  // kettlebell-incline-bench-press
  ...bracket('kettlebell-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 21, intermediate: 29, advanced: 39, elite: 49 }),
  ...bracket('kettlebell-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 29, intermediate: 39, advanced: 50, elite: 62 }),
  ...bracket('kettlebell-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 28, novice: 37, intermediate: 48, advanced: 60, elite: 73 }),
  ...bracket('kettlebell-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 23, elite: 31 }),
  ...bracket('kettlebell-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 21, advanced: 29, elite: 38 }),

  // kettlebell-push-press
  ...bracket('kettlebell-push-press', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 32, elite: 43 }),
  ...bracket('kettlebell-push-press', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 22, intermediate: 31, advanced: 42, elite: 54 }),
  ...bracket('kettlebell-push-press', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 28, intermediate: 39, advanced: 50, elite: 63 }),
  ...bracket('kettlebell-push-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 18, elite: 25 }),
  ...bracket('kettlebell-push-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 16, advanced: 22, elite: 29 }),

  // kettlebell-renegade-rows
  ...bracket('kettlebell-renegade-rows', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('kettlebell-renegade-rows', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('kettlebell-renegade-rows', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('kettlebell-renegade-rows', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('kettlebell-renegade-rows', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // kettlebell-romanian-deadlift
  ...bracket('kettlebell-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 40, advanced: 66, elite: 97 }),
  ...bracket('kettlebell-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 33, intermediate: 57, advanced: 88, elite: 124 }),
  ...bracket('kettlebell-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 45, intermediate: 73, advanced: 107, elite: 146 }),
  ...bracket('kettlebell-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 31, advanced: 47, elite: 65 }),
  ...bracket('kettlebell-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 54, elite: 74 }),

  // kettlebell-row
  ...bracket('kettlebell-row', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),
  ...bracket('kettlebell-row', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('kettlebell-row', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('kettlebell-row', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 27, elite: 36 }),
  ...bracket('kettlebell-row', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 31, elite: 41 }),

  // kettlebell-row-single
  ...bracket('kettlebell-row-single', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),
  ...bracket('kettlebell-row-single', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('kettlebell-row-single', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('kettlebell-row-single', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 27, elite: 36 }),
  ...bracket('kettlebell-row-single', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 31, elite: 41 }),

  // kettlebell-seated-overhead-press
  ...bracket('kettlebell-seated-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 17, intermediate: 25, advanced: 34, elite: 43 }),
  ...bracket('kettlebell-seated-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 18, novice: 25, intermediate: 34, advanced: 44, elite: 54 }),
  ...bracket('kettlebell-seated-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 24, novice: 32, intermediate: 41, advanced: 52, elite: 64 }),
  ...bracket('kettlebell-seated-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 14, advanced: 19, elite: 25 }),
  ...bracket('kettlebell-seated-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 13, intermediate: 18, advanced: 24, elite: 30 }),

  // kettlebell-shrug
  ...bracket('kettlebell-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 33, advanced: 50, elite: 69 }),
  ...bracket('kettlebell-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 44, advanced: 63, elite: 84 }),
  ...bracket('kettlebell-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 23, novice: 36, intermediate: 54, advanced: 74, elite: 97 }),
  ...bracket('kettlebell-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 21, advanced: 33, elite: 47 }),
  ...bracket('kettlebell-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 55 }),

  // kettlebell-single-arm-row
  ...bracket('kettlebell-single-arm-row', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 32, advanced: 46, elite: 61 }),
  ...bracket('kettlebell-single-arm-row', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 30, intermediate: 43, advanced: 59, elite: 76 }),
  ...bracket('kettlebell-single-arm-row', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 53, advanced: 70, elite: 89 }),
  ...bracket('kettlebell-single-arm-row', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 12, intermediate: 19, advanced: 27, elite: 36 }),
  ...bracket('kettlebell-single-arm-row', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 31, elite: 41 }),

  // kettlebell-spinal-jefferson-curl
  ...bracket('kettlebell-spinal-jefferson-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('kettlebell-spinal-jefferson-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('kettlebell-spinal-jefferson-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('kettlebell-spinal-jefferson-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('kettlebell-spinal-jefferson-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // kettlebell-sumo-deadlift
  ...bracket('kettlebell-sumo-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 72, novice: 100, intermediate: 134, advanced: 174, elite: 216 }),
  ...bracket('kettlebell-sumo-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 102, novice: 135, intermediate: 174, advanced: 218, elite: 265 }),
  ...bracket('kettlebell-sumo-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 128, novice: 165, intermediate: 208, advanced: 256, elite: 307 }),
  ...bracket('kettlebell-sumo-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 43, novice: 62, intermediate: 87, advanced: 115, elite: 146 }),
  ...bracket('kettlebell-sumo-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 51, novice: 73, intermediate: 99, advanced: 129, elite: 161 }),

  // kettlebell-swing
  ...bracket('kettlebell-swing', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('kettlebell-swing', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('kettlebell-swing', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('kettlebell-swing', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('kettlebell-swing', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // kettlebell-thruster
  ...bracket('kettlebell-thruster', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('kettlebell-thruster', 'male', 70, 90, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 34, advanced: 50, elite: 67 }),
  ...bracket('kettlebell-thruster', 'male', 90, 999, 'one_rm_kg', { beginner: 17, novice: 26, intermediate: 41, advanced: 56, elite: 76 }),
  ...bracket('kettlebell-thruster', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 14, intermediate: 22, advanced: 28, elite: 36 }),
  ...bracket('kettlebell-thruster', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 23, advanced: 31, elite: 40 }),

  // kettlebell-turkish-get-up
  ...bracket('kettlebell-turkish-get-up', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('kettlebell-turkish-get-up', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('kettlebell-turkish-get-up', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('kettlebell-turkish-get-up', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('kettlebell-turkish-get-up', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // kettlebell-walking-lunges
  ...bracket('kettlebell-walking-lunges', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 23, advanced: 37, elite: 52 }),
  ...bracket('kettlebell-walking-lunges', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 45, elite: 62 }),
  ...bracket('kettlebell-walking-lunges', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 36, advanced: 52, elite: 70 }),
  ...bracket('kettlebell-walking-lunges', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 26, elite: 37 }),
  ...bracket('kettlebell-walking-lunges', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),

  // kettlebell-windmill
  ...bracket('kettlebell-windmill', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('kettlebell-windmill', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('kettlebell-windmill', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('kettlebell-windmill', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('kettlebell-windmill', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // kickstand-dumbbell-romanian-deadlift
  ...bracket('kickstand-dumbbell-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 40, advanced: 66, elite: 97 }),
  ...bracket('kickstand-dumbbell-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 33, intermediate: 57, advanced: 88, elite: 124 }),
  ...bracket('kickstand-dumbbell-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 45, intermediate: 73, advanced: 107, elite: 146 }),
  ...bracket('kickstand-dumbbell-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 31, advanced: 47, elite: 65 }),
  ...bracket('kickstand-dumbbell-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 54, elite: 74 }),

  // kneeling-cable-crunch
  ...bracket('kneeling-cable-crunch', 'male', 0, 70, 'one_rm_kg', { beginner: 19, novice: 34, intermediate: 56, advanced: 83, elite: 113 }),
  ...bracket('kneeling-cable-crunch', 'male', 70, 90, 'one_rm_kg', { beginner: 26, novice: 44, intermediate: 68, advanced: 97, elite: 130 }),
  ...bracket('kneeling-cable-crunch', 'male', 90, 999, 'one_rm_kg', { beginner: 32, novice: 51, intermediate: 77, advanced: 108, elite: 143 }),
  ...bracket('kneeling-cable-crunch', 'female', 0, 55, 'one_rm_kg', { beginner: 13, novice: 25, intermediate: 43, advanced: 64, elite: 89 }),
  ...bracket('kneeling-cable-crunch', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 31, intermediate: 50, advanced: 74, elite: 101 }),

  // landmine-press
  ...bracket('landmine-press', 'male', 0, 70, 'one_rm_kg', { beginner: 13, novice: 26, intermediate: 44, advanced: 67, elite: 94 }),
  ...bracket('landmine-press', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 35, intermediate: 56, advanced: 82, elite: 112 }),
  ...bracket('landmine-press', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 44, intermediate: 67, advanced: 95, elite: 126 }),
  ...bracket('landmine-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 25, advanced: 38, elite: 54 }),
  ...bracket('landmine-press', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 30, advanced: 44, elite: 61 }),

  // landmine-t-bar-rows
  ...bracket('landmine-t-bar-rows', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 60, advanced: 85, elite: 114 }),
  ...bracket('landmine-t-bar-rows', 'male', 70, 90, 'one_rm_kg', { beginner: 38, novice: 58, intermediate: 82, advanced: 111, elite: 143 }),
  ...bracket('landmine-t-bar-rows', 'male', 90, 999, 'one_rm_kg', { beginner: 52, novice: 74, intermediate: 102, advanced: 134, elite: 169 }),
  ...bracket('landmine-t-bar-rows', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 37, advanced: 56, elite: 77 }),
  ...bracket('landmine-t-bar-rows', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 30, intermediate: 46, advanced: 67, elite: 89 }),

  // lat-pulldown
  ...bracket('lat-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 35, novice: 50, intermediate: 69, advanced: 90, elite: 113 }),
  ...bracket('lat-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 64, intermediate: 85, advanced: 108, elite: 133 }),
  ...bracket('lat-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 57, novice: 76, intermediate: 98, advanced: 123, elite: 150 }),
  ...bracket('lat-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 42, advanced: 56, elite: 72 }),
  ...bracket('lat-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 36, intermediate: 49, advanced: 64, elite: 81 }),

  // lateral-raise-to-front-raise
  ...bracket('lateral-raise-to-front-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 13, advanced: 20, elite: 29 }),
  ...bracket('lateral-raise-to-front-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('lateral-raise-to-front-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 39 }),
  ...bracket('lateral-raise-to-front-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 12, elite: 16 }),
  ...bracket('lateral-raise-to-front-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 18 }),

  // leaning-cable-lateral-raise
  ...bracket('leaning-cable-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 13, advanced: 22, elite: 34 }),
  ...bracket('leaning-cable-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 8, intermediate: 16, advanced: 27, elite: 39 }),
  ...bracket('leaning-cable-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 19, advanced: 30, elite: 44 }),
  ...bracket('leaning-cable-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 9, advanced: 16, elite: 23 }),
  ...bracket('leaning-cable-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),

  // leaning-single-arm-dumbbell-lateral-raise
  ...bracket('leaning-single-arm-dumbbell-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 8, advanced: 14, elite: 21 }),
  ...bracket('leaning-single-arm-dumbbell-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 11, advanced: 18, elite: 25 }),
  ...bracket('leaning-single-arm-dumbbell-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 14, advanced: 21, elite: 30 }),
  ...bracket('leaning-single-arm-dumbbell-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 6, advanced: 9, elite: 12 }),
  ...bracket('leaning-single-arm-dumbbell-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 7, advanced: 11, elite: 14 }),

  // leg-press-calf-raise
  ...bracket('leg-press-calf-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 51, novice: 93, intermediate: 150, advanced: 222, elite: 303 }),
  ...bracket('leg-press-calf-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 84, novice: 136, intermediate: 204, advanced: 286, elite: 377 }),
  ...bracket('leg-press-calf-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 115, novice: 175, intermediate: 252, advanced: 342, elite: 441 }),
  ...bracket('leg-press-calf-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 31, novice: 64, intermediate: 111, advanced: 170, elite: 240 }),
  ...bracket('leg-press-calf-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 46, novice: 85, intermediate: 139, advanced: 205, elite: 281 }),

  // lever-lateral-wide-pulldown
  ...bracket('lever-lateral-wide-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 28, novice: 42, intermediate: 62, advanced: 84, elite: 107 }),
  ...bracket('lever-lateral-wide-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 40, novice: 57, intermediate: 78, advanced: 102, elite: 128 }),
  ...bracket('lever-lateral-wide-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 50, novice: 69, intermediate: 91, advanced: 117, elite: 145 }),
  ...bracket('lever-lateral-wide-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 41, advanced: 55, elite: 69 }),
  ...bracket('lever-lateral-wide-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 35, intermediate: 46, advanced: 61, elite: 77 }),

  // loaded-wrist-extensor-eccentric
  ...bracket('loaded-wrist-extensor-eccentric', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('loaded-wrist-extensor-eccentric', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('loaded-wrist-extensor-eccentric', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('loaded-wrist-extensor-eccentric', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('loaded-wrist-extensor-eccentric', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // loaded-wrist-flexor-eccentric
  ...bracket('loaded-wrist-flexor-eccentric', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 21, advanced: 34, elite: 50 }),
  ...bracket('loaded-wrist-flexor-eccentric', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 27, advanced: 41, elite: 58 }),
  ...bracket('loaded-wrist-flexor-eccentric', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 19, intermediate: 32, advanced: 47, elite: 65 }),
  ...bracket('loaded-wrist-flexor-eccentric', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 23, elite: 34 }),
  ...bracket('loaded-wrist-flexor-eccentric', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 8, intermediate: 16, advanced: 26, elite: 37 }),

  // lunge-walking
  ...bracket('lunge-walking', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 20, intermediate: 40, advanced: 67, elite: 98 }),
  ...bracket('lunge-walking', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 31, intermediate: 54, advanced: 85, elite: 120 }),
  ...bracket('lunge-walking', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 40, intermediate: 67, advanced: 101, elite: 139 }),
  ...bracket('lunge-walking', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 18, intermediate: 32, advanced: 49, elite: 70 }),
  ...bracket('lunge-walking', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 20, intermediate: 34, advanced: 52, elite: 73 }),

  // lying-cambered-barbell-row
  ...bracket('lying-cambered-barbell-row', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 46, intermediate: 65, advanced: 87, elite: 111 }),
  ...bracket('lying-cambered-barbell-row', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 66, intermediate: 88, advanced: 114, elite: 141 }),
  ...bracket('lying-cambered-barbell-row', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 84, intermediate: 108, advanced: 136, elite: 166 }),
  ...bracket('lying-cambered-barbell-row', 'female', 0, 55, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 72 }),
  ...bracket('lying-cambered-barbell-row', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 46, advanced: 64, elite: 83 }),

  // lying-leg-curl
  ...bracket('lying-leg-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 21, novice: 34, intermediate: 52, advanced: 73, elite: 96 }),
  ...bracket('lying-leg-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 30, novice: 46, intermediate: 66, advanced: 90, elite: 116 }),
  ...bracket('lying-leg-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 57, intermediate: 79, advanced: 105, elite: 133 }),
  ...bracket('lying-leg-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 13, novice: 21, intermediate: 32, advanced: 46, elite: 62 }),
  ...bracket('lying-leg-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 27, intermediate: 40, advanced: 55, elite: 71 }),

  // lying-single-arm-lateral-raise
  ...bracket('lying-single-arm-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 8, advanced: 14, elite: 21 }),
  ...bracket('lying-single-arm-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 11, advanced: 18, elite: 25 }),
  ...bracket('lying-single-arm-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 14, advanced: 21, elite: 30 }),
  ...bracket('lying-single-arm-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 6, advanced: 9, elite: 12 }),
  ...bracket('lying-single-arm-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 7, advanced: 11, elite: 14 }),

  // machine-45-degree-back-extension
  ...bracket('machine-45-degree-back-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 56, intermediate: 88, advanced: 127, elite: 171 }),
  ...bracket('machine-45-degree-back-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 45, novice: 72, intermediate: 107, advanced: 150, elite: 197 }),
  ...bracket('machine-45-degree-back-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 55, novice: 85, intermediate: 124, advanced: 169, elite: 219 }),
  ...bracket('machine-45-degree-back-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 23, novice: 39, intermediate: 61, advanced: 88, elite: 119 }),
  ...bracket('machine-45-degree-back-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 47, intermediate: 71, advanced: 100, elite: 132 }),

  // machine-assisted-pull-up
  ...bracket('machine-assisted-pull-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 14, advanced: 23, elite: 33 }),
  ...bracket('machine-assisted-pull-up', 'male', 70, 90, 'reps', { beginner: 1, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),
  ...bracket('machine-assisted-pull-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 6, intermediate: 11, advanced: 18, elite: 25 }),
  ...bracket('machine-assisted-pull-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 0, intermediate: 6, advanced: 13, elite: 22 }),
  ...bracket('machine-assisted-pull-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 0, intermediate: 5, advanced: 11, elite: 18 }),

  // machine-back-extension
  ...bracket('machine-back-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 56, intermediate: 88, advanced: 127, elite: 171 }),
  ...bracket('machine-back-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 45, novice: 72, intermediate: 107, advanced: 150, elite: 197 }),
  ...bracket('machine-back-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 55, novice: 85, intermediate: 124, advanced: 169, elite: 219 }),
  ...bracket('machine-back-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 23, novice: 39, intermediate: 61, advanced: 88, elite: 119 }),
  ...bracket('machine-back-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 47, intermediate: 71, advanced: 100, elite: 132 }),

  // machine-cable-v-bar-push-downs
  ...bracket('machine-cable-v-bar-push-downs', 'male', 0, 70, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 89 }),
  ...bracket('machine-cable-v-bar-push-downs', 'male', 70, 90, 'one_rm_kg', { beginner: 22, novice: 36, intermediate: 56, advanced: 80, elite: 107 }),
  ...bracket('machine-cable-v-bar-push-downs', 'male', 90, 999, 'one_rm_kg', { beginner: 29, novice: 46, intermediate: 67, advanced: 93, elite: 122 }),
  ...bracket('machine-cable-v-bar-push-downs', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 24, advanced: 38, elite: 53 }),
  ...bracket('machine-cable-v-bar-push-downs', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 31, advanced: 46, elite: 63 }),

  // machine-chest-press
  ...bracket('machine-chest-press', 'male', 0, 70, 'one_rm_kg', { beginner: 27, novice: 45, intermediate: 70, advanced: 100, elite: 134 }),
  ...bracket('machine-chest-press', 'male', 70, 90, 'one_rm_kg', { beginner: 39, novice: 61, intermediate: 89, advanced: 123, elite: 160 }),
  ...bracket('machine-chest-press', 'male', 90, 999, 'one_rm_kg', { beginner: 50, novice: 74, intermediate: 105, advanced: 142, elite: 181 }),
  ...bracket('machine-chest-press', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 33, advanced: 50, elite: 71 }),
  ...bracket('machine-chest-press', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 38, advanced: 57, elite: 79 }),

  // machine-crunch
  ...bracket('machine-crunch', 'male', 0, 70, 'one_rm_kg', { beginner: 19, novice: 34, intermediate: 56, advanced: 83, elite: 113 }),
  ...bracket('machine-crunch', 'male', 70, 90, 'one_rm_kg', { beginner: 26, novice: 44, intermediate: 68, advanced: 97, elite: 130 }),
  ...bracket('machine-crunch', 'male', 90, 999, 'one_rm_kg', { beginner: 32, novice: 51, intermediate: 77, advanced: 108, elite: 143 }),
  ...bracket('machine-crunch', 'female', 0, 55, 'one_rm_kg', { beginner: 13, novice: 25, intermediate: 43, advanced: 64, elite: 89 }),
  ...bracket('machine-crunch', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 31, intermediate: 50, advanced: 74, elite: 101 }),

  // machine-dips
  ...bracket('machine-dips', 'male', 0, 70, 'one_rm_kg', { beginner: 41, novice: 63, intermediate: 90, advanced: 123, elite: 159 }),
  ...bracket('machine-dips', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 81, intermediate: 112, advanced: 149, elite: 188 }),
  ...bracket('machine-dips', 'male', 90, 999, 'one_rm_kg', { beginner: 70, novice: 97, intermediate: 131, advanced: 170, elite: 212 }),
  ...bracket('machine-dips', 'female', 0, 55, 'one_rm_kg', { beginner: 23, novice: 36, intermediate: 54, advanced: 75, elite: 99 }),
  ...bracket('machine-dips', 'female', 55, 999, 'one_rm_kg', { beginner: 27, novice: 42, intermediate: 61, advanced: 83, elite: 108 }),

  // machine-face-pulls
  ...bracket('machine-face-pulls', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 21, intermediate: 37, advanced: 57, elite: 80 }),
  ...bracket('machine-face-pulls', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 47, advanced: 69, elite: 95 }),
  ...bracket('machine-face-pulls', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 55, advanced: 80, elite: 107 }),
  ...bracket('machine-face-pulls', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 17, intermediate: 28, advanced: 43, elite: 60 }),
  ...bracket('machine-face-pulls', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 22, intermediate: 35, advanced: 51, elite: 69 }),

  // machine-front-military-press
  ...bracket('machine-front-military-press', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 33, intermediate: 46, advanced: 61, elite: 77 }),
  ...bracket('machine-front-military-press', 'male', 70, 90, 'one_rm_kg', { beginner: 35, novice: 47, intermediate: 63, advanced: 80, elite: 98 }),
  ...bracket('machine-front-military-press', 'male', 90, 999, 'one_rm_kg', { beginner: 46, novice: 61, intermediate: 78, advanced: 97, elite: 117 }),
  ...bracket('machine-front-military-press', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 19, intermediate: 27, advanced: 38, elite: 49 }),
  ...bracket('machine-front-military-press', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 25, intermediate: 35, advanced: 46, elite: 59 }),

  // machine-goblet-sissy-squat
  ...bracket('machine-goblet-sissy-squat', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 22, advanced: 40, elite: 61 }),
  ...bracket('machine-goblet-sissy-squat', 'male', 70, 90, 'reps', { beginner: 0, novice: 8, intermediate: 21, advanced: 37, elite: 54 }),
  ...bracket('machine-goblet-sissy-squat', 'male', 90, 999, 'reps', { beginner: 0, novice: 8, intermediate: 19, advanced: 33, elite: 48 }),
  ...bracket('machine-goblet-sissy-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 15, advanced: 29, elite: 44 }),
  ...bracket('machine-goblet-sissy-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 6, intermediate: 16, advanced: 28, elite: 40 }),

  // machine-hack-squat
  ...bracket('machine-hack-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 41, novice: 73, intermediate: 117, advanced: 171, elite: 231 }),
  ...bracket('machine-hack-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 63, novice: 102, intermediate: 152, advanced: 213, elite: 280 }),
  ...bracket('machine-hack-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 84, novice: 127, intermediate: 183, advanced: 249, elite: 321 }),
  ...bracket('machine-hack-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 43, intermediate: 78, advanced: 124, elite: 176 }),
  ...bracket('machine-hack-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 28, novice: 56, intermediate: 95, advanced: 145, elite: 202 }),

  // machine-hip-abduction
  ...bracket('machine-hip-abduction', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 55, intermediate: 87, advanced: 126, elite: 171 }),
  ...bracket('machine-hip-abduction', 'male', 70, 90, 'one_rm_kg', { beginner: 41, novice: 67, intermediate: 102, advanced: 145, elite: 192 }),
  ...bracket('machine-hip-abduction', 'male', 90, 999, 'one_rm_kg', { beginner: 49, novice: 78, intermediate: 115, advanced: 159, elite: 209 }),
  ...bracket('machine-hip-abduction', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 36, intermediate: 59, advanced: 87, elite: 120 }),
  ...bracket('machine-hip-abduction', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 43, intermediate: 68, advanced: 99, elite: 134 }),

  // machine-hip-adduction
  ...bracket('machine-hip-adduction', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 55, intermediate: 87, advanced: 126, elite: 171 }),
  ...bracket('machine-hip-adduction', 'male', 70, 90, 'one_rm_kg', { beginner: 41, novice: 67, intermediate: 102, advanced: 145, elite: 192 }),
  ...bracket('machine-hip-adduction', 'male', 90, 999, 'one_rm_kg', { beginner: 49, novice: 78, intermediate: 115, advanced: 159, elite: 209 }),
  ...bracket('machine-hip-adduction', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 36, intermediate: 59, advanced: 87, elite: 120 }),
  ...bracket('machine-hip-adduction', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 43, intermediate: 68, advanced: 99, elite: 134 }),

  // machine-hip-thrust
  ...bracket('machine-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 63, intermediate: 107, advanced: 163, elite: 227 }),
  ...bracket('machine-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 149, advanced: 213, elite: 285 }),
  ...bracket('machine-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 80, novice: 126, intermediate: 186, advanced: 257, elite: 335 }),
  ...bracket('machine-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 30, novice: 56, intermediate: 92, advanced: 137, elite: 187 }),
  ...bracket('machine-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 39, novice: 69, intermediate: 108, advanced: 155, elite: 209 }),

  // machine-horizontal-leg-press
  ...bracket('machine-horizontal-leg-press', 'male', 0, 70, 'one_rm_kg', { beginner: 53, novice: 90, intermediate: 139, advanced: 199, elite: 265 }),
  ...bracket('machine-horizontal-leg-press', 'male', 70, 90, 'one_rm_kg', { beginner: 76, novice: 119, intermediate: 175, advanced: 241, elite: 314 }),
  ...bracket('machine-horizontal-leg-press', 'male', 90, 999, 'one_rm_kg', { beginner: 97, novice: 145, intermediate: 206, advanced: 277, elite: 355 }),
  ...bracket('machine-horizontal-leg-press', 'female', 0, 55, 'one_rm_kg', { beginner: 34, novice: 61, intermediate: 98, advanced: 144, elite: 196 }),
  ...bracket('machine-horizontal-leg-press', 'female', 55, 999, 'one_rm_kg', { beginner: 44, novice: 75, intermediate: 115, advanced: 165, elite: 220 }),

  // machine-lat-pullover
  ...bracket('machine-lat-pullover', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 35, advanced: 57, elite: 81 }),
  ...bracket('machine-lat-pullover', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 48, advanced: 72, elite: 100 }),
  ...bracket('machine-lat-pullover', 'male', 90, 999, 'one_rm_kg', { beginner: 22, novice: 38, intermediate: 59, advanced: 86, elite: 116 }),
  ...bracket('machine-lat-pullover', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 20, advanced: 33, elite: 47 }),
  ...bracket('machine-lat-pullover', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 25, advanced: 39, elite: 54 }),

  // machine-lateral-raise
  ...bracket('machine-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 15, novice: 27, intermediate: 44, advanced: 65, elite: 88 }),
  ...bracket('machine-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 25, novice: 41, intermediate: 61, advanced: 84, elite: 111 }),
  ...bracket('machine-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 35, novice: 53, intermediate: 75, advanced: 101, elite: 130 }),
  ...bracket('machine-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('machine-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 29, advanced: 42, elite: 58 }),

  // machine-leg-extension
  ...bracket('machine-leg-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 57, intermediate: 85, advanced: 119, elite: 156 }),
  ...bracket('machine-leg-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 72, intermediate: 103, advanced: 140, elite: 180 }),
  ...bracket('machine-leg-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 58, novice: 85, intermediate: 119, advanced: 158, elite: 201 }),
  ...bracket('machine-leg-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 34, intermediate: 55, advanced: 80, elite: 109 }),
  ...bracket('machine-leg-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 41, intermediate: 64, advanced: 91, elite: 121 }),

  // machine-leg-press
  ...bracket('machine-leg-press', 'male', 0, 70, 'one_rm_kg', { beginner: 71, novice: 115, intermediate: 173, advanced: 242, elite: 319 }),
  ...bracket('machine-leg-press', 'male', 70, 90, 'one_rm_kg', { beginner: 109, novice: 162, intermediate: 230, advanced: 309, elite: 395 }),
  ...bracket('machine-leg-press', 'male', 90, 999, 'one_rm_kg', { beginner: 144, novice: 205, intermediate: 280, advanced: 366, elite: 460 }),
  ...bracket('machine-leg-press', 'female', 0, 55, 'one_rm_kg', { beginner: 39, novice: 73, intermediate: 122, advanced: 183, elite: 252 }),
  ...bracket('machine-leg-press', 'female', 55, 999, 'one_rm_kg', { beginner: 58, novice: 100, intermediate: 155, advanced: 223, elite: 299 }),

  // machine-neutral-row
  ...bracket('machine-neutral-row', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 49, intermediate: 68, advanced: 90, elite: 115 }),
  ...bracket('machine-neutral-row', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 65, intermediate: 87, advanced: 112, elite: 140 }),
  ...bracket('machine-neutral-row', 'male', 90, 999, 'one_rm_kg', { beginner: 59, novice: 79, intermediate: 104, advanced: 131, elite: 160 }),
  ...bracket('machine-neutral-row', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 41, advanced: 56, elite: 73 }),
  ...bracket('machine-neutral-row', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 35, intermediate: 50, advanced: 66, elite: 85 }),

  // machine-pec-fly
  ...bracket('machine-pec-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 26, advanced: 46, elite: 69 }),
  ...bracket('machine-pec-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 8, novice: 19, intermediate: 36, advanced: 58, elite: 84 }),
  ...bracket('machine-pec-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 13, novice: 26, intermediate: 45, advanced: 69, elite: 98 }),
  ...bracket('machine-pec-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 15, advanced: 26, elite: 39 }),
  ...bracket('machine-pec-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 19, advanced: 31, elite: 46 }),

  // machine-plate-loaded-leg-extension
  ...bracket('machine-plate-loaded-leg-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 57, intermediate: 85, advanced: 119, elite: 156 }),
  ...bracket('machine-plate-loaded-leg-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 72, intermediate: 103, advanced: 140, elite: 180 }),
  ...bracket('machine-plate-loaded-leg-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 58, novice: 85, intermediate: 119, advanced: 158, elite: 201 }),
  ...bracket('machine-plate-loaded-leg-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 34, intermediate: 55, advanced: 80, elite: 109 }),
  ...bracket('machine-plate-loaded-leg-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 41, intermediate: 64, advanced: 91, elite: 121 }),

  // machine-plate-loaded-t-bar-row
  ...bracket('machine-plate-loaded-t-bar-row', 'male', 0, 70, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 60, advanced: 85, elite: 114 }),
  ...bracket('machine-plate-loaded-t-bar-row', 'male', 70, 90, 'one_rm_kg', { beginner: 38, novice: 58, intermediate: 82, advanced: 111, elite: 143 }),
  ...bracket('machine-plate-loaded-t-bar-row', 'male', 90, 999, 'one_rm_kg', { beginner: 52, novice: 74, intermediate: 102, advanced: 134, elite: 169 }),
  ...bracket('machine-plate-loaded-t-bar-row', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 23, intermediate: 37, advanced: 56, elite: 77 }),
  ...bracket('machine-plate-loaded-t-bar-row', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 30, intermediate: 46, advanced: 67, elite: 89 }),

  // machine-preacher-curl
  ...bracket('machine-preacher-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 16, advanced: 24, elite: 32 }),
  ...bracket('machine-preacher-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 21, advanced: 30, elite: 39 }),
  ...bracket('machine-preacher-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 18, intermediate: 26, advanced: 35, elite: 44 }),
  ...bracket('machine-preacher-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),
  ...bracket('machine-preacher-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 18, elite: 24 }),

  // machine-pulldown
  ...bracket('machine-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 35, novice: 50, intermediate: 69, advanced: 90, elite: 113 }),
  ...bracket('machine-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 64, intermediate: 85, advanced: 108, elite: 133 }),
  ...bracket('machine-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 57, novice: 76, intermediate: 98, advanced: 123, elite: 150 }),
  ...bracket('machine-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 42, advanced: 56, elite: 72 }),
  ...bracket('machine-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 36, intermediate: 49, advanced: 64, elite: 81 }),

  // machine-seated-cable-row
  ...bracket('machine-seated-cable-row', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 49, intermediate: 68, advanced: 90, elite: 115 }),
  ...bracket('machine-seated-cable-row', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 65, intermediate: 87, advanced: 112, elite: 140 }),
  ...bracket('machine-seated-cable-row', 'male', 90, 999, 'one_rm_kg', { beginner: 59, novice: 79, intermediate: 104, advanced: 131, elite: 160 }),
  ...bracket('machine-seated-cable-row', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 41, advanced: 56, elite: 73 }),
  ...bracket('machine-seated-cable-row', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 35, intermediate: 50, advanced: 66, elite: 85 }),

  // machine-tricep-extension
  ...bracket('machine-tricep-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 39, intermediate: 60, advanced: 86, elite: 115 }),
  ...bracket('machine-tricep-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 31, novice: 50, intermediate: 73, advanced: 102, elite: 133 }),
  ...bracket('machine-tricep-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 39, novice: 59, intermediate: 85, advanced: 115, elite: 148 }),
  ...bracket('machine-tricep-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 35, advanced: 52, elite: 71 }),
  ...bracket('machine-tricep-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 16, novice: 27, intermediate: 42, advanced: 60, elite: 81 }),

  // machine-underhand-row
  ...bracket('machine-underhand-row', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 49, intermediate: 68, advanced: 90, elite: 115 }),
  ...bracket('machine-underhand-row', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 65, intermediate: 87, advanced: 112, elite: 140 }),
  ...bracket('machine-underhand-row', 'male', 90, 999, 'one_rm_kg', { beginner: 59, novice: 79, intermediate: 104, advanced: 131, elite: 160 }),
  ...bracket('machine-underhand-row', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 41, advanced: 56, elite: 73 }),
  ...bracket('machine-underhand-row', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 35, intermediate: 50, advanced: 66, elite: 85 }),

  // man-maker
  ...bracket('man-maker', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('man-maker', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('man-maker', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('man-maker', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('man-maker', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // meadows-row
  ...bracket('meadows-row', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 21, intermediate: 37, advanced: 58, elite: 83 }),
  ...bracket('meadows-row', 'male', 70, 90, 'one_rm_kg', { beginner: 20, novice: 35, intermediate: 55, advanced: 80, elite: 109 }),
  ...bracket('meadows-row', 'male', 90, 999, 'one_rm_kg', { beginner: 30, novice: 48, intermediate: 72, advanced: 100, elite: 131 }),
  ...bracket('meadows-row', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 19, intermediate: 28, advanced: 40, elite: 52 }),
  ...bracket('meadows-row', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 21, intermediate: 31, advanced: 43, elite: 56 }),

  // medicine-ball-throw
  ...bracket('medicine-ball-throw', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('medicine-ball-throw', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('medicine-ball-throw', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('medicine-ball-throw', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('medicine-ball-throw', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // mountain-climber
  ...bracket('mountain-climber', 'male', 0, 70, 'reps', { beginner: 0, novice: 27, intermediate: 69, advanced: 123, elite: 186 }),
  ...bracket('mountain-climber', 'male', 70, 90, 'reps', { beginner: 0, novice: 19, intermediate: 53, advanced: 96, elite: 144 }),
  ...bracket('mountain-climber', 'male', 90, 999, 'reps', { beginner: 0, novice: 14, intermediate: 42, advanced: 78, elite: 118 }),
  ...bracket('mountain-climber', 'female', 0, 55, 'reps', { beginner: 0, novice: 22, intermediate: 64, advanced: 119, elite: 184 }),
  ...bracket('mountain-climber', 'female', 55, 999, 'reps', { beginner: 0, novice: 9, intermediate: 40, advanced: 80, elite: 127 }),

  // muscle-up
  ...bracket('muscle-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 1, intermediate: 6, advanced: 11, elite: 17 }),
  ...bracket('muscle-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 2, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('muscle-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 2, intermediate: 7, advanced: 10, elite: 15 }),
  ...bracket('muscle-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 0, intermediate: 4, advanced: 9, elite: 14 }),
  ...bracket('muscle-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 0, intermediate: 5, advanced: 9, elite: 13 }),

  // narrow-pulldown
  ...bracket('narrow-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 43, novice: 59, intermediate: 77, advanced: 97, elite: 120 }),
  ...bracket('narrow-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 55, novice: 72, intermediate: 93, advanced: 114, elite: 138 }),
  ...bracket('narrow-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 66, novice: 84, intermediate: 106, advanced: 130, elite: 155 }),
  ...bracket('narrow-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 57, elite: 75 }),
  ...bracket('narrow-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 37, intermediate: 52, advanced: 68, elite: 85 }),

  // neck-curl
  ...bracket('neck-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 1, novice: 8, intermediate: 23, advanced: 46, elite: 75 }),
  ...bracket('neck-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 2, novice: 12, intermediate: 29, advanced: 55, elite: 87 }),
  ...bracket('neck-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 15, intermediate: 35, advanced: 63, elite: 97 }),
  ...bracket('neck-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 9, intermediate: 23, advanced: 43, elite: 69 }),
  ...bracket('neck-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 1, novice: 7, intermediate: 21, advanced: 40, elite: 66 }),

  // neck-extension
  ...bracket('neck-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 1, novice: 8, intermediate: 24, advanced: 47, elite: 77 }),
  ...bracket('neck-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 12, intermediate: 31, advanced: 57, elite: 90 }),
  ...bracket('neck-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 16, intermediate: 37, advanced: 65, elite: 100 }),
  ...bracket('neck-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 4, intermediate: 10, advanced: 18, elite: 28 }),
  ...bracket('neck-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 9, intermediate: 17, advanced: 27, elite: 39 }),

  // neutral-grip-dumbbell-bench-press
  ...bracket('neutral-grip-dumbbell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 24, advanced: 36, elite: 49 }),
  ...bracket('neutral-grip-dumbbell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 13, novice: 22, intermediate: 33, advanced: 46, elite: 61 }),
  ...bracket('neutral-grip-dumbbell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 41, advanced: 55, elite: 72 }),
  ...bracket('neutral-grip-dumbbell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 15, advanced: 22, elite: 29 }),
  ...bracket('neutral-grip-dumbbell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 13, intermediate: 19, advanced: 26, elite: 33 }),

  // neutral-grip-lat-pulldown
  ...bracket('neutral-grip-lat-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 41, novice: 57, intermediate: 75, advanced: 96, elite: 119 }),
  ...bracket('neutral-grip-lat-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 54, novice: 71, intermediate: 92, advanced: 115, elite: 139 }),
  ...bracket('neutral-grip-lat-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 65, novice: 84, intermediate: 106, advanced: 131, elite: 157 }),
  ...bracket('neutral-grip-lat-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 24, novice: 34, intermediate: 47, advanced: 61, elite: 77 }),
  ...bracket('neutral-grip-lat-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 40, intermediate: 54, advanced: 70, elite: 86 }),

  // neutral-grip-pull-up
  ...bracket('neutral-grip-pull-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 15, advanced: 24, elite: 33 }),
  ...bracket('neutral-grip-pull-up', 'male', 70, 90, 'reps', { beginner: 1, novice: 8, intermediate: 14, advanced: 22, elite: 30 }),
  ...bracket('neutral-grip-pull-up', 'male', 90, 999, 'reps', { beginner: 2, novice: 7, intermediate: 12, advanced: 19, elite: 26 }),
  ...bracket('neutral-grip-pull-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 1, intermediate: 7, advanced: 12, elite: 18 }),
  ...bracket('neutral-grip-pull-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 2, intermediate: 6, advanced: 10, elite: 15 }),

  // nordic-hamstring-curl
  ...bracket('nordic-hamstring-curl', 'male', 0, 70, 'reps', { beginner: 0, novice: 0, intermediate: 10, advanced: 21, elite: 33 }),
  ...bracket('nordic-hamstring-curl', 'male', 70, 90, 'reps', { beginner: 0, novice: 2, intermediate: 10, advanced: 19, elite: 30 }),
  ...bracket('nordic-hamstring-curl', 'male', 90, 999, 'reps', { beginner: 0, novice: 1, intermediate: 9, advanced: 17, elite: 26 }),
  ...bracket('nordic-hamstring-curl', 'female', 0, 55, 'reps', { beginner: 0, novice: 0, intermediate: 11, advanced: 23, elite: 37 }),
  ...bracket('nordic-hamstring-curl', 'female', 55, 999, 'reps', { beginner: 0, novice: 6, intermediate: 14, advanced: 26, elite: 38 }),

  // pallof-press
  ...bracket('pallof-press', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('pallof-press', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('pallof-press', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('pallof-press', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('pallof-press', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // parralel-bar-dips
  ...bracket('parralel-bar-dips', 'male', 0, 70, 'reps', { beginner: 1, novice: 10, intermediate: 20, advanced: 33, elite: 46 }),
  ...bracket('parralel-bar-dips', 'male', 70, 90, 'reps', { beginner: 3, novice: 10, intermediate: 20, advanced: 31, elite: 42 }),
  ...bracket('parralel-bar-dips', 'male', 90, 999, 'reps', { beginner: 4, novice: 10, intermediate: 19, advanced: 28, elite: 38 }),
  ...bracket('parralel-bar-dips', 'female', 0, 55, 'reps', { beginner: 0, novice: 0, intermediate: 9, advanced: 20, elite: 31 }),
  ...bracket('parralel-bar-dips', 'female', 55, 999, 'reps', { beginner: 0, novice: 2, intermediate: 9, advanced: 18, elite: 27 }),

  // pause-squat
  ...bracket('pause-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 49, novice: 70, intermediate: 95, advanced: 125, elite: 157 }),
  ...bracket('pause-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 76, novice: 101, intermediate: 131, advanced: 165, elite: 201 }),
  ...bracket('pause-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 100, novice: 129, intermediate: 163, advanced: 200, elite: 240 }),
  ...bracket('pause-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 28, novice: 43, intermediate: 61, advanced: 83, elite: 107 }),
  ...bracket('pause-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 41, novice: 59, intermediate: 80, advanced: 105, elite: 131 }),

  // pendlay-row
  ...bracket('pendlay-row', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 50, intermediate: 67, advanced: 87, elite: 109 }),
  ...bracket('pendlay-row', 'male', 70, 90, 'one_rm_kg', { beginner: 53, novice: 70, intermediate: 91, advanced: 114, elite: 138 }),
  ...bracket('pendlay-row', 'male', 90, 999, 'one_rm_kg', { beginner: 69, novice: 88, intermediate: 111, advanced: 137, elite: 164 }),
  ...bracket('pendlay-row', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 58, elite: 74 }),
  ...bracket('pendlay-row', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 40, intermediate: 55, advanced: 71, elite: 89 }),

  // pendulum-squat-v-squat
  ...bracket('pendulum-squat-v-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 41, novice: 73, intermediate: 117, advanced: 171, elite: 231 }),
  ...bracket('pendulum-squat-v-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 63, novice: 102, intermediate: 152, advanced: 213, elite: 280 }),
  ...bracket('pendulum-squat-v-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 84, novice: 127, intermediate: 183, advanced: 249, elite: 321 }),
  ...bracket('pendulum-squat-v-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 43, intermediate: 78, advanced: 124, elite: 176 }),
  ...bracket('pendulum-squat-v-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 28, novice: 56, intermediate: 95, advanced: 145, elite: 202 }),

  // pike-push-up
  ...bracket('pike-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 6, intermediate: 17, advanced: 31, elite: 45 }),
  ...bracket('pike-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 8, intermediate: 17, advanced: 29, elite: 42 }),
  ...bracket('pike-push-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 8, intermediate: 16, advanced: 27, elite: 38 }),
  ...bracket('pike-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 11, advanced: 20, elite: 29 }),
  ...bracket('pike-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 4, intermediate: 10, advanced: 17, elite: 25 }),

  // pistol-squat
  ...bracket('pistol-squat', 'male', 0, 70, 'reps', { beginner: 0, novice: 3, intermediate: 12, advanced: 24, elite: 37 }),
  ...bracket('pistol-squat', 'male', 70, 90, 'reps', { beginner: 0, novice: 5, intermediate: 13, advanced: 23, elite: 34 }),
  ...bracket('pistol-squat', 'male', 90, 999, 'reps', { beginner: 0, novice: 5, intermediate: 12, advanced: 21, elite: 30 }),
  ...bracket('pistol-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 1, intermediate: 8, advanced: 16, elite: 25 }),
  ...bracket('pistol-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 3, intermediate: 9, advanced: 15, elite: 22 }),

  // plate-forward-lunge
  ...bracket('plate-forward-lunge', 'male', 0, 70, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 20, advanced: 33, elite: 47 }),
  ...bracket('plate-forward-lunge', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 25, advanced: 39, elite: 55 }),
  ...bracket('plate-forward-lunge', 'male', 90, 999, 'one_rm_kg', { beginner: 10, novice: 18, intermediate: 29, advanced: 44, elite: 61 }),
  ...bracket('plate-forward-lunge', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 9, intermediate: 16, advanced: 25, elite: 36 }),
  ...bracket('plate-forward-lunge', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 11, intermediate: 17, advanced: 28, elite: 39 }),

  // plate-front-raise
  ...bracket('plate-front-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 13, advanced: 22, elite: 32 }),
  ...bracket('plate-front-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 17, advanced: 27, elite: 38 }),
  ...bracket('plate-front-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 31, elite: 44 }),
  ...bracket('plate-front-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 8, advanced: 13, elite: 18 }),
  ...bracket('plate-front-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 15, elite: 20 }),

  // plate-pinch
  ...bracket('plate-pinch', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),
  ...bracket('plate-pinch', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 20, elite: 28 }),
  ...bracket('plate-pinch', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 24, elite: 33 }),
  ...bracket('plate-pinch', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 3, intermediate: 5, advanced: 9, elite: 13 }),
  ...bracket('plate-pinch', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),

  // plyometric-kettlebell-push-up
  ...bracket('plyometric-kettlebell-push-up', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 41, advanced: 67, elite: 95 }),
  ...bracket('plyometric-kettlebell-push-up', 'male', 70, 90, 'reps', { beginner: 6, novice: 20, intermediate: 38, advanced: 60, elite: 84 }),
  ...bracket('plyometric-kettlebell-push-up', 'male', 90, 999, 'reps', { beginner: 6, novice: 19, intermediate: 35, advanced: 54, elite: 74 }),
  ...bracket('plyometric-kettlebell-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 51 }),
  ...bracket('plyometric-kettlebell-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 43 }),

  // pogo-hops
  ...bracket('pogo-hops', 'male', 0, 70, 'reps', { beginner: 0, novice: 27, intermediate: 69, advanced: 123, elite: 186 }),
  ...bracket('pogo-hops', 'male', 70, 90, 'reps', { beginner: 0, novice: 19, intermediate: 53, advanced: 96, elite: 144 }),
  ...bracket('pogo-hops', 'male', 90, 999, 'reps', { beginner: 0, novice: 14, intermediate: 42, advanced: 78, elite: 118 }),
  ...bracket('pogo-hops', 'female', 0, 55, 'reps', { beginner: 0, novice: 22, intermediate: 64, advanced: 119, elite: 184 }),
  ...bracket('pogo-hops', 'female', 55, 999, 'reps', { beginner: 0, novice: 9, intermediate: 40, advanced: 80, elite: 127 }),

  // power-clean
  ...bracket('power-clean', 'male', 0, 70, 'one_rm_kg', { beginner: 37, novice: 51, intermediate: 69, advanced: 89, elite: 110 }),
  ...bracket('power-clean', 'male', 70, 90, 'one_rm_kg', { beginner: 52, novice: 68, intermediate: 88, advanced: 111, elite: 135 }),
  ...bracket('power-clean', 'male', 90, 999, 'one_rm_kg', { beginner: 65, novice: 84, intermediate: 106, advanced: 130, elite: 156 }),
  ...bracket('power-clean', 'female', 0, 55, 'one_rm_kg', { beginner: 23, novice: 33, intermediate: 46, advanced: 60, elite: 75 }),
  ...bracket('power-clean', 'female', 55, 999, 'one_rm_kg', { beginner: 31, novice: 42, intermediate: 55, advanced: 71, elite: 87 }),

  // press-sit-up
  ...bracket('press-sit-up', 'male', 0, 70, 'reps', { beginner: 6, novice: 29, intermediate: 62, advanced: 103, elite: 148 }),
  ...bracket('press-sit-up', 'male', 70, 90, 'reps', { beginner: 5, novice: 24, intermediate: 52, advanced: 84, elite: 121 }),
  ...bracket('press-sit-up', 'male', 90, 999, 'reps', { beginner: 4, novice: 20, intermediate: 44, advanced: 71, elite: 102 }),
  ...bracket('press-sit-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 17, intermediate: 49, advanced: 88, elite: 133 }),
  ...bracket('press-sit-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 14, intermediate: 39, advanced: 70, elite: 104 }),

  // prone-lateral-raises
  ...bracket('prone-lateral-raises', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 13, advanced: 20, elite: 29 }),
  ...bracket('prone-lateral-raises', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 25, elite: 34 }),
  ...bracket('prone-lateral-raises', 'male', 90, 999, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 28, elite: 39 }),
  ...bracket('prone-lateral-raises', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 8, advanced: 12, elite: 16 }),
  ...bracket('prone-lateral-raises', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 18 }),

  // prone-y-t-raises
  ...bracket('prone-y-t-raises', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),
  ...bracket('prone-y-t-raises', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 5, intermediate: 9, advanced: 14, elite: 20 }),
  ...bracket('prone-y-t-raises', 'male', 90, 999, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 11, advanced: 17, elite: 24 }),
  ...bracket('prone-y-t-raises', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 2, intermediate: 4, advanced: 7, elite: 10 }),
  ...bracket('prone-y-t-raises', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 3, intermediate: 6, advanced: 9, elite: 13 }),

  // prying-goblet-squat
  ...bracket('prying-goblet-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 34, advanced: 51, elite: 70 }),
  ...bracket('prying-goblet-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 26, intermediate: 41, advanced: 59, elite: 80 }),
  ...bracket('prying-goblet-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 19, novice: 31, intermediate: 47, advanced: 66, elite: 88 }),
  ...bracket('prying-goblet-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 25, advanced: 36, elite: 48 }),
  ...bracket('prying-goblet-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 18, intermediate: 27, advanced: 38, elite: 51 }),

  // pull-up
  ...bracket('pull-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 14, advanced: 23, elite: 33 }),
  ...bracket('pull-up', 'male', 70, 90, 'reps', { beginner: 1, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),
  ...bracket('pull-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 6, intermediate: 11, advanced: 18, elite: 25 }),
  ...bracket('pull-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 0, intermediate: 6, advanced: 13, elite: 22 }),
  ...bracket('pull-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 0, intermediate: 5, advanced: 11, elite: 18 }),

  // push-jerk
  ...bracket('push-jerk', 'male', 0, 70, 'one_rm_kg', { beginner: 33, novice: 47, intermediate: 64, advanced: 85, elite: 106 }),
  ...bracket('push-jerk', 'male', 70, 90, 'one_rm_kg', { beginner: 49, novice: 66, intermediate: 86, advanced: 109, elite: 134 }),
  ...bracket('push-jerk', 'male', 90, 999, 'one_rm_kg', { beginner: 64, novice: 83, intermediate: 106, advanced: 131, elite: 158 }),
  ...bracket('push-jerk', 'female', 0, 55, 'one_rm_kg', { beginner: 26, novice: 35, intermediate: 45, advanced: 57, elite: 70 }),
  ...bracket('push-jerk', 'female', 55, 999, 'one_rm_kg', { beginner: 32, novice: 42, intermediate: 53, advanced: 66, elite: 80 }),

  // push-up
  ...bracket('push-up', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 41, advanced: 67, elite: 95 }),
  ...bracket('push-up', 'male', 70, 90, 'reps', { beginner: 6, novice: 20, intermediate: 38, advanced: 60, elite: 84 }),
  ...bracket('push-up', 'male', 90, 999, 'reps', { beginner: 6, novice: 19, intermediate: 35, advanced: 54, elite: 74 }),
  ...bracket('push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 51 }),
  ...bracket('push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 43 }),

  // reverse-crunch
  ...bracket('reverse-crunch', 'male', 0, 70, 'reps', { beginner: 0, novice: 13, intermediate: 35, advanced: 62, elite: 91 }),
  ...bracket('reverse-crunch', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 53, elite: 78 }),
  ...bracket('reverse-crunch', 'male', 90, 999, 'reps', { beginner: 0, novice: 11, intermediate: 27, advanced: 46, elite: 67 }),
  ...bracket('reverse-crunch', 'female', 0, 55, 'reps', { beginner: 0, novice: 12, intermediate: 31, advanced: 55, elite: 80 }),
  ...bracket('reverse-crunch', 'female', 55, 999, 'reps', { beginner: 0, novice: 10, intermediate: 26, advanced: 44, elite: 64 }),

  // reverse-grip-barbell-bench-press
  ...bracket('reverse-grip-barbell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 25, novice: 42, intermediate: 65, advanced: 94, elite: 126 }),
  ...bracket('reverse-grip-barbell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 43, novice: 65, intermediate: 94, advanced: 127, elite: 164 }),
  ...bracket('reverse-grip-barbell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 61, novice: 87, intermediate: 119, advanced: 157, elite: 197 }),
  ...bracket('reverse-grip-barbell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 15, intermediate: 34, advanced: 60, elite: 93 }),
  ...bracket('reverse-grip-barbell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 30, intermediate: 56, advanced: 89, elite: 128 }),

  // reverse-grip-barbell-curl
  ...bracket('reverse-grip-barbell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 18, intermediate: 29, advanced: 44, elite: 61 }),
  ...bracket('reverse-grip-barbell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 26, intermediate: 40, advanced: 57, elite: 76 }),
  ...bracket('reverse-grip-barbell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 34, intermediate: 49, advanced: 68, elite: 89 }),
  ...bracket('reverse-grip-barbell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 19, advanced: 29, elite: 40 }),
  ...bracket('reverse-grip-barbell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 14, intermediate: 22, advanced: 33, elite: 44 }),

  // reverse-grip-incline-push-up
  ...bracket('reverse-grip-incline-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 31, advanced: 56, elite: 83 }),
  ...bracket('reverse-grip-incline-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 52, elite: 76 }),
  ...bracket('reverse-grip-incline-push-up', 'male', 90, 999, 'reps', { beginner: 2, novice: 14, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('reverse-grip-incline-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 16, advanced: 32, elite: 49 }),
  ...bracket('reverse-grip-incline-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 31, elite: 45 }),

  // reverse-grip-tricep-pushdown
  ...bracket('reverse-grip-tricep-pushdown', 'male', 0, 70, 'one_rm_kg', { beginner: 9, novice: 21, intermediate: 38, advanced: 60, elite: 86 }),
  ...bracket('reverse-grip-tricep-pushdown', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 29, intermediate: 48, advanced: 73, elite: 101 }),
  ...bracket('reverse-grip-tricep-pushdown', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 36, intermediate: 57, advanced: 84, elite: 114 }),
  ...bracket('reverse-grip-tricep-pushdown', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 13, intermediate: 24, advanced: 40, elite: 58 }),
  ...bracket('reverse-grip-tricep-pushdown', 'female', 55, 999, 'one_rm_kg', { beginner: 8, novice: 17, intermediate: 30, advanced: 47, elite: 66 }),

  // reverse-hack-squat
  ...bracket('reverse-hack-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 41, novice: 73, intermediate: 117, advanced: 171, elite: 231 }),
  ...bracket('reverse-hack-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 63, novice: 102, intermediate: 152, advanced: 213, elite: 280 }),
  ...bracket('reverse-hack-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 84, novice: 127, intermediate: 183, advanced: 249, elite: 321 }),
  ...bracket('reverse-hack-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 43, intermediate: 78, advanced: 124, elite: 176 }),
  ...bracket('reverse-hack-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 28, novice: 56, intermediate: 95, advanced: 145, elite: 202 }),

  // reverse-hyperextension
  ...bracket('reverse-hyperextension', 'male', 0, 70, 'reps', { beginner: 0, novice: 9, intermediate: 30, advanced: 55, elite: 84 }),
  ...bracket('reverse-hyperextension', 'male', 70, 90, 'reps', { beginner: 0, novice: 14, intermediate: 33, advanced: 55, elite: 80 }),
  ...bracket('reverse-hyperextension', 'male', 90, 999, 'reps', { beginner: 3, novice: 16, intermediate: 33, advanced: 53, elite: 75 }),
  ...bracket('reverse-hyperextension', 'female', 0, 55, 'reps', { beginner: 0, novice: 6, intermediate: 21, advanced: 40, elite: 61 }),
  ...bracket('reverse-hyperextension', 'female', 55, 999, 'reps', { beginner: 3, novice: 14, intermediate: 29, advanced: 46, elite: 64 }),

  // reverse-pec-deck
  ...bracket('reverse-pec-deck', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('reverse-pec-deck', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('reverse-pec-deck', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('reverse-pec-deck', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('reverse-pec-deck', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // romanian-deadlift-hamstring-sweeps
  ...bracket('romanian-deadlift-hamstring-sweeps', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('romanian-deadlift-hamstring-sweeps', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('romanian-deadlift-hamstring-sweeps', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('romanian-deadlift-hamstring-sweeps', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('romanian-deadlift-hamstring-sweeps', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // scapular-pull-up
  ...bracket('scapular-pull-up', 'male', 0, 70, 'reps', { beginner: 3, novice: 15, intermediate: 28, advanced: 45, elite: 65 }),
  ...bracket('scapular-pull-up', 'male', 70, 90, 'reps', { beginner: 4, novice: 16, intermediate: 27, advanced: 43, elite: 60 }),
  ...bracket('scapular-pull-up', 'male', 90, 999, 'reps', { beginner: 3, novice: 13, intermediate: 24, advanced: 39, elite: 55 }),
  ...bracket('scapular-pull-up', 'female', 0, 55, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 35, elite: 50 }),
  ...bracket('scapular-pull-up', 'female', 55, 999, 'reps', { beginner: 2, novice: 7, intermediate: 17, advanced: 30, elite: 45 }),

  // seal-row
  ...bracket('seal-row', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 50, intermediate: 67, advanced: 87, elite: 109 }),
  ...bracket('seal-row', 'male', 70, 90, 'one_rm_kg', { beginner: 53, novice: 70, intermediate: 91, advanced: 114, elite: 138 }),
  ...bracket('seal-row', 'male', 90, 999, 'one_rm_kg', { beginner: 69, novice: 88, intermediate: 111, advanced: 137, elite: 164 }),
  ...bracket('seal-row', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 43, advanced: 58, elite: 74 }),
  ...bracket('seal-row', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 40, intermediate: 55, advanced: 71, elite: 89 }),

  // seated-barbell-military-press
  ...bracket('seated-barbell-military-press', 'male', 0, 70, 'one_rm_kg', { beginner: 23, novice: 33, intermediate: 46, advanced: 61, elite: 77 }),
  ...bracket('seated-barbell-military-press', 'male', 70, 90, 'one_rm_kg', { beginner: 35, novice: 47, intermediate: 63, advanced: 80, elite: 98 }),
  ...bracket('seated-barbell-military-press', 'male', 90, 999, 'one_rm_kg', { beginner: 46, novice: 61, intermediate: 78, advanced: 97, elite: 117 }),
  ...bracket('seated-barbell-military-press', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 19, intermediate: 27, advanced: 38, elite: 49 }),
  ...bracket('seated-barbell-military-press', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 25, intermediate: 35, advanced: 46, elite: 59 }),

  // seated-calf-raise
  ...bracket('seated-calf-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 20, novice: 41, intermediate: 73, advanced: 112, elite: 158 }),
  ...bracket('seated-calf-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 31, novice: 57, intermediate: 93, advanced: 138, elite: 188 }),
  ...bracket('seated-calf-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 42, novice: 71, intermediate: 111, advanced: 159, elite: 213 }),
  ...bracket('seated-calf-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 29, intermediate: 56, advanced: 93, elite: 137 }),
  ...bracket('seated-calf-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 38, intermediate: 69, advanced: 109, elite: 156 }),

  // seated-dumbbell-curl
  ...bracket('seated-dumbbell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 17, advanced: 24, elite: 31 }),
  ...bracket('seated-dumbbell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 21, advanced: 29, elite: 37 }),
  ...bracket('seated-dumbbell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 12, novice: 18, intermediate: 25, advanced: 33, elite: 42 }),
  ...bracket('seated-dumbbell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 10, advanced: 13, elite: 18 }),
  ...bracket('seated-dumbbell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 9, intermediate: 12, advanced: 17, elite: 21 }),

  // seated-leg-curl
  ...bracket('seated-leg-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 29, novice: 45, intermediate: 67, advanced: 94, elite: 123 }),
  ...bracket('seated-leg-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 39, novice: 58, intermediate: 83, advanced: 112, elite: 144 }),
  ...bracket('seated-leg-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 48, novice: 69, intermediate: 96, advanced: 127, elite: 161 }),
  ...bracket('seated-leg-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 43, advanced: 62, elite: 83 }),
  ...bracket('seated-leg-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 21, novice: 34, intermediate: 51, advanced: 70, elite: 93 }),

  // selectorized-overhead-press-machine
  ...bracket('selectorized-overhead-press-machine', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 33, intermediate: 56, advanced: 84, elite: 116 }),
  ...bracket('selectorized-overhead-press-machine', 'male', 70, 90, 'one_rm_kg', { beginner: 29, novice: 50, intermediate: 76, advanced: 109, elite: 145 }),
  ...bracket('selectorized-overhead-press-machine', 'male', 90, 999, 'one_rm_kg', { beginner: 41, novice: 64, intermediate: 94, advanced: 130, elite: 170 }),
  ...bracket('selectorized-overhead-press-machine', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 14, intermediate: 27, advanced: 43, elite: 62 }),
  ...bracket('selectorized-overhead-press-machine', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 32, advanced: 50, elite: 71 }),

  // selectorized-torso-rotation-machine
  ...bracket('selectorized-torso-rotation-machine', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('selectorized-torso-rotation-machine', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('selectorized-torso-rotation-machine', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('selectorized-torso-rotation-machine', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('selectorized-torso-rotation-machine', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // single-arm-cable-fly
  ...bracket('single-arm-cable-fly', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 7, intermediate: 17, advanced: 32, elite: 49 }),
  ...bracket('single-arm-cable-fly', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 13, intermediate: 25, advanced: 42, elite: 62 }),
  ...bracket('single-arm-cable-fly', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 18, intermediate: 32, advanced: 51, elite: 75 }),
  ...bracket('single-arm-cable-fly', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 11, advanced: 20, elite: 30 }),
  ...bracket('single-arm-cable-fly', 'female', 55, 999, 'one_rm_kg', { beginner: 3, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),

  // single-arm-dumbbell-bench-press
  ...bracket('single-arm-dumbbell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 12, intermediate: 19, advanced: 29, elite: 39 }),
  ...bracket('single-arm-dumbbell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 12, novice: 19, intermediate: 28, advanced: 38, elite: 50 }),
  ...bracket('single-arm-dumbbell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 17, novice: 25, intermediate: 35, advanced: 47, elite: 60 }),
  ...bracket('single-arm-dumbbell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 7, intermediate: 12, advanced: 19, elite: 26 }),
  ...bracket('single-arm-dumbbell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 16, advanced: 23, elite: 31 }),

  // single-arm-dumbbell-overhead-press
  ...bracket('single-arm-dumbbell-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 10, intermediate: 16, advanced: 24, elite: 31 }),
  ...bracket('single-arm-dumbbell-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 17, intermediate: 24, advanced: 32, elite: 40 }),
  ...bracket('single-arm-dumbbell-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 16, novice: 22, intermediate: 30, advanced: 39, elite: 49 }),
  ...bracket('single-arm-dumbbell-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 7, intermediate: 10, advanced: 14, elite: 19 }),
  ...bracket('single-arm-dumbbell-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 10, intermediate: 14, advanced: 18, elite: 23 }),

  // single-arm-incline-lateral-raise
  ...bracket('single-arm-incline-lateral-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 8, advanced: 14, elite: 21 }),
  ...bracket('single-arm-incline-lateral-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 3, novice: 7, intermediate: 11, advanced: 18, elite: 25 }),
  ...bracket('single-arm-incline-lateral-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 14, advanced: 21, elite: 30 }),
  ...bracket('single-arm-incline-lateral-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 6, advanced: 9, elite: 12 }),
  ...bracket('single-arm-incline-lateral-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 5, intermediate: 7, advanced: 11, elite: 14 }),

  // single-arm-kettlebell-military-press-to-side
  ...bracket('single-arm-kettlebell-military-press-to-side', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('single-arm-kettlebell-military-press-to-side', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('single-arm-kettlebell-military-press-to-side', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('single-arm-kettlebell-military-press-to-side', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('single-arm-kettlebell-military-press-to-side', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // single-arm-landmine-press
  ...bracket('single-arm-landmine-press', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 17, intermediate: 29, advanced: 45, elite: 64 }),
  ...bracket('single-arm-landmine-press', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 25, intermediate: 40, advanced: 59, elite: 79 }),
  ...bracket('single-arm-landmine-press', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 33, intermediate: 50, advanced: 70, elite: 93 }),
  ...bracket('single-arm-landmine-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 21, advanced: 31, elite: 42 }),
  ...bracket('single-arm-landmine-press', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 25, advanced: 35, elite: 47 }),

  // single-arm-landmine-row
  ...bracket('single-arm-landmine-row', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 42, advanced: 60, elite: 80 }),
  ...bracket('single-arm-landmine-row', 'male', 70, 90, 'one_rm_kg', { beginner: 29, novice: 44, intermediate: 61, advanced: 83, elite: 104 }),
  ...bracket('single-arm-landmine-row', 'male', 90, 999, 'one_rm_kg', { beginner: 42, novice: 58, intermediate: 78, advanced: 101, elite: 127 }),
  ...bracket('single-arm-landmine-row', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 28, advanced: 41, elite: 55 }),
  ...bracket('single-arm-landmine-row', 'female', 55, 999, 'one_rm_kg', { beginner: 15, novice: 24, intermediate: 35, advanced: 49, elite: 64 }),

  // single-arm-lat-pulldown
  ...bracket('single-arm-lat-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 16, novice: 28, intermediate: 44, advanced: 64, elite: 85 }),
  ...bracket('single-arm-lat-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 24, novice: 39, intermediate: 57, advanced: 79, elite: 103 }),
  ...bracket('single-arm-lat-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 32, novice: 48, intermediate: 68, advanced: 92, elite: 118 }),
  ...bracket('single-arm-lat-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 27, advanced: 39, elite: 53 }),
  ...bracket('single-arm-lat-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 14, novice: 22, intermediate: 34, advanced: 47, elite: 62 }),

  // single-arm-overhead-cable-extension
  ...bracket('single-arm-overhead-cable-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 18, intermediate: 31, advanced: 49, elite: 70 }),
  ...bracket('single-arm-overhead-cable-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 14, novice: 26, intermediate: 43, advanced: 64, elite: 87 }),
  ...bracket('single-arm-overhead-cable-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 21, novice: 35, intermediate: 53, advanced: 76, elite: 101 }),
  ...bracket('single-arm-overhead-cable-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('single-arm-overhead-cable-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 34, elite: 48 }),

  // single-arm-tricep-extension
  ...bracket('single-arm-tricep-extension', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 24, intermediate: 39, advanced: 59, elite: 82 }),
  ...bracket('single-arm-tricep-extension', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 33, intermediate: 51, advanced: 74, elite: 98 }),
  ...bracket('single-arm-tricep-extension', 'male', 90, 999, 'one_rm_kg', { beginner: 26, novice: 41, intermediate: 61, advanced: 85, elite: 113 }),
  ...bracket('single-arm-tricep-extension', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 26, advanced: 39, elite: 54 }),
  ...bracket('single-arm-tricep-extension', 'female', 55, 999, 'one_rm_kg', { beginner: 12, novice: 20, intermediate: 32, advanced: 46, elite: 62 }),

  // single-leg-back-extension
  ...bracket('single-leg-back-extension', 'male', 0, 70, 'reps', { beginner: 1, novice: 13, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('single-leg-back-extension', 'male', 70, 90, 'reps', { beginner: 5, novice: 15, intermediate: 29, advanced: 46, elite: 63 }),
  ...bracket('single-leg-back-extension', 'male', 90, 999, 'reps', { beginner: 6, novice: 15, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('single-leg-back-extension', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 39, elite: 54 }),
  ...bracket('single-leg-back-extension', 'female', 55, 999, 'reps', { beginner: 6, novice: 13, intermediate: 23, advanced: 35, elite: 46 }),

  // single-leg-barbell-squat
  ...bracket('single-leg-barbell-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 25, intermediate: 34, advanced: 45, elite: 57 }),
  ...bracket('single-leg-barbell-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 26, novice: 35, intermediate: 46, advanced: 59, elite: 72 }),
  ...bracket('single-leg-barbell-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 34, novice: 45, intermediate: 57, advanced: 71, elite: 85 }),
  ...bracket('single-leg-barbell-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 22, advanced: 31, elite: 41 }),
  ...bracket('single-leg-barbell-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 20, intermediate: 28, advanced: 38, elite: 49 }),

  // single-leg-bound
  ...bracket('single-leg-bound', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('single-leg-bound', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('single-leg-bound', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('single-leg-bound', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('single-leg-bound', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // single-leg-dumbbell-romanian-deadlift
  ...bracket('single-leg-dumbbell-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 40, advanced: 66, elite: 97 }),
  ...bracket('single-leg-dumbbell-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 33, intermediate: 57, advanced: 88, elite: 124 }),
  ...bracket('single-leg-dumbbell-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 45, intermediate: 73, advanced: 107, elite: 146 }),
  ...bracket('single-leg-dumbbell-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 31, advanced: 47, elite: 65 }),
  ...bracket('single-leg-dumbbell-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 54, elite: 74 }),

  // single-leg-glute-bridge
  ...bracket('single-leg-glute-bridge', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 26, advanced: 53, elite: 85 }),
  ...bracket('single-leg-glute-bridge', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 26, advanced: 50, elite: 77 }),
  ...bracket('single-leg-glute-bridge', 'male', 90, 999, 'reps', { beginner: 0, novice: 10, intermediate: 26, advanced: 47, elite: 71 }),
  ...bracket('single-leg-glute-bridge', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 26, advanced: 50, elite: 77 }),
  ...bracket('single-leg-glute-bridge', 'female', 55, 999, 'reps', { beginner: 0, novice: 8, intermediate: 24, advanced: 44, elite: 65 }),

  // single-leg-hip-thrust
  ...bracket('single-leg-hip-thrust', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 38, intermediate: 69, advanced: 113, elite: 163 }),
  ...bracket('single-leg-hip-thrust', 'male', 70, 90, 'one_rm_kg', { beginner: 34, novice: 64, intermediate: 103, advanced: 155, elite: 211 }),
  ...bracket('single-leg-hip-thrust', 'male', 90, 999, 'one_rm_kg', { beginner: 53, novice: 87, intermediate: 134, advanced: 191, elite: 255 }),
  ...bracket('single-leg-hip-thrust', 'female', 0, 55, 'one_rm_kg', { beginner: 23, novice: 42, intermediate: 68, advanced: 104, elite: 142 }),
  ...bracket('single-leg-hip-thrust', 'female', 55, 999, 'one_rm_kg', { beginner: 28, novice: 52, intermediate: 82, advanced: 119, elite: 161 }),

  // single-leg-hop
  ...bracket('single-leg-hop', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('single-leg-hop', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('single-leg-hop', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('single-leg-hop', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('single-leg-hop', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // single-leg-kettlebell-romanian-deadlift-deficit
  ...bracket('single-leg-kettlebell-romanian-deadlift-deficit', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 40, advanced: 66, elite: 97 }),
  ...bracket('single-leg-kettlebell-romanian-deadlift-deficit', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 33, intermediate: 57, advanced: 88, elite: 124 }),
  ...bracket('single-leg-kettlebell-romanian-deadlift-deficit', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 45, intermediate: 73, advanced: 107, elite: 146 }),
  ...bracket('single-leg-kettlebell-romanian-deadlift-deficit', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 31, advanced: 47, elite: 65 }),
  ...bracket('single-leg-kettlebell-romanian-deadlift-deficit', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 54, elite: 74 }),

  // single-leg-press
  ...bracket('single-leg-press', 'male', 0, 70, 'one_rm_kg', { beginner: 27, novice: 57, intermediate: 99, advanced: 153, elite: 216 }),
  ...bracket('single-leg-press', 'male', 70, 90, 'one_rm_kg', { beginner: 42, novice: 78, intermediate: 126, advanced: 187, elite: 255 }),
  ...bracket('single-leg-press', 'male', 90, 999, 'one_rm_kg', { beginner: 56, novice: 96, intermediate: 150, advanced: 215, elite: 288 }),
  ...bracket('single-leg-press', 'female', 0, 55, 'one_rm_kg', { beginner: 16, novice: 35, intermediate: 63, advanced: 98, elite: 139 }),
  ...bracket('single-leg-press', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 46, intermediate: 77, advanced: 116, elite: 160 }),

  // single-leg-standing-calf-raise
  ...bracket('single-leg-standing-calf-raise', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 44, advanced: 77, elite: 114 }),
  ...bracket('single-leg-standing-calf-raise', 'male', 70, 90, 'reps', { beginner: 4, novice: 18, intermediate: 39, advanced: 66, elite: 96 }),
  ...bracket('single-leg-standing-calf-raise', 'male', 90, 999, 'reps', { beginner: 3, novice: 16, intermediate: 35, advanced: 57, elite: 84 }),
  ...bracket('single-leg-standing-calf-raise', 'female', 0, 55, 'reps', { beginner: 0, novice: 13, intermediate: 35, advanced: 64, elite: 95 }),
  ...bracket('single-leg-standing-calf-raise', 'female', 55, 999, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 54, elite: 80 }),

  // single-leg-step-down
  ...bracket('single-leg-step-down', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('single-leg-step-down', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('single-leg-step-down', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('single-leg-step-down', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('single-leg-step-down', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // single-legged-romanian-deadlifts
  ...bracket('single-legged-romanian-deadlifts', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 20, intermediate: 40, advanced: 66, elite: 97 }),
  ...bracket('single-legged-romanian-deadlifts', 'male', 70, 90, 'one_rm_kg', { beginner: 16, novice: 33, intermediate: 57, advanced: 88, elite: 124 }),
  ...bracket('single-legged-romanian-deadlifts', 'male', 90, 999, 'one_rm_kg', { beginner: 25, novice: 45, intermediate: 73, advanced: 107, elite: 146 }),
  ...bracket('single-legged-romanian-deadlifts', 'female', 0, 55, 'one_rm_kg', { beginner: 9, novice: 19, intermediate: 31, advanced: 47, elite: 65 }),
  ...bracket('single-legged-romanian-deadlifts', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 54, elite: 74 }),

  // sissy-squat
  ...bracket('sissy-squat', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 22, advanced: 40, elite: 61 }),
  ...bracket('sissy-squat', 'male', 70, 90, 'reps', { beginner: 0, novice: 8, intermediate: 21, advanced: 37, elite: 54 }),
  ...bracket('sissy-squat', 'male', 90, 999, 'reps', { beginner: 0, novice: 8, intermediate: 19, advanced: 33, elite: 48 }),
  ...bracket('sissy-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 15, advanced: 29, elite: 44 }),
  ...bracket('sissy-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 6, intermediate: 16, advanced: 28, elite: 40 }),

  // sit-up
  ...bracket('sit-up', 'male', 0, 70, 'reps', { beginner: 6, novice: 29, intermediate: 62, advanced: 103, elite: 148 }),
  ...bracket('sit-up', 'male', 70, 90, 'reps', { beginner: 5, novice: 24, intermediate: 52, advanced: 84, elite: 121 }),
  ...bracket('sit-up', 'male', 90, 999, 'reps', { beginner: 4, novice: 20, intermediate: 44, advanced: 71, elite: 102 }),
  ...bracket('sit-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 17, intermediate: 49, advanced: 88, elite: 133 }),
  ...bracket('sit-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 14, intermediate: 39, advanced: 70, elite: 104 }),

  // skater-bound
  ...bracket('skater-bound', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('skater-bound', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('skater-bound', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('skater-bound', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('skater-bound', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // slider-leg-curl
  ...bracket('slider-leg-curl', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('slider-leg-curl', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('slider-leg-curl', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('slider-leg-curl', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('slider-leg-curl', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // smith-machine-bench-press
  ...bracket('smith-machine-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 36, novice: 52, intermediate: 72, advanced: 94, elite: 119 }),
  ...bracket('smith-machine-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 53, novice: 72, intermediate: 95, advanced: 120, elite: 148 }),
  ...bracket('smith-machine-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 68, novice: 89, intermediate: 115, advanced: 143, elite: 173 }),
  ...bracket('smith-machine-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 13, novice: 23, intermediate: 37, advanced: 55, elite: 75 }),
  ...bracket('smith-machine-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 49, advanced: 69, elite: 91 }),

  // smith-machine-bent-over-row
  ...bracket('smith-machine-bent-over-row', 'male', 0, 70, 'one_rm_kg', { beginner: 25, novice: 40, intermediate: 59, advanced: 82, elite: 107 }),
  ...bracket('smith-machine-bent-over-row', 'male', 70, 90, 'one_rm_kg', { beginner: 39, novice: 57, intermediate: 80, advanced: 106, elite: 135 }),
  ...bracket('smith-machine-bent-over-row', 'male', 90, 999, 'one_rm_kg', { beginner: 52, novice: 73, intermediate: 97, advanced: 125, elite: 157 }),
  ...bracket('smith-machine-bent-over-row', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 49, elite: 67 }),
  ...bracket('smith-machine-bent-over-row', 'female', 55, 999, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 39, advanced: 56, elite: 75 }),

  // smith-machine-calf-raise
  ...bracket('smith-machine-calf-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 16, novice: 35, intermediate: 66, advanced: 105, elite: 153 }),
  ...bracket('smith-machine-calf-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 25, novice: 49, intermediate: 84, advanced: 129, elite: 180 }),
  ...bracket('smith-machine-calf-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 35, novice: 61, intermediate: 100, advanced: 147, elite: 202 }),
  ...bracket('smith-machine-calf-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 24, intermediate: 48, advanced: 84, elite: 127 }),
  ...bracket('smith-machine-calf-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 13, novice: 30, intermediate: 59, advanced: 96, elite: 141 }),

  // smith-machine-close-grip-bench-press
  ...bracket('smith-machine-close-grip-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 28, novice: 42, intermediate: 60, advanced: 81, elite: 104 }),
  ...bracket('smith-machine-close-grip-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 45, novice: 62, intermediate: 84, advanced: 108, elite: 134 }),
  ...bracket('smith-machine-close-grip-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 60, novice: 80, intermediate: 105, advanced: 131, elite: 160 }),
  ...bracket('smith-machine-close-grip-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 12, novice: 21, intermediate: 33, advanced: 50, elite: 67 }),
  ...bracket('smith-machine-close-grip-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 29, intermediate: 44, advanced: 62, elite: 81 }),

  // smith-machine-decline-bench-press
  ...bracket('smith-machine-decline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 29, novice: 46, intermediate: 68, advanced: 93, elite: 123 }),
  ...bracket('smith-machine-decline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 68, intermediate: 94, advanced: 124, elite: 157 }),
  ...bracket('smith-machine-decline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 87, intermediate: 117, advanced: 149, elite: 187 }),
  ...bracket('smith-machine-decline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 10, novice: 21, intermediate: 36, advanced: 56, elite: 79 }),
  ...bracket('smith-machine-decline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 17, novice: 29, intermediate: 48, advanced: 69, elite: 94 }),

  // smith-machine-front-squat
  ...bracket('smith-machine-front-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 32, novice: 49, intermediate: 72, advanced: 98, elite: 126 }),
  ...bracket('smith-machine-front-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 68, intermediate: 94, advanced: 124, elite: 156 }),
  ...bracket('smith-machine-front-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 85, intermediate: 115, advanced: 146, elite: 180 }),
  ...bracket('smith-machine-front-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 19, novice: 32, intermediate: 46, advanced: 65, elite: 84 }),
  ...bracket('smith-machine-front-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 26, novice: 38, intermediate: 55, advanced: 75, elite: 96 }),

  // smith-machine-incline-bench-press
  ...bracket('smith-machine-incline-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 26, novice: 39, intermediate: 56, advanced: 77, elite: 100 }),
  ...bracket('smith-machine-incline-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 41, novice: 57, intermediate: 79, advanced: 102, elite: 128 }),
  ...bracket('smith-machine-incline-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 54, novice: 74, intermediate: 97, advanced: 124, elite: 152 }),
  ...bracket('smith-machine-incline-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 8, novice: 16, intermediate: 28, advanced: 44, elite: 62 }),
  ...bracket('smith-machine-incline-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 14, novice: 23, intermediate: 38, advanced: 55, elite: 76 }),

  // smith-machine-overhead-press
  ...bracket('smith-machine-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 41, advanced: 58, elite: 76 }),
  ...bracket('smith-machine-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 27, novice: 40, intermediate: 56, advanced: 75, elite: 97 }),
  ...bracket('smith-machine-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 36, novice: 51, intermediate: 69, advanced: 90, elite: 114 }),
  ...bracket('smith-machine-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 23, advanced: 34, elite: 47 }),
  ...bracket('smith-machine-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 18, intermediate: 29, advanced: 41, elite: 56 }),

  // smith-machine-seated-overhead-press
  ...bracket('smith-machine-seated-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 41, advanced: 58, elite: 76 }),
  ...bracket('smith-machine-seated-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 27, novice: 40, intermediate: 56, advanced: 75, elite: 97 }),
  ...bracket('smith-machine-seated-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 36, novice: 51, intermediate: 69, advanced: 90, elite: 114 }),
  ...bracket('smith-machine-seated-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 14, intermediate: 23, advanced: 34, elite: 47 }),
  ...bracket('smith-machine-seated-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 18, intermediate: 29, advanced: 41, elite: 56 }),

  // smith-machine-squat
  ...bracket('smith-machine-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 37, novice: 60, intermediate: 89, advanced: 124, elite: 163 }),
  ...bracket('smith-machine-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 57, novice: 84, intermediate: 118, advanced: 158, elite: 202 }),
  ...bracket('smith-machine-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 75, novice: 106, intermediate: 144, advanced: 187, elite: 234 }),
  ...bracket('smith-machine-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 34, intermediate: 55, advanced: 81, elite: 111 }),
  ...bracket('smith-machine-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 42, intermediate: 66, advanced: 94, elite: 126 }),

  // smith-machine-standing-shrugs
  ...bracket('smith-machine-standing-shrugs', 'male', 0, 70, 'one_rm_kg', { beginner: 26, novice: 48, intermediate: 78, advanced: 114, elite: 156 }),
  ...bracket('smith-machine-standing-shrugs', 'male', 70, 90, 'one_rm_kg', { beginner: 46, novice: 74, intermediate: 110, advanced: 153, elite: 201 }),
  ...bracket('smith-machine-standing-shrugs', 'male', 90, 999, 'one_rm_kg', { beginner: 66, novice: 99, intermediate: 139, advanced: 187, elite: 239 }),
  ...bracket('smith-machine-standing-shrugs', 'female', 0, 55, 'one_rm_kg', { beginner: 10, novice: 24, intermediate: 45, advanced: 72, elite: 104 }),
  ...bracket('smith-machine-standing-shrugs', 'female', 55, 999, 'one_rm_kg', { beginner: 19, novice: 37, intermediate: 62, advanced: 93, elite: 128 }),

  // smith-machine-sumo-romanian-deadlift
  ...bracket('smith-machine-sumo-romanian-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 58, novice: 86, intermediate: 122, advanced: 164, elite: 209 }),
  ...bracket('smith-machine-sumo-romanian-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 84, novice: 117, intermediate: 157, advanced: 203, elite: 254 }),
  ...bracket('smith-machine-sumo-romanian-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 105, novice: 142, intermediate: 188, advanced: 236, elite: 291 }),
  ...bracket('smith-machine-sumo-romanian-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 31, novice: 51, intermediate: 75, advanced: 104, elite: 135 }),
  ...bracket('smith-machine-sumo-romanian-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 38, novice: 58, intermediate: 84, advanced: 113, elite: 146 }),

  // snap-down-landing
  ...bracket('snap-down-landing', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('snap-down-landing', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('snap-down-landing', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('snap-down-landing', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('snap-down-landing', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // snatch-grip-deadlift
  ...bracket('snatch-grip-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 44, novice: 66, intermediate: 94, advanced: 128, elite: 164 }),
  ...bracket('snatch-grip-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 73, novice: 101, intermediate: 135, advanced: 174, elite: 216 }),
  ...bracket('snatch-grip-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 100, novice: 133, intermediate: 172, advanced: 216, elite: 262 }),
  ...bracket('snatch-grip-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 29, novice: 44, intermediate: 63, advanced: 86, elite: 110 }),
  ...bracket('snatch-grip-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 41, novice: 59, intermediate: 80, advanced: 106, elite: 133 }),

  // snatch-grip-high-pull
  ...bracket('snatch-grip-high-pull', 'male', 0, 70, 'one_rm_kg', { beginner: 22, novice: 39, intermediate: 61, advanced: 88, elite: 119 }),
  ...bracket('snatch-grip-high-pull', 'male', 70, 90, 'one_rm_kg', { beginner: 36, novice: 57, intermediate: 84, advanced: 115, elite: 150 }),
  ...bracket('snatch-grip-high-pull', 'male', 90, 999, 'one_rm_kg', { beginner: 50, novice: 74, intermediate: 104, advanced: 139, elite: 177 }),
  ...bracket('snatch-grip-high-pull', 'female', 0, 55, 'one_rm_kg', { beginner: 11, novice: 21, intermediate: 36, advanced: 54, elite: 74 }),
  ...bracket('snatch-grip-high-pull', 'female', 55, 999, 'one_rm_kg', { beginner: 18, novice: 31, intermediate: 48, advanced: 68, elite: 91 }),

  // snatch-pull
  ...bracket('snatch-pull', 'male', 0, 70, 'one_rm_kg', { beginner: 30, novice: 48, intermediate: 70, advanced: 97, elite: 127 }),
  ...bracket('snatch-pull', 'male', 70, 90, 'one_rm_kg', { beginner: 46, novice: 67, intermediate: 94, advanced: 124, elite: 158 }),
  ...bracket('snatch-pull', 'male', 90, 999, 'one_rm_kg', { beginner: 60, novice: 84, intermediate: 114, advanced: 148, elite: 184 }),
  ...bracket('snatch-pull', 'female', 0, 55, 'one_rm_kg', { beginner: 23, novice: 36, intermediate: 53, advanced: 73, elite: 95 }),
  ...bracket('snatch-pull', 'female', 55, 999, 'one_rm_kg', { beginner: 26, novice: 40, intermediate: 57, advanced: 78, elite: 101 }),

  // spider-curl
  ...bracket('spider-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 7, novice: 15, intermediate: 25, advanced: 38, elite: 53 }),
  ...bracket('spider-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 13, novice: 22, intermediate: 34, advanced: 50, elite: 67 }),
  ...bracket('spider-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 18, novice: 29, intermediate: 43, advanced: 60, elite: 78 }),
  ...bracket('spider-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 17, advanced: 25, elite: 35 }),
  ...bracket('spider-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 15, intermediate: 23, advanced: 32, elite: 43 }),

  // split-jerk
  ...bracket('split-jerk', 'male', 0, 70, 'one_rm_kg', { beginner: 35, novice: 50, intermediate: 68, advanced: 90, elite: 113 }),
  ...bracket('split-jerk', 'male', 70, 90, 'one_rm_kg', { beginner: 53, novice: 71, intermediate: 93, advanced: 118, elite: 144 }),
  ...bracket('split-jerk', 'male', 90, 999, 'one_rm_kg', { beginner: 69, novice: 90, intermediate: 115, advanced: 142, elite: 171 }),
  ...bracket('split-jerk', 'female', 0, 55, 'one_rm_kg', { beginner: 26, novice: 36, intermediate: 48, advanced: 63, elite: 78 }),
  ...bracket('split-jerk', 'female', 55, 999, 'one_rm_kg', { beginner: 33, novice: 44, intermediate: 58, advanced: 73, elite: 90 }),

  // squat-thrusts
  ...bracket('squat-thrusts', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('squat-thrusts', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('squat-thrusts', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('squat-thrusts', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('squat-thrusts', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // stability-ball-leg-curl
  ...bracket('stability-ball-leg-curl', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('stability-ball-leg-curl', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('stability-ball-leg-curl', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('stability-ball-leg-curl', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('stability-ball-leg-curl', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // standing-alternating-dumbbell-overhead-press
  ...bracket('standing-alternating-dumbbell-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 32, elite: 43 }),
  ...bracket('standing-alternating-dumbbell-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 22, intermediate: 31, advanced: 42, elite: 54 }),
  ...bracket('standing-alternating-dumbbell-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 28, intermediate: 39, advanced: 50, elite: 63 }),
  ...bracket('standing-alternating-dumbbell-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 18, elite: 25 }),
  ...bracket('standing-alternating-dumbbell-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 16, advanced: 22, elite: 29 }),

  // standing-cable-hip-abduction
  ...bracket('standing-cable-hip-abduction', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('standing-cable-hip-abduction', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('standing-cable-hip-abduction', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('standing-cable-hip-abduction', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('standing-cable-hip-abduction', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // standing-calf-raise-machine
  ...bracket('standing-calf-raise-machine', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 63, intermediate: 110, advanced: 168, elite: 236 }),
  ...bracket('standing-calf-raise-machine', 'male', 70, 90, 'one_rm_kg', { beginner: 49, novice: 88, intermediate: 141, advanced: 207, elite: 282 }),
  ...bracket('standing-calf-raise-machine', 'male', 90, 999, 'one_rm_kg', { beginner: 65, novice: 110, intermediate: 169, advanced: 240, elite: 320 }),
  ...bracket('standing-calf-raise-machine', 'female', 0, 55, 'one_rm_kg', { beginner: 16, novice: 40, intermediate: 75, advanced: 121, elite: 176 }),
  ...bracket('standing-calf-raise-machine', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 53, intermediate: 93, advanced: 144, elite: 203 }),

  // standing-dumbbell-overhead-press
  ...bracket('standing-dumbbell-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 10, novice: 15, intermediate: 23, advanced: 32, elite: 43 }),
  ...bracket('standing-dumbbell-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 15, novice: 22, intermediate: 31, advanced: 42, elite: 54 }),
  ...bracket('standing-dumbbell-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 20, novice: 28, intermediate: 39, advanced: 50, elite: 63 }),
  ...bracket('standing-dumbbell-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 13, advanced: 18, elite: 25 }),
  ...bracket('standing-dumbbell-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 11, intermediate: 16, advanced: 22, elite: 29 }),

  // standing-neutral-grip-dumbbell-overhead-press
  ...bracket('standing-neutral-grip-dumbbell-overhead-press', 'male', 0, 70, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 18, advanced: 27, elite: 38 }),
  ...bracket('standing-neutral-grip-dumbbell-overhead-press', 'male', 70, 90, 'one_rm_kg', { beginner: 10, novice: 17, intermediate: 26, advanced: 36, elite: 48 }),
  ...bracket('standing-neutral-grip-dumbbell-overhead-press', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 22, intermediate: 33, advanced: 44, elite: 57 }),
  ...bracket('standing-neutral-grip-dumbbell-overhead-press', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 8, intermediate: 12, advanced: 16, elite: 21 }),
  ...bracket('standing-neutral-grip-dumbbell-overhead-press', 'female', 55, 999, 'one_rm_kg', { beginner: 7, novice: 10, intermediate: 14, advanced: 19, elite: 23 }),

  // straight-arm-lat-pulldown
  ...bracket('straight-arm-lat-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 35, novice: 50, intermediate: 69, advanced: 90, elite: 113 }),
  ...bracket('straight-arm-lat-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 47, novice: 64, intermediate: 85, advanced: 108, elite: 133 }),
  ...bracket('straight-arm-lat-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 57, novice: 76, intermediate: 98, advanced: 123, elite: 150 }),
  ...bracket('straight-arm-lat-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 42, advanced: 56, elite: 72 }),
  ...bracket('straight-arm-lat-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 36, intermediate: 49, advanced: 64, elite: 81 }),

  // straight-arm-rope-pulldown-light
  ...bracket('straight-arm-rope-pulldown-light', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('straight-arm-rope-pulldown-light', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('straight-arm-rope-pulldown-light', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('straight-arm-rope-pulldown-light', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('straight-arm-rope-pulldown-light', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // straight-bar-bench-mid-row
  ...bracket('straight-bar-bench-mid-row', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 46, intermediate: 65, advanced: 87, elite: 111 }),
  ...bracket('straight-bar-bench-mid-row', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 66, intermediate: 88, advanced: 114, elite: 141 }),
  ...bracket('straight-bar-bench-mid-row', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 84, intermediate: 108, advanced: 136, elite: 166 }),
  ...bracket('straight-bar-bench-mid-row', 'female', 0, 55, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 72 }),
  ...bracket('straight-bar-bench-mid-row', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 46, advanced: 64, elite: 83 }),

  // sumo-deadlift
  ...bracket('sumo-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 72, novice: 100, intermediate: 134, advanced: 174, elite: 216 }),
  ...bracket('sumo-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 102, novice: 135, intermediate: 174, advanced: 218, elite: 265 }),
  ...bracket('sumo-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 128, novice: 165, intermediate: 208, advanced: 256, elite: 307 }),
  ...bracket('sumo-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 43, novice: 62, intermediate: 87, advanced: 115, elite: 146 }),
  ...bracket('sumo-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 51, novice: 73, intermediate: 99, advanced: 129, elite: 161 }),

  // supermans
  ...bracket('supermans', 'male', 0, 70, 'reps', { beginner: 1, novice: 13, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('supermans', 'male', 70, 90, 'reps', { beginner: 5, novice: 15, intermediate: 29, advanced: 46, elite: 63 }),
  ...bracket('supermans', 'male', 90, 999, 'reps', { beginner: 6, novice: 15, intermediate: 28, advanced: 42, elite: 57 }),
  ...bracket('supermans', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 39, elite: 54 }),
  ...bracket('supermans', 'female', 55, 999, 'reps', { beginner: 6, novice: 13, intermediate: 23, advanced: 35, elite: 46 }),

  // tate-press
  ...bracket('tate-press', 'male', 0, 70, 'one_rm_kg', { beginner: 2, novice: 8, intermediate: 18, advanced: 32, elite: 49 }),
  ...bracket('tate-press', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 12, intermediate: 23, advanced: 40, elite: 59 }),
  ...bracket('tate-press', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 15, intermediate: 29, advanced: 46, elite: 67 }),
  ...bracket('tate-press', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 9, advanced: 14, elite: 19 }),
  ...bracket('tate-press', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 12, advanced: 17, elite: 23 }),

  // tibialis-raise
  ...bracket('tibialis-raise', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('tibialis-raise', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('tibialis-raise', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('tibialis-raise', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('tibialis-raise', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // toes-to-bar
  ...bracket('toes-to-bar', 'male', 0, 70, 'reps', { beginner: 0, novice: 5, intermediate: 14, advanced: 26, elite: 39 }),
  ...bracket('toes-to-bar', 'male', 70, 90, 'reps', { beginner: 0, novice: 7, intermediate: 15, advanced: 26, elite: 36 }),
  ...bracket('toes-to-bar', 'male', 90, 999, 'reps', { beginner: 0, novice: 7, intermediate: 15, advanced: 24, elite: 33 }),
  ...bracket('toes-to-bar', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 10, advanced: 19, elite: 28 }),
  ...bracket('toes-to-bar', 'female', 55, 999, 'reps', { beginner: 0, novice: 5, intermediate: 11, advanced: 18, elite: 25 }),

  // towel-doorframe-row
  ...bracket('towel-doorframe-row', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 50 }),
  ...bracket('towel-doorframe-row', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 19, advanced: 32, elite: 46 }),
  ...bracket('towel-doorframe-row', 'male', 90, 999, 'reps', { beginner: 1, novice: 9, intermediate: 18, advanced: 30, elite: 42 }),
  ...bracket('towel-doorframe-row', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 12, advanced: 21, elite: 31 }),
  ...bracket('towel-doorframe-row', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),

  // towel-slide-leg-curl
  ...bracket('towel-slide-leg-curl', 'male', 0, 70, 'reps', { beginner: 5, novice: 15, intermediate: 30, advanced: 50, elite: 75 }),
  ...bracket('towel-slide-leg-curl', 'male', 70, 90, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('towel-slide-leg-curl', 'male', 90, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),
  ...bracket('towel-slide-leg-curl', 'female', 0, 55, 'reps', { beginner: 4, novice: 13, intermediate: 26, advanced: 44, elite: 66 }),
  ...bracket('towel-slide-leg-curl', 'female', 55, 999, 'reps', { beginner: 3, novice: 11, intermediate: 22, advanced: 38, elite: 58 }),

  // trap-bar-deadlift
  ...bracket('trap-bar-deadlift', 'male', 0, 70, 'one_rm_kg', { beginner: 72, novice: 98, intermediate: 130, advanced: 167, elite: 206 }),
  ...bracket('trap-bar-deadlift', 'male', 70, 90, 'one_rm_kg', { beginner: 99, novice: 130, intermediate: 166, advanced: 207, elite: 251 }),
  ...bracket('trap-bar-deadlift', 'male', 90, 999, 'one_rm_kg', { beginner: 123, novice: 157, intermediate: 197, advanced: 242, elite: 288 }),
  ...bracket('trap-bar-deadlift', 'female', 0, 55, 'one_rm_kg', { beginner: 41, novice: 60, intermediate: 84, advanced: 111, elite: 140 }),
  ...bracket('trap-bar-deadlift', 'female', 55, 999, 'one_rm_kg', { beginner: 54, novice: 75, intermediate: 101, advanced: 130, elite: 162 }),

  // trap-bar-shrug
  ...bracket('trap-bar-shrug', 'male', 0, 70, 'one_rm_kg', { beginner: 35, novice: 63, intermediate: 99, advanced: 142, elite: 192 }),
  ...bracket('trap-bar-shrug', 'male', 70, 90, 'one_rm_kg', { beginner: 59, novice: 93, intermediate: 135, advanced: 185, elite: 242 }),
  ...bracket('trap-bar-shrug', 'male', 90, 999, 'one_rm_kg', { beginner: 82, novice: 120, intermediate: 167, advanced: 223, elite: 283 }),
  ...bracket('trap-bar-shrug', 'female', 0, 55, 'one_rm_kg', { beginner: 14, novice: 32, intermediate: 56, advanced: 87, elite: 122 }),
  ...bracket('trap-bar-shrug', 'female', 55, 999, 'one_rm_kg', { beginner: 26, novice: 46, intermediate: 75, advanced: 109, elite: 149 }),

  // trx-row
  ...bracket('trx-row', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 50 }),
  ...bracket('trx-row', 'male', 70, 90, 'reps', { beginner: 0, novice: 9, intermediate: 19, advanced: 32, elite: 46 }),
  ...bracket('trx-row', 'male', 90, 999, 'reps', { beginner: 1, novice: 9, intermediate: 18, advanced: 30, elite: 42 }),
  ...bracket('trx-row', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 12, advanced: 21, elite: 31 }),
  ...bracket('trx-row', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),

  // trx-squat
  ...bracket('trx-squat', 'male', 0, 70, 'reps', { beginner: 3, novice: 27, intermediate: 62, advanced: 106, elite: 156 }),
  ...bracket('trx-squat', 'male', 70, 90, 'reps', { beginner: 3, novice: 23, intermediate: 53, advanced: 88, elite: 128 }),
  ...bracket('trx-squat', 'male', 90, 999, 'reps', { beginner: 2, novice: 20, intermediate: 45, advanced: 75, elite: 108 }),
  ...bracket('trx-squat', 'female', 0, 55, 'reps', { beginner: 0, novice: 13, intermediate: 45, advanced: 84, elite: 130 }),
  ...bracket('trx-squat', 'female', 55, 999, 'reps', { beginner: 0, novice: 12, intermediate: 37, advanced: 68, elite: 104 }),

  // tuck-jump
  ...bracket('tuck-jump', 'male', 0, 70, 'reps', { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 40 }),
  ...bracket('tuck-jump', 'male', 70, 90, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('tuck-jump', 'male', 90, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),
  ...bracket('tuck-jump', 'female', 0, 55, 'reps', { beginner: 2, novice: 6, intermediate: 12, advanced: 20, elite: 32 }),
  ...bracket('tuck-jump', 'female', 55, 999, 'reps', { beginner: 1, novice: 5, intermediate: 10, advanced: 17, elite: 27 }),

  // turkish-get-up
  ...bracket('turkish-get-up', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('turkish-get-up', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('turkish-get-up', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('turkish-get-up', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('turkish-get-up', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // two-arm-kettlebell-military-press
  ...bracket('two-arm-kettlebell-military-press', 'male', 0, 70, 'one_rm_kg', { beginner: 8, novice: 15, intermediate: 26, advanced: 40, elite: 58 }),
  ...bracket('two-arm-kettlebell-military-press', 'male', 70, 90, 'one_rm_kg', { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 70 }),
  ...bracket('two-arm-kettlebell-military-press', 'male', 90, 999, 'one_rm_kg', { beginner: 14, novice: 24, intermediate: 40, advanced: 60, elite: 84 }),
  ...bracket('two-arm-kettlebell-military-press', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 15, advanced: 24, elite: 35 }),
  ...bracket('two-arm-kettlebell-military-press', 'female', 55, 999, 'one_rm_kg', { beginner: 6, novice: 11, intermediate: 19, advanced: 30, elite: 44 }),

  // underhand-barbell-row
  ...bracket('underhand-barbell-row', 'male', 0, 70, 'one_rm_kg', { beginner: 31, novice: 46, intermediate: 65, advanced: 87, elite: 111 }),
  ...bracket('underhand-barbell-row', 'male', 70, 90, 'one_rm_kg', { beginner: 48, novice: 66, intermediate: 88, advanced: 114, elite: 141 }),
  ...bracket('underhand-barbell-row', 'male', 90, 999, 'one_rm_kg', { beginner: 63, novice: 84, intermediate: 108, advanced: 136, elite: 166 }),
  ...bracket('underhand-barbell-row', 'female', 0, 55, 'one_rm_kg', { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 72 }),
  ...bracket('underhand-barbell-row', 'female', 55, 999, 'one_rm_kg', { beginner: 20, novice: 32, intermediate: 46, advanced: 64, elite: 83 }),

  // v-up
  ...bracket('v-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 13, intermediate: 35, advanced: 62, elite: 91 }),
  ...bracket('v-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 53, elite: 78 }),
  ...bracket('v-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 11, intermediate: 27, advanced: 46, elite: 67 }),
  ...bracket('v-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 12, intermediate: 31, advanced: 55, elite: 80 }),
  ...bracket('v-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 10, intermediate: 26, advanced: 44, elite: 64 }),

  // walking-lunge-with-twist
  ...bracket('walking-lunge-with-twist', 'male', 0, 70, 'reps', { beginner: 3, novice: 12, intermediate: 28, advanced: 48, elite: 72 }),
  ...bracket('walking-lunge-with-twist', 'male', 70, 90, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('walking-lunge-with-twist', 'male', 90, 999, 'reps', { beginner: 2, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),
  ...bracket('walking-lunge-with-twist', 'female', 0, 55, 'reps', { beginner: 2, novice: 10, intermediate: 24, advanced: 42, elite: 64 }),
  ...bracket('walking-lunge-with-twist', 'female', 55, 999, 'reps', { beginner: 1, novice: 8, intermediate: 20, advanced: 36, elite: 56 }),

  // wall-ball
  ...bracket('wall-ball', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('wall-ball', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('wall-ball', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('wall-ball', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('wall-ball', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // weighted-parallel-bar-straight-leg-raise
  ...bracket('weighted-parallel-bar-straight-leg-raise', 'male', 0, 70, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 28, elite: 40 }),
  ...bracket('weighted-parallel-bar-straight-leg-raise', 'male', 70, 90, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 23, advanced: 35, elite: 50 }),
  ...bracket('weighted-parallel-bar-straight-leg-raise', 'male', 90, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 28, advanced: 42, elite: 60 }),
  ...bracket('weighted-parallel-bar-straight-leg-raise', 'female', 0, 55, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 11, advanced: 18, elite: 26 }),
  ...bracket('weighted-parallel-bar-straight-leg-raise', 'female', 55, 999, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 14, advanced: 22, elite: 32 }),

  // weighted-pull-ups
  ...bracket('weighted-pull-ups', 'male', 0, 70, 'one_rm_kg', { beginner: 0, novice: 10, intermediate: 25, advanced: 40, elite: 60 }),
  ...bracket('weighted-pull-ups', 'male', 70, 90, 'one_rm_kg', { beginner: 0, novice: 13, intermediate: 31, advanced: 50, elite: 71 }),
  ...bracket('weighted-pull-ups', 'male', 90, 999, 'one_rm_kg', { beginner: 0, novice: 18, intermediate: 38, advanced: 60, elite: 85 }),
  ...bracket('weighted-pull-ups', 'female', 0, 55, 'one_rm_kg', { beginner: 0, novice: 3, intermediate: 8, advanced: 21, elite: 35 }),
  ...bracket('weighted-pull-ups', 'female', 55, 999, 'one_rm_kg', { beginner: 0, novice: 5, intermediate: 12, advanced: 27, elite: 42 }),

  // wide-grip-barbell-bench-press
  ...bracket('wide-grip-barbell-bench-press', 'male', 0, 70, 'one_rm_kg', { beginner: 34, novice: 50, intermediate: 71, advanced: 95, elite: 121 }),
  ...bracket('wide-grip-barbell-bench-press', 'male', 70, 90, 'one_rm_kg', { beginner: 51, novice: 71, intermediate: 95, advanced: 123, elite: 152 }),
  ...bracket('wide-grip-barbell-bench-press', 'male', 90, 999, 'one_rm_kg', { beginner: 67, novice: 90, intermediate: 116, advanced: 147, elite: 179 }),
  ...bracket('wide-grip-barbell-bench-press', 'female', 0, 55, 'one_rm_kg', { beginner: 17, novice: 28, intermediate: 43, advanced: 61, elite: 81 }),
  ...bracket('wide-grip-barbell-bench-press', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 37, intermediate: 53, advanced: 73, elite: 95 }),

  // wide-grip-barbell-curl
  ...bracket('wide-grip-barbell-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 12, novice: 20, intermediate: 32, advanced: 47, elite: 62 }),
  ...bracket('wide-grip-barbell-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 19, novice: 29, intermediate: 42, advanced: 60, elite: 77 }),
  ...bracket('wide-grip-barbell-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 24, novice: 36, intermediate: 51, advanced: 69, elite: 89 }),
  ...bracket('wide-grip-barbell-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 20, advanced: 31, elite: 41 }),
  ...bracket('wide-grip-barbell-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 9, novice: 16, intermediate: 25, advanced: 35, elite: 48 }),

  // wide-grip-lat-pulldown
  ...bracket('wide-grip-lat-pulldown', 'male', 0, 70, 'one_rm_kg', { beginner: 28, novice: 42, intermediate: 62, advanced: 84, elite: 107 }),
  ...bracket('wide-grip-lat-pulldown', 'male', 70, 90, 'one_rm_kg', { beginner: 40, novice: 57, intermediate: 78, advanced: 102, elite: 128 }),
  ...bracket('wide-grip-lat-pulldown', 'male', 90, 999, 'one_rm_kg', { beginner: 50, novice: 69, intermediate: 91, advanced: 117, elite: 145 }),
  ...bracket('wide-grip-lat-pulldown', 'female', 0, 55, 'one_rm_kg', { beginner: 20, novice: 30, intermediate: 41, advanced: 55, elite: 69 }),
  ...bracket('wide-grip-lat-pulldown', 'female', 55, 999, 'one_rm_kg', { beginner: 25, novice: 35, intermediate: 46, advanced: 61, elite: 77 }),

  // wide-grip-pull-up
  ...bracket('wide-grip-pull-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 7, intermediate: 14, advanced: 23, elite: 33 }),
  ...bracket('wide-grip-pull-up', 'male', 70, 90, 'reps', { beginner: 1, novice: 7, intermediate: 13, advanced: 21, elite: 29 }),
  ...bracket('wide-grip-pull-up', 'male', 90, 999, 'reps', { beginner: 0, novice: 6, intermediate: 11, advanced: 18, elite: 25 }),
  ...bracket('wide-grip-pull-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 0, intermediate: 6, advanced: 13, elite: 22 }),
  ...bracket('wide-grip-pull-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 0, intermediate: 5, advanced: 11, elite: 18 }),

  // wide-grip-seated-cable-row
  ...bracket('wide-grip-seated-cable-row', 'male', 0, 70, 'one_rm_kg', { beginner: 27, novice: 42, intermediate: 61, advanced: 84, elite: 109 }),
  ...bracket('wide-grip-seated-cable-row', 'male', 70, 90, 'one_rm_kg', { beginner: 40, novice: 58, intermediate: 79, advanced: 106, elite: 135 }),
  ...bracket('wide-grip-seated-cable-row', 'male', 90, 999, 'one_rm_kg', { beginner: 51, novice: 72, intermediate: 97, advanced: 124, elite: 155 }),
  ...bracket('wide-grip-seated-cable-row', 'female', 0, 55, 'one_rm_kg', { beginner: 18, novice: 28, intermediate: 40, advanced: 55, elite: 70 }),
  ...bracket('wide-grip-seated-cable-row', 'female', 55, 999, 'one_rm_kg', { beginner: 24, novice: 34, intermediate: 47, advanced: 63, elite: 81 }),

  // wide-incline-push-up
  ...bracket('wide-incline-push-up', 'male', 0, 70, 'reps', { beginner: 0, novice: 10, intermediate: 31, advanced: 56, elite: 83 }),
  ...bracket('wide-incline-push-up', 'male', 70, 90, 'reps', { beginner: 0, novice: 13, intermediate: 31, advanced: 52, elite: 76 }),
  ...bracket('wide-incline-push-up', 'male', 90, 999, 'reps', { beginner: 2, novice: 14, intermediate: 30, advanced: 48, elite: 69 }),
  ...bracket('wide-incline-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 4, intermediate: 16, advanced: 32, elite: 49 }),
  ...bracket('wide-incline-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 31, elite: 45 }),

  // wide-push-up
  ...bracket('wide-push-up', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 41, advanced: 67, elite: 95 }),
  ...bracket('wide-push-up', 'male', 70, 90, 'reps', { beginner: 6, novice: 20, intermediate: 38, advanced: 60, elite: 84 }),
  ...bracket('wide-push-up', 'male', 90, 999, 'reps', { beginner: 6, novice: 19, intermediate: 35, advanced: 54, elite: 74 }),
  ...bracket('wide-push-up', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 51 }),
  ...bracket('wide-push-up', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 43 }),

  // wide-push-ups
  ...bracket('wide-push-ups', 'male', 0, 70, 'reps', { beginner: 4, novice: 19, intermediate: 41, advanced: 67, elite: 95 }),
  ...bracket('wide-push-ups', 'male', 70, 90, 'reps', { beginner: 6, novice: 20, intermediate: 38, advanced: 60, elite: 84 }),
  ...bracket('wide-push-ups', 'male', 90, 999, 'reps', { beginner: 6, novice: 19, intermediate: 35, advanced: 54, elite: 74 }),
  ...bracket('wide-push-ups', 'female', 0, 55, 'reps', { beginner: 0, novice: 7, intermediate: 19, advanced: 34, elite: 51 }),
  ...bracket('wide-push-ups', 'female', 55, 999, 'reps', { beginner: 0, novice: 7, intermediate: 17, advanced: 30, elite: 43 }),

  // wrist-roller
  ...bracket('wrist-roller', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 6, intermediate: 10, advanced: 16, elite: 22 }),
  ...bracket('wrist-roller', 'male', 70, 90, 'one_rm_kg', { beginner: 4, novice: 8, intermediate: 13, advanced: 20, elite: 28 }),
  ...bracket('wrist-roller', 'male', 90, 999, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 16, advanced: 24, elite: 33 }),
  ...bracket('wrist-roller', 'female', 0, 55, 'one_rm_kg', { beginner: 1, novice: 3, intermediate: 5, advanced: 9, elite: 13 }),
  ...bracket('wrist-roller', 'female', 55, 999, 'one_rm_kg', { beginner: 2, novice: 4, intermediate: 7, advanced: 11, elite: 16 }),

  // yates-row
  ...bracket('yates-row', 'male', 0, 70, 'one_rm_kg', { beginner: 37, novice: 53, intermediate: 74, advanced: 98, elite: 124 }),
  ...bracket('yates-row', 'male', 70, 90, 'one_rm_kg', { beginner: 57, novice: 77, intermediate: 101, advanced: 129, elite: 159 }),
  ...bracket('yates-row', 'male', 90, 999, 'one_rm_kg', { beginner: 75, novice: 98, intermediate: 126, advanced: 157, elite: 189 }),
  ...bracket('yates-row', 'female', 0, 55, 'one_rm_kg', { beginner: 21, novice: 31, intermediate: 44, advanced: 59, elite: 75 }),
  ...bracket('yates-row', 'female', 55, 999, 'one_rm_kg', { beginner: 30, novice: 41, intermediate: 56, advanced: 72, elite: 90 }),

  // z-press
  ...bracket('z-press', 'male', 0, 70, 'one_rm_kg', { beginner: 20, novice: 31, intermediate: 45, advanced: 62, elite: 81 }),
  ...bracket('z-press', 'male', 70, 90, 'one_rm_kg', { beginner: 29, novice: 42, intermediate: 58, advanced: 78, elite: 99 }),
  ...bracket('z-press', 'male', 90, 999, 'one_rm_kg', { beginner: 37, novice: 51, intermediate: 70, advanced: 91, elite: 113 }),
  ...bracket('z-press', 'female', 0, 55, 'one_rm_kg', { beginner: 7, novice: 13, intermediate: 22, advanced: 33, elite: 46 }),
  ...bracket('z-press', 'female', 55, 999, 'one_rm_kg', { beginner: 11, novice: 19, intermediate: 30, advanced: 43, elite: 57 }),

  // zercher-squat
  ...bracket('zercher-squat', 'male', 0, 70, 'one_rm_kg', { beginner: 37, novice: 58, intermediate: 85, advanced: 117, elite: 152 }),
  ...bracket('zercher-squat', 'male', 70, 90, 'one_rm_kg', { beginner: 57, novice: 82, intermediate: 113, advanced: 149, elite: 188 }),
  ...bracket('zercher-squat', 'male', 90, 999, 'one_rm_kg', { beginner: 74, novice: 102, intermediate: 137, advanced: 177, elite: 219 }),
  ...bracket('zercher-squat', 'female', 0, 55, 'one_rm_kg', { beginner: 21, novice: 34, intermediate: 52, advanced: 73, elite: 96 }),
  ...bracket('zercher-squat', 'female', 55, 999, 'one_rm_kg', { beginner: 29, novice: 45, intermediate: 65, advanced: 88, elite: 114 }),

  // zottman-curl
  ...bracket('zottman-curl', 'male', 0, 70, 'one_rm_kg', { beginner: 3, novice: 8, intermediate: 15, advanced: 24, elite: 36 }),
  ...bracket('zottman-curl', 'male', 70, 90, 'one_rm_kg', { beginner: 5, novice: 10, intermediate: 18, advanced: 29, elite: 41 }),
  ...bracket('zottman-curl', 'male', 90, 999, 'one_rm_kg', { beginner: 6, novice: 12, intermediate: 21, advanced: 32, elite: 45 }),
  ...bracket('zottman-curl', 'female', 0, 55, 'one_rm_kg', { beginner: 4, novice: 6, intermediate: 10, advanced: 13, elite: 17 }),
  ...bracket('zottman-curl', 'female', 55, 999, 'one_rm_kg', { beginner: 5, novice: 8, intermediate: 11, advanced: 15, elite: 19 }),
];
