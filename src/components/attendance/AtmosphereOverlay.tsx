import { useEffect, useMemo } from 'react';
import { Canvas, Circle, Group, RoundedRect } from '@shopify/react-native-skia';
import { Easing, useDerivedValue, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export type AtmosphereType = 'none' | 'snow' | 'sand' | 'emberLava' | 'emberGold';

export interface AtmosphereOverlayProps {
  type: AtmosphereType;
  width: number;
  height: number;
}

interface DotConfig {
  x: number;
  size: number;
  fallDuration: number;
  /** Décalage 0..1 dans le cycle de chute : place la particule déjà en plein vol dès le montage. */
  initialPhase: number;
  swayAmplitude: number;
  swayDuration: number;
}

interface StreakConfig {
  y: number;
  length: number;
  duration: number;
  /** Décalage 0..1 dans le cycle de traversée : déjà réparti sur l'écran dès le montage. */
  initialPhase: number;
}

function buildDotConfigs(count: number, width: number, fallRange: [number, number]): DotConfig[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    size: 1.6 + Math.random() * 1.8,
    fallDuration: fallRange[0] + Math.random() * (fallRange[1] - fallRange[0]),
    initialPhase: Math.random(),
    swayAmplitude: 8 + Math.random() * 14,
    swayDuration: 1400 + Math.random() * 1200,
  }));
}

function buildStreakConfigs(count: number, height: number, durationRange: [number, number], lengthRange: [number, number]): StreakConfig[] {
  return Array.from({ length: count }, () => ({
    y: Math.random() * height,
    length: lengthRange[0] + Math.random() * (lengthRange[1] - lengthRange[0]),
    duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
    initialPhase: Math.random(),
  }));
}

/**
 * Point qui tombe en boucle du haut vers le bas de l'écran, avec un léger balancement latéral
 * (pas parfaitement vertical). Le cycle démarre à 0 mais le rendu ajoute `initialPhase` (modulo
 * 1) : chaque particule est donc déjà répartie à un point aléatoire de sa chute dès le premier
 * rendu, au lieu de toutes partir du haut en même temps (effet de "salves" sinon).
 */
function FallingDot({ config, height, color, opacity }: { config: DotConfig; height: number; color: string; opacity: number }) {
  const fall = useSharedValue(0);
  const sway = useSharedValue(0);

  useEffect(() => {
    fall.value = withRepeat(withTiming(1, { duration: config.fallDuration, easing: Easing.linear }), -1, false);
    sway.value = withRepeat(
      withSequence(
        withTiming(1, { duration: config.swayDuration, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1, { duration: config.swayDuration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [config, fall, sway]);

  const cy = useDerivedValue(() => {
    const t = (fall.value + config.initialPhase) % 1;
    return -20 + t * (height + 40);
  });
  const cx = useDerivedValue(() => config.x + sway.value * config.swayAmplitude);

  return <Circle cx={cx} cy={cy} r={config.size} color={color} opacity={opacity} />;
}

/** Petit trait qui traverse l'écran horizontalement en boucle, façon vent de sable (même principe de phase initiale que FallingDot). */
function WindStreak({ config, width, color, opacity }: { config: StreakConfig; width: number; color: string; opacity: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: config.duration, easing: Easing.linear }), -1, false);
  }, [config, progress]);

  const x = useDerivedValue(() => {
    const t = (progress.value + config.initialPhase) % 1;
    return -config.length - 20 + t * (width + config.length + 40);
  });

  return <RoundedRect x={x} y={config.y} width={config.length} height={1.6} r={1} color={color} opacity={opacity} />;
}

/**
 * Calque d'ambiance par biome, superposé à l'écran (pas au contenu défilant) : neige en
 * Toundra, vent de sable au Désert, particules incandescentes au Volcan/Valhalla. Prairie et
 * Forêt n'ont aucune animation d'atmosphère.
 */
export function AtmosphereOverlay({ type, width, height }: AtmosphereOverlayProps) {
  const dotConfigs = useMemo(() => {
    if (type === 'snow') return buildDotConfigs(32, width, [5500, 9000]);
    if (type === 'emberLava' || type === 'emberGold') return buildDotConfigs(16, width, [8000, 13000]);
    return [];
  }, [type, width]);

  const streakConfigs = useMemo(
    () => (type === 'sand' ? buildStreakConfigs(28, height, [380, 650], [22, 46]) : []),
    [type, height],
  );

  if (type === 'none') return null;

  const dotColor = type === 'snow' ? '#FFFFFF' : type === 'emberLava' ? '#FDBA3A' : '#F2C94C';
  const dotOpacity = type === 'snow' ? 0.85 : 0.78;

  return (
    <Canvas style={{ width, height }}>
      <Group>
        {dotConfigs.map((config, i) => (
          <FallingDot key={i} config={config} height={height} color={dotColor} opacity={dotOpacity} />
        ))}
        {streakConfigs.map((config, i) => (
          <WindStreak key={i} config={config} width={width} color="#FBF2DC" opacity={0.7} />
        ))}
      </Group>
    </Canvas>
  );
}
