import React, { useState } from 'react';
import { Cpu, Play, Search, AlertCircle, Info, Database, Zap } from 'lucide-react';
import { generateExplainPlan } from '../../utils/sqlEngine';
import { ExplainPlanRow } from '../../types';

export const QueryOptimization: React.FC = () => {
  const PRESET_QUERIES = [
    {
      label: 'EXPLAIN Multi-Table Foreign Key JOIN',
      sql: `EXPLAIN SELECT t.team_name, count(m.match_id) as match_count\nFROM teams t\nINNER JOIN matches m ON t.team_id = m.team_a_id\nWHERE m.status = 'COMPLETED'\nGROUP BY t.team_name;`
    },
    {
      label: 'EXPLAIN Indexed WHERE Status Scan',
      sql: `EXPLAIN SELECT * FROM matches WHERE status = 'LIVE';`
    },
    {
      label: 'EXPLAIN Full Relation Scan',
      sql: `EXPLAIN SELECT * FROM teams;`
    }
  ];

  const [explainSql, setExplainSql] = useState(PRESET_QUERIES[0].sql);
  const [explainPlan, setExplainPlan] = useState<ExplainPlanRow[]>(() =>
    generateExplainPlan(PRESET_QUERIES[0].sql)
  );

  const handleRunExplain = () => {
    setExplainPlan(generateExplainPlan(explainSql));
  };

  return (
    <div className="space-y-6">
      {/* Intro info */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>
            MySQL Cost-Based Optimizer (CBO) Execution Plan Inspector. Analyzes index usage and row estimation.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono-code text-[11px] text-slate-400">
          <span>Engine: InnoDB</span> · <span>Optimizer: Standard MySQL 8.0</span>
        </div>
      </div>

      {/* Preset Toolbar */}
      <div className="flex flex-wrap gap-2">
        {PRESET_QUERIES.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setExplainSql(p.sql);
              setExplainPlan(generateExplainPlan(p.sql));
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono-code transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Editor box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
          <span className="font-mono-code text-slate-400 font-bold flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            MySQL EXPLAIN Target Statement
          </span>
          <button
            onClick={handleRunExplain}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Generate EXPLAIN Plan</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={explainSql}
          onChange={e => setExplainSql(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono-code text-xs focus:outline-emerald-500"
        />
      </div>

      {/* EXPLAIN Results Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-xl space-y-2">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-heading font-bold text-white text-sm">
            Optimizer Execution Plan (EXPLAIN FORMAT=TRADITIONAL)
          </span>
          <span className="text-slate-400 font-mono-code text-[11px]">{explainPlan.length} Execution Steps</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950/60">
                <th className="py-2.5 px-3">id</th>
                <th className="py-2.5 px-3">select_type</th>
                <th className="py-2.5 px-3">table</th>
                <th className="py-2.5 px-3 text-center">type</th>
                <th className="py-2.5 px-3">possible_keys</th>
                <th className="py-2.5 px-3">key</th>
                <th className="py-2.5 px-3 text-center">rows</th>
                <th className="py-2.5 px-3 text-center">filtered %</th>
                <th className="py-2.5 px-4">Extra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {explainPlan.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-slate-400">{row.id}</td>
                  <td className="py-3 px-3 text-slate-300">{row.select_type}</td>
                  <td className="py-3 px-3 font-bold text-white">{row.table}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.type === 'eq_ref' || row.type === 'const'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : row.type === 'ref' || row.type === 'range'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{row.possible_keys || 'NULL'}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{row.key || 'NULL'}</td>
                  <td className="py-3 px-3 text-center text-white">{row.rows}</td>
                  <td className="py-3 px-3 text-center text-slate-300">{row.filtered}%</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{row.Extra || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Explanations for Students & Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="font-bold text-white">Join Type: `ref` / `eq_ref`</div>
          <p className="text-slate-400 leading-snug">
            Indicates efficient B+ Tree traversal utilizing primary or foreign key indexes. Only matching tuples are fetched.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="font-bold text-white">Join Type: `ALL` (Table Scan)</div>
          <p className="text-slate-400 leading-snug">
            Indicates entire table is read from disk. Acceptable on small lookup catalogs (e.g. 22 teams), but requires indexes on large scale.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="font-bold text-white">Extra: `Using where`</div>
          <p className="text-slate-400 leading-snug">
            Post-retrieval filtering executed by MySQL storage engine before returning rows to the JDBC client.
          </p>
        </div>
      </div>
    </div>
  );
};
