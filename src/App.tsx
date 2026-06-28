import { useState, useEffect } from 'react';
import { ViewState, UserData, AdminSettings, SyncTimerState } from './types';
import { loadAdminSettings, saveAdminSettings } from './store';

import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { CheckInfoView } from './components/CheckInfoView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminView } from './components/AdminView';
import { GameView } from './components/GameView';

export default function App() {
  const [view, setView] = useState<ViewState>('login');
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [settings, setSettings] = useState<AdminSettings>(loadAdminSettings());
  const [syncTimer, setSyncTimer] = useState<SyncTimerState | undefined>(undefined);

  const handleLoginConfirm = (data: UserData) => {
    setUserData(data);
    if (data.baan === 'Admin') {
      setView('admin-login');
    } else {
      setView('check');
    }
  };

  const handleAdminSettingsSave = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    saveAdminSettings(newSettings);
  };

  useEffect(() => {
    if (!settings.appsScriptUrl) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(settings.appsScriptUrl);
        const data = await res.json();
        
        // Parse synchronized timer details
        const fetchedTimer: SyncTimerState = {
          startTime: data.timerStartTime !== undefined ? Number(data.timerStartTime) : 0,
          duration: data.timerDuration !== undefined ? Number(data.timerDuration) : settings.timerDuration,
          state: data.timerState || 'idle',
          serverTime: data.serverTime !== undefined ? Number(data.serverTime) : Date.now(),
          fetchedAt: Date.now()
        };
        setSyncTimer(fetchedTimer);

        if (data.round && data.round !== settings.currentRound) {
          const newSettings = { ...settings, currentRound: data.round };
          setSettings(newSettings);
          saveAdminSettings(newSettings);
          
          // Only boot players back to menu (don't boot admin!)
          if (view !== 'admin' && view !== 'admin-login') {
            setView('login');
            setUserData(undefined);
          }
        }
      } catch (e) {
        // silently fail on network error
      }
    };

    fetchStatus(); // fetch immediately
    const interval = setInterval(fetchStatus, 4000); // pull status every 4 seconds for closer sync

    return () => clearInterval(interval);
  }, [settings, view]);

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 font-sans relative overflow-hidden">
      <Header userData={userData} currentRound={settings.currentRound} />
      
      <main className="w-full h-full absolute inset-0 pt-16 bg-white overflow-auto">
        {view === 'login' && (
          <LoginView onConfirm={handleLoginConfirm} />
        )}
        
        {view === 'check' && userData && (
          <CheckInfoView 
            userData={userData} 
            syncTimer={syncTimer}
            onStart={() => setView('game')} 
          />
        )}

        {view === 'admin-login' && (
          <AdminLoginView 
            onSuccess={() => setView('admin')} 
            onCancel={() => {
              setView('login');
              setUserData(undefined);
            }} 
          />
        )}

        {view === 'admin' && (
          <AdminView 
            settings={settings}
            syncTimer={syncTimer}
            onSave={handleAdminSettingsSave}
            onLogout={() => {
              setView('login');
              setUserData(undefined);
            }}
          />
        )}

        {view === 'game' && userData && (
          <GameView 
            userData={userData}
            settings={settings}
            syncTimer={syncTimer}
            onExit={() => {
              setView('login');
              setUserData(undefined);
            }}
          />
        )}
      </main>
    </div>
  );
}
