import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog, type ConfirmDialogRequest } from '@/components/ui/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAttendanceProgress, resetAttendanceProgress, setPenaltyThresholdDays } from '@/db/queries/attendance';

export default function AttendanceSettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [thresholdInput, setThresholdInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmDialogRequest | null>(null);

  useEffect(() => {
    getAttendanceProgress().then((progress) => {
      if (progress.penaltyThresholdDays != null) setThresholdInput(String(progress.penaltyThresholdDays));
    });
  }, []);

  async function handleSave() {
    const days = Number(thresholdInput);
    if (!Number.isFinite(days) || days <= 0) return;
    await setPenaltyThresholdDays(Math.round(days));
    setSaved(true);
  }

  function handleResetAttendance() {
    setConfirmRequest({
      title: "Réinitialiser l'assiduité ?",
      message: 'Ta position sur la carte et le nombre de séances par biome repartiront de zéro. Ton seuil de pénalité est conservé.',
      confirmLabel: 'Réinitialiser',
      onConfirm: async () => {
        await resetAttendanceProgress();
      },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Réglages — Assiduité</ThemedText>
        <ThemedText type="smallBold">Jours sans séance avant pénalité</ThemedText>
        <TextInput
          value={thresholdInput}
          onChangeText={(value) => {
            setThresholdInput(value);
            setSaved(false);
          }}
          keyboardType="numeric"
          style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
        />
        <GameButton style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSave}>
          <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
            {saved ? 'Enregistré ✓' : 'Enregistrer'}
          </ThemedText>
        </GameButton>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Zone dangereuse
        </ThemedText>
        <GameButton silent onPress={handleResetAttendance} style={[styles.resetButton, { borderColor: colors.danger }]}>
          <ThemedText type="small" style={{ color: colors.danger }}>
            Réinitialiser l&apos;assiduité
          </ThemedText>
        </GameButton>
      </SafeAreaView>
      <ConfirmDialog request={confirmRequest} onDismiss={() => setConfirmRequest(null)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  saveButton: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.two },
  sectionSpacing: { marginTop: Spacing.three },
  resetButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
