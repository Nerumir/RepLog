import { useEffect, useMemo } from 'react';
import { Circle, Group, Path, Rect, RoundedRect } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { shade } from './colorUtils';
import { diamondPoints, halfDiscPoints, polygonPath, polylinePath, splitTrapezoidHalves, trapezoidPoints } from './shapes';

/** Ombre au sol ellipsoïdale, pour ancrer un élément et suggérer du relief. */
export function GroundShadow({
  x,
  y,
  radiusX,
  radiusY,
  opacity = 0.25,
}: {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  opacity?: number;
}) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }, { scaleY: radiusY / radiusX }]}>
      <Circle cx={0} cy={0} r={radiusX} color={`rgba(10,10,15,${opacity})`} />
    </Group>
  );
}

/** Ovale plat plein (même technique que GroundShadow : cercle écrasé verticalement), pour une base, un socle, etc. */
export function FlatOval({
  x,
  y,
  radiusX,
  radiusY,
  color,
  opacity = 1,
}: {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color: string;
  opacity?: number;
}) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }, { scaleY: radiusY / radiusX }]}>
      <Circle cx={0} cy={0} r={radiusX} color={color} opacity={opacity} />
    </Group>
  );
}

export const TREE_VARIANT_COUNT = 3;

function ConiferCanopy({ scale, trunkHeight, light, dark }: { scale: number; trunkHeight: number; light: string; dark: string }) {
  const layerCount = 4;
  const baseWidth = 40 * scale;
  const layerHeight = (130 * scale) / layerCount;
  const layers = useMemo(() => {
    const items = [];
    for (let i = 0; i < layerCount; i += 1) {
      const bottomY = -trunkHeight - i * layerHeight * 0.7;
      const topY = bottomY - layerHeight;
      const width = baseWidth * (1 - i / layerCount) + 6 * scale;
      items.push({
        left: polygonPath([{ x: 0, y: topY }, { x: -width / 2, y: bottomY }, { x: 0, y: bottomY }]),
        right: polygonPath([{ x: 0, y: topY }, { x: width / 2, y: bottomY }, { x: 0, y: bottomY }]),
      });
    }
    return items;
  }, [baseWidth, layerHeight, scale, trunkHeight]);

  return (
    <>
      {layers.map((layer, i) => (
        <Group key={i}>
          <Path path={layer.left} color={light} />
          <Path path={layer.right} color={dark} />
        </Group>
      ))}
    </>
  );
}

function RoundCanopy({ scale, trunkHeight, color }: { scale: number; trunkHeight: number; color: string }) {
  const light = useMemo(() => shade(color, 0.2), [color]);
  const dark = useMemo(() => shade(color, -0.22), [color]);
  const blobs = useMemo(
    () => [
      { cx: 0, cy: -trunkHeight - 58 * scale, r: 24 * scale },
      { cx: -16 * scale, cy: -trunkHeight - 40 * scale, r: 18 * scale },
      { cx: 16 * scale, cy: -trunkHeight - 44 * scale, r: 19 * scale },
      { cx: 0, cy: -trunkHeight - 30 * scale, r: 20 * scale },
    ],
    [scale, trunkHeight],
  );
  return (
    <>
      {blobs.map((b, i) => (
        <Group key={i}>
          <Circle cx={b.cx + 2 * scale} cy={b.cy + 2 * scale} r={b.r} color={dark} />
          <Circle cx={b.cx - 1 * scale} cy={b.cy - 1 * scale} r={b.r * 0.9} color={light} />
        </Group>
      ))}
    </>
  );
}

function ColumnCanopy({ scale, trunkHeight, light, dark }: { scale: number; trunkHeight: number; light: string; dark: string }) {
  const height = 140 * scale;
  const width = 22 * scale;
  const bottomY = -trunkHeight;
  const topY = bottomY - height;
  const tipY = topY - 14 * scale;
  const halves = useMemo(() => splitTrapezoidHalves(0, topY, bottomY, width * 0.3, width), [topY, bottomY, width]);
  const tip = useMemo(
    () => ({
      left: polygonPath([{ x: 0, y: tipY }, { x: -width * 0.15, y: topY }, { x: 0, y: topY }]),
      right: polygonPath([{ x: 0, y: tipY }, { x: width * 0.15, y: topY }, { x: 0, y: topY }]),
    }),
    [tipY, topY, width],
  );
  return (
    <>
      <Path path={polygonPath(halves.left)} color={light} />
      <Path path={polygonPath(halves.right)} color={dark} />
      <Path path={tip.left} color={light} />
      <Path path={tip.right} color={dark} />
    </>
  );
}

