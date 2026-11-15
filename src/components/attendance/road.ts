import { Dimensions } from 'react-native';

import { mulberry32 } from './random';
import type { Pt } from './shapes';

// Largeur réelle de l'écran plutôt qu'une valeur fixe : évite les bandes vides sur les côtés
// quand le canevas (360 à l'origine) est plus étroit que l'appareil réel.
export const CANVAS_WIDTH = Dimensions.get('window').width;
export const POINT_SPACING_Y = 100;
export const TOP_MARGIN = 80;
export const BOTTOM_MARGIN = 60;

const ROAD_MARGIN = 60;
const ROAD_MIN_X = ROAD_MARGIN;
const ROAD_MAX_X = CANVAS_WIDTH - ROAD_MARGIN;

/** Échelle "proche" (bas du biome, point 0) vs "lointaine" (haut du biome) pour l'illusion de profondeur. */
export const NEAR_SCALE = 1.15;
export const FAR_SCALE = 0.68;

/** Échelle de profondeur pour un point du décor/route, selon sa position verticale dans le biome. */
export function depthScaleForY(y: number, height: number): number {
  const t = Math.max(0, Math.min(1, y / height));
  return FAR_SCALE + (NEAR_SCALE - FAR_SCALE) * t;
}

/**
 * Génère un tracé de route sinueux : somme de plusieurs harmoniques à fréquences
 * incommensurables (virages serrés dominants + variation plus lente + texture fine) plus un
 * léger bruit par point. La combinaison ne se répète jamais exactement sur la longueur d'un
 * biome — ça lit comme une vraie route de montagne, pas un zigzag mécanique ni une sinusoïde
 * pure. Déterministe pour un `seed` donné (stable entre deux rendus, différent par biome).
 */
export function buildRoadPoints(totalPoints: number, seed: number): Pt[] {
  const random = mulberry32(seed);
  const centerX = (ROAD_MIN_X + ROAD_MAX_X) / 2;
  const amplitude = (ROAD_MAX_X - ROAD_MIN_X) / 2;

  const harmonics = [
    { freq: 0.5 + random() * 0.3, weight: 1 },
    { freq: 1.0 + random() * 0.5, weight: 0.55 },
    { freq: 0.15 + random() * 0.1, weight: 0.4 },
  ].map((h) => ({ ...h, phase: random() * Math.PI * 2 }));
  const totalWeight = harmonics.reduce((sum, h) => sum + h.weight, 0);

  const points: Pt[] = [];
  for (let i = 0; i < totalPoints; i += 1) {
    const y = (totalPoints - 1 - i) * POINT_SPACING_Y + BOTTOM_MARGIN;
    let offset = 0;
    for (const h of harmonics) {
      offset += Math.sin(i * h.freq + h.phase) * h.weight;
    }
    offset /= totalWeight;
    const jitter = (random() - 0.5) * 7;
    const x = Math.max(ROAD_MIN_X, Math.min(ROAD_MAX_X, centerX + offset * amplitude * 0.92 + jitter));
    points.push({ x, y });
  }
  return points;
}

/**
 * Position x approximative de la route pour une ordonnée `y` donnée (interpolation linéaire
 * entre les deux points encadrants). Permet au décor de se placer au plus près de la route
 * réelle (courbe) plutôt que de respecter une marge fixe indépendante de sa position.
 */
export function roadXAtY(points: Pt[], y: number): number {
  if (points.length === 0) return (ROAD_MIN_X + ROAD_MAX_X) / 2;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (y <= a.y && y >= b.y) {
      const t = a.y === b.y ? 0 : (a.y - y) / (a.y - b.y);
      return a.x + (b.x - a.x) * t;
    }
  }
  return y > points[0].y ? points[0].x : points[points.length - 1].x;
}

export function roadTotalHeight(totalPoints: number): number {
  return (totalPoints - 1) * POINT_SPACING_Y + BOTTOM_MARGIN + TOP_MARGIN;
}

function catmullRomPoint(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/** Sur-échantillonne le tracé via Catmull-Rom pour obtenir une courbe fine et régulière. */
export function sampleRoadCurve(points: Pt[], subdivisions = 8): Pt[] {
  if (points.length < 2) return points;
  const result: Pt[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < subdivisions; s += 1) {
      result.push(catmullRomPoint(p0, p1, p2, p3, s / subdivisions));
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

/**
 * Construit un ruban (polygone fermé) suivant la courbe, dont la demi-largeur rétrécit avec
 * la profondeur — effet de perspective façon route qui s'éloigne vers l'horizon.
 */
export function buildRoadRibbonPolygon(samples: Pt[], height: number, baseHalfWidth: number): Pt[] {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < samples.length; i += 1) {
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(samples.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const halfWidth = baseHalfWidth * depthScaleForY(samples[i].y, height);
    left.push({ x: samples[i].x + nx * halfWidth, y: samples[i].y + ny * halfWidth });
    right.push({ x: samples[i].x - nx * halfWidth, y: samples[i].y - ny * halfWidth });
  }
  return [...left, ...right.reverse()];
}
