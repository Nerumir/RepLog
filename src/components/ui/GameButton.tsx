import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { playTap } from '@/audio/soundEffects';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type GameButtonProps = PressableProps & {
  /** Désactive le son/vibration de tap (utile pour des boutons secondaires très répétés). */
  silent?: boolean;
};

export function GameButton({ style, onPressIn, onPressOut, silent, ...rest }: GameButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPressIn={(event) => {
        // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue: la mutation de .value est l'API attendue, pas un état React.
        scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
        if (!silent) {
          playTap();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue: la mutation de .value est l'API attendue, pas un état React.
        scale.value = withSpring(1, { damping: 12, stiffness: 250 });
        onPressOut?.(event);
      }}
      {...rest}
    />
  );
}
