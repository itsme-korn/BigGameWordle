import { AdminSettings } from './types';

const ADMIN_SETTINGS_KEY = 'bigGameWordle_adminSettings';

export const defaultSettings: AdminSettings = {
  timerDuration: 120,
  sheetId: '',
  sheetTabName: 'Sheet1',
  appsScriptUrl: '',
  currentRound: 1
};

export function loadAdminSettings(): AdminSettings {
  const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse admin settings', e);
    }
  }
  return defaultSettings;
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
}
