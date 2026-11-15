import { useEffect, useMemo, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { Easing, runOnJS, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { absolutePosition, POINTS_PER_BIOME } from '@/domain/attendance';
import { AtmosphereOverlay, type AtmosphereType } from './AtmosphereOverlay';
import { BiomeGround } from './BiomeGround';
import { PlayerMarker } from './PlayerMarker';
import { BIOME_PALETTES } from './palette';
import { buildRoadPoints, CANVAS_WIDTH, depthScaleForY, roadTotalHeight, sampleRoadCurve } from './road';
import { RoadPath } from './RoadPath';
import { DesertBiome } from './biomes/DesertBiome';
import { ForestBiome } from './biomes/ForestBiome';
import { PrairieBiome } from './biomes/PrairieBiome';
import { TundraBiome } from './biomes/TundraBiome';
import { ValhallaBiome } from './biomes/ValhallaBiome';
import { VolcanoBiome } from './biomes/VolcanoBiome';

const BIOME_COMPONENTS = [PrairieBiome, ForestBiome, TundraBiome, DesertBiome, VolcanoBiome, ValhallaBiome];
const ATMOSPHERE_BY_BIOME: AtmosphereType[] = ['none', 'none', 'snow', 'sand', 'emberLava', 'emberGold'];
const PLAYER_COLOR = '#7C3AED';

export interface AttendanceMapProps {
  biomeIndex: number;
  pointInBiome: number;
  /** Point de départ (même biome) depuis lequel glisser le repère jusqu'à `pointInBiome`, si différent. */
  animateFromPointInBiome?: number;
  /** Appelé une fois le glissement d'animation arrivé à destination. */
  onArrived?: () => void;
}

export function AttendanceMap({ biomeIndex, pointInBiome, animateFromPointInBiome, onArrived }: AttendanceMapProps) {
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const height = roadTotalHeight(POINTS_PER_BIOME);
  const BiomeComponent = BIOME_COMPONENTS[biomeIndex] ?? BIOME_COMPONENTS[0];
  const palette = BIOME_PALETTES[biomeIndex] ?? BIOME_PALETTES[0];
  const points = useMemo(() => buildRoadPoints(POINTS_PER_BIOME, biomeIndex * 7919 + 13), [biomeIndex]);
  const playerPos = points[pointInBiome] ?? points[0];
  const playerDepth = depthScaleForY(playerPos.y, height);
  const stepNumber = absolutePosition({ biomeIndex, pointInBiome }) + 1;
  const atmosphereType = ATMOSPHERE_BY_BIOME[biomeIndex] ?? 'none';
  const screenHeight = Dimensions.get('window').height;

  const animSamples = useMemo(() => {
    if (animateFromPointInBiome == null || animateFromPointInBiome === pointInBiome) return null;
    const from = Math.min(animateFromPointInBiome, pointInBiome);
    const to = Math.max(animateFromPointInBiome, pointInBiome);
    const segment = points.slice(from, to + 1);
    if (segment.length < 2) return null;
    const curve = sampleRoadCurve(segment, 14);
    return animateFromPointInBiome < pointInBiome ? curve : curve.slice().reverse();
  }, [points, animateFromPointInBiome, pointInBiome]);

  const progress = useSharedValue(animSamples ? 0 : 1);

  const markerX = useDerivedValue(() => {
    if (!animSamples) return playerPos.x;
    const idx = progress.value * (animSamples.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, animSamples.length - 1);
    const t = idx - i0;
    return animSamples[i0].x + (animSamples[i1].x - animSamples[i0].x) * t;
  }, [animSamples, playerPos.x]);

  const markerY = useDerivedValue(() => {
    if (!animSamples) return playerPos.y;
    const idx = progress.value * (animSamples.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, animSamples.length - 1);
    const t = idx - i0;
    return animSamples[i0].y + (animSamples[i1].y - animSamples[i0].y) * t;
  }, [animSamples, playerPos.y]);

  useEffect(() => {
    if (!animSamples) {
      progress.value = 1;
      return;
    }
    progress.value = 0;
    progress.value = withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }, (finished) => {
      if (finished && onArrived) runOnJS(onArrived)();
    });
  }, [animSamples, onArrived, progress]);

  useEffect(() => {
    const viewportHeight = Dimensions.get('window').height;
    const maxScroll = Math.max(height - viewportHeight, 0);
    const targetScrollY = Math.min(Math.max(playerPos.y - viewportHeight / 2, 0), maxScroll);
    const timeout = setTimeout(() => scrollRef.current?.scrollTo({ y: targetScrollY, animated: true }), 50);
    return () => clearTimeout(timeout);
  }, [height, playerPos.y]);

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content}>
        <Canvas style={{ width: CANVAS_WIDTH, height }}>
          <BiomeGround height={height} palette={palette} />
          <RoadPath points={points} currentPoint={pointInBiome} palette={palette} height={height} travelColor={PLAYER_COLOR} />
          <BiomeComponent height={height} roadPoints={points} />
          <PlayerMarker x={markerX} y={markerY} scale={1.4 * playerDepth} color={PLAYER_COLOR} stepNumber={stepNumber} />
        </Canvas>
      </ScrollView>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AtmosphereOverlay type={atmosphereType} width={CANVAS_WIDTH} height={screenHeight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  content: { alignItems: 'center' },
});
