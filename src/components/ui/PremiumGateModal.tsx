import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameButton } from '@/components/ui/GameButton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { redeemPremiumCode } from '@/db/queries/premium';
import { FREE_SESSION_LIMIT } from '@/domain/premium';

interface PremiumGateModalProps {
  visible: boolean;
  /** true si l'utilisateur a déjà épuisé ses séances gratuites (bloque le démarrage d'une nouvelle séance). */
  limitReached: boolean;
  completedSessions: number;
  onDismiss: () => void;
  /** Appelé après un code valide, pour laisser l'appelant rafraîchir son état et éventuellement démarrer la séance. */
  onUnlocked: () => void;
}

/** Rappel non bloquant (à chaque ouverture) ou mur bloquant (séances épuisées) pour la limite de la version gratuite. */
export function PremiumGateModal({ visible, limitReached, completedSessions, onDismiss, onUnlocked }: PremiumGateModalProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setShowCodeInput(false);
    setCode('');
    setError(null);
  }

  async function handleRedeem() {
    setSubmitting(true);
    setError(null);
    const ok = await redeemPremiumCode(code);
    setSubmitting(false);
    if (!ok) {
      setError('Ce code n\'est pas valide.');
      return;
    }
    reset();
    onUnlocked();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        reset();
        onDismiss();
      }}>
      <ThemedView style={styles.backdrop}>
        <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
          <ThemedText type="subtitle" style={styles.title}>
            {limitReached ? 'Limite de la version gratuite atteinte' : 'Version d\'essai'}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.message}>
            {limitReached
              ? `Tu as terminé tes ${FREE_SESSION_LIMIT} séances gratuites. Le reste de l'app (programmes, catalogue, profil, assiduité) reste accessible, mais il faut débloquer la version illimitée pour démarrer une nouvelle séance.`
              : `Tu es sur la version gratuite de RepLog : tu peux tester 100% des fonctionnalités pendant tes ${FREE_SESSION_LIMIT} premières séances (${completedSessions}/${FREE_SESSION_LIMIT} déjà faites) avant de décider si ça vaut le coup pour toi de l'acheter.`}
          </ThemedText>

          {showCodeInput ? (
            <>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="RLOG-XXXX-XXXX"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
                autoCorrect={false}
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              />
              {error && (
                <ThemedText type="small" themeColor="danger">
                  {error}
                </ThemedText>
              )}
              <GameButton
                onPress={handleRedeem}
                disabled={submitting || code.trim().length === 0}
                style={[styles.button, { backgroundColor: colors.accent }]}>
                <ThemedText type="smallBold" style={{ color: '#FFFFFF' }}>
                  {submitting ? 'Vérification…' : 'Débloquer avec ce code'}
                </ThemedText>
              </GameButton>
            </>
          ) : (
            <Pressable onPress={() => setShowCodeInput(true)}>
              <ThemedText type="small" themeColor="accent" style={styles.codeLink}>
                J&apos;ai un code de déblocage
              </ThemedText>
            </Pressable>
          )}

          <GameButton
            onPress={() => {
              reset();
              onDismiss();
            }}
            style={[styles.button, styles.buttonOutline, { borderColor: colors.border }]}>
            <ThemedText type="smallBold">{limitReached ? 'Plus tard' : 'Compris'}</ThemedText>
          </GameButton>
        </ThemedView>
      </ThemedView>
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
  message: { marginBottom: Spacing.one, lineHeight: 20 },
  codeLink: { textDecorationLine: 'underline', marginBottom: Spacing.one },
  input: { borderWidth: 1.5, borderRadius: 12, padding: Spacing.two, fontSize: 16 },
  button: { borderRadius: 999, paddingVertical: Spacing.three, alignItems: 'center' },
  buttonOutline: { borderWidth: 1.5 },
});
