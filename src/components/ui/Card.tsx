import { StyleSheet, View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Gradients, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type CardProps = ViewProps & {
  /** Dégradé d'accent en fond de carte (pour mettre en avant un élément : niveau atteint, séance active...). */
  glow?: keyof typeof Gradients;
};

export function Card({ style, glow, children, ...rest }: CardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  if (glow) {
    return (
      <LinearGradient
        colors={Gradients[glow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.glowBorder, style]}
        {...rest}>
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }, style]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  glowBorder: {
    borderWidth: 0,
    shadowColor: '#A855F7',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
