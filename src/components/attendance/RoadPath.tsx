import { useMemo } from 'react';
import { Circle, Group, matchFont, Path, Text } from '@shopify/react-native-skia';
import { Platform } from 'react-native';

import { shade } from './colorUtils';
import { type BiomePalette } from './palette';
import { buildRoadRibbonPolygon, sampleRoadCurve } from './road';
import { polygonPath, type Pt } from './shapes';

const ROAD_HALF_WIDTH = 10;
const SHOULDER_HALF_WIDTH = 14;
const MARKER_RADIUS = 13;
const MARKER_RADIUS_CURRENT = 17;

const numberFont = matchFont({
  fontFamily: Platform.select({ ios: 'Helvetica', default: 'sans-serif' }),
  fontSize: 15,
  fontWeight: 'bold',
});

export interface RoadPathProps {
  points: Pt[];
  currentPoint: number;
  palette: BiomePalette;
  height: number;
  /** Couleur du repère du joueur, utilisée pour colorer la portion de route déjà parcourue. */
  travelColor: string;
}

function RoadRibbon({ points, height, color, shoulderColor }: { points: Pt[]; height: number; color: string; shoulderColor: string }) {
  const samples = useMemo(() => sampleRoadCurve(points, 8), [points]);
  const shoulderPolygon = useMemo(
    () => polygonPath(buildRoadRibbonPolygon(samples, height, SHOULDER_HALF_WIDTH)),
    [samples, height],
  );
  const roadPolygon = useMemo(() => polygonPath(buildRoadRibbonPolygon(samples, height, ROAD_HALF_WIDTH)), [samples, height]);

  return (
    <Group>
      <Path path={shoulderPolygon} color={shoulderColor} />
      <Path path={roadPolygon} color={color} />
    </Group>
  );
}

export function RoadPath({ points, currentPoint, palette, height, travelColor }: RoadPathProps) {
  const traveledPoints = useMemo(() => points.slice(0, currentPoint + 1), [points, currentPoint]);
  const remainingPoints = useMemo(() => points.slice(currentPoint), [points, currentPoint]);
  const shoulderColor = useMemo(() => shade(palette.road, -0.3), [palette.road]);
  const travelShoulderColor = useMemo(() => shade(travelColor, -0.3), [travelColor]);

  return (
    <Group>
      <RoadRibbon points={remainingPoints} height={height} color={palette.road} shoulderColor={shoulderColor} />
      <RoadRibbon points={traveledPoints} height={height} color={travelColor} shoulderColor={travelShoulderColor} />
      {points.map((p, i) => {
        const isCurrent = i === currentPoint;
        const isPassed = i <= currentPoint;
        const radius = isCurrent ? MARKER_RADIUS_CURRENT : MARKER_RADIUS;
        const label = String(i + 1);
        const labelWidth = numberFont.measureText(label).width;
        return (
          <Group key={i}>
            <Circle cx={p.x} cy={p.y} r={radius} color={isPassed ? '#FFFFFF' : 'rgba(255,255,255,0.4)'} />
            {isCurrent && <Circle cx={p.x} cy={p.y} r={radius} style="stroke" strokeWidth={2.5} color={travelColor} />}
            <Text x={p.x - labelWidth / 2} y={p.y + 5} text={label} font={numberFont} color={isPassed ? '#2B2B2B' : 'rgba(43,43,43,0.55)'} />
          </Group>
        );
      })}
    </Group>
  );
}
