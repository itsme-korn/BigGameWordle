import { useState, useEffect } from 'react';
import { AdminSettings } from '../types';
import { Settings, LogOut, Copy, Check } from 'lucide-react';

interface AdminViewProps {
  settings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
  onLogout: () => void;
}

export function AdminView({ settings, onSave, onLogout }: AdminViewProps) {
  const [formData, setFormData] = useState<AdminSettings>(settings);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleChange = (field: keyof AdminSettings, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setSaved(true);
  };

  const handleRoundChange = async (round: number) => {
    const newSettings = { ...formData, currentRound: round };
    setFormData(newSettings);
    onSave(newSettings);

    if (formData.appsScriptUrl) {
      try {
        await fetch(formData.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'setRound', round })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const appsScriptCode = `/**
 * Google Apps Script for BigGameWordle Integration
 * Setup Instructions:
 * 1. Open your Google Spreadsheet.
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete any default code in Code.gs and paste this entire block.
 * 4. Replace the SpreadSheet ID below if it's not pre-populated.
 * 5. In Apps Script editor, click "Deploy" (top right) -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Set "Execute as": "Me" (your email) and "Who has access": "Anyone".
 * 8. Click "Deploy", approve permissions, and copy the deployment "Web app URL".
 * 9. Paste that URL into the Admin settings panel of your BigGameWordle app!
 */

const SPREADSHEET_ID = "${formData.sheetId || 'YOUR_SPREADSHEET_ID_HERE'}";
const SHEET_NAME = "${formData.sheetTabName || 'Sheet1'}";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'setRound') {
      PropertiesService.getScriptProperties().setProperty('currentRound', data.round.toString());
      return ContentService.createTextOutput(JSON.stringify({"status": "success", "round": data.round}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    // Append data (Timestamp, Baan, Position, Won, Guesses, TimeLeft, Round)
    sheet.appendRow([
      new Date(),
      data.baan,
      data.position,
      data.won,
      data.guesses,
      data.timeLeft,
      data.round
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const round = PropertiesService.getScriptProperties().getProperty('currentRound') || '1';
  return ContentService.createTextOutput(JSON.stringify({"round": parseInt(round)}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Add CORS headers for preflight OPTIONS requests
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center border-b border-slate-200 pb-3">
              <Settings className="w-4 h-4 mr-2 text-indigo-600" />
              Admin Settings
            </h2>
            <p className="text-xs text-slate-500 mt-2 italic">Secured by THUNNER access.</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Game Round Controls</h2>
              <p className="text-sm text-slate-500">Change the active round. This will force all players back to the menu.</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(round => (
                  <button
                    key={round}
                    onClick={() => handleRoundChange(round)}
                    className={`py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all shadow-sm ${
                      formData.currentRound === round 
                        ? 'bg-indigo-600 text-white shadow-indigo-200 border border-indigo-700' 
                        : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Round {round}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Default Timer (Seconds)</label>
            <input
              type="number"
              value={formData.timerDuration}
              onChange={(e) => handleChange('timerDuration', parseInt(e.target.value) || 0)}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Google Sheet ID</label>
            <input
              type="text"
              value={formData.sheetId}
              onChange={(e) => handleChange('sheetId', e.target.value)}
              placeholder="1Q8AAE37LQ-g10B0KF9HXP..."
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Sheet Tab Name</label>
            <input
              type="text"
              value={formData.sheetTabName}
              onChange={(e) => handleChange('sheetTabName', e.target.value)}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Apps Script Web App URL</label>
            <input
              type="text"
              value={formData.appsScriptUrl}
              onChange={(e) => handleChange('appsScriptUrl', e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="bg-white border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-900 uppercase mb-2">Developer Stats</h3>
            <div className="space-y-1.5 text-[10px] sm:text-xs font-mono text-indigo-700">
              <div className="flex justify-between"><span>Status:</span> <span className="font-bold">Active</span></div>
              <div className="flex justify-between"><span>Sheet Link:</span> <span className={`font-bold uppercase ${formData.appsScriptUrl ? 'text-green-600' : 'text-slate-500'}`}>{formData.appsScriptUrl ? 'Synchronized' : 'Pending'}</span></div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 uppercase text-xs tracking-widest flex items-center justify-center"
          >
            {saved ? (
              <><Check className="w-4 h-4 mr-2" /> Settings Saved</>
            ) : (
              "Save All Configurations"
            )}
          </button>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Apps Script Deployment Code</label>
            <button
              onClick={copyCode}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-300 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto rounded-lg border border-slate-800 shadow-inner">
            <pre><code>{appsScriptCode}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
