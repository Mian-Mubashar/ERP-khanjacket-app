/**
 * Khan Jacket House - Sync .env into src/config/env.ts
 * Generates pure TypeScript configuration without creating conflicting .json files in src/config/
 */
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const targetPath = path.resolve(__dirname, '../src/config/env.ts');

const parseEnv = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`[ENV-SYNC] Warning: ${filePath} does not exist.`);
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const result = {};

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const equalsIdx = trimmed.indexOf('=');
    if (equalsIdx > 0) {
      const key = trimmed.slice(0, equalsIdx).trim();
      let value = trimmed.slice(equalsIdx + 1).trim();

      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      result[key] = value;
    }
  });

  return result;
};

try {
  const env = parseEnv(envPath);

  const appEnv = env.APP_ENV || 'development';
  const appName = env.APP_NAME || 'Khan Jacket House';
  const appVersion = env.APP_VERSION || '1.0.0';
  const appBundleId = env.APP_BUNDLE_ID || 'com.warehouseapp';

  const apiBaseUrl = env.API_BASE_URL || 'http://10.0.2.2:5000/api/v1';
  const apiIosUrl = env.API_IOS_URL || 'http://localhost:5000/api/v1';
  const apiDeviceUrl = env.API_DEVICE_URL || 'http://192.168.1.100:5000/api/v1';
  const apiProdUrl = env.API_PRODUCTION_URL ? `'${env.API_PRODUCTION_URL}'` : 'undefined';

  const firebaseProjectId = env.FIREBASE_PROJECT_ID || 'khan-warehouse-app';
  const firebaseProjectNumber = env.FIREBASE_PROJECT_NUMBER || '1068631121630';
  const firebaseStorageBucket = env.FIREBASE_STORAGE_BUCKET || 'khan-warehouse-app.firebasestorage.app';
  const firebaseAppId = env.FIREBASE_APP_ID || '1:1068631121630:android:f70c72d9f99421a405ac4f';
  const firebaseApiKey = env.FIREBASE_API_KEY || 'AIzaSyAabvve9OqexKXy97Tn6J_XQe04NKFTs6w';
  const firebaseSenderId = env.FIREBASE_MESSAGING_SENDER_ID || '1068631121630';

  const appleBundleId = env.APPLE_BUNDLE_ID || 'com.warehouseapp';
  const appleTeamId = env.APPLE_TEAM_ID || '';
  const appleKeyId = env.APPLE_KEY_ID || '';
  const appleP8Path = env.APPLE_AUTH_KEY_P8_PATH || '';

  const tsContent = `/**
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

export const APP_VERSION = '${appVersion}';
export const APP_NAME = '${appName}';

export const ENV: AppEnvironment = {
  APP_ENV: '${appEnv}' as AppEnvironment['APP_ENV'],
  APP_NAME: '${appName}',
  APP_VERSION: '${appVersion}',
  APP_BUNDLE_ID: '${appBundleId}',

  // Backend Endpoints
  API_BASE_URL: '${apiBaseUrl}',
  API_IOS_URL: '${apiIosUrl}',
  API_DEVICE_URL: '${apiDeviceUrl}',
  API_PRODUCTION_URL: ${apiProdUrl},

  // Firebase
  FIREBASE_PROJECT_ID: '${firebaseProjectId}',
  FIREBASE_PROJECT_NUMBER: '${firebaseProjectNumber}',
  FIREBASE_STORAGE_BUCKET: '${firebaseStorageBucket}',
  FIREBASE_APP_ID: '${firebaseAppId}',
  FIREBASE_API_KEY: '${firebaseApiKey}',
  FIREBASE_MESSAGING_SENDER_ID: '${firebaseSenderId}',

  // Apple APNs
  APPLE_BUNDLE_ID: '${appleBundleId}',
  APPLE_TEAM_ID: '${appleTeamId}',
  APPLE_KEY_ID: '${appleKeyId}',
  APPLE_AUTH_KEY_P8_PATH: '${appleP8Path}',
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
`;

  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, tsContent, 'utf-8');
  console.log(`[ENV-SYNC] Successfully synchronized ${Object.keys(env).length} keys from .env directly into src/config/env.ts`);
} catch (error) {
  console.error('[ENV-SYNC] Error synchronizing .env:', error);
}
