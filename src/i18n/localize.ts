import { useTranslation } from 'react-i18next';

/** Choisit le champ anglais si la langue active est 'en' et qu'il est renseigné, sinon le français. */
export function pickLocalized(language: string, fr: string, en: string | null | undefined): string {
  return language === 'en' && en ? en : fr;
}

/** `localize(fr, en)` lié à la langue active, recalculé à chaque changement de langue (re-render via useTranslation). */
export function useLocalize() {
  const { i18n } = useTranslation();
  return (fr: string, en: string | null | undefined) => pickLocalized(i18n.language, fr, en);
}