export function Tree({
  x,
  y,
  scale = 1,
  variant = 0,
  trunkColor = '#6B4226',
  leavesColor = '#2F8F4E',
}: {
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  trunkColor?: string;
  leavesColor?: string;
}) {
  const trunkHeight = 18 * scale;
  const trunkWidth = 6 * scale;
  const trunkDark = useMemo(() => shade(trunkColor, -0.3), [trunkColor]);
  const leavesLight = useMemo(() => shade(leavesColor, 0.2), [leavesColor]);
  const leavesDark = useMemo(() => shade(leavesColor, -0.26), [leavesColor]);
  const shadowRadius = variant === 1 ? 30 * scale : variant === 2 ? 20 * scale : 17 * scale;

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={0} y={1 * scale} radiusX={shadowRadius} radiusY={shadowRadius * 0.33} opacity={0.3} />
      <RoundedRect x={-trunkWidth / 2} y={-trunkHeight} width={trunkWidth / 2} height={trunkHeight} r={1} color={trunkDark} />
      <RoundedRect x={0} y={-trunkHeight} width={trunkWidth / 2} height={trunkHeight} r={1} color={trunkColor} />
      {variant === 0 && <ConiferCanopy scale={scale} trunkHeight={trunkHeight} light={leavesLight} dark={leavesDark} />}
      {variant === 1 && <RoundCanopy scale={scale} trunkHeight={trunkHeight} color={leavesColor} />}
      {variant === 2 && <ColumnCanopy scale={scale} trunkHeight={trunkHeight} light={leavesLight} dark={leavesDark} />}
    </Group>
  );
}

/** Arbre mort : tronc nu et branches brisées (lignes facettées clair/sombre), sans feuillage. */
export function DeadTree({ x, y, scale = 1, color = '#5B5248' }: { x: number; y: number; scale?: number; color?: string }) {
  const light = useMemo(() => shade(color, 0.2), [color]);
  const dark = useMemo(() => shade(color, -0.26), [color]);
  const trunkHeight = 56 * scale;
  const trunkWidth = 7 * scale;

  const branches = useMemo(
    () => [
      {
        points: [{ x: 0, y: -trunkHeight }, { x: -22 * scale, y: -trunkHeight - 10 * scale }, { x: -30 * scale, y: -trunkHeight - 26 * scale }],
        width: 3.2 * scale,
        light: true,
      },
      {
        points: [{ x: 0, y: -trunkHeight }, { x: 18 * scale, y: -trunkHeight - 8 * scale }, { x: 26 * scale, y: -trunkHeight - 24 * scale }],
        width: 3.2 * scale,
        light: false,
      },
      { points: [{ x: 0, y: -trunkHeight * 0.78 }, { x: -16 * scale, y: -trunkHeight * 0.78 - 16 * scale }], width: 2.4 * scale, light: false },
      { points: [{ x: 0, y: -trunkHeight * 0.6 }, { x: 14 * scale, y: -trunkHeight * 0.6 - 14 * scale }], width: 2.4 * scale, light: true },
      { points: [{ x: 0, y: -trunkHeight - 2 * scale }, { x: 2 * scale, y: -trunkHeight - 20 * scale }], width: 2.6 * scale, light: true },
    ],
    [scale, trunkHeight],
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={0} y={1 * scale} radiusX={16 * scale} radiusY={5 * scale} opacity={0.26} />
      <RoundedRect x={-trunkWidth / 2} y={-trunkHeight} width={trunkWidth / 2} height={trunkHeight} r={1} color={light} />
      <RoundedRect x={0} y={-trunkHeight} width={trunkWidth / 2} height={trunkHeight} r={1} color={dark} />
      {branches.map((b, i) => (
        <Path key={i} path={polylinePath(b.points)} style="stroke" strokeWidth={b.width} color={b.light ? light : dark} />
      ))}
    </Group>
  );
}

