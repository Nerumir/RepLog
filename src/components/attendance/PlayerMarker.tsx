import { useEffect, useMemo } from 'react';
import { Group, matchFont, Path, RoundedRect, Text } from '@shopify/react-native-skia';
import { Platform } from 'react-native';
import { type SharedValue, useDerivedValue, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { GroundShadow } from './Decor';
import { polygonPath } from './shapes';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'sans-serif' });
const labelFontSmall = matchFont({ fontFamily, fontSize: 12, fontWeight: 'normal' });
const labelFontBig = matchFont({ fontFamily, fontSize: 22, fontWeight: 'bold' });

export interface PlayerMarkerProps {
  x: number | SharedValue<number>;
  y: number | SharedValue<number>;
  scale?: number;
  color: string;
  /** Progression absolue tous biomes confondus (ex: 37 pour biome 1, point 17). */
  stepNumber: number;
}

/**
 * Repère du joueur : triangle inversé (pointe posée sur le point de la route) avec son ombre,
 * flottant plus haut et un peu plus vite que les bateaux vikings, surmonté du libellé "Étape X".
 * `x`/`y` peuvent être des valeurs animées (Reanimated) pour glisser le long de la route.
 */
export function PlayerMarker({ x, y, scale = 1, color, stepNumber }: PlayerMarkerProps) {
  const { t } = useTranslation();
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withSequence(withTiming(-9 * scale, { duration: 650 }), withTiming(0, { duration: 650 })), -1, true);
  }, [bob, scale]);
  const transform = useDerivedValue(() => [
    { translateX: typeof x === 'number' ? x : x.value },
    { translateY: (typeof y === 'number' ? y : y.value) + bob.value },
  ]);

  const triangle = useMemo(
    () =>
      polygonPath([
        { x: -15 * scale, y: -32 * scale },
        { x: 15 * scale, y: -32 * scale },
        { x: 0, y: 0 },
      ]),
    [scale],
  );

  const stepLabel = String(stepNumber);
  const stepWord = t('attendance.map.step');
  const smallWidth = labelFontSmall.measureText(stepWord).width;
  const bigWidth = labelFontBig.measureText(stepLabel).width;
  const numberY = -36 * scale;
  const etapeY = numberY - 20 * scale;

  const badgePaddingX = 10 * scale;
  const badgeTop = etapeY - 11 * scale;
  const badgeBottom = numberY + 6 * scale;
  const badgeWidth = Math.max(smallWidth, bigWidth) + badgePaddingX * 2;

  return (
    <Group transform={transform}>
      <GroundShadow x={0} y={2 * scale} radiusX={16 * scale} radiusY={5 * scale} opacity={0.3} />
      <Path path={triangle} color={color} />
      <RoundedRect
        x={-badgeWidth / 2}
        y={badgeTop}
        width={badgeWidth}
        height={badgeBottom - badgeTop}
        r={10 * scale}
        color="rgba(255,255,255,0.92)"
      />
      <Text x={-smallWidth / 2} y={etapeY} text={stepWord} font={labelFontSmall} color={color} />
      <Text x={-bigWidth / 2} y={numberY} text={stepLabel} font={labelFontBig} color={color} />
    </Group>
  );
}
