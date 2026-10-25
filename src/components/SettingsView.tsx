import React, { useState } from 'react';
import {
  Settings,
  Database,
  Radio,
  Shield,
  RefreshCw,
  Download,
  Key,
  Globe,
  Sliders,
  CheckCircle,
  FileCode
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';

interface SettingsViewProps {
  onOpenExportModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenExportModal }) => {
  const state = dbStore.getState();
  const [dataMode, setDataMode] = useState(state.dataMode);
  const [apiKey, setApiKey] = useState(state.apiConfig.apiKey);
  const [endpoint, setEndpoint] = useState(state.apiConfig.endpoint);
  const [readOnly, setReadOnly] = useState(state.sqlReadOnly);
  const [saveMsg, setSaveMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dbStore.setDataMode(dataMode);
    dbStore.setSqlReadOnly(readOnly);
    setSaveMsg('Configuration updated successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {saveMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* 1. Data Modes (Section 12 of Requirements) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-heading font-black text-white text-base">Application Data Operation Modes</h3>
            <p className="text-xs text-slate-400">Switch between Seeded Demo, Independent Local, or External Sports API</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Mode A: Demo Data */}
          <div
            onClick={() => setDataMode('DEMO')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              dataMode === 'DEMO'
                ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs text-white">Mode A: Demo Data</span>
              <input
                type="radio"
                name="mode"
                checked={dataMode === 'DEMO'}
                onChange={() => setDataMode('DEMO')}
                className="accent-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              22 teams, 110 athletes, 4 tournaments, 34+ matches seeded from <span className="font-mono-code text-slate-300">seed_data.sql</span>.
            </p>
          </div>

          {/* Mode B: Local Campus Mode */}
          <div
            onClick={() => setDataMode('LOCAL')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              dataMode === 'LOCAL'
                ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs text-white">Mode B: Local Campus</span>
              <input
                type="radio"
                name="mode"
                checked={dataMode === 'LOCAL'}
                onChange={() => setDataMode('LOCAL')}
                className="accent-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Autonomous campus tournaments. Custom student team creation and scheduling without external feeds.
            </p>
          </div>

          {/* Mode C: External Sports API */}
          <div
            onClick={() => setDataMode('API')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              dataMode === 'API'
                ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-xs text-white">Mode C: Real Sports API</span>
              <input
                type="radio"
                name="mode"
                checked={dataMode === 'API'}
                onChange={() => setDataMode('API')}
                className="accent-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              External sports feed with credential validation, TTL cache, and MySQL fallback.
            </p>
          </div>
        </div>

        {/* API Credentials Configuration */}
        {dataMode === 'API' && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <Globe className="w-4 h-4" />
              <span>External Sports API Configuration</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">API Key / Token (Masked)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-code focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">API Endpoint URL</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={e => setEndpoint(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-code focus:outline-emerald-500"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Last Refreshed: <span className="text-white font-mono-code">{new Date().toLocaleString()}</span> (Cached with 5-min TTL)
            </div>
          </div>
        )}
      </div>

      {/* 2. SQL Safety & Access Control (Section 13G) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-heading font-black text-white text-base">SQL Security &amp; Safety Controls</h3>
            <p className="text-xs text-slate-400">Enforces Section 13G safety and prevents unauthorized destructive queries</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-bold text-white text-xs">Enable SQL Read-Only Mode</div>
              <p className="text-[11px] text-slate-400">
                Blocks any manual `INSERT`, `UPDATE`, `DELETE`, or `DROP` queries in the SQL Query Playground.
              </p>
            </div>
            <input
              type="checkbox"
              checked={readOnly}
              onChange={e => setReadOnly(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Apply Settings Changes
          </button>
        </div>
      </div>

      {/* 3. JavaFX Desktop Codebase & Export Center */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-heading font-black text-white text-base">Complete Java 21 + JavaFX Desktop Source</h3>
              <p className="text-xs text-slate-400">Downloadable Maven repository with schema.sql and seed_data.sql</p>
            </div>
          </div>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Open Code Explorer &amp; ZIP Exporter</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The entire Java 21 desktop application is fully generated inside <span className="font-mono-code text-emerald-400">/arena-x-java/</span>. It features JDBC PreparedStatement DAOs, HikariCP pooling, JavaFX CSS themes, tournament scheduling algorithms, and schema definitions ready for import into IntelliJ IDEA, Eclipse, and MySQL Workbench.
        </p>
      </div>

      {/* 4. Factory Reset */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
        <div>
          <h4 className="font-heading font-bold text-sm text-rose-300">Clean Database Reset &amp; Re-seed</h4>
          <p className="text-xs text-rose-400/80">
            Re-runs `reset_database.sql` and `seed_data.sql` to restore factory test data.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset database to original seed state?')) {
              dbStore.resetDatabase();
              setSaveMsg('Database reset to fresh seed state.');
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs"
        >
          Reset Database
        </button>
      </div>
    </div>
  );
};
