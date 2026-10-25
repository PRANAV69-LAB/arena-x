import React, { useState } from 'react';
import { Play, RotateCcw, Clock, History, AlertTriangle, CheckCircle, Database, Sparkles } from 'lucide-react';
import { dbStore } from '../../data/databaseStore';

export const SqlPlayground: React.FC = () => {
  const PRESET_QUERIES = [
    {
      label: '1. Multi-Table JOIN (Teams, Matches & Scores)',
      query: `SELECT t.team_name, count(m.match_id) as matches_played, t.city\nFROM teams t\nINNER JOIN matches m ON t.team_id = m.team_a_id OR t.team_id = m.team_b_id\nWHERE m.status = 'COMPLETED'\nGROUP BY t.team_name, t.city\nORDER BY matches_played DESC;`
    },
    {
      label: '2. Athlete Eligibility & Jersey Number Filtering',
      query: `SELECT player_id, first_name, last_name, primary_sport, eligibility_status\nFROM players\nWHERE primary_sport = 'CRICKET' AND eligibility_status = 'ELIGIBLE'\nORDER BY last_name ASC\nLIMIT 10;`
    },
    {
      label: '3. Tournament Capacity & Format Aggregation',
      query: `SELECT format, count(tournament_id) as total_tournaments, max(max_teams) as max_capacity\nFROM tournaments\nGROUP BY format\nORDER BY total_tournaments DESC;`
    },
    {
      label: '4. System Audit Trail Query (Security Logs)',
      query: `SELECT log_id, action_type, entity_name, details, created_at\nFROM audit_logs\nORDER BY created_at DESC\nLIMIT 8;`
    }
  ];

  const [query, setQuery] = useState(PRESET_QUERIES[0].query);
  const [history, setHistory] = useState<string[]>([PRESET_QUERIES[0].query]);
  const [result, setResult] = useState<{
    columns: string[];
    rows: any[][];
    executionTimeMs: number;
    affectedRows?: number;
    error?: string;
  } | null>(() => dbStore.executeSql(PRESET_QUERIES[0].query));

  const handleExecute = () => {
    if (!query.trim()) return;
    const res = dbStore.executeSql(query);
    setResult(res);
    setHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 8));
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Preset Queries Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Academic SQL Templates (JOIN, Aggregate, Group By, Filter):</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(preset.query);
                const res = dbStore.executeSql(preset.query);
                setResult(res);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono-code transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Area */}
      <div className="p-5 rounded-2xl bg-[#070B14] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
          <span className="font-mono-code text-slate-400 font-bold flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            MySQL Console: `arena_x_db`
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
            >
              Clear Editor
            </button>
            <button
              onClick={handleExecute}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute (Ctrl+Enter)</span>
            </button>
          </div>
        </div>

        <div className="relative font-mono-code text-xs">
          <textarea
            rows={6}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleExecute();
              }
            }}
            placeholder="Type standard MySQL query here... (SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY)"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:outline-emerald-500/80 focus:border-emerald-500 font-mono-code text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Execution Results or Error */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Execution Time: <span className="text-emerald-400 font-mono-code">{result.executionTimeMs} ms</span>
              </span>
              {result.affectedRows !== undefined && (
                <span className="text-slate-400 font-mono-code">
                  Rows Returned / Affected: <span className="text-white font-bold">{result.affectedRows}</span>
                </span>
              )}
            </div>
            <span className="text-slate-500 font-mono-code text-[11px]">JDBC PreparedStatement Emulated</span>
          </div>

          {result.error ? (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-400">MySQL Execution Error</p>
                <p className="font-mono-code text-[11px] mt-1">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-code">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950/60">
                      {result.columns.map((c, i) => (
                        <th key={i} className="py-2.5 px-3.5 font-bold text-emerald-400">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3.5 text-slate-200 text-[11px] truncate max-w-sm">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Query History */}
      {history.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent Query History</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(h);
                  const res = dbStore.executeSql(h);
                  setResult(res);
                }}
                className="px-2.5 py-1 rounded bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white font-mono-code text-[11px] truncate max-w-xs transition-colors"
              >
                {h.replace(/\n/g, ' ').substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
