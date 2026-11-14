/**
 * Khan Jacket House - Production Push Notification Service
 * Manages Firebase Cloud Messaging (FCM) & Apple APNs token registration and incoming notification alerts
 */
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { API_BASE_URL } from './api';
import { ENV } from '../config/env';

export interface PushNotificationPayload {
  title?: string;
  body?: string;
  data?: Record<string, any>;
}

class PushNotificationManager {
  private currentToken: string | null = null;
  private isInitialized = false;

  /**
   * Request push notification permission
   */
  async requestUserPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ (API level 33+) requires runtime permission for notifications
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }

      if (Platform.OS === 'ios') {
        // iOS requires authorization via native module or APNs
        return true;
      }

      return false;
    } catch (error) {
      console.warn('[PushNotificationService] Permission request error:', error);
      return false;
    }
  }

  /**
   * Generate or retrieve device token and sync to backend
   */
  async initialize(onNotificationOpened?: (data: any) => void): Promise<string | null> {
    if (this.isInitialized && this.currentToken) {
      return this.currentToken;
    }

    try {
      await this.requestUserPermission();

      // Check if @react-native-firebase/messaging is installed in runtime
      let fcmToken: string | null = null;
      try {
        const messaging = require('@react-native-firebase/messaging').default;
        if (messaging) {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            fcmToken = await messaging().getToken();

            // Listen for token refreshes
            messaging().onTokenRefresh((newToken: string) => {
              this.currentToken = newToken;
              this.syncTokenToBackend(newToken);
            });

            // Listen for foreground notifications
            messaging().onMessage(async (remoteMessage: any) => {
              const title = remoteMessage.notification?.title || 'Khan Jacket House Alert';
              const body = remoteMessage.notification?.body || '';

              Alert.alert(title, body, [
                {
                  text: 'View',
                  onPress: () => onNotificationOpened?.(remoteMessage.data),
                },
                { text: 'OK', style: 'cancel' },
              ]);
            });

            // Listen for background click
            messaging().onNotificationOpenedApp((remoteMessage: any) => {
              if (remoteMessage?.data) {
                onNotificationOpened?.(remoteMessage.data);
              }
            });
          }
        }
      } catch {
        // Graceful fallback for Metro / Expo / dev mode before native compile
        fcmToken = `SIMULATOR-${Platform.OS.toUpperCase()}-${Date.now().toString(36)}`;
      }

      if (fcmToken) {
        this.currentToken = fcmToken;
        await this.syncTokenToBackend(fcmToken);
      }

      this.isInitialized = true;
      return this.currentToken;
    } catch (error) {
      console.warn('[PushNotificationService] Initialization error:', error);
      return null;
    }
  }

  /**
   * Register the device push token with Khan Warehouse Backend
   */
  async syncTokenToBackend(token: string): Promise<boolean> {
    try {
      const payload = {
        token,
        platform: Platform.OS,
        deviceName: `${Platform.OS === 'ios' ? 'iPhone' : 'Android'} Device`,
        deviceId: `DEV-${Platform.OS}-${token.slice(-8)}`,
        appVersion: ENV.APP_VERSION,
      };

      const response = await fetch(`${API_BASE_URL}/notifications/register-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      return json.success === true;
    } catch (error) {
      console.warn('[PushNotificationService] Failed to sync token to backend:', error);
      return false;
    }
  }

  /**
   * Unregister token (e.g. on logout)
   */
  async unregisterToken(): Promise<boolean> {
    if (!this.currentToken) {
      return false;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unregister-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.currentToken }),
      });
      const json = await response.json();
      this.currentToken = null;
      return json.success === true;
    } catch {
      return false;
    }
  }

  getCurrentToken(): string | null {
    return this.currentToken;
  }
}

export const PushNotificationService = new PushNotificationManager();
