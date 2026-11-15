import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, TrophyTierInfo } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { listAchievementsWithStatus, type AchievementWithStatus } from '@/db/queries/achievements';
import type { AchievementTier } from '@/domain/achievements';

const TROPHY_TIER_ORDER: AchievementTier[] = ['bronze', 'silver', 'gold', 'diamond', 'ruby'];

export default function AchievementsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);

  useEffect(() => {
    listAchievementsWithStatus().then(setAchievements);
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Trophées</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          {unlockedCount} / {achievements.length} succès débloqués
        </ThemedText>
        <ScrollView contentContainerStyle={styles.content}>
          {TROPHY_TIER_ORDER.map((tier) => {
            const tierAchievements = achievements.filter((a) => a.tier === tier);
            if (tierAchievements.length === 0) return null;
            return (
              <ThemedView key={tier} style={styles.section}>
                <ThemedText type="smallBold" style={{ color: TrophyTierInfo[tier].color }}>
                  {TrophyTierInfo[tier].label}
                </ThemedText>
                {tierAchievements.map((achievement) => (
                  <Card key={achievement.id} style={[styles.card, !achievement.unlocked && styles.cardLocked]}>
                    <ThemedView style={styles.cardRow}>
                      <Ionicons
                        name={achievement.unlocked ? 'trophy' : 'lock-closed'}
                        size={28}
                        color={achievement.unlocked ? TrophyTierInfo[tier].color : colors.textSecondary}
                      />
                      <ThemedView style={styles.cardText}>
                        <ThemedText type="smallBold" themeColor={achievement.unlocked ? 'text' : 'textSecondary'}>
                          {achievement.name}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {achievement.description}
                        </ThemedText>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <ThemedText type="small" themeColor="textSecondary" style={styles.unlockedDate}>
                            Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </ThemedText>
                        )}
                      </ThemedView>
                    </ThemedView>
                  </Card>
                ))}
              </ThemedView>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.one },
  subtitle: { marginBottom: Spacing.one },
  content: { gap: Spacing.three, paddingBottom: Spacing.four },
  section: { gap: Spacing.two, backgroundColor: 'transparent' },
  card: { gap: Spacing.one },
  cardLocked: { opacity: 0.55 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, backgroundColor: 'transparent' },
  cardText: { flex: 1, gap: 2, backgroundColor: 'transparent' },
  unlockedDate: { opacity: 0.7, marginTop: 2 },
});
