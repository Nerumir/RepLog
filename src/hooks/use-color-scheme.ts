import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useThemeStore } from '@/state/useThemeStore';

/** Thème effectif : respecte le choix explicite de l'utilisateur (clair/sombre), sinon suit le système. */
export function useColorScheme(): 'light' | 'dark' {
  const mode = useThemeStore((state) => state.mode);
  const systemScheme = useSystemColorScheme();

  if (mode === 'light' || mode === 'dark') return mode;
  return systemScheme === 'dark' ? 'dark' : 'light';
}
