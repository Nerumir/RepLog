import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RestCountdownRingProps {
  remainingSeconds: number | null;
  totalSeconds: number;
  size?: number;
}

export function RestCountdownRing({ remainingSeconds, totalSeconds, size = 220 }: RestCountdownRingProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    if (remainingSeconds === null || totalSeconds <= 0) return;
    const fraction = Math.min(1, Math.max(0, remainingSeconds / totalSeconds));
    progress.value = withTiming(fraction, { duration: 350 });
  }, [remainingSeconds, totalSeconds, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <ThemedView style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.backgroundSelected}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.accentSecondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <ThemedText type="title" style={styles.timerText}>
        {remainingSeconds === null ? '…' : `${remainingSeconds}s`}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  timerText: { fontSize: 44, lineHeight: 48 },
});
