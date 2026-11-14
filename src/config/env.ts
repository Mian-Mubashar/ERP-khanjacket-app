/**
 * Khan Jacket House - Centralized Environment Configuration
 * Safe TypeScript environment variables generated from .env
 * DO NOT add an env.json file in this folder as Metro prioritizes .json over .ts
 */
import { Platform } from 'react-native';

export interface AppEnvironment {
  APP_ENV: 'development' | 'staging' | 'production';
  APP_NAME: string;
  APP_VERSION: string;
  APP_BUNDLE_ID: string;

  // API Endpoints
  API_BASE_URL: string;
  API_IOS_URL: string;
  API_DEVICE_URL: string;
  API_PRODUCTION_URL?: string;

  // Firebase Push Notifications
  FIREBASE_PROJECT_ID: string;
  FIREBASE_PROJECT_NUMBER: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_APP_ID: string;
  FIREBASE_API_KEY: string;
  FIREBASE_MESSAGING_SENDER_ID: string;

  // Apple APNs
  APPLE_BUNDLE_ID: string;
  APPLE_TEAM_ID: string;
  APPLE_KEY_ID: string;
  APPLE_AUTH_KEY_P8_PATH: string;
}

export const APP_VERSION = '1.0.0';
export const APP_NAME = 'Khan Jacket House';

export const ENV: AppEnvironment = {
  APP_ENV: 'development' as AppEnvironment['APP_ENV'],
  APP_NAME: 'Khan Jacket House',
  APP_VERSION: '1.0.0',
  APP_BUNDLE_ID: 'com.warehouseapp',

  // Backend Endpoints
  API_BASE_URL: 'http://10.0.2.2:5000/api/v1',
  API_IOS_URL: 'http://localhost:5000/api/v1',
  API_DEVICE_URL: 'http://192.168.1.100:5000/api/v1',
  API_PRODUCTION_URL: undefined,

  // Firebase
  FIREBASE_PROJECT_ID: 'khan-warehouse-app',
  FIREBASE_PROJECT_NUMBER: '1068631121630',
  FIREBASE_STORAGE_BUCKET: 'khan-warehouse-app.firebasestorage.app',
  FIREBASE_APP_ID: '1:1068631121630:android:f70c72d9f99421a405ac4f',
  FIREBASE_API_KEY: 'AIzaSyAabvve9OqexKXy97Tn6J_XQe04NKFTs6w',
  FIREBASE_MESSAGING_SENDER_ID: '1068631121630',

  // Apple APNs
  APPLE_BUNDLE_ID: 'com.warehouseapp',
  APPLE_TEAM_ID: '',
  APPLE_KEY_ID: '',
  APPLE_AUTH_KEY_P8_PATH: '',
};

/**
 * Automatically determine the most suitable API endpoint based on current platform
 */
export function getDefaultApiUrl(): string {
  if (ENV.APP_ENV === 'production' && ENV.API_PRODUCTION_URL) {
    return ENV.API_PRODUCTION_URL;
  }

  if (Platform.OS === 'ios') {
    return ENV.API_IOS_URL;
  }

  // Android emulator loopback to host PC
  return ENV.API_BASE_URL;
}

export default ENV;
