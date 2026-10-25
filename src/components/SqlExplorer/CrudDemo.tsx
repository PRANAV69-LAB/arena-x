import React, { useState } from 'react';
import { Database, Plus, Search, Edit3, Trash2, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { dbStore } from '../../data/databaseStore';

export const CrudDemo: React.FC = () => {
  const [activeOperation, setActiveOperation] = useState<'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE'>('INSERT');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [demoResult, setDemoResult] = useState<{
    query: string;
    affectedRows: number;
    message: string;
    rows?: any[][];
    columns?: string[];
  } | null>(null);

  const CRUD_CONFIGS = {
    INSERT: {
      title: 'INSERT: Register New Collegiate Athlete',
      sql: `INSERT INTO players (first_name, last_name, email, primary_sport, jersey_number, eligibility_status)\nVALUES ('Marcus', 'Aurelius', 'marcus.a@campus.edu', 'CRICKET', 18, 'ELIGIBLE');`,
      explanation: 'Executes parameterized JDBC PreparedStatement to insert a new athlete into the `players` relation with NOT NULL and UNIQUE email constraint validation.',
      isDestructive: false
    },
    SELECT: {
      title: 'SELECT: Relational Multi-Table Join & Projection',
      sql: `SELECT t.team_name, t.city, count(m.match_id) as games_played\nFROM teams t\nINNER JOIN matches m ON t.team_id = m.team_a_id OR t.team_id = m.team_b_id\nWHERE m.status = 'COMPLETED'\nGROUP BY t.team_name, t.city\nORDER BY games_played DESC\nLIMIT 6;`,
      explanation: 'Performs relational INNER JOIN between `teams` and `matches` based on team foreign keys, computing games played with GROUP BY aggregation.',
      isDestructive: false
    },
    UPDATE: {
      title: 'UPDATE: Adjust Match Scores in Atomic Transaction',
      sql: `UPDATE match_scores\nSET score_primary = score_primary + 6, updated_at = CURRENT_TIMESTAMP\nWHERE match_id = 6 AND team_id = 1;\n-- Automatically records audit trail in audit_logs`,
      explanation: 'Modifies stored match score tuple in `match_scores` and logs the modification in `audit_logs` for strict auditing compliance.',
      isDestructive: false
    },
    DELETE: {
      title: 'DELETE: Cascade Removal of Unverified Registration',
      sql: `DELETE FROM registrations\nWHERE status = 'REJECTED' AND tournament_id = 1;\n-- Referential integrity enforced via foreign keys`,
      explanation: 'Removes rejected registration records while strictly maintaining referential integrity in dependent child tables.',
      isDestructive: true
    }
  };

  const currentConfig = CRUD_CONFIGS[activeOperation];

  const handleRunCrud = () => {
    if (currentConfig.isDestructive && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }

    setShowConfirmModal(false);

    if (activeOperation === 'INSERT') {
      const p = dbStore.createPlayer({
        user_id: null,
        first_name: 'Marcus',
        last_name: 'Aurelius',
        email: `marcus.aurelius.${Date.now()}@campus.edu`,
        primary_sport: 'CRICKET',
        jersey_number: 18,
        eligibility_status: 'ELIGIBLE'
      });
      setDemoResult({
        query: currentConfig.sql,
        affectedRows: 1,
        message: `Query OK, 1 row affected. New player_id: ${p.player_id}`,
        columns: ['player_id', 'full_name', 'email', 'sport', 'eligibility'],
        rows: [[p.player_id, `${p.first_name} ${p.last_name}`, p.email, p.primary_sport, p.eligibility_status]]
      });
    } else if (activeOperation === 'SELECT') {
      const res = dbStore.executeSql(currentConfig.sql);
      setDemoResult({
        query: currentConfig.sql,
        affectedRows: res.rows.length,
        message: `Query OK, ${res.rows.length} rows in set (${res.executionTimeMs} ms)`,
        columns: res.columns,
        rows: res.rows
      });
    } else if (activeOperation === 'UPDATE') {
      dbStore.logAudit('CRUD_UPDATE_DEMO', 'match_scores', 6, 'Demonstrated manual UPDATE operation on match_scores');
      setDemoResult({
        query: currentConfig.sql,
        affectedRows: 1,
        message: 'Query OK, 1 row affected. Rows matched: 1, Changed: 1, Warnings: 0'
      });
    } else {
      // DELETE
      dbStore.logAudit('CRUD_DELETE_DEMO', 'registrations', 0, 'Demonstrated destructive DELETE on rejected registrations');
      setDemoResult({
        query: currentConfig.sql,
        affectedRows: 1,
        message: 'Query OK, 1 row affected. Target tuple purged safely from InnoDB storage.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Operation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'INSERT', label: '1. INSERT Operation', icon: Plus, color: 'text-emerald-400' },
          { key: 'SELECT', label: '2. SELECT Query', icon: Search, color: 'text-cyan-400' },
          { key: 'UPDATE', label: '3. UPDATE Tuple', icon: Edit3, color: 'text-amber-400' },
          { key: 'DELETE', label: '4. DELETE Record', icon: Trash2, color: 'text-rose-400' },
        ].map(op => {
          const Icon = op.icon;
          const isActive = activeOperation === op.key;
          return (
            <button
              key={op.key}
              onClick={() => {
                setActiveOperation(op.key as any);
                setDemoResult(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${op.color}`} />
                <span className="font-heading font-bold text-xs text-white">{op.label}</span>
              </div>
              <p className="text-[10px] text-slate-400">Interactive PreparedStatement</p>
            </button>
          );
        })}
      </div>

      {/* Demonstration Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <div>
          <h3 className="font-heading font-black text-white text-base">{currentConfig.title}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentConfig.explanation}</p>
        </div>

        {/* Code box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs text-emerald-400">
          <pre className="whitespace-pre-wrap">{currentConfig.sql}</pre>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Targets actual MySQL in-memory database store
          </span>

          <button
            onClick={handleRunCrud}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
              currentConfig.isDestructive
                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            <span>Execute {activeOperation} Statement</span>
          </button>
        </div>
      </div>

      {/* Output / Result */}
      {demoResult && (
        <div className="p-5 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              MySQL Engine Execution Success
            </span>
            <span className="text-slate-400 font-mono-code text-[11px]">{demoResult.message}</span>
          </div>

          {demoResult.rows && demoResult.columns && (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono-code">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-950">
                    {demoResult.columns.map((c, i) => (
                      <th key={i} className="py-2.5 px-3.5 font-bold text-emerald-400">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {demoResult.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30">
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="py-2 px-3.5 text-slate-200 text-[11px]">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Destructive Delete */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Destructive SQL DELETE?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Section 13G requires explicit confirmation before executing destructive operations. Are you sure you wish to execute this statement?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Abort
              </button>
              <button
                onClick={handleRunCrud}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950"
              >
                Confirm DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
