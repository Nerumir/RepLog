import { LinearGradient, Rect, vec } from '@shopify/react-native-skia';

import type { BiomePalette } from './palette';
import { CANVAS_WIDTH } from './road';

export function BiomeGround({ height, palette }: { height: number; palette: BiomePalette }) {
  return (
    <Rect x={0} y={0} width={CANVAS_WIDTH} height={height}>
      <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[palette.groundTop, palette.groundBottom]} />
    </Rect>
  );
}
