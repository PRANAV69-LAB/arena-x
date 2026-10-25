import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, Table, Database, Filter, ArrowDownUp, Sparkles } from 'lucide-react';
import { analyzeSqlPipeline } from '../../utils/sqlEngine';
import { dbStore } from '../../data/databaseStore';

export const VisualLearningMode: React.FC = () => {
  const SAMPLE_LEARNING_QUERIES = [
    {
      title: 'Query A: Filter & Sort (Single Relation)',
      sql: `SELECT player_id, first_name, last_name, jersey_number\nFROM players\nWHERE primary_sport = 'CRICKET'\nORDER BY jersey_number ASC\nLIMIT 6;`
    },
    {
      title: 'Query B: Relational JOIN with Predicate Filtering',
      sql: `SELECT t.team_name, m.match_id, m.status\nFROM teams t\nINNER JOIN matches m ON t.team_id = m.team_a_id\nWHERE m.status = 'COMPLETED'\nORDER BY m.match_id ASC\nLIMIT 5;`
    },
    {
      title: 'Query C: Aggregation & GROUP BY',
      sql: `SELECT format, count(tournament_id) as total_tournaments\nFROM tournaments\nGROUP BY format\nORDER BY total_tournaments DESC;`
    }
  ];

  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const activeQuery = SAMPLE_LEARNING_QUERIES[activeQueryIndex];
  const steps = analyzeSqlPipeline(activeQuery.sql);
  const result = dbStore.executeSql(activeQuery.sql);

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Select Query for Educational Step-by-Step Visualization:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_LEARNING_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQueryIndex(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeQueryIndex === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono-code text-xs text-emerald-400">
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
          Source SQL Statement
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">{activeQuery.sql}</pre>
      </div>

      {/* Logical Execution Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-white text-base tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            ANSI SQL Logical Order of Operations Pipeline
          </h3>
          <span className="text-xs text-slate-400 font-mono-code">
            Executed by MySQL Query Execution Engine
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((s, idx) => (
            <div
              key={s.stepNumber}
              className={`p-4 rounded-2xl border transition-all ${s.visualHighlight} relative`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-black/40 text-white font-mono-code font-bold text-xs flex items-center justify-center">
                    {s.stepNumber}
                  </span>
                  <h4 className="font-heading font-bold text-sm tracking-wide">{s.phaseName}</h4>
                </div>

                <div className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-black/30 border border-white/10">
                  {s.clause}
                </div>
              </div>

              <div className="pt-3 text-xs leading-relaxed opacity-90">
                {s.technicalExplanation}
              </div>

              {/* Row Flow Indicator */}
              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono-code opacity-75">
                <span>Tuples scanned: {s.sampleInputRows}</span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Tuples passed to next stage: {s.sampleOutputRows}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Materialized Result Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <span className="font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Final Materialized Result (Returned to Client)
          </span>
          <span className="text-slate-400 font-mono-code text-[11px]">
            {result.rows.length} Rows · {result.executionTimeMs} ms
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left text-xs font-mono-code">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900">
                {result.columns.map((c, i) => (
                  <th key={i} className="py-2 px-3 font-bold text-emerald-400">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {result.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/30">
                  {row.map((val, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-slate-200 text-[11px]">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
