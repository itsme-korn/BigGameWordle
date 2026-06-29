import { UserData } from '../types';

interface CheckInfoViewProps {
  userData: UserData;
  onStart: () => void;
}

export function CheckInfoView({ userData, onStart }: CheckInfoViewProps) {
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

          <div className="w-full text-center space-y-3">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 animate-pulse">
              <p className="text-indigo-800 font-semibold text-sm">Waiting for Admin to Start Next Round...</p>
              <p className="text-indigo-600/80 text-xs mt-1 font-medium">You will be automatically joined when the round begins.</p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 my-2">
              <div className="h-px bg-slate-200 w-12"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">OR</span>
              <div className="h-px bg-slate-200 w-12"></div>
            </div>

            <button
              onClick={onStart}
              className="w-full text-indigo-600 font-bold py-3 rounded-xl border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all uppercase tracking-tighter text-sm active:scale-98"
            >
              Join Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