/**
 * Igloo en 2D franc (pas d'illusion de dôme 3D) : blocs de neige rectangulaires empilés, dont
 * la largeur suit la courbe d'un cercle (silhouette globale vaguement en demi-cercle malgré des
 * rectangles bien plats), chacun ombré en deux tons avec une ombre portée dupliquée à gauche,
 * posés sur un socle ovale, avec une entrée en demi-cercle sombre.
 */
export function Igloo({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const base = '#EAF6FF';
  const baseLight = useMemo(() => shade(base, 0.1), []);
  const baseDark = useMemo(() => shade(base, -0.16), []);
  const shadowDupe = useMemo(() => shade(base, -0.32), []);
  const snowBank = '#DCEEFB';

  const blocks = useMemo(() => {
    const layerCount = 6;
    const radius = 30 * scale;
    const layerHeight = radius / layerCount;
    const baseY = -4 * scale;
    return Array.from({ length: layerCount }, (_, i) => {
      const hCenter = (i + 0.5) * layerHeight;
      const width = 2 * Math.sqrt(Math.max(0, radius * radius - hCenter * hCenter));
      const topY = baseY - (i + 1) * layerHeight;
      return { width, height: layerHeight, topY };
    });
  }, [scale]);

  const doorway = useMemo(() => polygonPath(halfDiscPoints(0, -4 * scale, 6 * scale, 10)), [scale]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={0} y={2 * scale} radiusX={28 * scale} radiusY={7 * scale} opacity={0.26} />
      <FlatOval x={0} y={-2 * scale} radiusX={32 * scale} radiusY={8 * scale} color={snowBank} />
      {blocks.map((block, i) => (
        <Group key={i}>
          <Rect
            x={-block.width / 2 - 4 * scale}
            y={block.topY + 2 * scale}
            width={block.width}
            height={block.height}
            color={shadowDupe}
            opacity={0.55}
          />
          <Rect x={-block.width / 2} y={block.topY} width={block.width / 2} height={block.height} color={baseLight} />
          <Rect x={0} y={block.topY} width={block.width / 2} height={block.height} color={baseDark} />
        </Group>
      ))}
      <Path path={doorway} color="#1E2A38" />
    </Group>
  );
}

export function Hut({ x, y, scale = 1, wallColor = '#D1A054', roofColor = '#7A4A2B' }: { x: number; y: number; scale?: number; wallColor?: string; roofColor?: string }) {
  const roofLight = useMemo(() => shade(roofColor, 0.16), [roofColor]);
  const roofDark = useMemo(() => shade(roofColor, -0.2), [roofColor]);
  const wallLight = useMemo(() => shade(wallColor, 0.1), [wallColor]);
  const wallDark = useMemo(() => shade(wallColor, -0.2), [wallColor]);
  const doorColor = useMemo(() => shade(roofColor, -0.35), [roofColor]);

  const wallTop = -34 * scale;
  const roofApex = wallTop - 30 * scale;

  const paths = useMemo(
    () => ({
      wallLeft: polygonPath(trapezoidPoints(-5 * scale, wallTop, 0, 26 * scale, 30 * scale)),
      wallRight: polygonPath(trapezoidPoints(5 * scale, wallTop, 0, 26 * scale, 30 * scale)),
      roofLeft: polygonPath([{ x: 0, y: roofApex }, { x: -19 * scale, y: wallTop + 2 * scale }, { x: 0, y: wallTop + 2 * scale }]),
      roofRight: polygonPath([{ x: 0, y: roofApex }, { x: 19 * scale, y: wallTop + 2 * scale }, { x: 0, y: wallTop + 2 * scale }]),
      door: polygonPath(trapezoidPoints(4 * scale, -18 * scale, 0, 8 * scale, 9 * scale)),
    }),
    [roofApex, scale, wallTop],
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={0} y={1 * scale} radiusX={22 * scale} radiusY={6 * scale} opacity={0.26} />
      <Path path={paths.wallLeft} color={wallLight} />
      <Path path={paths.wallRight} color={wallDark} />
      <RoundedRect x={-8 * scale} y={-26 * scale} width={8 * scale} height={7 * scale} r={1} color={wallDark} />
      <RoundedRect x={-6.5 * scale} y={-24.5 * scale} width={5 * scale} height={4.5 * scale} r={0.5} color="#1E2A38" />
      <Path path={paths.door} color={doorColor} />
      <Path path={paths.roofLeft} color={roofLight} />
      <Path path={paths.roofRight} color={roofDark} />
      <RoundedRect x={-2 * scale} y={roofApex - 1 * scale} width={4 * scale} height={6 * scale} r={2} color={roofDark} />
    </Group>
  );
}

function FacetedRock({ cx, height, width, light, mid, dark }: { cx: number; height: number; width: number; light: string; mid: string; dark: string }) {
  const apex = { x: cx + width * 0.06, y: -height };
  const baseLeft = { x: cx - width / 2, y: 0 };
  const baseRight = { x: cx + width / 2, y: 0 };
  const baseCenter = { x: cx + width * 0.1, y: 0 };
  const capLeft = { x: cx - width * 0.2, y: -height * 0.6 };
  const capRight = { x: cx + width * 0.26, y: -height * 0.62 };
  return (
    <>
      <Path path={polygonPath([apex, baseCenter, baseLeft])} color={dark} />
      <Path path={polygonPath([apex, baseRight, baseCenter])} color={mid} />
      <Path path={polygonPath([apex, capRight, capLeft])} color={light} />
    </>
  );
}

export function RockCluster({ x, y, scale = 1, color = '#6B6560' }: { x: number; y: number; scale?: number; color?: string }) {
  const light = useMemo(() => shade(color, 0.22), [color]);
  const dark = useMemo(() => shade(color, -0.26), [color]);
  const rocks = useMemo(
    () => [
      { cx: -14 * scale, height: 22 * scale, width: 24 * scale },
      { cx: 8 * scale, height: 32 * scale, width: 30 * scale },
      { cx: 24 * scale, height: 16 * scale, width: 18 * scale },
    ],
    [scale],
  );
  const pebble = useMemo(
    () => polygonPath([{ x: -22 * scale, y: -8 * scale }, { x: -16 * scale, y: 0 }, { x: -28 * scale, y: 0 }]),
    [scale],
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={4 * scale} y={1 * scale} radiusX={30 * scale} radiusY={9 * scale} opacity={0.3} />
      {rocks.map((rock, i) => (
        <FacetedRock key={i} cx={rock.cx} height={rock.height} width={rock.width} light={light} mid={color} dark={dark} />
      ))}
      <Path path={pebble} color={dark} />
    </Group>
  );
}

export function Cactus({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const base = '#3F8A4E';
  const light = useMemo(() => shade(base, 0.2), []);
  const dark = useMemo(() => shade(base, -0.22), []);
  const trunkHeight = 68 * scale;
  const trunkWidth = 10 * scale;

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={0} y={1 * scale} radiusX={16 * scale} radiusY={5 * scale} opacity={0.26} />
      <RoundedRect x={-trunkWidth / 2} y={-trunkHeight} width={trunkWidth / 2} height={trunkHeight} r={trunkWidth / 2} color={light} />
      <RoundedRect x={0} y={-trunkHeight} width={trunkWidth / 2} height={trunkHeight} r={trunkWidth / 2} color={dark} />
      <Circle cx={0} cy={-trunkHeight} r={trunkWidth / 2} color={light} />
      <RoundedRect x={-20 * scale} y={-40 * scale} width={13 * scale} height={7 * scale} r={3.5 * scale} color={light} />
      <RoundedRect x={-21 * scale} y={-52 * scale} width={7 * scale} height={16 * scale} r={3.5 * scale} color={dark} />
      <RoundedRect x={8 * scale} y={-50 * scale} width={13 * scale} height={7 * scale} r={3.5 * scale} color={dark} />
      <RoundedRect x={16 * scale} y={-62 * scale} width={7 * scale} height={16 * scale} r={3.5 * scale} color={light} />
      <Path
        path={polygonPath([{ x: -2 * scale, y: -trunkHeight }, { x: -2 * scale, y: -trunkHeight * 0.3 }])}
        style="stroke"
        strokeWidth={1.2 * scale}
        color={dark}
        opacity={0.5}
      />
      <Circle cx={2 * scale} cy={-trunkHeight - 2 * scale} r={3.5 * scale} color="#E8577A" />
    </Group>
  );
}

/**
 * Lac plat : remplissage clair entouré d'un contour plus sombre (même traitement que la rivière
 * de lave qu'il remplace dans le volcan), plus un reflet pour un peu de relief.
 */
export function Lake({
  x,
  y,
  scale = 1,
  fillColor,
  borderColor,
}: {
  x: number;
  y: number;
  scale?: number;
  fillColor: string;
  borderColor: string;
}) {
  const radiusX = 42 * scale;
  const radiusY = radiusX * 0.5;
  const centerY = -radiusY;
  const highlight = useMemo(() => shade(fillColor, 0.2), [fillColor]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <FlatOval x={0} y={centerY} radiusX={radiusX} radiusY={radiusY} color={borderColor} />
      <FlatOval x={0} y={centerY} radiusX={radiusX * 0.82} radiusY={radiusY * 0.82} color={fillColor} />
      <FlatOval
        x={-radiusX * 0.2}
        y={centerY - radiusY * 0.15}
        radiusX={radiusX * 0.25}
        radiusY={radiusY * 0.15}
        color={highlight}
        opacity={0.6}
      />
    </Group>
  );
}

export function VikingShip({ x, y, scale = 1, groundColor = '#5B3B8C' }: { x: number; y: number; scale?: number; groundColor?: string }) {
  const waveColor = useMemo(() => shade(groundColor, 0.22), [groundColor]);
  const hullColor = '#5A3A24';
  const hullLight = useMemo(() => shade(hullColor, 0.22), []);
  const sailColor = '#E7D08A';
  const sailAccent = '#8C2F39';
  const shieldA = '#8C2F39';
  const shieldB = '#E7D08A';

  const halfLen = 45 * scale;
  const mastHeight = 58 * scale;

  const paths = useMemo(
    () => ({
      hull: polygonPath([
        { x: -halfLen - 9 * scale, y: -15 * scale },
        { x: -halfLen + 11 * scale, y: -4 * scale },
        { x: halfLen - 11 * scale, y: -4 * scale },
        { x: halfLen + 9 * scale, y: -15 * scale },
        { x: halfLen - 7 * scale, y: 9 * scale },
        { x: -halfLen + 7 * scale, y: 9 * scale },
      ]),
      deck: polygonPath([
        { x: -halfLen + 11 * scale, y: -4 * scale },
        { x: halfLen - 11 * scale, y: -4 * scale },
        { x: halfLen - 15 * scale, y: 0 },
        { x: -halfLen + 15 * scale, y: 0 },
      ]),
      sail: trapezoidPoints(0, -mastHeight + 8 * scale, -8 * scale, 10 * scale, 28 * scale),
      flag: polygonPath([{ x: 0, y: -mastHeight }, { x: 10 * scale, y: -mastHeight + 5 * scale }, { x: 0, y: -mastHeight + 10 * scale }]),
    }),
    [halfLen, mastHeight, scale],
  );

  const shields = useMemo(
    () => [-halfLen * 0.5, 0, halfLen * 0.5].map((sx, i) => ({ cx: sx, color: i % 2 === 0 ? shieldA : shieldB })),
    [halfLen],
  );

  // Léger tangage de haut en bas pour donner l'impression que le bateau flotte, avec un
  // déphasage déterministe par position pour que plusieurs bateaux ne tanguent pas à l'unisson.
  const bob = useSharedValue(0);
  useEffect(() => {
    const phaseDelay = Math.abs(Math.sin(x * 12.9898 + y * 78.233)) * 900;
    bob.value = withDelay(
      phaseDelay,
      withRepeat(withSequence(withTiming(-4 * scale, { duration: 900 }), withTiming(0, { duration: 900 })), -1, true),
    );
  }, [bob, scale, x, y]);
  const transform = useDerivedValue(() => [{ translateX: x }, { translateY: y + bob.value }]);

  // Petite "vague" sous la coque : même couleur que le sol mais plus claire, qui se resserre
  // quand le bateau se soulève et s'élargit quand il retombe (inverse du tangage).
  const waveBaseRadiusX = halfLen + 10 * scale;
  const waveBaseRadiusY = 10 * scale;
  const waveRadiusX = useDerivedValue(() => {
    const t = Math.max(0, Math.min(1, bob.value / (-4 * scale)));
    return waveBaseRadiusX * (1.15 - 0.35 * t);
  });

  return (
    <Group transform={transform}>
      <Group transform={[{ translateX: 0 }, { translateY: 2 * scale }, { scaleY: waveBaseRadiusY / waveBaseRadiusX }]}>
        <Circle cx={0} cy={0} r={waveRadiusX} color={waveColor} opacity={0.6} />
      </Group>
      <Path path={paths.hull} color={hullColor} />
      <Path path={paths.deck} color={hullLight} />
      {shields.map((s, i) => (
        <Circle key={i} cx={s.cx} cy={-2 * scale} r={5 * scale} color={s.color} />
      ))}
      <RoundedRect x={-1.5 * scale} y={-mastHeight} width={3 * scale} height={mastHeight + 4 * scale} r={1} color="#4A2E17" />
      <Path path={paths.flag} color={sailAccent} />
      <Path path={polygonPath(paths.sail)} color={sailColor} />
      <RoundedRect x={-5 * scale} y={-mastHeight + 16 * scale} width={10 * scale} height={5 * scale} r={1} color={sailAccent} />
      <RoundedRect x={-7 * scale} y={-mastHeight + 28 * scale} width={14 * scale} height={5 * scale} r={1} color={sailAccent} />
    </Group>
  );
}

export function Palace({
  x,
  y,
  scale = 1,
  baseColor = '#A9872F',
  roofColor = '#E7D08A',
}: {
  x: number;
  y: number;
  scale?: number;
  baseColor?: string;
  roofColor?: string;
}) {
  const midColor = useMemo(() => shade(baseColor, 0.18), [baseColor]);
  const upperColor = useMemo(() => shade(baseColor, 0.34), [baseColor]);
  const baseLight = useMemo(() => shade(baseColor, 0.14), [baseColor]);
  const midLight = useMemo(() => shade(midColor, 0.16), [midColor]);
  const upperLight = useMemo(() => shade(upperColor, 0.16), [upperColor]);
  const roofDark = useMemo(() => shade(roofColor, -0.18), [roofColor]);
  const doorColor = useMemo(() => shade(baseColor, -0.4), [baseColor]);

  const baseTop = -22 * scale;
  const midTop = -52 * scale;
  const upperTop = -76 * scale;
  const roofApex = -102 * scale;

  const paths = useMemo(
    () => ({
      baseLeft: polygonPath(trapezoidPoints(-15 * scale, baseTop, 0, 58 * scale, 64 * scale)),
      baseRight: polygonPath(trapezoidPoints(15 * scale, baseTop, 0, 58 * scale, 64 * scale)),
      midLeft: polygonPath(trapezoidPoints(-9 * scale, midTop, baseTop + 2 * scale, 40 * scale, 48 * scale)),
      midRight: polygonPath(trapezoidPoints(9 * scale, midTop, baseTop + 2 * scale, 40 * scale, 48 * scale)),
      upperLeft: polygonPath(trapezoidPoints(-5 * scale, upperTop, midTop + 2 * scale, 24 * scale, 32 * scale)),
      upperRight: polygonPath(trapezoidPoints(5 * scale, upperTop, midTop + 2 * scale, 24 * scale, 32 * scale)),
      roof: polygonPath(diamondPoints(0, (upperTop + roofApex) / 2, 34 * scale, upperTop - roofApex)),
      door: polygonPath(trapezoidPoints(0, -16 * scale, 0, 14 * scale, 16 * scale)),
    }),
    [baseTop, midTop, roofApex, scale, upperTop],
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <GroundShadow x={0} y={1 * scale} radiusX={46 * scale} radiusY={12 * scale} opacity={0.32} />
      <Path path={paths.baseLeft} color={baseLight} />
      <Path path={paths.baseRight} color={baseColor} />
      <Path path={paths.door} color={doorColor} />
      <Path path={paths.midLeft} color={midLight} />
      <Path path={paths.midRight} color={midColor} />
      <Path path={paths.upperLeft} color={upperLight} />
      <Path path={paths.upperRight} color={upperColor} />
      <Path path={paths.roof} color={roofColor} />
      <Path path={polygonPath([{ x: 0, y: upperTop }, { x: 17 * scale, y: (upperTop + roofApex) / 2 }, { x: 0, y: roofApex }])} color={roofDark} />
      <RoundedRect x={-1.5 * scale} y={roofApex - 14 * scale} width={3 * scale} height={14 * scale} r={1} color="#6B5420" />
      <Path path={polygonPath([{ x: 1.5 * scale, y: roofApex - 14 * scale }, { x: 13 * scale, y: roofApex - 10 * scale }, { x: 1.5 * scale, y: roofApex - 6 * scale }])} color="#8C2F39" />
    </Group>
  );
}
