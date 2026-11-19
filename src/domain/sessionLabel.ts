import i18n from '@/i18n';

/** Construit le libellé d'une séance à partir des groupes musculaires primaires de ses exercices. */
export function buildSessionLabel(primaryMuscleNames: string[]): string {
  const unique = Array.from(new Set(primaryMuscleNames));
  return unique.length > 0 ? unique.join(', ') : i18n.t('sessionLabel.fallback');
}
