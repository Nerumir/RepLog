import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { getExerciseMedia } from '@/media/exerciseMedia';

interface ExerciseMediaViewProps {
  exerciseId: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
}

export function ExerciseMediaView({ exerciseId, width = 280, height = 187, autoPlay = true }: ExerciseMediaViewProps) {
  const media = getExerciseMedia(exerciseId);

  if (media.kind === 'video') {
    return <ExerciseVideoView source={media.source} width={width} height={height} autoPlay={autoPlay} />;
  }

  return (
    <Image
      source={media.source}
      style={[styles.image, { width, height }]}
      contentFit="cover"
      // Les GIF animés (expo-image utilise Glide côté Android) jouent automatiquement ;
      // les images fixes s'affichent simplement en statique, sans traitement particulier.
    />
  );
}

function ExerciseVideoView({
  source,
  width,
  height,
  autoPlay,
}: {
  source: number;
  width: number;
  height: number;
  autoPlay: boolean;
}) {
  // Dans les listes (miniatures), on affiche juste la première image sans lancer la lecture :
  // décoder et boucler une dizaine de vidéos en même temps fait ramer le scroll.
  const player = useVideoPlayer(source, (p) => {
    p.muted = true;
    if (autoPlay) {
      p.loop = true;
      p.play();
    }
  });

  return (
    <VideoView
      player={player}
      style={[styles.image, { width, height }]}
      contentFit="cover"
      nativeControls={false}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
  },
});
