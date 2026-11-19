import i18n from '@/i18n';
import type { EquipmentId } from '@/domain/types';
import { muscleTargetsForSession, splitTypeInfo, type SplitType } from '@/domain/splitTypes';

export type ProgramGoal = 'hypertrophy' | 'general_fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

const MINUTES_PER_EXERCISE = 10;

/** Vue aplatie d'un exercice du catalogue, telle que fournie par `listExercisesForGeneration`. */
export interface GenerationExerciseRow {
  id: string;
  name: string;
  nameEn: string;
  isAdvanced: boolean;
  primaryMuscleIds: string[];
  /** Primaire + secondaire, dédupliqués : sert à estimer si le mouvement est polyarticulaire. */
  allMuscleIds: string[];
  equipmentIds: EquipmentId[];
}

export interface ProgramGeneratorInput {
  splitType: SplitType;
  sessionsPerWeek: number;
  /** Matériel réellement à disposition de l'utilisateur (liste détaillée, pas les 3 catégories de l'onglet Exercices). */
  availableEquipment: EquipmentId[];
  goal: ProgramGoal;
  experience: ExperienceLevel;
  minutesPerSession: number;
}

export interface GeneratedExercise {
  exerciseId: string;
  exerciseName: string;
  exerciseNameEn: string;
  isBodyweight: boolean;
}

export interface GeneratedSession {
  name: string;
  defaultRestSeconds: number;
  exercises: GeneratedExercise[];
}

export interface ProgramGeneratorResult {
  programName: string;
  splitType: SplitType;
  sessionsPerWeek: number;
  sessions: GeneratedSession[];
  warnings: string[];
}

/** Heuristique polyarticulaire : un mouvement qui recrute 3 groupes musculaires ou plus (primaire + secondaire). */
function isCompound(exercise: GenerationExerciseRow): boolean {
  return exercise.allMuscleIds.length >= 3;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Exercices non encore utilisés dans le programme en premier (variété sur la semaine), le reste mélangé derrière. */
function rankByUsage(pool: GenerationExerciseRow[], usedIds: Set<string>): GenerationExerciseRow[] {
  const unused = shuffle(pool.filter((ex) => !usedIds.has(ex.id)));
  const used = shuffle(pool.filter((ex) => usedIds.has(ex.id)));
  return [...unused, ...used];
}

function pickSessionExercises(
  pool: GenerationExerciseRow[],
  targetMuscles: string[],
  exerciseCount: number,
  usedIds: Set<string>,
): GenerationExerciseRow[] {
  const chosen: GenerationExerciseRow[] = [];
  const chosenIds = new Set<string>();

  // Un exercice par groupe ciblé en priorité, pour répartir la séance plutôt que d'empiler le même muscle.
  for (const muscle of shuffle(targetMuscles)) {
    if (chosen.length >= exerciseCount) break;
    const candidate = rankByUsage(
      pool.filter((ex) => !chosenIds.has(ex.id) && ex.primaryMuscleIds.includes(muscle)),
      usedIds,
    )[0];
    if (candidate) {
      chosen.push(candidate);
      chosenIds.add(candidate.id);
    }
  }

  // Complète les créneaux restants sans contrainte de muscle précis si besoin.
  if (chosen.length < exerciseCount) {
    for (const candidate of rankByUsage(pool, usedIds)) {
      if (chosen.length >= exerciseCount) break;
      if (chosenIds.has(candidate.id)) continue;
      chosen.push(candidate);
      chosenIds.add(candidate.id);
    }
  }

  return chosen;
}

/**
 * Génère un programme aléatoire respectant les contraintes de l'utilisateur. Pur (aucun accès
 * DB) : peut être rappelé à volonté pour "régénérer" sans redemander le questionnaire, à partir
 * du même catalogue déjà chargé.
 */
export function generateProgram(input: ProgramGeneratorInput, catalog: GenerationExerciseRow[]): ProgramGeneratorResult {
  const exerciseCount = Math.max(1, Math.floor(input.minutesPerSession / MINUTES_PER_EXERCISE));
  const warnings: string[] = [];

  const eligible = catalog.filter(
    (ex) =>
      ex.equipmentIds.every((id) => input.availableEquipment.includes(id)) &&
      (input.experience !== 'beginner' || !ex.isAdvanced),
  );

  const dayLabels = splitTypeInfo[input.splitType].dayLabels(input.sessionsPerWeek);
  const usedAcrossProgram = new Set<string>();
  const sessions: GeneratedSession[] = [];

  for (let sessionIndex = 0; sessionIndex < input.sessionsPerWeek; sessionIndex += 1) {
    const targetMuscles = muscleTargetsForSession(input.splitType, sessionIndex);
    const sessionPool = eligible.filter((ex) => ex.primaryMuscleIds.some((m) => targetMuscles.includes(m)));

    // Oriente la sélection selon l'objectif, avec repli sur l'ensemble du pool si trop peu de candidats.
    const preferred = sessionPool.filter((ex) => (input.goal === 'hypertrophy' ? !isCompound(ex) : isCompound(ex)));
    const rankedPool = preferred.length >= exerciseCount ? preferred : sessionPool;

    const chosen = pickSessionExercises(rankedPool, targetMuscles, exerciseCount, usedAcrossProgram);
    if (chosen.length < exerciseCount) {
      warnings.push(
        i18n.t('programGenerator.notEnoughExercises', {
          sessionIndex: sessionIndex + 1,
          dayLabel: dayLabels[sessionIndex],
          available: chosen.length,
          requested: exerciseCount,
        }),
      );
    }
    for (const ex of chosen) usedAcrossProgram.add(ex.id);

    sessions.push({
      name: dayLabels[sessionIndex],
      defaultRestSeconds: 90,
      exercises: chosen.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        exerciseNameEn: ex.nameEn,
        isBodyweight: ex.equipmentIds.includes('bodyweight'),
      })),
    });
  }

  return {
    programName: i18n.t('programGenerator.programName', { splitLabel: i18n.t(`enums.splitType.${input.splitType}.label`) }),
    splitType: input.splitType,
    sessionsPerWeek: input.sessionsPerWeek,
    sessions,
    warnings,
  };
}
