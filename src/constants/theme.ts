/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

import type { AchievementTier } from '@/domain/achievements';
import type { PerformanceLevel } from '@/domain/types';

export const Colors = {
  light: {
    text: '#0E0B1A',
    background: '#F4F1FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E7DEFF',
    textSecondary: '#6B6480',
    accent: '#7C3AED',
    accentSecondary: '#F59E0B',
    border: '#DCD3F5',
    success: '#16A34A',
    danger: '#DC2626',
  },
  dark: {
    text: '#F3EFFF',
    background: '#0B0A14',
    backgroundElement: '#17152A',
    backgroundSelected: '#241F3D',
    textSecondary: '#9790B5',
    accent: '#A78BFA',
    accentSecondary: '#FBBF24',
    border: '#2E2850',
    success: '#4ADE80',
    danger: '#F87171',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Dégradés et glow façon "jeu vidéo" — indépendants du light/dark (toujours vifs sur fond sombre de carte).
export const Gradients = {
  accent: ['#7C3AED', '#A855F7'] as const,
  gold: ['#F59E0B', '#FDE047'] as const,
  danger: ['#EF4444', '#F87171'] as const,
} as const;

export const Glow = {
  accent: '#A855F7',
  gold: '#FDE047',
} as const;

// Paliers de niveau de performance (Débutant → Élite) : tier numérique, libellé, médaille, couleur + dégradé.
export const LevelTierInfo: Record<
  PerformanceLevel,
  { tier: number; label: string; medal: string; color: string; gradient: readonly [string, string] }
> = {
  beginner: { tier: 1, label: 'Débutant', medal: 'Bronze', color: '#92400E', gradient: ['#78350F', '#B45309'] },
  novice: { tier: 2, label: 'Novice', medal: 'Argent', color: '#CBD5E1', gradient: ['#94A3B8', '#E2E8F0'] },
  intermediate: { tier: 3, label: 'Intermédiaire', medal: 'Or', color: '#F59E0B', gradient: ['#D97706', '#FDE047'] },
  advanced: { tier: 4, label: 'Confirmé', medal: 'Diamant', color: '#38BDF8', gradient: ['#0EA5E9', '#7DD3FC'] },
  elite: { tier: 5, label: 'Élite', medal: 'GrandMaster', color: '#DC2626', gradient: ['#B91C1C', '#F87171'] },
} as const;

// Paliers de trophées de succès (Bronze → Rubis) : mêmes couleurs que les paliers de niveau.
export const TrophyTierInfo: Record<AchievementTier, { label: string; color: string }> = {
  bronze: { label: 'Bronze', color: LevelTierInfo.beginner.color },
  silver: { label: 'Argent', color: LevelTierInfo.novice.color },
  gold: { label: 'Or', color: LevelTierInfo.intermediate.color },
  diamond: { label: 'Diamant', color: LevelTierInfo.advanced.color },
  ruby: { label: 'Rubis', color: LevelTierInfo.elite.color },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
