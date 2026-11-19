/** Nombre de séances que la version gratuite permet de terminer avant de devoir débloquer la version illimitée. */
export const FREE_SESSION_LIMIT = 10;

const CODE_ALPHABET_HINT = 'RLOG-XXXX-XXXX';

/**
 * Hash non cryptographique (FNV-1a) volontairement choisi pour éviter une dépendance native
 * supplémentaire : suffisant pour ne pas exposer les codes en clair dans le bundle JS, pour un
 * usage "cadeau à des proches" plutôt qu'une protection anti-piratage à toute épreuve.
 */
function fnv1aHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function normalizePremiumCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

/** Empreintes des codes valides (générés hors-app, jamais stockés en clair dans le code source). */
const VALID_PREMIUM_CODE_HASHES = new Set<string>([
  '4eefb951',
  'f543b272',
  '7ac70d74',
  'dca65e92',
  '96ebfa05',
  'a8546927',
  '577a29a3',
  '99bf2aa8',
  '75863e12',
  '500329cf',
  'e3d9af23',
  '3e273248',
  '6298685c',
  '00c4890f',
  '60ef6ed1',
]);

export function isValidPremiumCode(raw: string): boolean {
  if (!raw.trim()) return false;
  return VALID_PREMIUM_CODE_HASHES.has(fnv1aHash(normalizePremiumCode(raw)));
}

export { CODE_ALPHABET_HINT };
