import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseMediaView } from '@/components/exercise/ExerciseMediaView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/theme';
import { getMuscleGroupById, listExercisesByPrimaryMuscleWithEquipment } from '@/db/queries/exercises';
import { bucketForEquipment, EQUIPMENT_BUCKETS, type ExerciseEquipmentBucket } from '@/domain/exerciseEquipmentBucket';

export default function MuscleGroupBucketCatalogScreen() {
  const { muscleGroupId, bucket } = useLocalSearchParams<{ muscleGroupId: string; bucket: ExerciseEquipmentBucket }>();

  const [muscleName, setMuscleName] = useState('');
  const [rows, setRows] = useState<{ exerciseId: string; exerciseName: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [muscle, exercisesForMuscle] = await Promise.all([
        getMuscleGroupById(muscleGroupId),
        listExercisesByPrimaryMuscleWithEquipment(muscleGroupId),
      ]);
      setMuscleName(muscle?.name ?? '');
      setRows(
        exercisesForMuscle
          .filter((exercise) => bucketForEquipment(exercise.equipmentIds) === bucket)
          .map((exercise) => ({ exerciseId: exercise.exerciseId, exerciseName: exercise.exerciseName })),
      );
      setLoaded(true);
    })();
  }, [muscleGroupId, bucket]);

  if (!loaded) return null;

  const bucketLabel = EQUIPMENT_BUCKETS.find((b) => b.id === bucket)?.label ?? '';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">{muscleName}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {bucketLabel}
        </ThemedText>
        <FlatList
          style={styles.list}
          data={rows}
          keyExtractor={(item) => item.exerciseId}
          initialNumToRender={8}
          windowSize={5}
          renderItem={({ item }) => (
            <Link href={`/exercises/${item.exerciseId}`} asChild>
              <Pressable>
                <Card style={styles.row}>
                  <ThemedText type="default" style={styles.rowLabel} numberOfLines={1}>
                    {item.exerciseName}
                  </ThemedText>
                  <ExerciseMediaView exerciseId={item.exerciseId} width={56} height={56} autoPlay={false} />
                </Card>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <ThemedText themeColor="textSecondary">Aucun exercice dans cette catégorie pour l&apos;instant.</ThemedText>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  list: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  rowLabel: { flexShrink: 1, flex: 1 },
});
