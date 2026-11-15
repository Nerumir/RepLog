import { useMemo } from 'react';
import { Group, Path, RoundedRect } from '@shopify/react-native-skia';

import { polygonPath, polylinePath, type Pt } from './shapes';

export type HandItemType = 'spear' | 'bow';

export interface HandItemProps {
  type?: HandItemType;
  /** Point de préhension (où la main tient l'objet), dans le repère local du personnage. */
  gripX: number;
  gripY: number;
  scale: number;
}

const SPEAR_TILT_RAD = (20 * Math.PI) / 180;
const BOW_TILT_RAD = (40 * Math.PI) / 180;

function Spear({ gripX, gripY, scale }: { gripX: number; gripY: number; scale: number }) {
  // La main tient le milieu de la hampe : elle s'étend symétriquement de part et d'autre du grip.
  const halfLength = 27 * scale;
  const shaftWidth = 2.2 * scale;

  const tip = useMemo(
    () =>
      polygonPath([
        { x: 0, y: -halfLength - 9 * scale },
        { x: -3.5 * scale, y: -halfLength },
        { x: 3.5 * scale, y: -halfLength },
      ]),
    [halfLength, scale],
  );

  return (
    <Group transform={[{ translateX: gripX }, { translateY: gripY }, { rotate: SPEAR_TILT_RAD }]}>
      <RoundedRect x={-shaftWidth / 2} y={-halfLength} width={shaftWidth} height={halfLength * 2} r={1} color="#6B4226" />
      <Path path={tip} color="#9AA3AD" />
    </Group>
  );
}

/**
 * Points du galbe de l'arc : la poignée (centre du galbe, point le plus bombé) est à l'origine
 * locale — c'est elle que tient la main, pas la corde. La corde (aux deux extrémités) se
 * retrouve donc côté personnage (x local négatif), le ventre de l'arc bombant vers l'extérieur.
 */
function buildBowCurvePoints(radius: number): Pt[] {
  const segments = 8;
  const edgeDeg = 65;
  return Array.from({ length: segments + 1 }, (_, i) => {
    const deg = -edgeDeg + (2 * edgeDeg * i) / segments;
    const rad = (deg * Math.PI) / 180;
    return { x: radius * (Math.cos(rad) - 1), y: radius * Math.sin(rad) };
  });
}

/** Corde de l'arc : dessinée séparément car elle doit passer derrière le personnage. */
function BowString({ gripX, gripY, scale }: { gripX: number; gripY: number; scale: number }) {
  const radius = 22 * scale;
  const points = useMemo(() => buildBowCurvePoints(radius), [radius]);
  const stringPath = useMemo(() => polylinePath([points[0], points[points.length - 1]]), [points]);

  return (
    <Group transform={[{ translateX: gripX }, { translateY: gripY }, { rotate: BOW_TILT_RAD }]}>
      <Path path={stringPath} style="stroke" strokeWidth={1 * scale} color="#D8D0C0" opacity={0.85} />
    </Group>
  );
}

/** Galbe de l'arc : la poignée (prise en main) est à l'origine, le ventre bombe vers l'extérieur. */
function BowCurve({ gripX, gripY, scale }: { gripX: number; gripY: number; scale: number }) {
  const radius = 22 * scale;
  const points = useMemo(() => buildBowCurvePoints(radius), [radius]);
  const bowPath = useMemo(() => polylinePath(points), [points]);

  return (
    <Group transform={[{ translateX: gripX }, { translateY: gripY }, { rotate: BOW_TILT_RAD }]}>
      <Path path={bowPath} style="stroke" strokeWidth={2.2 * scale} color="#6B4226" strokeCap="round" strokeJoin="round" />
    </Group>
  );
}

/** Partie d'un objet tenu en main qui doit passer DERRIÈRE le personnage (ex: corde d'arc). */
export function HandItemBack({ type, gripX, gripY, scale }: HandItemProps) {
  if (type === 'bow') return <BowString gripX={gripX} gripY={gripY} scale={scale} />;
  return null;
}

/** Partie d'un objet tenu en main dessinée par-dessus le personnage (lance, galbe de l'arc...). */
export function HandItemFront({ type, gripX, gripY, scale }: HandItemProps) {
  if (type === 'spear') return <Spear gripX={gripX} gripY={gripY} scale={scale} />;
  if (type === 'bow') return <BowCurve gripX={gripX} gripY={gripY} scale={scale} />;
  return null;
}
