import { UserData, SyncTimerState } from '../types';

interface CheckInfoViewProps {
  userData: UserData;
  syncTimer?: SyncTimerState;
  onStart: () => void;
}

export function CheckInfoView({ userData, syncTimer, onStart }: CheckInfoViewProps) {
  const isTimerRunning = syncTimer?.state === 'running';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center sm:text-left">
          <h2 className="text-xl font-bold">Ready to Play?</h2>
          <p className="text-indigo-100 text-sm mt-1">Verify your details before entering the game.</p>
        </div>
        
        <div className="p-8 flex flex-col items-center w-full space-y-6">
          <div className="w-full p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <p className="text-emerald-800 font-bold text-xs uppercase tracking-widest mb-1">Your Identity</p>
            <p className="text-emerald-950 text-base font-semibold">{userData.baan} | Position: {userData.position}</p>
          </div>

          <div className="w-full p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
            <p className="text-indigo-800 font-bold text-xs uppercase tracking-widest mb-1">Lobby Status</p>
            {isTimerRunning ? (
              <div>
                <p className="text-indigo-950 text-sm font-semibold flex items-center justify-center text-green-600">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Timer is Active / Game In Progress
                </p>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                Waiting for Admin to Start the Timer
              </p>
            )}
          </div>

          <button
            onClick={onStart}
            className={`w-full text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-tighter text-lg active:scale-98 ${
              isTimerRunning 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-100' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isTimerRunning ? 'Enter Active Game' : 'Enter Lobby'}
          </button>
        </div>
      </div>
    </div>
  );
}
