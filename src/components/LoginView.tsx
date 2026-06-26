import { useState } from 'react';
import { UserData } from '../types';

interface LoginViewProps {
  onConfirm: (userData: UserData) => void;
}

const BAANS = [
  'Baan 1', 'Baan 2', 'Baan 3', 'Baan 4', 'Baan 5', 'Baan 6',
  'Baan 7', 'Baan 8', 'Baan 9', 'Baan 10', 'Baan 11', 'Baan 12',
  'Admin'
];

const POSITIONS = Array.from({ length: 34 }, (_, i) => (i + 1).toString());

export function LoginView({ onConfirm }: LoginViewProps) {
  const [baan, setBaan] = useState('');
  const [position, setPosition] = useState('');

  const isComplete = baan === 'Admin' || (baan !== '' && position !== '');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6 text-white text-center sm:text-left">
          <h2 className="text-xl font-bold">Welcome to BigGameWordle</h2>
          <p className="text-indigo-100 text-sm mt-1">Please select your location to begin.</p>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="text-lg text-slate-700 text-center leading-relaxed mb-8 flex flex-wrap justify-center items-center gap-y-4">
            <span>ฉัน อยู่บ้าน</span>
            <select
              value={baan}
              onChange={(e) => setBaan(e.target.value)}
              className="mx-2 border-b-2 border-indigo-500 bg-transparent py-1 font-bold text-indigo-600 focus:outline-none px-2"
            >
              <option value="" disabled>Select</option>
              {BAANS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            
            {baan !== 'Admin' && (
              <>
                <span className="ml-2">รอบนี้ตกที่ช่อง</span>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="mx-2 border-b-2 border-indigo-500 bg-transparent py-1 font-bold text-indigo-600 focus:outline-none px-2"
                >
                  <option value="" disabled>Select</option>
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="w-full h-14">
            {isComplete && (
              <button
                onClick={() => onConfirm({ baan, position: baan === 'Admin' ? '' : position })}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
