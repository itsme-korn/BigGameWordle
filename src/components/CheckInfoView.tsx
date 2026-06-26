import { UserData } from '../types';

interface CheckInfoViewProps {
  userData: UserData;
  onStart: () => void;
}

export function CheckInfoView({ userData, onStart }: CheckInfoViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6 text-white text-center sm:text-left">
          <h2 className="text-xl font-bold">Ready to Play?</h2>
          <p className="text-indigo-100 text-sm mt-1">Verify your details before starting.</p>
        </div>
        
        <div className="p-8 flex flex-col items-center w-full space-y-6">
          <div className="w-full p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <p className="text-green-800 font-bold text-sm uppercase tracking-wider mb-1">Check Info</p>
            <p className="text-green-700 text-sm font-medium">Baan: {userData.baan} | Position: {userData.position}</p>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg shadow-red-100 transition-all uppercase tracking-tighter text-lg"
          >
            Start the Timer
          </button>
        </div>
      </div>
    </div>
  );
}
