import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { LevelTierInfo } from '@/constants/theme';
import type { PerformanceLevel } from '@/domain/types';

interface LevelProgressBarProps {
  /** 0..1 */
  progress: number;
  height?: number;
  /** Palier atteint, pour colorer le remplissage (beginner par défaut). */
  level?: PerformanceLevel | null;
}

export function LevelProgressBar({ progress, height = 10, level }: LevelProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 600 });
  }, [clamped, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const gradient = LevelTierInfo[level ?? 'beginner'].gradient;

  return (
    <ThemedView type="backgroundElement" style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fillWrapper, { height, borderRadius: height / 2 }, animatedStyle]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { borderRadius: height / 2 }]}
        />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fillWrapper: { overflow: 'hidden' },
  fill: { flex: 1 },
});
