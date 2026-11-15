export type OneRmFormulaId = 'epley' | 'brzycki' | 'lombardi';

interface OneRmFormula {
  id: OneRmFormulaId;
  label: string;
  calculate(weightKg: number, reps: number): number;
}

const epley: OneRmFormula = {
  id: 'epley',
  label: 'Epley',
  calculate: (w, r) => (r <= 1 ? w : w * (1 + r / 30)),
};

const brzycki: OneRmFormula = {
  id: 'brzycki',
  label: 'Brzycki',
  calculate: (w, r) => (r <= 1 ? w : w * (36 / (37 - r))),
};

const lombardi: OneRmFormula = {
  id: 'lombardi',
  label: 'Lombardi',
  calculate: (w, r) => (r <= 1 ? w : w * Math.pow(r, 0.1)),
};

export const oneRmFormulas: Record<OneRmFormulaId, OneRmFormula> = { epley, brzycki, lombardi };

export const defaultOneRmFormulaId: OneRmFormulaId = 'epley';

export function calculateOneRm(
  weightKg: number,
  reps: number,
  formulaId: OneRmFormulaId = defaultOneRmFormulaId,
): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  return Math.round(oneRmFormulas[formulaId].calculate(weightKg, reps) * 10) / 10;
}
