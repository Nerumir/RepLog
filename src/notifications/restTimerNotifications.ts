import * as Notifications from 'expo-notifications';

const REST_TIMER_CHANNEL_ID = 'rest-timer';

export async function ensureRestTimerChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync(REST_TIMER_CHANNEL_ID, {
    name: 'Fin de repos',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export interface ScheduledRest {
  notificationId: string;
  restEndsAt: number;
}

export async function scheduleRestEnd(seconds: number, body: string): Promise<ScheduledRest> {
  const restEndsAt = Date.now() + seconds * 1000;
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Repos terminé',
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: REST_TIMER_CHANNEL_ID,
    },
  });
  return { notificationId, restEndsAt };
}

export async function cancelRestEnd(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
