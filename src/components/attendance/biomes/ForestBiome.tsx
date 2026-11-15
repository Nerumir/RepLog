import { Character } from '../Character';
import { DECOR_SIZE } from '../decorSizes';
import { Hut, Tree, TREE_VARIANT_COUNT } from '../Decor';
import { planDecor } from '../layout';
import { BIOME_PALETTES } from '../palette';
import { hashRandom } from '../random';
import type { BiomeProps } from './types';

export function ForestBiome({ height, roadPoints }: BiomeProps) {
  const palette = BIOME_PALETTES[1];
  const plan = planDecor(height, roadPoints, {
    treesBack: { seed: 11, step: 75, naturalWidth: DECOR_SIZE.tree.width, naturalHeight: DECOR_SIZE.tree.height, baseScale: 0.7 },
    treesFront: { seed: 12, step: 95, naturalWidth: DECOR_SIZE.tree.width, naturalHeight: DECOR_SIZE.tree.height, baseScale: 1.1 },
    huts: { seed: 14, step: 300, naturalWidth: DECOR_SIZE.hut.width, naturalHeight: DECOR_SIZE.hut.height, baseScale: 0.9 },
    npcs: { seed: 13, step: 190, naturalWidth: DECOR_SIZE.npc.width, naturalHeight: DECOR_SIZE.npc.height, baseScale: 1.15 },
  });

  return (
    <>
      {plan.huts.map((p, i) => (
        <Hut key={i} x={p.x} y={p.y} scale={p.scale} wallColor="#5C4028" roofColor="#3F5C3A" />
      ))}
      {plan.treesBack.map((p, i) => (
        <Tree
          key={`b-${i}`}
          x={p.x}
          y={p.y}
          scale={p.scale}
          variant={Math.floor(hashRandom(11, i) * TREE_VARIANT_COUNT)}
          leavesColor="#1F4E2D"
          trunkColor="#4A2E17"
        />
      ))}
      {plan.treesFront.map((p, i) => (
        <Tree key={`f-${i}`} x={p.x} y={p.y} scale={p.scale} variant={Math.floor(hashRandom(12, i) * TREE_VARIANT_COUNT)} leavesColor="#2F6F3D" />
      ))}
      {plan.npcs.map((p, i) => (
        <Character key={i} x={p.x} y={p.y} bulk={palette.npcBulk} outfitColor={palette.npcOutfit} scale={p.scale} accessory="bandana" handItem="bow" />
      ))}
    </>
  );
}
