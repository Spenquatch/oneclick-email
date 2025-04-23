import { Settings, DEFAULT_SETTINGS } from './types';

/**
 * Storage utility class for handling Chrome storage operations
 */
export class StorageService {
  /**
   * Saves settings to Chrome sync storage
   * @param settings The settings object to save
   * @returns Promise that resolves when settings are saved
   */
  static async saveSettings(settings: Settings): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ settings }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Loads settings from Chrome sync storage
   * @returns Promise that resolves with loaded settings or defaults
   */
  static async loadSettings(): Promise<Settings> {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (result) => {
        if (chrome.runtime.lastError || !result.settings) {
          resolve({ ...DEFAULT_SETTINGS });
        } else {
          // Merge with defaults to ensure all properties exist
          resolve({ ...DEFAULT_SETTINGS, ...result.settings });
        }
      });
    });
  }
} 