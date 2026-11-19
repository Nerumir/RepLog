import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Body, { type Slug } from 'react-native-body-highlighter';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { HelpButton } from '@/components/ui/HelpButton';
import { LevelProgressBar } from '@/components/ui/LevelProgressBar';
import { Colors, LevelTierInfo, Spacing, TrophyTierInfo } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTrophyCountsByTier } from '@/db/queries/achievements';
import { applyLazyPenaltiesIfNeeded, getBiomeSessionCounts } from '@/db/queries/attendance';
import { listMuscleGroups } from '@/db/queries/exercises';
import { gatherExercisePerformanceInputs } from '@/db/queries/performanceSummary';
import { getUserProfile } from '@/db/queries/profile';
import { getAppSettings } from '@/db/queries/settings';
import type { AchievementTier } from '@/domain/achievements';
import { BIOMES } from '@/domain/attendance';
import { aggregateByMuscleGroup, type MuscleGroupSummary } from '@/domain/muscleAggregation';
import { progressWithinTier, tierFromScore } from '@/domain/performanceLevel';
import type { Sex } from '@/domain/types';
import { muscleHighlighterSlugs } from '@/media/muscleHighlighterMap';

const TROPHY_TIER_ORDER: AchievementTier[] = ['bronze', 'silver', 'gold', 'diamond', 'ruby'];

const DIAGRAM_HEIGHT = 240;
const DIAGRAM_MIN_SCALE = 0.5;
const COLLAPSE_DISTANCE = 140;

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [nickname, setNickname] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [summaries, setSummaries] = useState<MuscleGroupSummary[]>([]);
  const [currentBiomeIndex, setCurrentBiomeIndex] = useState(0);
  const [biomeSessionCounts, setBiomeSessionCounts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'attendance' | 'trophies'>('attendance');
  const [trophyCounts, setTrophyCounts] = useState<Record<AchievementTier, number>>({
    bronze: 0,
    silver: 0,
    gold: 0,
    diamond: 0,
    ruby: 0,
  });

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const diagramContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [DIAGRAM_HEIGHT, DIAGRAM_HEIGHT * DIAGRAM_MIN_SCALE],
      Extrapolation.CLAMP,
    ),
  }));
  const diagramContentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollY.value, [0, COLLAPSE_DISTANCE], [1, DIAGRAM_MIN_SCALE], Extrapolation.CLAMP),
      },
    ],
  }));

  const load = useCallback(() => {
    (async () => {
      const [profile, settings] = await Promise.all([getUserProfile(), getAppSettings()]);
      if (!profile) return;
      setNickname(profile.nickname);
      setSex(profile.sex);

      // Le catalogue compte des centaines d'exercices mais seule une poignée est pratiquée :
      // on ne calcule le niveau que pour ceux ayant déjà une série loggée, pas pour tout le
      // catalogue (évite des centaines d'allers-retours DB à chaque ouverture de l'onglet).
      const [muscleGroups, perExercise] = await Promise.all([
        listMuscleGroups(),
        gatherExercisePerformanceInputs(profile, settings?.oneRmFormula ?? 'epley'),
      ]);

      setSummaries(aggregateByMuscleGroup(perExercise, muscleGroups));

      const [attendanceProgress, sessionCounts, trophyCountsByTier] = await Promise.all([
        applyLazyPenaltiesIfNeeded(),
        getBiomeSessionCounts(),
        getTrophyCountsByTier(),
      ]);
      setCurrentBiomeIndex(attendanceProgress.biomeIndex);
      setBiomeSessionCounts(sessionCounts);
      setTrophyCounts(trophyCountsByTier);
    })();
  }, []);

  useFocusEffect(load);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.headerRow}>
          <ThemedView style={styles.headerTitleRow}>
            <ThemedText type="subtitle" style={styles.headerTitle} numberOfLines={1}>
              {nickname || 'Profil'}
            </ThemedText>
            <HelpButton
              title="Profil"
              body={
                'Ta carte d\'identité sportive : ton niveau par groupe musculaire (Débutant → Élite), calculé à partir de tes meilleures performances comparées à des barèmes par sexe et poids de corps.\n\n' +
                "Tu y retrouves aussi ta progression sur la carte d'assiduité, et tes trophées débloqués (régularité, progression musculaire, spécialisations par matériel...).\n\n" +
                "Dans les réglages (⚙️), tu peux modifier ton profil, réinitialiser tes performances/trophées, ou exporter/importer toutes tes données pour changer de téléphone."
              }
            />
          </ThemedView>
          <Link href="/profile/settings" asChild>
            <Pressable style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.text} />
            </Pressable>
          </Link>
        </ThemedView>

        <Animated.View style={[styles.diagramContainer, diagramContainerStyle]}>
          <Animated.View style={[styles.bodyRow, diagramContentStyle]}>
            <Body
              data={toBodyData(summaries)}
              side="front"
              gender={sex === 'female' ? 'female' : 'male'}
              scale={0.7}
              border={colors.border}
              defaultFill={colors.backgroundSelected}
            />
            <Body
              data={toBodyData(summaries)}
              side="back"
              gender={sex === 'female' ? 'female' : 'male'}
              scale={0.7}
              border={colors.border}
              defaultFill={colors.backgroundSelected}
            />
          </Animated.View>
        </Animated.View>

        <Animated.FlatList
          data={summaries}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.muscleGroupId}
          ListHeaderComponent={
            <ThemedView style={styles.listHeader}>
              <ThemedView style={styles.tabRow}>
                <Pressable
                  style={[styles.tabButton, activeTab === 'attendance' && { backgroundColor: colors.backgroundSelected }]}
                  onPress={() => setActiveTab('attendance')}>
                  <ThemedText type="smallBold" themeColor={activeTab === 'attendance' ? 'text' : 'textSecondary'}>
                    Assiduité
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.tabButton, activeTab === 'trophies' && { backgroundColor: colors.backgroundSelected }]}
                  onPress={() => setActiveTab('trophies')}>
                  <ThemedText type="smallBold" themeColor={activeTab === 'trophies' ? 'text' : 'textSecondary'}>
                    Trophées
                  </ThemedText>
                </Pressable>
              </ThemedView>
              <Link href={activeTab === 'attendance' ? '/attendance' : '/achievements'} asChild>
                <Pressable>
                  <Card style={styles.biomeCard}>
                    {activeTab === 'attendance' ? (
                      <>
                        <ThemedView style={styles.biomeHeaderRow}>
                          <Ionicons name="trail-sign" size={20} color={colors.accent} />
                          <ThemedText type="smallBold">Assiduité · {BIOMES[currentBiomeIndex]?.label ?? '—'}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.biomeListRow}>
                          {BIOMES.map((biome, index) => (
                            <ThemedView key={biome.id} style={styles.biomeListItem}>
                              <ThemedText type="small" themeColor={index === currentBiomeIndex ? 'accent' : 'textSecondary'}>
                                {biome.label}
                              </ThemedText>
                              <ThemedText type="smallBold" themeColor={index === currentBiomeIndex ? 'accent' : 'text'}>
                                {biomeSessionCounts[index] ?? 0}
                              </ThemedText>
                            </ThemedView>
                          ))}
                        </ThemedView>
                      </>
                    ) : (
                      <>
                        <ThemedView style={styles.biomeHeaderRow}>
                          <Ionicons name="trophy" size={20} color={colors.accent} />
                          <ThemedText type="smallBold">
                            Trophées · {Object.values(trophyCounts).reduce((a, b) => a + b, 0)} débloqués
                          </ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.biomeListRow}>
                          {TROPHY_TIER_ORDER.map((tier) => (
                            <ThemedView key={tier} style={styles.trophyListItem}>
                              <ThemedText type="small" themeColor="textSecondary">
                                {TrophyTierInfo[tier].label}
                              </ThemedText>
                              <ThemedText type="smallBold" style={{ color: TrophyTierInfo[tier].color }}>
                                {trophyCounts[tier]}
                              </ThemedText>
                            </ThemedView>
                          ))}
                        </ThemedView>
                      </>
                    )}
                  </Card>
                </Pressable>
              </Link>
              <ThemedText type="smallBold">Niveaux par groupe musculaire</ThemedText>
            </ThemedView>
          }
          renderItem={({ item, index }) => {
            const tier = item.averageScore !== null ? tierFromScore(item.averageScore) : null;
            return (
              <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(16)}>
                <Link href={`/muscle/${item.muscleGroupId}`} asChild>
                  <Pressable>
                    <Card style={styles.row}>
                      <ThemedView style={styles.rowHeader}>
                        <ThemedView style={styles.rowHeaderText}>
                          <ThemedText type="default">{item.name}</ThemedText>
                          <ThemedText type="small" themeColor="textSecondary">
                            {tier ? `Niveau ${LevelTierInfo[tier].tier}` : '—'}
                          </ThemedText>
                        </ThemedView>
                        <Ionicons name="medal" size={28} color={tier ? LevelTierInfo[tier].color : colors.textSecondary} />
                      </ThemedView>
                      <LevelProgressBar
                        progress={item.averageScore !== null ? progressWithinTier(item.averageScore) : 0}
                        level={tier}
                      />
                    </Card>
                  </Pressable>
                </Link>
              </Animated.View>
            );
          }}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

