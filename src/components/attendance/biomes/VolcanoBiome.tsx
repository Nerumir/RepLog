import { Character } from '../Character';
import { DECOR_SIZE } from '../decorSizes';
import { Lake, Palace, RockCluster } from '../Decor';
import { planDecor } from '../layout';
import { BIOME_PALETTES } from '../palette';
import { CANVAS_WIDTH } from '../road';
import type { BiomeProps } from './types';

export function VolcanoBiome({ height, roadPoints }: BiomeProps) {
  const palette = BIOME_PALETTES[4];
  const plan = planDecor(height, roadPoints, {
    lakes: {
      seed: 43,
      step: 275,
      naturalWidth: DECOR_SIZE.lake.width,
      naturalHeight: DECOR_SIZE.lake.height,
      targetWidth: CANVAS_WIDTH * 0.42,
    },
    mountains: {
      seed: 41,
      step: 180,
      naturalWidth: DECOR_SIZE.mountain.width,
      naturalHeight: DECOR_SIZE.mountain.height,
      targetWidth: CANVAS_WIDTH / 2,
    },
    castles: { seed: 44, step: 320, naturalWidth: DECOR_SIZE.palace.width, naturalHeight: DECOR_SIZE.palace.height, baseScale: 0.75 },
    npcs: { seed: 42, step: 200, naturalWidth: DECOR_SIZE.npc.width, naturalHeight: DECOR_SIZE.npc.height, baseScale: 1.3 },
  });

  return (
    <>
      {plan.lakes.map((p, i) => (
        <Lake key={i} x={p.x} y={p.y} scale={p.scale} fillColor="#FDBA3A" borderColor="#E8572E" />
      ))}
      {plan.mountains.map((p, i) => (
        <RockCluster key={i} x={p.x} y={p.y} scale={p.scale} color="#3A2E2A" />
      ))}
      {plan.castles.map((p, i) => (
        <Palace key={i} x={p.x} y={p.y} scale={p.scale} baseColor="#8B2A2A" roofColor="#B23A3A" />
      ))}
      {plan.npcs.map((p, i) => (
        <Character key={i} x={p.x} y={p.y} bulk={palette.npcBulk} outfitColor={palette.npcOutfit} scale={p.scale} accessory="pointedHat" />
      ))}
    </>
  );
}
