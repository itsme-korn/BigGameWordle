import { AdminSettings } from './types';

const ADMIN_SETTINGS_KEY = 'bigGameWordle_adminSettings';

export const defaultSettings: AdminSettings = {
  timerDuration: 120,
  sheetId: '1PQhzmC2sU1AQNZ5EfArXvS3ADT4o2YTr-VMYgJyb2XQ',
  sheetTabName: 'ชีต1',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbz_xLJCBlK3aulcehMVbqZg-ByiaO6k_zSOvNm5mdZ6JzgXcarP-bEa20bEPUU8_VHk/exec',
  currentRound: 1
};

export function loadAdminSettings(): AdminSettings {
  const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migrate old default URL to new default URL
      if (parsed.appsScriptUrl === 'https://script.google.com/macros/s/AKfycbycT65l29_axUxcjQop2cKUnmx4VpoEFIK2yEvcf-Tw-Ez8d-GURO0oez3Y73zYOT4W/exec' || parsed.appsScriptUrl === 'https://script.google.com/macros/s/AKfycbziFsP0QLLGxg9Gnr2P1InBogsW7nHHkEO7VnF7uHy7x9U6-LcsmwhAsWe3OqzrXx_i/exec' || parsed.appsScriptUrl === 'https://script.google.com/macros/s/AKfycbxRh95OxBf4pCbZIzVTtLchNQS3CY7wGIqyBrIYvHM61rXloBtX4kMlehQjhHCgQVSm/exec') {
        parsed.appsScriptUrl = defaultSettings.appsScriptUrl;
      }
      return { ...defaultSettings, ...parsed };
    } catch (e) {
      console.error('Failed to parse admin settings', e);
    }
  }
  return defaultSettings;
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
}
