import { UserData } from '../types';

export function Header({ userData }: { userData?: UserData }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-between px-4 sm:px-6 text-white shadow-md z-10">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-indigo-600 font-black text-xl">W</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">BigGameWordle</h1>
      </div>
      {userData && (userData.baan || userData.position) && (
        <div className="flex flex-col items-end sm:flex-row sm:items-center sm:space-x-4 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-sm border border-white/20">
          <div className="hidden sm:block text-xs uppercase tracking-wider font-semibold opacity-80">Current Session</div>
          <div className="text-xs sm:text-sm font-medium">
            {userData.baan === 'Admin' ? 'Admin' : `${userData.baan} | Pos: ${userData.position}`}
          </div>
        </div>
      )}
    </header>
  );
}
