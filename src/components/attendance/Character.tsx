import { useMemo } from 'react';
import { Circle, Group, Path } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, type SharedValue } from 'react-native-reanimated';

import { Accessory, type AccessoryType } from './Accessory';
import { shade } from './colorUtils';
import { FlatOval, GroundShadow } from './Decor';
import { HandItemBack, HandItemFront, type HandItemType } from './HandItem';
import { polygonPath, splitTrapezoidHalves } from './shapes';

export interface CharacterProps {
  x: number;
  /** Position verticale des pieds (origine locale 0,0). */
  y: number;
  /** Carrure 0 (svelte) → 1 (très musclé), de plus en plus élevée à travers les biomes. */
  bulk: number;
  outfitColor: string;
  scale?: number;
  facing?: 1 | -1;
  /** Petit accessoire distinctif du biome (chapeau, bandana, casque...). */
  accessory?: AccessoryType;
  /** Objet tenu en main, distinctif du biome (lance, arc...). */
  handItem?: HandItemType;
  /** Décalage vertical animé additionnel (ex: respiration, petit saut), piloté par Reanimated. */
  bobY?: SharedValue<number>;
}

const LIMB_COLOR = '#141318';
const HEAD_COLOR = '#F8F6FF';
/** Rayon des mains/pieds : fixe, indépendant de la carrure, pour un rendu naturel (pas des moufles géantes). */
const EXTREMITY_RADIUS_FACTOR = 3.2;