function toBodyData(summaries: MuscleGroupSummary[]) {
  const scoreBySlug = new Map<Slug, number>();
  for (const summary of summaries) {
    const slug = muscleHighlighterSlugs[summary.muscleGroupId];
    if (!slug || summary.averageScore === null) continue;
    const previous = scoreBySlug.get(slug);
    if (previous === undefined || summary.averageScore > previous) {
      scoreBySlug.set(slug, summary.averageScore);
    }
  }
  return Array.from(scoreBySlug.entries()).map(([slug, score]) => ({
    slug,
    color: LevelTierInfo[tierFromScore(score)].color,
  }));
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two, backgroundColor: 'transparent' },
  headerTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  headerTitle: { flexShrink: 1 },
  settingsButton: { padding: Spacing.one },
  diagramContainer: { overflow: 'hidden', justifyContent: 'center' },
  bodyRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.three, marginVertical: Spacing.two },
  listHeader: { gap: Spacing.two, marginBottom: Spacing.two, backgroundColor: 'transparent' },
  row: {
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' },
  rowHeaderText: { gap: 2, backgroundColor: 'transparent' },
  tabRow: { flexDirection: 'row', gap: Spacing.one, backgroundColor: 'transparent' },
  tabButton: { flex: 1, borderRadius: 12, paddingVertical: Spacing.one, alignItems: 'center' },
  biomeCard: { gap: Spacing.two },
  biomeHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
  biomeListRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Spacing.two, backgroundColor: 'transparent' },
  biomeListItem: { flexBasis: '31%', alignItems: 'center', gap: 2, backgroundColor: 'transparent' },
  trophyListItem: { flexBasis: '18%', alignItems: 'center', gap: 2, backgroundColor: 'transparent' },
});
