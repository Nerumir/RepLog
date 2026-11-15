import { Character } from '../Character';
import { DECOR_SIZE } from '../decorSizes';
import { Palace, VikingShip } from '../Decor';
import { planDecor } from '../layout';
import { BIOME_PALETTES } from '../palette';
import type { BiomeProps } from './types';

export function ValhallaBiome({ height, roadPoints }: BiomeProps) {
  const palette = BIOME_PALETTES[5];
  const plan = planDecor(height, roadPoints, {
    palaces: { seed: 51, step: 210, naturalWidth: DECOR_SIZE.palace.width, naturalHeight: DECOR_SIZE.palace.height, baseScale: 0.8 },
    ships: { seed: 52, step: 250, naturalWidth: DECOR_SIZE.vikingShip.width, naturalHeight: DECOR_SIZE.vikingShip.height, baseScale: 0.8 },
    npcs: { seed: 53, step: 200, naturalWidth: DECOR_SIZE.npc.width, naturalHeight: DECOR_SIZE.npc.height, baseScale: 1.35 },
  });

  return (
    <>
      {plan.ships.map((p, i) => (
        <VikingShip key={i} x={p.x} y={p.y} scale={p.scale} groundColor={palette.groundBottom} />
      ))}
      {plan.palaces.map((p, i) => (
        <Palace key={i} x={p.x} y={p.y} scale={p.scale} />
      ))}
      {plan.npcs.map((p, i) => (
        <Character key={i} x={p.x} y={p.y} bulk={palette.npcBulk} outfitColor={palette.npcOutfit} scale={p.scale} accessory="viking" />
      ))}
    </>
  );
}
