export type Sex = 'male' | 'female';

export type EquipmentId =
  | 'bodyweight'
  | 'dumbbell'
  | 'barbell'
  | 'ez-bar'
  | 'trap-bar'
  | 'kettlebell'
  | 'cable'
  | 'band'
  | 'machine'
  | 'smith-machine'
  | 'bench'
  | 'medicine-ball'
  | 'trx'
  | 'other';

export type MuscleRole = 'primary' | 'secondary';

export type PerformanceLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export type ProgramSource = 'manual' | 'generated';

export type SessionStatus = 'in_progress' | 'completed' | 'aborted';
