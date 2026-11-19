import { useEffect, useState } from 'react';
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
import { getUserProfile, updateProfile } from '@/db/queries/profile';
import { formatFrenchDateInput, parseFrenchDate, toFrenchDate } from '@/domain/frenchDate';
import type { Sex } from '@/domain/types';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [heightCm, setHeightCm] = useState('');
  const [bodyWeightKg, setBodyWeightKg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserProfile().then((profile) => {
      if (!profile) return;
      setNickname(profile.nickname);
      setBirthDate(toFrenchDate(profile.birthDate));
      setSex(profile.sex);
      setHeightCm(String(profile.heightCm));
      setBodyWeightKg(String(profile.bodyWeightKg));
    });
  }, []);

  const isoBirthDate = parseFrenchDate(birthDate);
  const isValid = nickname.trim().length > 0 && isoBirthDate !== null && Number(heightCm) > 0 && Number(bodyWeightKg) > 0;

  async function handleSave() {
    if (!isValid || !isoBirthDate) {
      playError();
      setError(t('onboarding.fillAllFields'));
      return;
    }
    await updateProfile({
      nickname: nickname.trim(),
      birthDate: isoBirthDate,
      sex,
      heightCm: Number(heightCm),
      bodyWeightKg: Number(bodyWeightKg),
    });
    router.back();
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">{t('profileEdit.title')}</ThemedText>

          <TextInput
            placeholder={t('onboarding.nicknamePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={nickname}
            onChangeText={setNickname}
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />
          <TextInput
            placeholder={t('onboarding.birthDatePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={birthDate}
            onChangeText={(value) => setBirthDate(formatFrenchDateInput(value))}
            keyboardType="numeric"
            maxLength={10}
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />

          <ThemedView style={styles.sexRow} type="backgroundElement">
            <Pressable
              style={[styles.sexOption, sex === 'male' && { backgroundColor: colors.accent }]}
              onPress={() => setSex('male')}>
              <ThemedText type="default" style={sex === 'male' ? styles.sexOptionLabelSelected : undefined}>
                {t('onboarding.male')}
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.sexOption, sex === 'female' && { backgroundColor: colors.accent }]}
              onPress={() => setSex('female')}>
              <ThemedText type="default" style={sex === 'female' ? styles.sexOptionLabelSelected : undefined}>
                {t('onboarding.female')}
              </ThemedText>
            </Pressable>
          </ThemedView>

          <TextInput
            placeholder={t('onboarding.heightPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="numeric"
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />
          <TextInput
            placeholder={t('onboarding.weightPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={bodyWeightKg}
            onChangeText={setBodyWeightKg}
            keyboardType="numeric"
            style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
          />

          {error && <ThemedText themeColor="textSecondary">{error}</ThemedText>}

          <GameButton style={[styles.submit, { backgroundColor: colors.accent }]} onPress={handleSave}>
            <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
              {t('common.save')}
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
  content: { padding: Spacing.four, gap: Spacing.three },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  sexRow: { flexDirection: 'row', borderRadius: 999, overflow: 'hidden' },
  sexOption: { flex: 1, paddingVertical: Spacing.two, alignItems: 'center' },
  sexOptionLabelSelected: { color: '#FFFFFF', fontWeight: '700' },
  submit: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.two },
});
