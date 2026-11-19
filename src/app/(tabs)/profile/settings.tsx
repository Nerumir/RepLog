import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog, type ConfirmDialogRequest } from '@/components/ui/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resetAchievements } from '@/db/queries/achievements';
import { exportAllData, importAllData } from '@/db/queries/backup';
import { getFreeTierStatus, redeemPremiumCode } from '@/db/queries/premium';
import { getAppSettings, updateAppSettings, type ThemeMode } from '@/db/queries/settings';
import { resetPerformances } from '@/db/queries/profile';
import { FREE_SESSION_LIMIT } from '@/domain/premium';
import type { OneRmFormulaId } from '@/domain/oneRepMax';
import { exportBackupToFile, pickAndReadBackupFile } from '@/io/backupFile';
import { useThemeStore } from '@/state/useThemeStore';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'Système' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
];

const FORMULA_OPTIONS: { value: OneRmFormulaId; label: string }[] = [
  { value: 'epley', label: 'Epley' },
  { value: 'brzycki', label: 'Brzycki' },
  { value: 'lombardi', label: 'Lombardi' },
];

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [oneRmFormula, setOneRmFormula] = useState<OneRmFormulaId>('epley');
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmDialogRequest | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSubmitting, setCodeSubmitting] = useState(false);
  const setGlobalThemeMode = useThemeStore((state) => state.setMode);

  function loadPremiumStatus() {
    getFreeTierStatus().then(({ unlocked, completedSessions: count }) => {
      setPremiumUnlocked(unlocked);
      setCompletedSessions(count);
    });
  }

  useEffect(() => {
    getAppSettings().then((settings) => {
      if (!settings) return;
      setThemeMode(settings.themeMode);
      setOneRmFormula(settings.oneRmFormula);
      setDebugModeEnabled(settings.debugModeEnabled);
    });
    loadPremiumStatus();
  }, []);

  async function handleRedeemCode() {
    setCodeSubmitting(true);
    setCodeError(null);
    const ok = await redeemPremiumCode(codeInput);
    setCodeSubmitting(false);
    if (!ok) {
      setCodeError("Ce code n'est pas valide.");
      return;
    }
    setCodeInput('');
    loadPremiumStatus();
  }

  async function handleThemeChange(value: ThemeMode) {
    setThemeMode(value);
    setGlobalThemeMode(value);
    await updateAppSettings({ themeMode: value });
  }

  async function handleFormulaChange(value: OneRmFormulaId) {
    setOneRmFormula(value);
    await updateAppSettings({ oneRmFormula: value });
  }

  async function handleDebugModeChange(value: boolean) {
    setDebugModeEnabled(value);
    await updateAppSettings({ debugModeEnabled: value });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const payload = await exportAllData();
      await exportBackupToFile(payload);
    } finally {
      setExporting(false);
    }
  }

  function handleImport() {
    setConfirmRequest({
      title: 'Importer des données ?',
      message:
        'Toutes tes données actuelles (profil, programmes, historique, trophées, assiduité) seront remplacées par celles du fichier choisi. Cette action est irréversible.',
      confirmLabel: 'Choisir un fichier',
      tone: 'danger',
      onConfirm: async () => {
        setImporting(true);
        setImportMessage(null);
        try {
          const payload = await pickAndReadBackupFile();
          if (!payload) return;
          await importAllData(payload);
          setImportMessage('Import réussi. Ferme et rouvre complètement l\'application pour voir tes données.');
        } catch {
          setImportMessage("Échec de l'import : le fichier n'est pas une sauvegarde RepLog valide.");
        } finally {
          setImporting(false);
        }
      },
    });
  }

  function handleResetPerformances() {
    setConfirmRequest({
      title: 'Réinitialiser les performances ?',
      message:
        "Ton historique de séances est conservé, mais tes niveaux seront recalculés uniquement à partir de tes prochaines performances. Tes trophées débloqués repartiront aussi à zéro.",
      confirmLabel: 'Réinitialiser',
      onConfirm: async () => {
        await resetPerformances();
        await resetAchievements();
      },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Réglages</ThemedText>

        <Link href="/profile/edit" asChild>
          <GameButton style={StyleSheet.flatten([styles.editProfileButton, { borderColor: colors.accent }])}>
            <ThemedText type="small" themeColor="accent">
              Modifier le profil
            </ThemedText>
          </GameButton>
        </Link>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Version
        </ThemedText>
        {premiumUnlocked ? (
          <ThemedText type="small" themeColor="accent">
            ✓ Version illimitée débloquée
          </ThemedText>
        ) : (
          <>
            <ThemedText type="small" themeColor="textSecondary">
              Version gratuite : {completedSessions}/{FREE_SESSION_LIMIT} séances utilisées.
            </ThemedText>
            <ThemedView style={styles.backupRow}>
              <TextInput
                value={codeInput}
                onChangeText={setCodeInput}
                placeholder="Code de déblocage"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
                autoCorrect={false}
                style={[styles.codeInput, { color: colors.text, borderColor: colors.border }]}
              />
              <GameButton
                silent
                onPress={handleRedeemCode}
                disabled={codeSubmitting || codeInput.trim().length === 0}
                style={StyleSheet.flatten([styles.backupButton, { borderColor: colors.accent }])}>
                <ThemedText type="small" themeColor="accent">
                  {codeSubmitting ? 'Vérification...' : 'Valider'}
                </ThemedText>
              </GameButton>
            </ThemedView>
            {codeError && (
              <ThemedText type="small" themeColor="danger">
                {codeError}
              </ThemedText>
            )}
          </>
        )}

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Thème
        </ThemedText>
        <ThemedView style={styles.optionRow} type="backgroundElement">
          {THEME_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.option, themeMode === option.value && { backgroundColor: colors.accent }]}
              onPress={() => handleThemeChange(option.value)}>
              <ThemedText type="default" style={themeMode === option.value ? styles.optionLabelSelected : undefined}>
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Formule de calcul du 1RM
        </ThemedText>
        <ThemedView style={styles.optionRow} type="backgroundElement">
          {FORMULA_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.option, oneRmFormula === option.value && { backgroundColor: colors.accent }]}
              onPress={() => handleFormulaChange(option.value)}>
              <ThemedText type="default" style={oneRmFormula === option.value ? styles.optionLabelSelected : undefined}>
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Mode de débug
        </ThemedText>
        <ThemedView style={styles.optionRow} type="backgroundElement">
          {([
            { value: false, label: 'Désactivé' },
            { value: true, label: 'Activé' },
          ] as const).map((option) => (
            <Pressable
              key={String(option.value)}
              style={[styles.option, debugModeEnabled === option.value && { backgroundColor: colors.accent }]}
              onPress={() => handleDebugModeChange(option.value)}>
              <ThemedText type="default" style={debugModeEnabled === option.value ? styles.optionLabelSelected : undefined}>
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Sauvegarde
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Pour transférer tes données vers un autre téléphone : exporte un fichier ici, puis importe-le sur l&apos;autre appareil.
        </ThemedText>
        <ThemedView style={styles.backupRow}>
          <GameButton
            silent
            onPress={handleExport}
            disabled={exporting}
            style={StyleSheet.flatten([styles.backupButton, { borderColor: colors.accent }])}>
            <ThemedText type="small" themeColor="accent">
              {exporting ? 'Export...' : 'Exporter mes données'}
            </ThemedText>
          </GameButton>
          <GameButton
            silent
            onPress={handleImport}
            disabled={importing}
            style={StyleSheet.flatten([styles.backupButton, { borderColor: colors.danger }])}>
            <ThemedText type="small" style={{ color: colors.danger }}>
              {importing ? 'Import...' : 'Importer des données'}
            </ThemedText>
          </GameButton>
        </ThemedView>
        {importMessage && (
          <ThemedText type="small" themeColor="textSecondary">
            {importMessage}
          </ThemedText>
        )}

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          Zone dangereuse
        </ThemedText>
        <GameButton
          silent
          onPress={handleResetPerformances}
          style={[styles.resetButton, { borderColor: colors.danger }]}>
          <ThemedText type="small" style={{ color: colors.danger }}>
            Réinitialiser les performances
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
  optionRow: { flexDirection: 'row', borderRadius: 999, overflow: 'hidden' },
  option: { flex: 1, paddingVertical: Spacing.two, alignItems: 'center' },
  optionLabelSelected: { color: '#FFFFFF', fontWeight: '700' },
  sectionSpacing: { marginTop: Spacing.three },
  editProfileButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  backupRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, backgroundColor: 'transparent' },
  codeInput: { flex: 1, minWidth: 160, borderWidth: 1.5, borderRadius: 999, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three },
  backupButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  resetButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
