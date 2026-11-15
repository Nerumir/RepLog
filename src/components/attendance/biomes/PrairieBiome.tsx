import { Character } from '../Character';
import { DECOR_SIZE } from '../decorSizes';
import { Lake, Tree, TREE_VARIANT_COUNT } from '../Decor';
import { planDecor } from '../layout';
import { BIOME_PALETTES } from '../palette';
import { hashRandom } from '../random';
import { CANVAS_WIDTH } from '../road';
import type { BiomeProps } from './types';

export function PrairieBiome({ height, roadPoints }: BiomeProps) {
  const palette = BIOME_PALETTES[0];
  const plan = planDecor(height, roadPoints, {
    lakes: {
      seed: 3,
      step: 275,
      naturalWidth: DECOR_SIZE.lake.width,
      naturalHeight: DECOR_SIZE.lake.height,
      targetWidth: CANVAS_WIDTH * 0.42,
    },
    trees: { seed: 1, step: 110, naturalWidth: DECOR_SIZE.tree.width, naturalHeight: DECOR_SIZE.tree.height, baseScale: 0.9 },
    npcs: { seed: 2, step: 180, naturalWidth: DECOR_SIZE.npc.width, naturalHeight: DECOR_SIZE.npc.height, baseScale: 1.1 },
  });

  return (
    <>
      {plan.lakes.map((p, i) => (
        <Lake key={i} x={p.x} y={p.y} scale={p.scale} fillColor="#6FC3E0" borderColor="#E3C878" />
      ))}
      {plan.trees.map((p, i) => (
        <Tree key={i} x={p.x} y={p.y} scale={p.scale} variant={Math.floor(hashRandom(1, i) * TREE_VARIANT_COUNT)} leavesColor="#5FBF5A" />
      ))}
      {plan.npcs.map((p, i) => (
        <Character key={i} x={p.x} y={p.y} bulk={palette.npcBulk} outfitColor={palette.npcOutfit} scale={p.scale} accessory="strawHat" />
      ))}
    </>
  );
}
