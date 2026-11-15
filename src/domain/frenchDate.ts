/** Formate une saisie en cours (chiffres tapés librement) en JJ/MM/AAAA. */
export function formatFrenchDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join('/');
}

/** Valide une date JJ/MM/AAAA complète et la convertit en ISO (AAAA-MM-JJ) ; null si invalide. */
export function parseFrenchDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;
  return `${yyyy}-${mm}-${dd}`;
}

/** Convertit une date ISO (AAAA-MM-JJ) stockée en base vers l'affichage JJ/MM/AAAA. */
export function toFrenchDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return '';
  const [, yyyy, mm, dd] = match;
  return `${dd}/${mm}/${yyyy}`;
}
