import React, { useState } from 'react';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminLoginView({ onSuccess, onCancel }: AdminLoginViewProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === 'THUNNER') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-800 p-6 text-white text-center sm:text-left">
          <h2 className="text-xl font-bold">Admin Authentication</h2>
          <p className="text-slate-400 text-sm mt-1">Secured by THUNNER access.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs font-semibold">Incorrect password</p>}
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-lg shadow-slate-200 text-xs uppercase tracking-widest"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
