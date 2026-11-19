import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HelpButtonProps {
  title: string;
  body: string;
}

/** Bouton "i" rond affiché dans l'en-tête d'un onglet, qui explique son fonctionnement dans une modale. */
export function HelpButton({ title, body }: HelpButtonProps) {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)} hitSlop={8}>
        <Ionicons name="information-circle-outline" size={24} color={colors.textSecondary} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={[styles.card, { backgroundColor: colors.background }]} onPress={() => {}}>
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
            <ScrollView style={styles.scroll}>
              {body.split('\n\n').map((paragraph, index) => (
                <ThemedText key={index} type="default" themeColor="textSecondary" style={styles.paragraph}>
                  {paragraph}
                </ThemedText>
              ))}
            </ScrollView>
            <GameButton onPress={() => setVisible(false)} style={[styles.closeButton, { backgroundColor: colors.accent }]}>
              <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
                {t('common.gotIt')}
              </ThemedText>
            </GameButton>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: { padding: Spacing.one },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
    maxHeight: '75%',
  },
  title: { marginBottom: Spacing.one },
  scroll: { flexGrow: 0 },
  paragraph: { lineHeight: 20, marginBottom: Spacing.two },
  closeButton: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center' },
});
