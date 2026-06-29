import { useState, useEffect } from 'react';
import { ViewState, UserData, AdminSettings } from './types';
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
        // Add cache busting to prevent the browser from caching the GET request
        const url = new URL(settings.appsScriptUrl);
        url.searchParams.set('t', Date.now().toString());
        const res = await fetch(url.toString());
        const data = await res.json();
        
        if (data.round && data.round !== settings.currentRound) {
          const newSettings = { ...settings, currentRound: data.round };
          setSettings(newSettings);
          saveAdminSettings(newSettings);
          
          // Auto-start the game if they are waiting in the lobby
          if (view === 'check' && userData) {
            setView('game');
          }
          // If they are already in 'game', GameView will react to the settings.currentRound change 
          // and reset its board and timer automatically.
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
