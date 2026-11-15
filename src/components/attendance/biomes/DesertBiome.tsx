import { Character } from '../Character';
import { DECOR_SIZE } from '../decorSizes';
import { Cactus, Hut, RockCluster } from '../Decor';
import { planDecor } from '../layout';
import { BIOME_PALETTES } from '../palette';
import { CANVAS_WIDTH } from '../road';
import type { BiomeProps } from './types';

export function DesertBiome({ height, roadPoints }: BiomeProps) {
  const palette = BIOME_PALETTES[3];
  const plan = planDecor(height, roadPoints, {
    huts: { seed: 31, step: 170, naturalWidth: DECOR_SIZE.hut.width, naturalHeight: DECOR_SIZE.hut.height },
    cacti: { seed: 32, step: 105, naturalWidth: DECOR_SIZE.cactus.width, naturalHeight: DECOR_SIZE.cactus.height, baseScale: 0.9 },
    mountains: {
      seed: 33,
      step: 180,
      naturalWidth: DECOR_SIZE.mountain.width,
      naturalHeight: DECOR_SIZE.mountain.height,
      targetWidth: CANVAS_WIDTH / 2,
    },
    npcs: { seed: 34, step: 200, naturalWidth: DECOR_SIZE.npc.width, naturalHeight: DECOR_SIZE.npc.height, baseScale: 1.25 },
  });

  return (
    <>
      {plan.mountains.map((p, i) => (
        <RockCluster key={i} x={p.x} y={p.y} scale={p.scale} color="#A9763F" />
      ))}
      {plan.cacti.map((p, i) => (
        <Cactus key={i} x={p.x} y={p.y} scale={p.scale} />
      ))}
      {plan.huts.map((p, i) => (
        <Hut key={i} x={p.x} y={p.y} scale={p.scale} />
      ))}
      {plan.npcs.map((p, i) => (
        <Character key={i} x={p.x} y={p.y} bulk={palette.npcBulk} outfitColor={palette.npcOutfit} scale={p.scale} handItem="spear" />
      ))}
    </>
  );
}
