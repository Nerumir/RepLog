import { getExerciseEquipment, getExerciseMuscles, getPerformanceStandards } from '@/db/queries/exercises';
import { getBestOneRmForExercise, getBestRepsForExercise, listExerciseIdsWithLoggedSets } from '@/db/queries/workoutLogs';
import { bucketForEquipment, type ExerciseEquipmentBucket } from '@/domain/exerciseEquipmentBucket';
import type { OneRmFormulaId } from '@/domain/oneRepMax';
import { computeLevelScore, pickBracket } from '@/domain/performanceLevel';
import type { Sex } from '@/domain/types';

export interface ExercisePerformanceSummaryInput {
  exerciseId: string;
  primaryMuscleIds: string[];
  score: number | null;
  equipmentBucket: ExerciseEquipmentBucket;
}

interface ProfileForSummary {
  sex: Sex;
  bodyWeightKg: number;
  performanceResetAt: number | null;
}

/**
 * Score de niveau (1..5) et bucket d'équipement par exercice pratiqué. Centralisé ici pour que
 * l'écran Profil (agrégation par groupe musculaire) et les succès (agrégation par groupe
 * musculaire ET par catégorie de matériel) restent toujours cohérents entre eux.
 */
export async function gatherExercisePerformanceInputs(
  profile: ProfileForSummary,
  formula: OneRmFormulaId,
): Promise<ExercisePerformanceSummaryInput[]> {
  const loggedExerciseIds = await listExerciseIdsWithLoggedSets(profile.performanceResetAt);

  return Promise.all(
    loggedExerciseIds.map(async (exerciseId) => {
      const [muscles, equipmentRows, standards] = await Promise.all([
        getExerciseMuscles(exerciseId),
        getExerciseEquipment(exerciseId),
        getPerformanceStandards(exerciseId),
      ]);
      const primaryMuscleIds = muscles.filter((m) => m.role === 'primary').map((m) => m.muscleGroupId);
      const metric: 'one_rm_kg' | 'reps' = standards[0]?.metric ?? 'one_rm_kg';
      const bestOneRm =
        metric === 'reps'
          ? await getBestRepsForExercise(exerciseId, profile.performanceResetAt)
          : await getBestOneRmForExercise(exerciseId, formula, profile.performanceResetAt);
      const score =
        bestOneRm !== null
          ? computeLevelScore(bestOneRm, pickBracket(standards, profile.sex, profile.bodyWeightKg)).score
          : null;
      const equipmentBucket = bucketForEquipment(equipmentRows.map((e) => e.equipmentId));
      return { exerciseId, primaryMuscleIds, score, equipmentBucket };
    }),
  );
}
