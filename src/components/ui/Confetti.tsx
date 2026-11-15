import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';

const COLORS = ['#FDE047', '#A855F7', '#F59E0B', '#60A5FA', '#34D399', '#F472B6', '#FB923C', '#FFFFFF'];
const PARTICLE_COUNT = 70;

interface Particle {
  color: string;
  angle: number;
  distance: number;
  width: number;
  height: number;
  startX: number;
  delay: number;
  spins: number;
}

function ConfettiParticle({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
    );
  }, [particle.delay, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const dx = particle.startX + Math.cos(particle.angle) * particle.distance * progress.value;
    const dy = Math.sin(particle.angle) * particle.distance * progress.value + 260 * progress.value ** 2;
    return {
      transform: [
        { translateX: dx },
        { translateY: dy },
        { rotate: `${progress.value * particle.spins * 360}deg` },
      ],
      opacity: 1 - progress.value ** 2,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { width: particle.width, height: particle.height, backgroundColor: particle.color },
        animatedStyle,
      ]}
    />
  );
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    color: COLORS[i % COLORS.length],
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
    distance: 160 + Math.random() * 260,
    width: 7 + Math.random() * 10,
    height: 10 + Math.random() * 16,
    startX: (Math.random() - 0.5) * 160,
    delay: Math.random() * 220,
    spins: 2 + Math.random() * 4,
  }));
}

/** Burst de confettis déclenché une fois au montage (remonter le composant via une key pour le relancer). */
export function Confetti() {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- génération aléatoire ponctuelle au montage, hors du rendu pur.
    setParticles(generateParticles());
  }, []);

  if (!particles) return null;

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {particles.map((particle, index) => (
        <ConfettiParticle key={index} particle={particle} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    alignItems: 'center',
  },
  particle: { position: 'absolute', borderRadius: 2 },
});
