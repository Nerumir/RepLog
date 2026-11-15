export function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Valeur pseudo-aléatoire stable pour un couple (seed, index) donné, sans état partagé. */
export function hashRandom(seed: number, index: number): number {
  return mulberry32(seed + index * 104729)();
}
