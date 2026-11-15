export type ExerciseEquipmentBucket = 'bodyweight' | 'free-weight' | 'machine';

export const EQUIPMENT_BUCKETS: { id: ExerciseEquipmentBucket; label: string }[] = [
  { id: 'free-weight', label: 'Poids, haltères et barres' },
  { id: 'machine', label: 'Machines' },
  { id: 'bodyweight', label: 'Poids du corps' },
];

const FREE_WEIGHT_EQUIPMENT = new Set(['dumbbell', 'barbell', 'kettlebell', 'ez-bar', 'trap-bar', 'medicine-ball']);

/**
 * Regroupe le matériel détaillé du catalogue en 3 catégories pour la navigation de l'onglet
 * Exercices. Le poids du corps prime sur tout le reste (tractions, dips... restent "Poids du
 * corps" même s'ils nécessitent une barre de traction) ; tout ce qui n'est ni poids du corps ni
 * un poids libre tombe dans "Machines" (machines guidées, poulies, etc.).
 */
export function bucketForEquipment(equipmentIds: string[]): ExerciseEquipmentBucket {
  if (equipmentIds.includes('bodyweight')) return 'bodyweight';
  if (equipmentIds.length === 1 && equipmentIds[0] === 'trx') return 'bodyweight';
  if (equipmentIds.some((id) => FREE_WEIGHT_EQUIPMENT.has(id))) return 'free-weight';
  return 'machine';
}