interface LimbOval {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** Un membre = deux ovales empilés (ex: cuisse+mollet, biceps+avant-bras), de plus en plus ronds avec la carrure. */
function buildLimbOvals(cx: number, topY: number, bottomY: number, width: number, bulk: number): { upper: LimbOval; lower: LimbOval } {
  const span = bottomY - topY;
  const radiusY = Math.abs(span) * 0.34;
  return {
    upper: { cx, cy: topY + span * 0.32, rx: (width / 2) * (1 + bulk * 0.55), ry: radiusY },
    lower: { cx, cy: topY + span * 0.72, rx: (width / 2) * (1 + bulk * 0.3), ry: radiusY },
  };
}

/**
 * Silhouette façon Monument Valley : membres noirs (en deux ovales empilés, de plus en plus
 * ronds avec la carrure), mains/pieds de taille fixe, visage blanc, torse facetté clair/sombre
 * pour l'illusion de relief, ombre portée au sol. Réutilisée pour les PNJ de décor.
 */
export function Character({ x, y, bulk, outfitColor, scale = 1, facing = 1, accessory, handItem, bobY }: CharacterProps) {
  const headRadius = 7 * scale;
  const legHeight = 15 * scale;
  const torsoHeight = 19 * scale;
  const shoulderWidth = (16 + bulk * 15) * scale;
  const hipWidth = (11 + bulk * 5) * scale;
  const legWidth = (4 + bulk * 2.5) * scale;
  const armWidth = (3.5 + bulk * 4) * scale;
  const extremityRadius = EXTREMITY_RADIUS_FACTOR * scale;
  const shoulderRadius = armWidth * (0.55 + bulk * 0.4);

  const hipY = -legHeight;
  const shoulderY = hipY - torsoHeight;
  const headCenterY = shoulderY - headRadius - 2 * scale;
  const armBottomY = hipY + torsoHeight * 0.35;

  const outfitLight = useMemo(() => shade(outfitColor, 0.16), [outfitColor]);
  const outfitDark = useMemo(() => shade(outfitColor, -0.26), [outfitColor]);
  const headShadow = useMemo(() => shade(HEAD_COLOR, -0.18), []);

  const limbs = useMemo(
    () => ({
      leftLeg: buildLimbOvals(-hipWidth / 4, hipY, 0, legWidth, bulk),
      rightLeg: buildLimbOvals(hipWidth / 4, hipY, 0, legWidth, bulk),
      leftArm: buildLimbOvals(-shoulderWidth / 2 - armWidth / 2, shoulderY + 2 * scale, armBottomY, armWidth, bulk),
      rightArm: buildLimbOvals(shoulderWidth / 2 + armWidth / 2, shoulderY + 2 * scale, armBottomY, armWidth, bulk),
    }),
    [hipWidth, hipY, legWidth, bulk, shoulderWidth, armWidth, shoulderY, scale, armBottomY],
  );

  const torsoPaths = useMemo(() => {
    const torso = splitTrapezoidHalves(0, shoulderY, hipY, shoulderWidth, hipWidth);
    return { left: polygonPath(torso.left), right: polygonPath(torso.right) };
  }, [shoulderY, hipY, shoulderWidth, hipWidth]);

  const fallbackBob = useSharedValue(0);
  const bob = bobY ?? fallbackBob;
  const transform = useDerivedValue(() => [{ translateX: x }, { translateY: y + bob.value }, { scaleX: facing }]);

  return (
    <Group transform={transform}>
      <GroundShadow x={0} y={2 * scale} radiusX={hipWidth * 0.75} radiusY={hipWidth * 0.22} opacity={0.3} />
      <HandItemBack type={handItem} gripX={limbs.rightArm.lower.cx} gripY={armBottomY} scale={scale} />
      <FlatOval x={limbs.leftLeg.upper.cx} y={limbs.leftLeg.upper.cy} radiusX={limbs.leftLeg.upper.rx} radiusY={limbs.leftLeg.upper.ry} color={LIMB_COLOR} />
      <FlatOval x={limbs.leftLeg.lower.cx} y={limbs.leftLeg.lower.cy} radiusX={limbs.leftLeg.lower.rx} radiusY={limbs.leftLeg.lower.ry} color={LIMB_COLOR} />
      <FlatOval x={limbs.rightLeg.upper.cx} y={limbs.rightLeg.upper.cy} radiusX={limbs.rightLeg.upper.rx} radiusY={limbs.rightLeg.upper.ry} color={LIMB_COLOR} />
      <FlatOval x={limbs.rightLeg.lower.cx} y={limbs.rightLeg.lower.cy} radiusX={limbs.rightLeg.lower.rx} radiusY={limbs.rightLeg.lower.ry} color={LIMB_COLOR} />
      <Circle cx={-hipWidth / 4} cy={0} r={extremityRadius} color={LIMB_COLOR} />
      <Circle cx={hipWidth / 4} cy={0} r={extremityRadius} color={LIMB_COLOR} />
      <FlatOval x={limbs.leftArm.upper.cx} y={limbs.leftArm.upper.cy} radiusX={limbs.leftArm.upper.rx} radiusY={limbs.leftArm.upper.ry} color={LIMB_COLOR} />
      <FlatOval x={limbs.leftArm.lower.cx} y={limbs.leftArm.lower.cy} radiusX={limbs.leftArm.lower.rx} radiusY={limbs.leftArm.lower.ry} color={LIMB_COLOR} />
      <FlatOval x={limbs.rightArm.upper.cx} y={limbs.rightArm.upper.cy} radiusX={limbs.rightArm.upper.rx} radiusY={limbs.rightArm.upper.ry} color={LIMB_COLOR} />
      <FlatOval x={limbs.rightArm.lower.cx} y={limbs.rightArm.lower.cy} radiusX={limbs.rightArm.lower.rx} radiusY={limbs.rightArm.lower.ry} color={LIMB_COLOR} />
      <Circle cx={limbs.leftArm.lower.cx} cy={armBottomY} r={extremityRadius} color={LIMB_COLOR} />
      <Circle cx={limbs.rightArm.lower.cx} cy={armBottomY} r={extremityRadius} color={LIMB_COLOR} />
      <Circle cx={-shoulderWidth / 2 - armWidth / 2} cy={shoulderY + 2 * scale} r={shoulderRadius} color={LIMB_COLOR} />
      <Circle cx={shoulderWidth / 2 + armWidth / 2} cy={shoulderY + 2 * scale} r={shoulderRadius} color={LIMB_COLOR} />
      <Path path={torsoPaths.left} color={outfitLight} />
      <Path path={torsoPaths.right} color={outfitDark} />
      {accessory === 'furHood' && <Circle cx={0} cy={headCenterY} r={headRadius * 1.55} color={outfitDark} />}
      <Circle cx={1.5 * scale} cy={headCenterY + 1.5 * scale} r={headRadius} color={headShadow} />
      <Circle cx={0} cy={headCenterY} r={headRadius} color={HEAD_COLOR} />
      <Accessory type={accessory} headRadius={headRadius} headCenterY={headCenterY} />
      <HandItemFront type={handItem} gripX={limbs.rightArm.lower.cx} gripY={armBottomY} scale={scale} />
    </Group>
  );
}
