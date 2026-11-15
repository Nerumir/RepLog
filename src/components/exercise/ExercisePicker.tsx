import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { ExerciseMediaView } from '@/components/exercise/ExerciseMediaView';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function normalizeForSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

interface ExercisePickerProps {
  catalog: { id: string; name: string; nameEn?: string }[];
  onSelect: (exerciseId: string, exerciseName: string) => void;
}

/**
 * Liste déroulante avec recherche, pensée pour un catalogue de 100+ exercices.
 * La recherche matche aussi le nom anglais d'origine (jamais affiché) pour retrouver un
 * exercice même en tapant son nom anglais plutôt que sa traduction française.
 */
export function ExercisePicker({ catalog, onSelect }: ExercisePickerProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 30;

  const normalizedQuery = normalizeForSearch(query);
  const filtered = useMemo(
    () =>
      normalizedQuery
        ? catalog.filter(
            (exercise) =>
              normalizeForSearch(exercise.name).includes(normalizedQuery) ||
              (exercise.nameEn && normalizeForSearch(exercise.nameEn).includes(normalizedQuery)),
          )
        : catalog,
    [catalog, normalizedQuery],
  );
  // On ne rend que 30 lignes à la fois (et 30 de plus à chaque bas de liste atteint) : chaque
  // ligne monte un lecteur vidéo, en monter des centaines d'un coup fait ramer le scroll.
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <TextInput
        placeholder="Rechercher un exercice..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={handleQueryChange}
        style={[styles.searchInput, { color: colors.text, borderColor: colors.backgroundSelected }]}
      />
      <FlatList
        style={styles.list}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        data={visible}
        keyExtractor={(exercise) => exercise.id}
        initialNumToRender={10}
        windowSize={5}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (visible.length < filtered.length) setPage((p) => p + 1);
        }}
        renderItem={({ item: exercise }) => (
          <Pressable onPress={() => onSelect(exercise.id, exercise.name)} style={styles.row}>
            <ThemedText type="default" style={styles.rowLabel} numberOfLines={1}>
              {exercise.name}
            </ThemedText>
            <ExerciseMediaView exerciseId={exercise.id} width={48} height={48} autoPlay={false} />
          </Pressable>
        )}
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary">
            {catalog.length === 0 ? 'Catalogue vide.' : 'Aucun exercice trouvé.'}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, padding: Spacing.three, gap: Spacing.two },
  searchInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  list: { maxHeight: 240 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    backgroundColor: 'transparent',
  },
  rowLabel: { flexShrink: 1, flex: 1 },
});
