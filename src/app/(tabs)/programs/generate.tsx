import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { attachSessionTemplateToProgram, createProgram } from '@/db/queries/programs';
import { createSessionTemplate } from '@/db/queries/sessionTemplates';
import { generateProgram } from '@/domain/programGenerator';
import { splitTypeInfo, type SplitType } from '@/domain/splitTypes';

const SPLIT_TYPES = Object.keys(splitTypeInfo) as SplitType[];

export default function GenerateProgramScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [splitType, setSplitType] = useState<SplitType>('full_body');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('3');
  const [warnings, setWarnings] = useState<string[]>([]);

  async function handleGenerate() {
    const result = generateProgram(
      { availableEquipment: ['bodyweight', 'dumbbell', 'barbell'], sessionsPerWeek: Number(sessionsPerWeek), splitType },
      [],
    );
    setWarnings(result.warnings);

    const program = await createProgram(result.program);
    for (const [index, sessionTemplate] of result.sessionTemplates.entries()) {
      const createdTemplate = await createSessionTemplate({
        name: sessionTemplate.name,
        defaultRestSeconds: sessionTemplate.defaultRestSeconds,
      });
      await attachSessionTemplateToProgram(program.id, createdTemplate.id, index, sessionTemplate.name);
    }

    router.replace(`/programs/${program.id}`);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Générer un programme</ThemedText>

          <ThemedText type="smallBold">Type de split</ThemedText>
          {SPLIT_TYPES.map((type) => (
            <Pressable
              key={type}
              style={[styles.option, splitType === type && { borderColor: colors.accent, backgroundColor: colors.backgroundSelected }]}
              onPress={() => setSplitType(type)}>
              <ThemedText type="default">{splitTypeInfo[type].label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {splitTypeInfo[type].description}
              </ThemedText>
            </Pressable>
          ))}

          <ThemedText type="smallBold">Séances par semaine</ThemedText>
          <TextInput
            value={sessionsPerWeek}
            onChangeText={setSessionsPerWeek}
            keyboardType="numeric"
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />

          {warnings.map((warning) => (
            <ThemedText key={warning} type="small" themeColor="textSecondary">
              ⚠ {warning}
            </ThemedText>
          ))}

          <GameButton style={[styles.submit, { backgroundColor: colors.accent }]} onPress={handleGenerate}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              Générer
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
  option: { padding: Spacing.three, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', gap: 2 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  submit: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.two },
});
