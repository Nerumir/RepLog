import { Group, Path } from '@shopify/react-native-skia';

import { shade } from './colorUtils';
import { FlatOval } from './Decor';
import { halfDiscPoints, polygonPath, trapezoidPoints } from './shapes';

export type AccessoryType = 'strawHat' | 'furHood' | 'bandana' | 'pointedHat' | 'viking';

export interface AccessoryProps {
  type?: AccessoryType;
  headRadius: number;
  headCenterY: number;
}

/**
 * Petit accessoire distinctif par biome, posé sur/devant la tête des PNJ. `furHood` est géré à
 * part dans Character.tsx car il doit être dessiné derrière la tête, dans la couleur du corps.
 */
export function Accessory({ type, headRadius: r, headCenterY: cy }: AccessoryProps) {
  if (!type || type === 'furHood') return null;

  if (type === 'strawHat') {
    const color = '#D9BC72';
    const dark = shade(color, -0.18);
    const brimY = cy - r * 0.3;
    return (
      <Group>
        <FlatOval x={0} y={brimY} radiusX={r * 1.7} radiusY={r * 0.95} color={color} />
        <Path path={polygonPath(trapezoidPoints(0, brimY - r * 1.3, brimY, r * 0.65, r * 1.5))} color={dark} />
      </Group>
    );
  }

  if (type === 'bandana') {
    const color = '#C8402E';
    const dark = shade(color, -0.2);
    return (
      <Group>
        <Path path={polygonPath(trapezoidPoints(0, cy - r * 0.3, cy - r * 0.02, r * 1.9, r * 1.95))} color={color} />
        <Path
          path={polygonPath([
            { x: r * 0.9, y: cy - r * 0.15 },
            { x: r * 1.55, y: cy + r * 0.15 },
            { x: r * 0.9, y: cy + r * 0.28 },
          ])}
          color={dark}
        />
      </Group>
    );
  }

  if (type === 'pointedHat') {
    // Base aussi large que la tête, pour que ça lise comme un vrai chapeau plutôt qu'une crête.
    const color = '#C8402E';
    const dark = shade(color, -0.2);
    const baseY = cy;
    const baseHalfWidth = r * 1.2;
    const apexY = cy - r * 3.2;
    return (
      <Group>
        <Path path={polygonPath([{ x: 0, y: apexY }, { x: -baseHalfWidth, y: baseY }, { x: 0, y: baseY }])} color={color} />
        <Path path={polygonPath([{ x: 0, y: apexY }, { x: baseHalfWidth, y: baseY }, { x: 0, y: baseY }])} color={dark} />
      </Group>
    );
  }

  // viking : barbe (légèrement plus basse sur le visage) + casque à cornes
  const beardColor = '#8A7560';
  const beardDark = shade(beardColor, -0.2);
  const helmetColor = '#6B7280';
  const hornColor = '#EFE6D8';
  return (
    <Group>
      <Path path={polygonPath(trapezoidPoints(-r * 0.15, cy + r * 0.55, cy + r * 1.65, r * 1.1, r * 0.4))} color={beardColor} />
      <Path path={polygonPath(trapezoidPoints(r * 0.15, cy + r * 0.55, cy + r * 1.65, r * 1.1, r * 0.4))} color={beardDark} />
      <Path path={polygonPath(halfDiscPoints(0, cy, r * 1.08, 10))} color={helmetColor} />
      <Path
        path={polygonPath([
          { x: -r * 0.85, y: cy - r * 0.35 },
          { x: -r * 1.55, y: cy - r * 1.35 },
          { x: -r * 0.55, y: cy - r * 0.55 },
        ])}
        color={hornColor}
      />
      <Path
        path={polygonPath([
          { x: r * 0.85, y: cy - r * 0.35 },
          { x: r * 1.55, y: cy - r * 1.35 },
          { x: r * 0.55, y: cy - r * 0.55 },
        ])}
        color={shade(hornColor, -0.12)}
      />
    </Group>
  );
}
