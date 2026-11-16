import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { listEquipment } from '@/db/queries/exercises';
import type { ExperienceLevel, ProgramGoal } from '@/domain/programGenerator';
import { splitTypeInfo, type SplitType } from '@/domain/splitTypes';
import type { EquipmentId } from '@/domain/types';

const SPLIT_TYPES = Object.keys(splitTypeInfo) as SplitType[];
const SESSIONS_PER_WEEK_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
const SESSION_MINUTES_OPTIONS = [20, 30, 40, 50, 60, 70, 80];

const GOAL_OPTIONS: { value: ProgramGoal; label: string; description: string }[] = [
  { value: 'hypertrophy', label: 'Prise de volume', description: 'Favorise des exercices qui isolent un muscle à la fois.' },
  { value: 'general_fitness', label: 'Forme générale', description: 'Favorise des exercices polyarticulaires, qui travaillent plusieurs muscles à la fois.' },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

export default function GenerateQuestionnaireScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [equipmentOptions, setEquipmentOptions] = useState<{ id: EquipmentId; name: string }[]>([]);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [availableEquipment, setAvailableEquipment] = useState<Set<EquipmentId>>(new Set(['bodyweight']));
  const [goal, setGoal] = useState<ProgramGoal>('general_fitness');
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');
  const [minutesPerSession, setMinutesPerSession] = useState(40);
  const [splitType, setSplitType] = useState<SplitType>('full_body');

  useEffect(() => {
    listEquipment().then((rows) => setEquipmentOptions(rows as { id: EquipmentId; name: string }[]));
  }, []);

  function toggleEquipment(equipmentId: EquipmentId) {
    setAvailableEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(equipmentId)) next.delete(equipmentId);
      else next.add(equipmentId);
      return next;
    });
  }

  function handleContinue() {
    if (availableEquipment.size === 0) return;
    router.push({
      pathname: '/programs/generate/preview',
      params: {
        sessionsPerWeek: String(sessionsPerWeek),
        availableEquipment: [...availableEquipment].join(','),
        goal,
        experience,
        minutesPerSession: String(minutesPerSession),
        splitType,
      },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Générer un programme</ThemedText>

          <ThemedText type="smallBold">Séances par semaine</ThemedText>
          <ThemedView style={styles.pillRow}>
            {SESSIONS_PER_WEEK_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[styles.pill, sessionsPerWeek === n && { backgroundColor: colors.accent }]}
                onPress={() => setSessionsPerWeek(n)}>
                <ThemedText type="small" style={sessionsPerWeek === n ? styles.pillLabelSelected : undefined}>
                  {n}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText type="smallBold">Matériel à disposition</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Sélectionne tout ce que tu as, même partiellement.
          </ThemedText>
          <ThemedView style={styles.pillRowWrap}>
            {equipmentOptions.map((equipment) => (
              <Pressable
                key={equipment.id}
                style={[
                  styles.equipmentPill,
                  { borderColor: colors.accent },
                  availableEquipment.has(equipment.id) && { backgroundColor: colors.accent },
                ]}
                onPress={() => toggleEquipment(equipment.id)}>
                <ThemedText
                  type="small"
                  themeColor={availableEquipment.has(equipment.id) ? undefined : 'accent'}
                  style={availableEquipment.has(equipment.id) ? styles.pillLabelSelected : undefined}>
                  {equipment.name}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText type="smallBold">Objectif</ThemedText>
          {GOAL_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.option, goal === option.value && { borderColor: colors.accent, backgroundColor: colors.backgroundSelected }]}
              onPress={() => setGoal(option.value)}>
              <ThemedText type="default">{option.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {option.description}
              </ThemedText>
            </Pressable>
          ))}

          <ThemedText type="smallBold">Expérience en musculation</ThemedText>
          <ThemedView style={styles.pillRow}>
            {EXPERIENCE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.pillFlex, experience === option.value && { backgroundColor: colors.accent }]}
                onPress={() => setExperience(option.value)}>
                <ThemedText type="small" style={experience === option.value ? styles.pillLabelSelected : undefined}>
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
          {experience === 'beginner' && (
            <ThemedText type="small" themeColor="textSecondary">
              Les exercices techniques ou délicats à exécuter seront exclus.
            </ThemedText>
          )}

          <ThemedText type="smallBold">Temps par séance</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Environ 10 min par exercice (séries comprises) → {Math.max(1, Math.floor(minutesPerSession / 10))} exercice(s) par séance.
          </ThemedText>
          <ThemedView style={styles.pillRowWrap}>
            {SESSION_MINUTES_OPTIONS.map((minutes) => (
              <Pressable
                key={minutes}
                style={[styles.pill, minutesPerSession === minutes && { backgroundColor: colors.accent }]}
                onPress={() => setMinutesPerSession(minutes)}>
                <ThemedText type="small" style={minutesPerSession === minutes ? styles.pillLabelSelected : undefined}>
                  {minutes} min
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText type="smallBold">Type de séance</ThemedText>
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

          <GameButton
            style={[styles.submit, { backgroundColor: colors.accent }, availableEquipment.size === 0 && styles.submitDisabled]}
            onPress={handleContinue}>
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
  pillRow: { flexDirection: 'row', gap: Spacing.one, backgroundColor: 'transparent' },
  pillRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, backgroundColor: 'transparent' },
  pill: {
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  pillFlex: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  equipmentPill: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  pillLabelSelected: { color: '#FFFFFF', fontWeight: '700' },
  submit: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.three },
  submitDisabled: { opacity: 0.5 },
});
