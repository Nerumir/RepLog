import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ExerciseMediaView } from '@/components/exercise/ExerciseMediaView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/theme';
import { useLocalize } from '@/i18n/localize';
import { getMuscleGroupById, listExercisesByPrimaryMuscleWithEquipment } from '@/db/queries/exercises';
import { bucketForEquipment, type ExerciseEquipmentBucket } from '@/domain/exerciseEquipmentBucket';

export default function MuscleGroupBucketCatalogScreen() {
  const { muscleGroupId, bucket } = useLocalSearchParams<{ muscleGroupId: string; bucket: ExerciseEquipmentBucket }>();
  const { t } = useTranslation();
  const localize = useLocalize();

  const [muscle, setMuscle] = useState<Awaited<ReturnType<typeof getMuscleGroupById>> | null>(null);
  const [rows, setRows] = useState<{ exerciseId: string; exerciseName: string; exerciseNameEn: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [muscleRow, exercisesForMuscle] = await Promise.all([
        getMuscleGroupById(muscleGroupId),
        listExercisesByPrimaryMuscleWithEquipment(muscleGroupId),
      ]);
      setMuscle(muscleRow);
      setRows(
        exercisesForMuscle
          .filter((exercise) => bucketForEquipment(exercise.equipmentIds) === bucket)
          .map((exercise) => ({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            exerciseNameEn: exercise.exerciseNameEn,
          })),
      );
      setLoaded(true);
    })();
  }, [muscleGroupId, bucket]);

  if (!loaded) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">{muscle ? localize(muscle.name, muscle.nameEn) : ''}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t(`enums.equipmentBucket.${bucket}`)}
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
                    {localize(item.exerciseName, item.exerciseNameEn)}
                  </ThemedText>
                  <ExerciseMediaView exerciseId={item.exerciseId} width={56} height={56} autoPlay={false} />
                </Card>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('catalog.emptyBucket')}</ThemedText>}
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
