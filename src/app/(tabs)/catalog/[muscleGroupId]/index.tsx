import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMuscleGroupById, listExercisesByPrimaryMuscleWithEquipment } from '@/db/queries/exercises';
import { bucketForEquipment, EQUIPMENT_BUCKETS } from '@/domain/exerciseEquipmentBucket';

export default function MuscleGroupCatalogScreen() {
  const { muscleGroupId } = useLocalSearchParams<{ muscleGroupId: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [muscleName, setMuscleName] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [muscle, exercisesForMuscle] = await Promise.all([
        getMuscleGroupById(muscleGroupId),
        listExercisesByPrimaryMuscleWithEquipment(muscleGroupId),
      ]);
      setMuscleName(muscle?.name ?? '');
      const next: Record<string, number> = {};
      for (const exercise of exercisesForMuscle) {
        const bucket = bucketForEquipment(exercise.equipmentIds);
        next[bucket] = (next[bucket] ?? 0) + 1;
      }
      setCounts(next);
      setLoaded(true);
    })();
  }, [muscleGroupId]);

  if (!loaded) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">{muscleName}</ThemedText>
        {EQUIPMENT_BUCKETS.map((bucket) => (
          <Link key={bucket.id} href={`/catalog/${muscleGroupId}/${bucket.id}`} asChild>
            <Pressable disabled={!counts[bucket.id]}>
              <Card style={[styles.row, !counts[bucket.id] && styles.rowDisabled]}>
                <ThemedView style={styles.rowText}>
                  <ThemedText type="default">{bucket.label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {counts[bucket.id] ?? 0} exercice(s)
                  </ThemedText>
                </ThemedView>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </Pressable>
          </Link>
        ))}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  rowDisabled: { opacity: 0.4 },
  rowText: { gap: 2, backgroundColor: 'transparent' },
});
