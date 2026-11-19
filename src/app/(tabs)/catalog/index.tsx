import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { HelpButton } from '@/components/ui/HelpButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalize } from '@/i18n/localize';
import { listMuscleGroups } from '@/db/queries/exercises';

export default function ExerciseCatalogScreen() {
  const { t } = useTranslation();
  const localize = useLocalize();
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
          <ThemedText type="subtitle">{t('catalog.title')}</ThemedText>
          <HelpButton title={t('catalog.help.title')} body={t('catalog.help.body')} />
        </ThemedView>
        <ThemedText type="small" themeColor="textSecondary">
          {t('catalog.subtitle')}
        </ThemedText>
        <FlatList
          style={styles.list}
          data={muscleGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/catalog/${item.id}`} asChild>
              <Pressable>
                <Card style={styles.row}>
                  <ThemedText type="default">{localize(item.name, item.nameEn)}</ThemedText>
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
