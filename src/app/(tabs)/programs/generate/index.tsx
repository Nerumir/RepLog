import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalize } from '@/i18n/localize';
import { listEquipment } from '@/db/queries/exercises';
import type { ExperienceLevel, ProgramGoal } from '@/domain/programGenerator';
import { SPLIT_TYPES, type SplitType } from '@/domain/splitTypes';
import type { EquipmentId } from '@/domain/types';

const SESSIONS_PER_WEEK_OPTIONS = [1, 2, 3, 4, 5, 6, 7];
const SESSION_MINUTES_OPTIONS = [20, 30, 40, 50, 60, 70, 80];
const GOAL_OPTIONS: ProgramGoal[] = ['hypertrophy', 'general_fitness'];
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];

export default function GenerateQuestionnaireScreen() {
  const { t } = useTranslation();
  const localize = useLocalize();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [equipmentOptions, setEquipmentOptions] = useState<{ id: EquipmentId; name: string; nameEn: string }[]>([]);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [availableEquipment, setAvailableEquipment] = useState<Set<EquipmentId>>(new Set(['bodyweight']));
  const [goal, setGoal] = useState<ProgramGoal>('general_fitness');
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');
  const [minutesPerSession, setMinutesPerSession] = useState(40);
  const [splitType, setSplitType] = useState<SplitType>('full_body');

  useEffect(() => {
    listEquipment().then((rows) => setEquipmentOptions(rows as { id: EquipmentId; name: string; nameEn: string }[]));
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
          <ThemedText type="subtitle">{t('generate.title')}</ThemedText>

          <ThemedText type="smallBold">{t('generate.sessionsPerWeekLabel')}</ThemedText>
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

          <ThemedText type="smallBold">{t('generate.equipmentLabel')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('generate.equipmentHint')}
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
                  {localize(equipment.name, equipment.nameEn)}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText type="smallBold">{t('generate.goalLabel')}</ThemedText>
          {GOAL_OPTIONS.map((value) => (
            <Pressable
              key={value}
              style={[styles.option, goal === value && { borderColor: colors.accent, backgroundColor: colors.backgroundSelected }]}
              onPress={() => setGoal(value)}>
              <ThemedText type="default">{t(`enums.goal.${value}.label`)}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t(`enums.goal.${value}.description`)}
              </ThemedText>
            </Pressable>
          ))}

          <ThemedText type="smallBold">{t('generate.experienceLabel')}</ThemedText>
          <ThemedView style={styles.pillRow}>
            {EXPERIENCE_OPTIONS.map((value) => (
              <Pressable
                key={value}
                style={[styles.pillFlex, experience === value && { backgroundColor: colors.accent }]}
                onPress={() => setExperience(value)}>
                <ThemedText type="small" style={experience === value ? styles.pillLabelSelected : undefined}>
                  {t(`enums.experience.${value}`)}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
          {experience === 'beginner' && (
            <ThemedText type="small" themeColor="textSecondary">
              {t('generate.beginnerHint')}
            </ThemedText>
          )}

          <ThemedText type="smallBold">{t('generate.timeLabel')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('generate.timeHint', { count: Math.max(1, Math.floor(minutesPerSession / 10)) })}
          </ThemedText>
          <ThemedView style={styles.pillRowWrap}>
            {SESSION_MINUTES_OPTIONS.map((minutes) => (
              <Pressable
                key={minutes}
                style={[styles.pill, minutesPerSession === minutes && { backgroundColor: colors.accent }]}
                onPress={() => setMinutesPerSession(minutes)}>
                <ThemedText type="small" style={minutesPerSession === minutes ? styles.pillLabelSelected : undefined}>
                  {t('generate.minutes', { count: minutes })}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText type="smallBold">{t('generate.splitTypeLabel')}</ThemedText>
          {SPLIT_TYPES.map((type) => (
            <Pressable
              key={type}
              style={[styles.option, splitType === type && { borderColor: colors.accent, backgroundColor: colors.backgroundSelected }]}
              onPress={() => setSplitType(type)}>
              <ThemedText type="default">{t(`enums.splitType.${type}.label`)}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t(`enums.splitType.${type}.description`)}
              </ThemedText>
            </Pressable>
          ))}

          <GameButton
            style={[styles.submit, { backgroundColor: colors.accent }, availableEquipment.size === 0 && styles.submitDisabled]}
            onPress={handleContinue}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              {t('programs.generate')}
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
