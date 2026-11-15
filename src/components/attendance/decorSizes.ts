/**
 * Dimensions "nature" (largeur, hauteur au-dessus du point d'ancrage) de chaque type de décor à
 * l'échelle 1, utilisées comme hitbox par `planDecor` pour garantir qu'aucun élément ne se
 * superpose à un autre. Doivent rester cohérentes avec la géométrie réelle dans Decor.tsx.
 */
export const DECOR_SIZE = {
  tree: { width: 46, height: 150 },
  deadTree: { width: 60, height: 90 },
  igloo: { width: 66, height: 36 },
  hut: { width: 40, height: 68 },
  mountain: { width: 60, height: 36 },
  cactus: { width: 50, height: 80 },
  vikingShip: { width: 108, height: 72 },
  palace: { width: 66, height: 124 },
  lake: { width: 84, height: 42 },
  npc: { width: 40, height: 56 },
} as const;
