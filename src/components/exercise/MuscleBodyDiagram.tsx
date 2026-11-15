import Body, { type ExtendedBodyPart } from 'react-native-body-highlighter';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MuscleRole, Sex } from '@/domain/types';
import { muscleHighlighterSlugs } from '@/media/muscleHighlighterMap';

export type MuscleHighlights = Partial<Record<string, MuscleRole>>;

interface MuscleBodyDiagramProps {
  view: 'front' | 'back';
  highlights: MuscleHighlights;
  sex?: Sex;
  scale?: number;
}

const PRIMARY_COLOR = '#FDE047';
const SECONDARY_COLOR = '#F59E0B';

export function MuscleBodyDiagram({ view, highlights, sex = 'male', scale = 0.55 }: MuscleBodyDiagramProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const data: ExtendedBodyPart[] = Object.entries(highlights).flatMap(([muscleGroupId, role]) => {
    const slug = muscleHighlighterSlugs[muscleGroupId];
    if (!slug || !role) return [];
    return [{ slug, color: role === 'primary' ? PRIMARY_COLOR : SECONDARY_COLOR }];
  });

  return (
    <Body
      data={data}
      side={view}
      gender={sex === 'female' ? 'female' : 'male'}
      scale={scale}
      border={colors.border}
      defaultFill={colors.backgroundSelected}
    />
  );
}
