import type { SplitType } from '@/domain/splitTypes';

export interface ProgramSeed {
  name: string;
  splitType: SplitType;
  sessionsPerWeek: number;
  sessionTemplateNames: string[]; // référence par nom vers sessionTemplatesSeed
}

export const programsSeed: ProgramSeed[] = [
  {
    name: 'Programme Démo',
    splitType: 'full_body',
    sessionsPerWeek: 1,
    sessionTemplateNames: ['Séance Démo Full Body'],
  },
];
