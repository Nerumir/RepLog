import { create } from 'zustand';

import { playFanfare, playSuccess, playTap } from '@/audio/soundEffects';
import {
  finishWorkoutLog,
  getWorkoutLogDetail,
  recordSetResult,
  updateRuntimeState,
} from '@/db/queries/workoutLogs';
import { cancelRestEnd, ensureNotificationPermission, ensureRestTimerChannel, scheduleRestEnd } from '@/notifications/restTimerNotifications';

export type SessionPhase =
  | { kind: 'idle' }
  | { kind: 'performing'; exerciseIndex: number; setIndex: number }
  | {
      kind: 'resting';
      exerciseIndex: number;
      nextSetIndex: number;
      restEndsAt: number;
      totalRestSeconds: number;
      notificationId: string;
    }
  | { kind: 'summary' };

export type WorkoutLogDetail = NonNullable<Awaited<ReturnType<typeof getWorkoutLogDetail>>>;

interface WorkoutSessionState {
  workoutLogId: number | null;
  detail: WorkoutLogDetail | null;
  phase: SessionPhase;
  hydrate: (workoutLogId: number) => Promise<void>;
  completeSet: (weightKg: number, reps: number) => Promise<void>;
  skipSet: () => Promise<void>;
  skipRest: () => Promise<void>;
  completeRestIfElapsed: () => void;
  abandon: () => Promise<void>;
  reset: () => void;
}

function findNext(detail: WorkoutLogDetail, exerciseIndex: number, setIndex: number) {
  const currentExercise = detail.exercises[exerciseIndex];
  if (setIndex + 1 < currentExercise.sets.length) {
    return { exerciseIndex, setIndex: setIndex + 1, done: false };
  }
  if (exerciseIndex + 1 < detail.exercises.length) {
    return { exerciseIndex: exerciseIndex + 1, setIndex: 0, done: false };
  }
  return { exerciseIndex, setIndex, done: true };
}

async function persistPhase(workoutLogId: number, phase: SessionPhase) {
  await updateRuntimeState(workoutLogId, JSON.stringify(phase));
}

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  workoutLogId: null,
  detail: null,
  phase: { kind: 'idle' },

  async hydrate(workoutLogId) {
    await ensureRestTimerChannel();
    await ensureNotificationPermission();

    const detail = await getWorkoutLogDetail(workoutLogId);
    if (!detail) {
      set({ workoutLogId: null, detail: null, phase: { kind: 'idle' } });
      return;
    }

    if (detail.status !== 'in_progress') {
      set({ workoutLogId, detail, phase: { kind: 'summary' } });
      return;
    }

    let phase: SessionPhase = { kind: 'performing', exerciseIndex: 0, setIndex: 0 };
    if (detail.runtimeState) {
      try {
        const parsed = JSON.parse(detail.runtimeState) as SessionPhase;
        if (parsed.kind === 'resting' && parsed.restEndsAt <= Date.now()) {
          // Le repos s'est déjà écoulé pendant que l'app était fermée : on avance directement.
          phase = { kind: 'performing', exerciseIndex: parsed.exerciseIndex, setIndex: parsed.nextSetIndex };
        } else {
          phase = parsed;
        }
      } catch {
        phase = { kind: 'performing', exerciseIndex: 0, setIndex: 0 };
      }
    }

    set({ workoutLogId, detail, phase });
  },

  async completeSet(weightKg, reps) {
    const { workoutLogId, detail, phase } = get();
    if (!workoutLogId || !detail || phase.kind !== 'performing') return;

    const exercise = detail.exercises[phase.exerciseIndex];
    const currentSet = exercise.sets[phase.setIndex];
    await recordSetResult(currentSet.id, weightKg, reps);
    playSuccess();

    const updatedDetail = await getWorkoutLogDetail(workoutLogId);
    if (!updatedDetail) return;

    const next = findNext(updatedDetail, phase.exerciseIndex, phase.setIndex);

    if (next.done) {
      await finishWorkoutLog(workoutLogId, 'completed');
      set({ detail: updatedDetail, phase: { kind: 'summary' } });
      return;
    }

    const restSeconds = exercise.restSecondsUsed;
    const nextExerciseName =
      next.exerciseIndex === phase.exerciseIndex
        ? exercise.exerciseNameSnapshot
        : updatedDetail.exercises[next.exerciseIndex].exerciseNameSnapshot;
    const { notificationId, restEndsAt } = await scheduleRestEnd(restSeconds, `Prochaine série : ${nextExerciseName}`);

    const newPhase: SessionPhase = {
      kind: 'resting',
      exerciseIndex: next.exerciseIndex,
      nextSetIndex: next.setIndex,
      restEndsAt,
      totalRestSeconds: restSeconds,
      notificationId,
    };
    await persistPhase(workoutLogId, newPhase);
    set({ detail: updatedDetail, phase: newPhase });
  },

  /** Passe la série en cours sans enregistrer de résultat : elle reste exclue des calculs de performance. */
  async skipSet() {
    const { workoutLogId, detail, phase } = get();
    if (!workoutLogId || !detail || phase.kind !== 'performing') return;

    playTap();
    const next = findNext(detail, phase.exerciseIndex, phase.setIndex);

    if (next.done) {
      await finishWorkoutLog(workoutLogId, 'completed');
      set({ phase: { kind: 'summary' } });
      return;
    }

    const newPhase: SessionPhase = { kind: 'performing', exerciseIndex: next.exerciseIndex, setIndex: next.setIndex };
    await persistPhase(workoutLogId, newPhase);
    set({ phase: newPhase });
  },

  async skipRest() {
    const { workoutLogId, phase } = get();
    if (!workoutLogId || phase.kind !== 'resting') return;
    await cancelRestEnd(phase.notificationId);
    const newPhase: SessionPhase = { kind: 'performing', exerciseIndex: phase.exerciseIndex, setIndex: phase.nextSetIndex };
    await persistPhase(workoutLogId, newPhase);
    set({ phase: newPhase });
  },

  completeRestIfElapsed() {
    const { workoutLogId, phase } = get();
    if (!workoutLogId || phase.kind !== 'resting') return;
    if (phase.restEndsAt > Date.now()) return;
    // Le repos s'est écoulé naturellement (app au premier plan) : la notification programmée
    // sonne à cet instant, pas besoin de l'annuler.
    const newPhase: SessionPhase = { kind: 'performing', exerciseIndex: phase.exerciseIndex, setIndex: phase.nextSetIndex };
    persistPhase(workoutLogId, newPhase);
    playFanfare();
    set({ phase: newPhase });
  },

  async abandon() {
    const { workoutLogId, phase } = get();
    if (!workoutLogId) return;
    if (phase.kind === 'resting') {
      await cancelRestEnd(phase.notificationId);
    }
    await finishWorkoutLog(workoutLogId, 'aborted');
    set({ workoutLogId: null, detail: null, phase: { kind: 'idle' } });
  },

  reset() {
    set({ workoutLogId: null, detail: null, phase: { kind: 'idle' } });
  },
}));
