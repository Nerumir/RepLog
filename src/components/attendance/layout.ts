import { mulberry32 } from './random';
import { CANVAS_WIDTH, depthScaleForY, roadXAtY, TOP_MARGIN } from './road';
import type { Pt } from './shapes';

// Marge minimale par rapport au bord du canevas (le décor peut quasiment le frôler) et
// dégagement minimal par rapport au centre de la route (évite le chevauchement avec son ruban).
const EDGE_MARGIN = 10;
const ROAD_CLEARANCE = 24;
// Marge supplémentaire entre deux hitbox voisines, pour éviter qu'elles se touchent pile.
const HITBOX_PADDING = 8;
const PLACEMENT_ATTEMPTS = 14;

export interface DecorPlacement extends Pt {
  scale: number;
}

export interface DecorRequest {
  seed: number;
  /** Espacement vertical visé entre deux emplacements candidats pour ce type. */
  step: number;
  /** Largeur et hauteur "nature" (à l'échelle 1) du composant, utilisées comme hitbox. */
  naturalWidth: number;
  naturalHeight: number;
  /** Multiplicateur de taille indépendant de la profondeur (ex: variantes plus petites). */
  baseScale?: number;
  /** Pour un élément "large" (ex: montagne) : largeur cible avant application de la profondeur. */
  targetWidth?: number;
}

interface PlacedHitbox {
  x: number;
  y: number;
  halfWidth: number;
  /** Hauteur de l'élément au-dessus de son point d'ancrage (y). */
  topReach: number;
}

/** Aire approximative (indépendante de la profondeur) servant à ordonner les priorités de placement. */
function approximateFootprintArea(req: DecorRequest): number {
  if (req.targetWidth) return req.targetWidth * req.naturalHeight;
  const s = req.baseScale ?? 1;
  return req.naturalWidth * s * req.naturalHeight * s;
}

/**
 * Position min/max de la route sur toute la hauteur occupée par un élément (de `y - topReach` à
 * `y`), et non à sa seule ancre : la route peut suffisamment "zigzaguer" sur la hauteur d'un
 * élément large (ex: un lac) pour que vérifier un seul point ne suffise pas à éviter le chevauchement.
 */
function roadXRangeOverSpan(roadPoints: Pt[], yAnchor: number, topReach: number): { min: number; max: number } {
  const samples = 5;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < samples; i += 1) {
    const y = yAnchor - (topReach * i) / (samples - 1);
    const x = roadXAtY(roadPoints, y);
    if (x < min) min = x;
    if (x > max) max = x;
  }
  return { min, max };
}

function hitboxesOverlap(a: PlacedHitbox, b: PlacedHitbox): boolean {
  const xOverlap = Math.abs(a.x - b.x) < a.halfWidth + b.halfWidth + HITBOX_PADDING;
  if (!xOverlap) return false;
  const aTop = a.y - a.topReach - HITBOX_PADDING;
  const aBottom = a.y + HITBOX_PADDING;
  const bTop = b.y - b.topReach - HITBOX_PADDING;
  const bBottom = b.y + HITBOX_PADDING;
  return aTop <= bBottom && bTop <= aBottom;
}

/**
 * Place plusieurs types de décor dans un même biome en tenant compte de la hitbox réelle
 * (largeur + hauteur au-dessus du point d'ancrage) de chaque élément déjà posé, tous types
 * confondus — un bateau ne peut donc plus se retrouver sous un palais, une maison sur un arbre,
 * etc. Les types avec la plus grande emprise sont placés en premier (ils ont la priorité sur
 * l'espace disponible) ; un emplacement sans place suffisante ou qui chevaucherait un élément
 * déjà posé est simplement ignoré après quelques tentatives — mieux vaut un trou qu'un chevauchement.
 */
export function planDecor(height: number, roadPoints: Pt[], requestsByType: Record<string, DecorRequest>): Record<string, DecorPlacement[]> {
  const placed: PlacedHitbox[] = [];
  const result: Record<string, DecorPlacement[]> = {};

  const orderedTypes = Object.keys(requestsByType).sort(
    (a, b) => approximateFootprintArea(requestsByType[b]) - approximateFootprintArea(requestsByType[a]),
  );

  for (const type of orderedTypes) {
    const req = requestsByType[type];
    const random = mulberry32(req.seed);
    const count = Math.max(0, Math.floor((height - TOP_MARGIN) / req.step));
    const yJitter = req.step * 0.3;
    const items: DecorPlacement[] = [];

    for (let i = 0; i < count; i += 1) {
      const y = height - TOP_MARGIN - i * req.step + (random() - 0.5) * 2 * yJitter;
      const depth = depthScaleForY(y, height);
      const scale = req.targetWidth ? (req.targetWidth / req.naturalWidth) * depth : depth * (req.baseScale ?? 1);
      const halfWidth = (req.naturalWidth * scale) / 2;
      const topReach = req.naturalHeight * scale;

      const { min: roadXMin, max: roadXMax } = roadXRangeOverSpan(roadPoints, y, topReach);
      const leftSpace = roadXMin - ROAD_CLEARANCE - EDGE_MARGIN;
      const rightSpace = CANVAS_WIDTH - EDGE_MARGIN - (roadXMax + ROAD_CLEARANCE);
      const sides: ('left' | 'right')[] = [];
      if (leftSpace >= halfWidth * 2) sides.push('left');
      if (rightSpace >= halfWidth * 2) sides.push('right');
      if (sides.length === 0) continue;

      for (let attempt = 0; attempt < PLACEMENT_ATTEMPTS; attempt += 1) {
        const side = sides[Math.floor(random() * sides.length)];
        const x =
          side === 'left'
            ? EDGE_MARGIN + halfWidth + random() * Math.max(0, leftSpace - halfWidth * 2)
            : roadXMax + ROAD_CLEARANCE + halfWidth + random() * Math.max(0, rightSpace - halfWidth * 2);

        const candidate: PlacedHitbox = { x, y, halfWidth, topReach };
        if (placed.some((p) => hitboxesOverlap(p, candidate))) continue;

        items.push({ x, y, scale });
        placed.push(candidate);
        break;
      }
    }

    result[type] = items;
  }

  return result;
}
