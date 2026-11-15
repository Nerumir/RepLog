import { Skia, type SkPath } from '@shopify/react-native-skia';

export interface Pt {
  x: number;
  y: number;
}

export function emptyPath(): SkPath {
  return Skia.Path.Make();
}

export function polygonPath(points: Pt[]): SkPath {
  if (points.length === 0) return emptyPath();
  const builder = Skia.PathBuilder.Make();
  builder.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    builder.lineTo(points[i].x, points[i].y);
  }
  builder.close();
  return builder.detach();
}

/** Ligne brisée ouverte (contrairement à polygonPath, ne referme pas sur le premier point). */
export function polylinePath(points: Pt[]): SkPath {
  if (points.length === 0) return emptyPath();
  const builder = Skia.PathBuilder.Make();
  builder.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    builder.lineTo(points[i].x, points[i].y);
  }
  return builder.detach();
}

/** Chemin lissé passant par tous les points via une interpolation Catmull-Rom (courbe naturelle, pas de "sinusoïde"). */
export function smoothPath(points: Pt[]): SkPath {
  if (points.length === 0) return emptyPath();
  const builder = Skia.PathBuilder.Make();
  builder.moveTo(points[0].x, points[0].y);
  if (points.length === 1) return builder.detach();
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    builder.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  return builder.detach();
}

/** Scinde un trapèze en deux moitiés gauche/droite (facettes claire/sombre pour un rendu facetté "low-poly 3D"). */
export function splitTrapezoidHalves(
  cx: number,
  topY: number,
  bottomY: number,
  topWidth: number,
  bottomWidth: number,
): { left: Pt[]; right: Pt[] } {
  return {
    left: [
      { x: cx - topWidth / 2, y: topY },
      { x: cx, y: topY },
      { x: cx, y: bottomY },
      { x: cx - bottomWidth / 2, y: bottomY },
    ],
    right: [
      { x: cx, y: topY },
      { x: cx + topWidth / 2, y: topY },
      { x: cx + bottomWidth / 2, y: bottomY },
      { x: cx, y: bottomY },
    ],
  };
}

export function trapezoidPoints(cx: number, topY: number, bottomY: number, topWidth: number, bottomWidth: number): Pt[] {
  return [
    { x: cx - topWidth / 2, y: topY },
    { x: cx + topWidth / 2, y: topY },
    { x: cx + bottomWidth / 2, y: bottomY },
    { x: cx - bottomWidth / 2, y: bottomY },
  ];
}

/** Demi-disque (arche plate en bas, bombée en haut) — ex: embrasure de porte. Pas d'arc Skia : simple polygone fin. */
export function halfDiscPoints(cx: number, cy: number, r: number, segments = 10): Pt[] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const theta = Math.PI * (i / segments);
    return { x: cx - r * Math.cos(theta), y: cy - r * Math.sin(theta) };
  });
}

export function diamondPoints(cx: number, cy: number, width: number, height: number): Pt[] {
  return [
    { x: cx, y: cy - height / 2 },
    { x: cx + width / 2, y: cy },
    { x: cx, y: cy + height / 2 },
    { x: cx - width / 2, y: cy },
  ];
}
