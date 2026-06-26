import { AdminSettings } from './types';

const ADMIN_SETTINGS_KEY = 'bigGameWordle_adminSettings';

export const defaultSettings: AdminSettings = {
  timerDuration: 120,
  sheetId: '1PQhzmC2sU1AQNZ5EfArXvS3ADT4o2YTr-VMYgJyb2XQ',
  sheetTabName: 'Sheet1',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbx_nmzZLumtLbyB5UN2zHKErQvNR38NB0sOKE7aU0S6VJ3aG0_vDPthXIX_v2C7LXh_/exec',
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
