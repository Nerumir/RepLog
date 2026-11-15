import { splitTypeInfo, type SplitType } from '@/domain/splitTypes';
import type { EquipmentId } from '@/domain/types';

export interface ProgramGeneratorInput {
  availableEquipment: EquipmentId[];
  sessionsPerWeek: number;
  splitType: SplitType;
  goal?: 'strength' | 'hypertrophy' | 'general';
}

export interface NewSessionTemplateInput {
  name: string;
  defaultRestSeconds: number;
  exercises: never[]; // rempli manuellement, ou par une future v2 de l'algorithme
}

export interface NewProgramInput {
  name: string;
  splitType: SplitType;
  sessionsPerWeek: number;
  source: 'generated';
}

export interface ExerciseCatalogRow {
  id: string;
  primaryMuscleIds: string[];
  equipmentIds: EquipmentId[];
}

export interface ProgramGeneratorResult {
  program: NewProgramInput;
  sessionTemplates: NewSessionTemplateInput[];
  warnings: string[];
}

/**
 * Stub volontaire : crée la structure de séances vides selon le split et le nombre de
 * jours choisis. La sélection réelle des exercices (par groupe musculaire ciblé par jour
 * + équipement disponible) sera implémentée une fois le catalogue d'exercices rempli.
 */
export function generateProgram(
  input: ProgramGeneratorInput,
  _catalog: ExerciseCatalogRow[],
): ProgramGeneratorResult {
  const dayLabels = splitTypeInfo[input.splitType].dayLabels(input.sessionsPerWeek);

  return {
    program: {
      name: `Programme ${splitTypeInfo[input.splitType].label}`,
      splitType: input.splitType,
      sessionsPerWeek: input.sessionsPerWeek,
      source: 'generated',
    },
    sessionTemplates: dayLabels.map((label) => ({
      name: label,
      defaultRestSeconds: 90,
      exercises: [],
    })),
    warnings: [
      'Génération automatique non implémentée — catalogue insuffisant. Séances vides créées, à compléter manuellement.',
    ],
  };
}
