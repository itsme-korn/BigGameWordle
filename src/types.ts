export type ViewState = 'login' | 'check' | 'admin-login' | 'admin' | 'game';

export interface UserData {
  baan: string;
  position: string;
}

export interface AdminSettings {
  timerDuration: number; // in seconds
  sheetId: string;
  sheetTabName: string;
  appsScriptUrl: string;
  currentRound: number;
}

export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface GuessLetter {
  char: string;
  status: LetterStatus;
}
