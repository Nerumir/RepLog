import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { playError } from '@/audio/soundEffects';
import { createProgram } from '@/db/queries/programs';
import { SPLIT_TYPES, type SplitType } from '@/domain/splitTypes';

export default function NewProgramScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [name, setName] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('full_body');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('3');
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) {
      playError();
      setError(t('newProgram.nameRequired'));
      return;
    }
    const program = await createProgram({
      name: name.trim(),
      splitType,
      sessionsPerWeek: Number(sessionsPerWeek) || 1,
      source: 'manual',
    });

    router.replace(`/programs/${program.id}`);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">{t('newProgram.title')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('newProgram.subtitle')}
          </ThemedText>

          <TextInput
            placeholder={t('newProgram.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />

          <ThemedText type="smallBold">{t('newProgram.splitTypeLabel')}</ThemedText>
          {SPLIT_TYPES.map((type) => (
            <Pressable
              key={type}
              style={[styles.option, splitType === type && { borderColor: colors.accent, backgroundColor: colors.backgroundSelected }]}
              onPress={() => setSplitType(type)}>
              <ThemedText type="default">{t(`enums.splitType.${type}.label`)}</ThemedText>
            </Pressable>
          ))}

          <ThemedText type="smallBold" style={styles.sectionSpacing}>
            {t('newProgram.sessionsPerWeekLabel')}
          </ThemedText>
          <TextInput
            value={sessionsPerWeek}
            onChangeText={setSessionsPerWeek}
            keyboardType="numeric"
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />

          {error && (
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          )}

          <GameButton style={[styles.submit, { backgroundColor: colors.accent }]} onPress={handleSave}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              {t('newProgram.submit')}
            </ThemedText>
          </GameButton>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  option: { padding: Spacing.three, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', gap: 2 },
  sectionSpacing: { marginTop: Spacing.three },
  submit: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.three },
});
