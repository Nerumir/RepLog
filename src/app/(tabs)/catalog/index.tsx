import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { HelpButton } from '@/components/ui/HelpButton';
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
        <ThemedView style={styles.headerTitleRow}>
          <ThemedText type="subtitle">Exercices</ThemedText>
          <HelpButton
            title="Exercices"
            body={
              "Parcours le catalogue complet des exercices, classé par groupe musculaire. Chaque exercice a une fiche avec une vidéo de démonstration, le matériel nécessaire, et l'historique de tes performances (1RM ou répétitions selon l'exercice).\n\n" +
              "C'est ici que tu peux consulter en détail tes progrès sur un exercice précis, indépendamment des séances où tu l'as pratiqué."
            }
          />
        </ThemedView>
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
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  list: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
});
