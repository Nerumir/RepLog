import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { listMuscleGroups } from '@/db/queries/exercises';

export default function ExerciseCatalogScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [muscleGroups, setMuscleGroups] = useState<Awaited<ReturnType<typeof listMuscleGroups>>>([]);

  useEffect(() => {
    listMuscleGroups().then(setMuscleGroups);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Exercices</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Choisis un groupe musculaire pour parcourir le catalogue.
        </ThemedText>
        <FlatList
          style={styles.list}
          data={muscleGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/catalog/${item.id}`} asChild>
              <Pressable>
                <Card style={styles.row}>
                  <ThemedText type="default">{item.name}</ThemedText>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Card>
              </Pressable>
            </Link>
          )}
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
    marginBottom: Spacing.two,
  },
});
