import {MMKV} from 'react-native-mmkv';

let storage: MMKV | null = null;

// Initialize MMKV with error handling
try {
  storage = new MMKV();
} catch (error) {
  console.warn('MMKV initialization failed, using in-memory fallback:', error);
  // Fallback to in-memory storage if MMKV is not available
  storage = null;
}

// In-memory fallback storage
const memoryStorage: {[key: string]: string} = {};

const CURRENT_DEPLOYMENT_KEY = 'current_deployment_key';

export const getCurrentDeploymentKey = (): string => {
  try {
    if (storage) {
      const key = storage.getString(CURRENT_DEPLOYMENT_KEY);
      return key || 'production';
    } else {
      // Fallback to in-memory storage
      return memoryStorage[CURRENT_DEPLOYMENT_KEY] || 'production';
    }
  } catch (error) {
    console.warn('Error reading deployment key from storage:', error);
    return memoryStorage[CURRENT_DEPLOYMENT_KEY] || 'production';
  }
};

export const setCurrentDeploymentKey = (key: string): void => {
  try {
    if (storage) {
      storage.set(CURRENT_DEPLOYMENT_KEY, key);
    } else {
      // Fallback to in-memory storage
      memoryStorage[CURRENT_DEPLOYMENT_KEY] = key;
    }
  } catch (error) {
    console.warn('Error writing deployment key to storage:', error);
    // Fallback to in-memory storage
    memoryStorage[CURRENT_DEPLOYMENT_KEY] = key;
  }
};
