/**
 * Web Notification Service for Ramadan Medication App
 * Uses the Web Notifications API to send browser notifications
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionStatus;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Show a browser notification
 */
export function showNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
  }
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/icon.svg',
      badge: '/icon.svg',
      ...options,
    });

    // Auto-close after 10 seconds unless requireInteraction is set
    if (!options?.requireInteraction) {
      setTimeout(() => notification.close(), 10000);
    }

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
}

/**
 * Show medication reminder notification
 */
export function showMedicationReminder(
  medicationName: string,
  dosage: string,
  isArabic: boolean = false,
  isPreAlert: boolean = false
): Notification | null {
  const title = isArabic
    ? isPreAlert
      ? `⏰ تذكير: ${medicationName}`
      : `💊 حان وقت الدواء: ${medicationName}`
    : isPreAlert
      ? `⏰ Reminder: ${medicationName}`
      : `💊 Time for: ${medicationName}`;

  const body = isArabic
    ? isPreAlert
      ? `استعد لتناول ${dosage} قريباً`
      : `تناول ${dosage} الآن`
    : isPreAlert
      ? `Get ready to take ${dosage} soon`
      : `Take ${dosage} now`;

  return showNotification(title, {
    body,
    tag: `medication-${medicationName}`,
    requireInteraction: !isPreAlert,
  });
}

/**
 * Show Suhoor countdown notification
 */
export function showSuhoorAlert(
  minutesRemaining: number,
  isArabic: boolean = false
): Notification | null {
  const title = isArabic
    ? '🌙 تنبيه السحور'
    : '🌙 Suhoor Alert';

  const body = isArabic
    ? `متبقي ${minutesRemaining} دقيقة على انتهاء وقت السحور`
    : `${minutesRemaining} minutes until Suhoor ends`;

  return showNotification(title, {
    body,
    tag: 'suhoor-alert',
    requireInteraction: true,
  });
}

/**
 * Show Iftar notification
 */
export function showIftarNotification(isArabic: boolean = false): Notification | null {
  const title = isArabic
    ? '🌅 حان وقت الإفطار!'
    : '🌅 Time for Iftar!';

  const body = isArabic
    ? 'أفطر الصائمون وابتلت العروق وثبت الأجر إن شاء الله'
    : 'Break your fast with dates and water';

  return showNotification(title, {
    body,
    tag: 'iftar-notification',
    requireInteraction: false,
  });
}

/**
 * Show test notification to verify notifications are working
 */
export function showTestNotification(isArabic: boolean = false): Notification | null {
  const title = isArabic
    ? '✅ الإشعارات تعمل!'
    : '✅ Notifications are working!';

  const body = isArabic
    ? 'ستتلقى تنبيهات أدويتك في الأوقات المحددة'
    : 'You will receive medication reminders at scheduled times';

  return showNotification(title, {
    body,
    tag: 'test-notification',
  });
}

// Store scheduled notification timeouts
const scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

/**
 * Schedule a notification for a specific time
 */
export function scheduleNotification(
  id: string,
  time: Date,
  title: string,
  body: string,
  options?: { tag?: string; requireInteraction?: boolean }
): boolean {
  const now = new Date();
  const delay = time.getTime() - now.getTime();

  if (delay <= 0) {
    console.warn('Cannot schedule notification in the past');
    return false;
  }

  // Cancel existing notification with same ID
  cancelScheduledNotification(id);

  const timeout = setTimeout(() => {
    showNotification(title, { body, ...options });
    scheduledNotifications.delete(id);
  }, delay);

  scheduledNotifications.set(id, timeout);
  return true;
}

/**
 * Cancel a scheduled notification
 */
export function cancelScheduledNotification(id: string): boolean {
  const timeout = scheduledNotifications.get(id);
  if (timeout) {
    clearTimeout(timeout);
    scheduledNotifications.delete(id);
    return true;
  }
  return false;
}

/**
 * Cancel all scheduled notifications
 */
export function cancelAllScheduledNotifications(): void {
  scheduledNotifications.forEach((timeout) => clearTimeout(timeout));
  scheduledNotifications.clear();
}

/**
 * Get count of scheduled notifications
 */
export function getScheduledNotificationCount(): number {
  return scheduledNotifications.size;
}
