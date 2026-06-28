import { useState, useEffect, useCallback } from 'react';
import { AdminSettings, UserData, LetterStatus, SyncTimerState } from '../types';
import { getRandomWord, isValidWord } from '../words';

interface GameViewProps {
  userData: UserData;
  settings: AdminSettings;
  syncTimer?: SyncTimerState;
  onExit: () => void;
}

const MAX_GUESSES = 6;
const WORD_LENGTH = 6;

export function GameView({ userData, settings, syncTimer, onExit }: GameViewProps) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [toastMessage, setToastMessage] = useState('');

  const isTimerRunning = syncTimer?.state === 'running';

  // Initialize game
  useEffect(() => {
    setTargetWord(getRandomWord());
    setTimeLeft(settings.timerDuration);
    setGuesses([]);
    setCurrentGuess('');
    setStatus('playing');
    setToastMessage('');
  }, [settings.timerDuration]);

  const syncData = useCallback(async (won: boolean) => {
    if (!settings.appsScriptUrl) return;
    try {
      await fetch(settings.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          baan: userData.baan,
          position: userData.position,
          won: won ? 'Yes' : 'No',
          guesses: guesses.length + (won ? 1 : 0),
          timeLeft: timeLeft,
          round: settings.currentRound
        })
      });
    } catch (e) {
      console.error('Failed to sync data', e);
    }
  }, [settings.appsScriptUrl, settings.currentRound, userData, guesses.length, timeLeft]);

  // Synchronized Timer Logic
  useEffect(() => {
    if (status !== 'playing') return;

    const updateTime = () => {
      if (syncTimer && syncTimer.state === 'running') {
        const localNow = Date.now();
        const elapsedMs = localNow - syncTimer.fetchedAt;
        const currentServerTime = syncTimer.serverTime + elapsedMs;
        const elapsedSinceStart = currentServerTime - syncTimer.startTime;
        const secondsLeft = Math.max(0, syncTimer.duration - Math.floor(elapsedSinceStart / 1000));
        
        setTimeLeft(secondsLeft);

        if (secondsLeft <= 0) {
          setStatus('lost');
          syncData(false);
        }
      } else if (syncTimer && (syncTimer.state === 'idle' || syncTimer.state === 'stopped')) {
        setTimeLeft(syncTimer.duration);
      } else {
        // Fallback
        setTimeLeft(settings.timerDuration);
      }
    };

    updateTime(); // initial run
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, [syncTimer, status, settings.timerDuration, syncData]);

  const onKeyPress = useCallback((key: string) => {
    if (status !== 'playing') return;

    if (!isTimerRunning) {
      setToastMessage('กรุณารอแอดมินเริ่มจับเวลาครับ!');
      setTimeout(() => setToastMessage(''), 2500);
      return;
    }

    if (key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) return;
      
      if (!isValidWord(currentGuess)) {
        setToastMessage('น้องใส่คำอะไรมาคับเนีย?');
        setTimeout(() => setToastMessage(''), 2500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === targetWord) {
        setStatus('won');
        syncData(true);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setStatus('lost');
        syncData(false);
      }
      return;
    }

    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, guesses, status, targetWord, syncData, isTimerRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key;
      if (key === 'Enter' || key === 'Backspace') {
        onKeyPress(key);
      } else if (/^[a-zA-Z]$/.test(key)) {
        onKeyPress(key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 30 && status === 'playing';

  // Helper to evaluate guess colors
  const getStatus = (guess: string, target: string): LetterStatus[] => {
    const result: LetterStatus[] = Array(WORD_LENGTH).fill('absent');
    const targetChars = target.split('');
    const guessChars = guess.split('');

    // First pass: find correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] === targetChars[i]) {
        result[i] = 'correct';
        targetChars[i] = '#'; // Mark as used
        guessChars[i] = '_';
      }
    }

    // Second pass: find present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] !== '_') {
        const idx = targetChars.indexOf(guessChars[i]);
        if (idx !== -1) {
          result[i] = 'present';
          targetChars[idx] = '#';
        }
      }
    }

    return result;
  };

  const getCellClasses = (char: string, status: string, isCurrentRow: boolean) => {
    const base = "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl font-bold rounded-sm border-2";
    
    if (status === 'correct') return `${base} border-green-500 bg-green-500 text-white`;
    if (status === 'present') return `${base} border-yellow-500 bg-yellow-500 text-white`;
    if (status === 'absent') return `${base} border-slate-700 bg-slate-800 text-white`;
    
    if (char) return `${base} border-slate-900 text-slate-900`;
    
    // Empty cell
    return `${base} border-slate-300 text-slate-900`;
  };

  // Keyboard layout
  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  // Map used letters for keyboard coloring
  const usedKeys: Record<string, LetterStatus> = {};
  guesses.forEach(guess => {
    const statuses = getStatus(guess, targetWord);
    guess.split('').forEach((char, i) => {
      const currentStatus = usedKeys[char];
      const newStatus = statuses[i];
      if (newStatus === 'correct' || (newStatus === 'present' && currentStatus !== 'correct') || (!currentStatus)) {
        usedKeys[char] = newStatus;
      }
    });
  });

  return (
    <div className="flex flex-col items-center min-h-screen pt-20 pb-4 px-2 w-full max-w-[500px] mx-auto bg-white font-sans relative">
      
      {/* Toast Message */}
      {toastMessage && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl z-50 text-sm font-bold tracking-wide animate-pulse">
          {toastMessage}
        </div>
      )}

      {/* Timer */}
      <div className="text-center mb-6">
        <div className={`font-mono text-5xl font-black tracking-widest ${isLowTime ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
          {formatTime(timeLeft)}
        </div>
        {!isTimerRunning ? (
          <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2 animate-pulse">
            Waiting for Admin to Start
          </span>
        ) : (
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Time Remaining</p>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 w-full flex flex-col justify-center items-center gap-2 mb-8">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const isCurrentRow = rowIndex === guesses.length;
          const isFutureRow = rowIndex > guesses.length;
          const guess = guesses[rowIndex] || (isCurrentRow ? currentGuess : '');
          const statuses = guesses[rowIndex] ? getStatus(guesses[rowIndex], targetWord) : Array(WORD_LENGTH).fill('empty');
          
          let rowOpacityClass = '';
          if (isFutureRow) {
            const distance = rowIndex - guesses.length;
            if (distance === 1) rowOpacityClass = 'opacity-30';
            else if (distance === 2) rowOpacityClass = 'opacity-20';
            else if (distance === 3) rowOpacityClass = 'opacity-10';
            else rowOpacityClass = 'opacity-5';
          }

          return (
            <div key={rowIndex} className={`flex gap-2 w-full justify-center ${rowOpacityClass}`}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const char = guess[colIndex] || '';
                const status = !isCurrentRow && char ? statuses[colIndex] : 'empty';
                const cellClasses = getCellClasses(char, status, isCurrentRow);
                
                // Add pulse for active cell
                const isActiveCell = isCurrentRow && colIndex === currentGuess.length;
                const activeClass = isActiveCell ? 'animate-pulse bg-slate-100' : '';

                return (
                  <div
                    key={colIndex}
                    className={`${cellClasses} ${activeClass} uppercase`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Game Over Message */}
      {status !== 'playing' && (
        <div className="mb-6 w-full text-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
          <div className={`text-2xl font-black uppercase tracking-tighter mb-2 ${status === 'won' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'won' ? 'You Won!' : 'Game Over'}
          </div>
          <div className="text-slate-600 mb-4 text-sm uppercase tracking-wider font-semibold">The word was: <span className="font-bold text-slate-900">{targetWord}</span></div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 animate-pulse">
            Waiting for Admin to start next round...
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div className="w-full max-w-[500px] flex flex-col items-center gap-2">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5 w-full">
            {row.map(key => {
              const keyStatus = usedKeys[key];
              let keyBg = 'bg-slate-100 text-slate-900 border-slate-300';
              if (keyStatus === 'correct') keyBg = 'bg-green-500 text-white border-green-700';
              else if (keyStatus === 'present') keyBg = 'bg-yellow-500 text-white border-yellow-700';
              else if (keyStatus === 'absent') keyBg = 'bg-slate-300 text-slate-500 border-slate-400';

              const isSpecial = key === 'Enter' || key === 'Backspace';
              
              if (isSpecial) {
                return (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="px-3 sm:px-4 py-4 bg-slate-300 text-slate-700 rounded font-bold shadow-sm border-b-2 border-slate-400 uppercase text-xs flex items-center justify-center transition active:scale-95"
                  >
                    {key === 'Backspace' ? '⌫' : 'Enter'}
                  </button>
                );
              }

              return (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={`px-2 sm:px-3 py-4 rounded font-bold shadow-sm border-b-2 flex-1 max-w-[44px] flex items-center justify-center transition active:scale-95 text-lg ${keyBg}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      
    </div>
  );
}
