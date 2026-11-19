import { useCallback, useRef, useState } from 'react';

import { getFreeTierStatus } from '@/db/queries/premium';

/** Bloque le démarrage d'une nouvelle séance si la limite de la version gratuite est atteinte. */
export function usePremiumSessionGate() {
  const [gate, setGate] = useState<{ completedSessions: number } | null>(null);
  const pendingActionRef = useRef<(() => void | Promise<void>) | null>(null);

  const runGated = useCallback(async (action: () => void | Promise<void>) => {
    const { limitReached, completedSessions } = await getFreeTierStatus();
    if (limitReached) {
      pendingActionRef.current = action;
      setGate({ completedSessions });
      return;
    }
    await action();
  }, []);

  const dismiss = useCallback(() => {
    pendingActionRef.current = null;
    setGate(null);
  }, []);

  const retryAfterUnlock = useCallback(async () => {
    setGate(null);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action) await action();
  }, []);

  return { gate, runGated, dismiss, retryAfterUnlock };
}
