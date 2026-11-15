import { Character } from '../Character';
import { DECOR_SIZE } from '../decorSizes';
import { DeadTree, Igloo, RockCluster } from '../Decor';
import { planDecor } from '../layout';
import { BIOME_PALETTES } from '../palette';
import { CANVAS_WIDTH } from '../road';
import type { BiomeProps } from './types';

export function TundraBiome({ height, roadPoints }: BiomeProps) {
  const palette = BIOME_PALETTES[2];
  const plan = planDecor(height, roadPoints, {
    igloos: { seed: 21, step: 150, naturalWidth: DECOR_SIZE.igloo.width, naturalHeight: DECOR_SIZE.igloo.height },
    mountains: {
      seed: 22,
      step: 180,
      naturalWidth: DECOR_SIZE.mountain.width,
      naturalHeight: DECOR_SIZE.mountain.height,
      targetWidth: CANVAS_WIDTH / 2,
    },
    deadTrees: { seed: 24, step: 220, naturalWidth: DECOR_SIZE.deadTree.width, naturalHeight: DECOR_SIZE.deadTree.height, baseScale: 0.85 },
    npcs: { seed: 23, step: 200, naturalWidth: DECOR_SIZE.npc.width, naturalHeight: DECOR_SIZE.npc.height, baseScale: 1.2 },
  });

  return (
    <>
      {plan.mountains.map((p, i) => (
        <RockCluster key={i} x={p.x} y={p.y} scale={p.scale} color="#B9C9D4" />
      ))}
      {plan.igloos.map((p, i) => (
        <Igloo key={i} x={p.x} y={p.y} scale={p.scale} />
      ))}
      {plan.deadTrees.map((p, i) => (
        <DeadTree key={i} x={p.x} y={p.y} scale={p.scale} color="#6E6A62" />
      ))}
      {plan.npcs.map((p, i) => (
        <Character key={i} x={p.x} y={p.y} bulk={palette.npcBulk} outfitColor={palette.npcOutfit} scale={p.scale} accessory="furHood" />
      ))}
    </>
  );
}
