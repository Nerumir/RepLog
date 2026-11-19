import { useEffect, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { playAchievement } from '@/audio/soundEffects';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Confetti } from '@/components/ui/Confetti';
import { GameButton } from '@/components/ui/GameButton';
import { Spacing, TrophyTierInfo } from '@/constants/theme';
import type { AchievementDefinition } from '@/domain/achievements';

interface AchievementUnlockedModalProps {
  queue: AchievementDefinition[];
  onDismissAll: () => void;
}

/** Pop-up plein écran affichée à la réception d'un ou plusieurs succès, un à la fois. */
export function AchievementUnlockedModal({ queue, onDismissAll }: AchievementUnlockedModalProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (queue.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchro avec le son joué (système externe), pas un état dérivé du rendu.
      setIndex(0);
      playAchievement();
    }
  }, [queue]);

  if (queue.length === 0) return null;

  const achievement = queue[index];
  const tierInfo = TrophyTierInfo[achievement.tier];
  const isLast = index === queue.length - 1;

  return (
    <Modal visible transparent={false} animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <ThemedView style={[styles.container, { backgroundColor: tierInfo.color }]}>
        <SafeAreaView style={styles.safeArea}>
          <Confetti key={`${achievement.id}-${index}`} />
          <ThemedView style={styles.center}>
            <ThemedText type="small" style={styles.unlockedLabel}>
              {t('achievementUnlocked.label', { tier: t(`enums.trophyTier.${achievement.tier}`) })}
            </ThemedText>
            <Ionicons name="trophy" size={120} color="#FFFFFF" style={styles.trophyIcon} />
            <ThemedText type="subtitle" style={styles.name}>
              {t(`achievements.${achievement.id}.name`)}
            </ThemedText>
            <ThemedText type="small" style={styles.description}>
              {t(`achievements.${achievement.id}.description`)}
            </ThemedText>
          </ThemedView>
          <GameButton
            style={styles.button}
            onPress={() => {
              if (isLast) onDismissAll();
              else setIndex(index + 1);
            }}>
            <ThemedText type="smallBold" style={styles.buttonLabel}>
              {isLast ? t('achievementUnlocked.great') : t('achievementUnlocked.next')}
            </ThemedText>
          </GameButton>
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, justifyContent: 'space-between', backgroundColor: 'transparent' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  unlockedLabel: { color: '#FFFFFF', opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 },
  trophyIcon: { marginVertical: Spacing.three },
  name: { color: '#FFFFFF', textAlign: 'center' },
  description: { color: '#FFFFFF', opacity: 0.85, textAlign: 'center', marginTop: Spacing.one },
  button: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)' },
  buttonLabel: { color: '#FFFFFF' },
});
