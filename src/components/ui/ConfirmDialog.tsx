import { Modal, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface ConfirmDialogRequest {
  title: string;
  message: string;
  confirmLabel: string;
  /** Rouge si action destructive (par défaut), violet sinon. */
  tone?: 'danger' | 'accent';
  onConfirm: () => void;
}

interface ConfirmDialogProps {
  request: ConfirmDialogRequest | null;
  onDismiss: () => void;
}

/** Remplace Alert.alert pour les confirmations d'actions importantes, avec le design de l'app. */
export function ConfirmDialog({ request, onDismiss }: ConfirmDialogProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const toneColor = request?.tone === 'accent' ? colors.accent : colors.danger;

  return (
    <Modal visible={request !== null} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={[styles.card, { backgroundColor: colors.background }]} onPress={() => {}}>
          {request && (
            <>
              <ThemedText type="subtitle" style={styles.title}>
                {request.title}
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.message}>
                {request.message}
              </ThemedText>
              <GameButton
                onPress={onDismiss}
                style={[styles.button, styles.buttonOutline, { borderColor: colors.border }]}>
                <ThemedText type="smallBold">Annuler</ThemedText>
              </GameButton>
              <GameButton
                onPress={() => {
                  request.onConfirm();
                  onDismiss();
                }}
                style={[styles.button, { backgroundColor: toneColor }]}>
                <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
                  {request.confirmLabel}
                </ThemedText>
              </GameButton>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  },
  title: { marginBottom: Spacing.one },
  message: { marginBottom: Spacing.two },
  button: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center' },
  buttonOutline: { borderWidth: 1.5 },
});
