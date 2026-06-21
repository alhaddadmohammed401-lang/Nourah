import * as Notifications from 'expo-notifications';
import type { PermissionResponse } from 'expo-modules-core';
import { Platform } from 'react-native';

// Expo 54 does not re-export the PermissionResponse base expected by expo-notifications 56.
type NotificationPermissionResponse =
  Notifications.NotificationPermissionsStatus & PermissionResponse;

// Set up default behavior for when notifications arrive while app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests push notification permissions from the user.
 * Returns true if granted.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const existingPermissions =
    (await Notifications.getPermissionsAsync()) as NotificationPermissionResponse;
  if (existingPermissions.granted) return true;

  const requestedPermissions =
    (await Notifications.requestPermissionsAsync()) as NotificationPermissionResponse;
  return requestedPermissions.granted;
}

/**
 * Checks current notification permission status.
 */
export async function hasNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const permissions =
    (await Notifications.getPermissionsAsync()) as NotificationPermissionResponse;
  return permissions.granted;
}

/**
 * Schedules the daily PM routine reminder at 8:00 PM.
 */
export async function scheduleDailyReminder(): Promise<string> {
  if (Platform.OS === 'web') return '';
  
  // Cancel existing PM reminders first to avoid duplicates
  await cancelNotificationById('daily-pm-reminder');

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 20, // 8:00 PM
    minute: 0,
  };

  return Notifications.scheduleNotificationAsync({
    identifier: 'daily-pm-reminder',
    content: {
      title: 'Time for your PM Routine 🌙',
      body: 'Keep your skin healthy and glowing. Let’s complete your PM routine steps now.',
      sound: true,
    },
    trigger,
  });
}

/**
 * Schedules the weekly skin check reminder on Sunday at 10:00 AM.
 */
export async function scheduleWeeklyCheck(): Promise<string> {
  if (Platform.OS === 'web') return '';

  await cancelNotificationById('weekly-skin-check');

  const trigger: Notifications.WeeklyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday: 1, // Sunday (1 = Sunday in expo-notifications trigger)
    hour: 10,  // 10:00 AM
    minute: 0,
  };

  return Notifications.scheduleNotificationAsync({
    identifier: 'weekly-skin-check',
    content: {
      title: 'Weekly Skin Check-in 🌟',
      body: 'Time to track your skin progress! Open Nourah and start your weekly face scan.',
      sound: true,
    },
    trigger,
  });
}

/**
 * Cancels a specific notification by its identifier.
 */
export async function cancelNotificationById(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (err) {
    console.warn(`Failed to cancel notification ${identifier}:`, err);
  }
}

/**
 * Cancels all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
