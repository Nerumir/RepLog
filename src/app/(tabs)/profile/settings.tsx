import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog, type ConfirmDialogRequest } from '@/components/ui/ConfirmDialog';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import i18n from '@/i18n';
import { resetAchievements } from '@/db/queries/achievements';
import { exportAllData, importAllData } from '@/db/queries/backup';
import { getFreeTierStatus, redeemPremiumCode } from '@/db/queries/premium';
import { getAppSettings, updateAppSettings, type AppLanguage, type ThemeMode } from '@/db/queries/settings';
import { resetPerformances } from '@/db/queries/profile';
import { FREE_SESSION_LIMIT } from '@/domain/premium';
import type { OneRmFormulaId } from '@/domain/oneRepMax';
import { exportBackupToFile, pickAndReadBackupFile } from '@/io/backupFile';
import { useThemeStore } from '@/state/useThemeStore';

const THEME_OPTIONS: ThemeMode[] = ['system', 'light', 'dark'];
const LANGUAGE_OPTIONS: AppLanguage[] = ['fr', 'en'];

const FORMULA_OPTIONS: { value: OneRmFormulaId; label: string }[] = [
  { value: 'epley', label: 'Epley' },
  { value: 'brzycki', label: 'Brzycki' },
  { value: 'lombardi', label: 'Lombardi' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [language, setLanguage] = useState<AppLanguage>('fr');
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
      setLanguage(settings.language);
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
      setCodeError(t('settings.version.invalidCode'));
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

  async function handleLanguageChange(value: AppLanguage) {
    setLanguage(value);
    i18n.changeLanguage(value);
    await updateAppSettings({ language: value });
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
      title: t('settings.importDialog.title'),
      message: t('settings.importDialog.message'),
      confirmLabel: t('settings.importDialog.confirmLabel'),
      tone: 'danger',
      onConfirm: async () => {
        setImporting(true);
        setImportMessage(null);
        try {
          const payload = await pickAndReadBackupFile();
          if (!payload) return;
          await importAllData(payload);
          setImportMessage(t('settings.importDialog.success'));
        } catch {
          setImportMessage(t('settings.importDialog.failure'));
        } finally {
          setImporting(false);
        }
      },
    });
  }

  function handleResetPerformances() {
    setConfirmRequest({
      title: t('settings.resetPerformancesDialog.title'),
      message: t('settings.resetPerformancesDialog.message'),
      confirmLabel: t('settings.resetPerformancesDialog.confirmLabel'),
      onConfirm: async () => {
        await resetPerformances();
        await resetAchievements();
      },
    });
  }

  function handleResetTrophies() {
    setConfirmRequest({
      title: t('settings.resetTrophiesDialog.title'),
      message: t('settings.resetTrophiesDialog.message'),
      confirmLabel: t('settings.resetTrophiesDialog.confirmLabel'),
      onConfirm: async () => {
        await resetAchievements();
      },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">{t('settings.title')}</ThemedText>

        <Link href="/profile/edit" asChild>
          <GameButton style={StyleSheet.flatten([styles.editProfileButton, { borderColor: colors.accent }])}>
            <ThemedText type="small" themeColor="accent">
              {t('settings.editProfile')}
            </ThemedText>
          </GameButton>
        </Link>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          {t('settings.version.title')}
        </ThemedText>
        {premiumUnlocked ? (
          <ThemedText type="small" themeColor="accent">
            {t('settings.version.unlocked')}
          </ThemedText>
        ) : (
          <>
            <ThemedText type="small" themeColor="textSecondary">
              {t('settings.version.freeUsage', { count: completedSessions, limit: FREE_SESSION_LIMIT })}
            </ThemedText>
            <ThemedView style={styles.backupRow}>
              <TextInput
                value={codeInput}
                onChangeText={setCodeInput}
                placeholder={t('settings.version.codePlaceholder')}
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
                  {codeSubmitting ? t('settings.version.verifying') : t('settings.version.validate')}
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
          {t('settings.language.title')}
        </ThemedText>
        <ThemedView style={styles.optionRow} type="backgroundElement">
          {LANGUAGE_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[styles.option, language === option && { backgroundColor: colors.accent }]}
              onPress={() => handleLanguageChange(option)}>
              <ThemedText type="default" style={language === option ? styles.optionLabelSelected : undefined}>
                {t(`settings.language.${option}`)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          {t('settings.theme.title')}
        </ThemedText>
        <ThemedView style={styles.optionRow} type="backgroundElement">
          {THEME_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[styles.option, themeMode === option && { backgroundColor: colors.accent }]}
              onPress={() => handleThemeChange(option)}>
              <ThemedText type="default" style={themeMode === option ? styles.optionLabelSelected : undefined}>
                {t(`settings.theme.${option}`)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          {t('settings.formula.title')}
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
          {t('settings.debug.title')}
        </ThemedText>
        <ThemedView style={styles.optionRow} type="backgroundElement">
          {([
            { value: false, labelKey: 'settings.debug.disabled' },
            { value: true, labelKey: 'settings.debug.enabled' },
          ] as const).map((option) => (
            <Pressable
              key={String(option.value)}
              style={[styles.option, debugModeEnabled === option.value && { backgroundColor: colors.accent }]}
              onPress={() => handleDebugModeChange(option.value)}>
              <ThemedText type="default" style={debugModeEnabled === option.value ? styles.optionLabelSelected : undefined}>
                {t(option.labelKey)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
        {debugModeEnabled && (
          <GameButton
            silent
            onPress={handleResetTrophies}
            style={StyleSheet.flatten([styles.resetButton, { borderColor: colors.danger }])}>
            <ThemedText type="small" style={{ color: colors.danger }}>
              {t('settings.debug.resetTrophies')}
            </ThemedText>
          </GameButton>
        )}

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          {t('settings.backup.title')}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t('settings.backup.description')}
        </ThemedText>
        <ThemedView style={styles.backupRow}>
          <GameButton
            silent
            onPress={handleExport}
            disabled={exporting}
            style={StyleSheet.flatten([styles.backupButton, { borderColor: colors.accent }])}>
            <ThemedText type="small" themeColor="accent">
              {exporting ? t('settings.backup.exporting') : t('settings.backup.export')}
            </ThemedText>
          </GameButton>
          <GameButton
            silent
            onPress={handleImport}
            disabled={importing}
            style={StyleSheet.flatten([styles.backupButton, { borderColor: colors.danger }])}>
            <ThemedText type="small" style={{ color: colors.danger }}>
              {importing ? t('settings.backup.importing') : t('settings.backup.import')}
            </ThemedText>
          </GameButton>
        </ThemedView>
        {importMessage && (
          <ThemedText type="small" themeColor="textSecondary">
            {importMessage}
          </ThemedText>
        )}

        <ThemedText type="smallBold" style={styles.sectionSpacing}>
          {t('settings.dangerZone.title')}
        </ThemedText>
        <GameButton
          silent
          onPress={handleResetPerformances}
          style={[styles.resetButton, { borderColor: colors.danger }]}>
          <ThemedText type="small" style={{ color: colors.danger }}>
            {t('settings.dangerZone.resetPerformances')}
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
