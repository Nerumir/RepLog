export interface SessionTemplateSeed {
  name: string;
  defaultRestSeconds: number;
  exercises: {
    exerciseId: string;
    orderIndex: number;
    restSecondsOverride?: number;
    sets: { setIndex: number; targetReps: number; targetWeightKg: number }[];
  }[];
}

export const sessionTemplatesSeed: SessionTemplateSeed[] = [
  {
    name: 'Séance Démo Full Body',
    defaultRestSeconds: 90,
    exercises: [
      {
        exerciseId: 'bench-press',
        orderIndex: 0,
        sets: [
          { setIndex: 0, targetReps: 8, targetWeightKg: 60 },
          { setIndex: 1, targetReps: 8, targetWeightKg: 60 },
          { setIndex: 2, targetReps: 8, targetWeightKg: 60 },
        ],
      },
      {
        exerciseId: 'back-squat',
        orderIndex: 1,
        restSecondsOverride: 120,
        sets: [
          { setIndex: 0, targetReps: 8, targetWeightKg: 80 },
          { setIndex: 1, targetReps: 8, targetWeightKg: 80 },
          { setIndex: 2, targetReps: 8, targetWeightKg: 80 },
        ],
      },
      {
        exerciseId: 'pull-up',
        orderIndex: 2,
        sets: [
          { setIndex: 0, targetReps: 8, targetWeightKg: 75 },
          { setIndex: 1, targetReps: 8, targetWeightKg: 75 },
          { setIndex: 2, targetReps: 8, targetWeightKg: 75 },
        ],
      },
    ],
  },
];
