import React, { useState } from 'react';
import { ShieldCheck, Play, RotateCcw, AlertTriangle, CheckCircle, Database, HelpCircle, Lock } from 'lucide-react';
import { dbStore } from '../../data/databaseStore';

export const TransactionDemo: React.FC = () => {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [transactionOutput, setTransactionOutput] = useState<{
    success: boolean;
    steps: string[];
    error?: string;
  } | null>(null);

  const handleRunTransaction = () => {
    const res = dbStore.executeAcidTransaction({
      matchId: 1,
      teamAId: 1,
      teamBId: 6,
      scoreA: 195,
      scoreB: 160,
      simulateFailure
    });
    setTransactionOutput(res);
  };

  return (
    <div className="space-y-6">
      {/* ACID Principles Education Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-emerald-400 font-heading">A — ATOMICITY</div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            All-or-nothing guarantee. Either all multi-table score updates succeed, or the entire transaction is rolled back.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-cyan-400 font-heading">C — CONSISTENCY</div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Preserves database invariants, foreign keys, and tournament point calculations across matches.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-amber-400 font-heading">I — ISOLATION</div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            InnoDB row-level locks prevent dirty reads while tournament tables are being mutated concurrently.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-purple-400 font-heading">D — DURABILITY</div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Committed state is written to redo log (WAL) on disk, surviving power outages and crashes.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Console */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-heading font-black text-white text-base">
              Atomic Match Score &amp; Standings Transaction Workflow
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Executes multi-table update: <span className="text-emerald-400 font-mono-code">match_scores</span> → <span className="text-emerald-400 font-mono-code">matches</span> → <span className="text-emerald-400 font-mono-code">audit_logs</span>
            </p>
          </div>

          {/* Toggle Simulated Constraint Failure */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs shrink-0">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={e => setSimulateFailure(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
              <span className="font-semibold text-rose-400">Simulate Network / Constraint Crash</span>
            </label>
          </div>
        </div>

        {/* Transaction SQL Code Template */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs text-emerald-400 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            JDBC Transaction Boundary (ScoreManagementService.java)
          </div>
          <div>Connection conn = DatabaseConnection.getConnection();</div>
          <div className="text-amber-400 font-bold">conn.setAutoCommit(false); // 1. BEGIN ATOMIC TRANSACTION</div>
          <div>PreparedStatement ps1 = conn.prepareStatement("INSERT INTO match_scores ..."); ps1.executeUpdate();</div>
          <div>PreparedStatement ps2 = conn.prepareStatement("UPDATE matches SET status = 'COMPLETED' ..."); ps2.executeUpdate();</div>
          <div className="text-cyan-400">PreparedStatement ps3 = conn.prepareStatement("INSERT INTO audit_logs ..."); ps3.executeUpdate();</div>
          {simulateFailure ? (
            <div className="text-rose-400 font-bold bg-rose-950/40 p-1 rounded">
              // Simulated Exception triggered here!
              <br />
              DatabaseConnection.rollback(conn); // 4. ROLLBACK ALL CHANGES
            </div>
          ) : (
            <div className="text-emerald-400 font-bold bg-emerald-950/40 p-1 rounded">
              conn.commit(); // 4. COMMIT ALL CHANGES ATOMICALLY
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ACID transaction with automatic rollback protection
          </span>

          <button
            onClick={handleRunTransaction}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
              simulateFailure
                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Transaction Test</span>
          </button>
        </div>
      </div>

      {/* Transaction Output Steps */}
      {transactionOutput && (
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            transactionOutput.success
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="font-bold flex items-center gap-2">
              {transactionOutput.success ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Transaction Committed: ACID Consistency Guaranteed
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Transaction Rolled Back: Zero Data Corruption
                </>
              )}
            </span>
            <span className="font-mono-code text-[11px]">
              {transactionOutput.success ? 'COMMIT SUCCESS' : 'ROLLBACK FIRED'}
            </span>
          </div>

          <div className="space-y-1.5 font-mono-code text-xs">
            {transactionOutput.steps.map((st, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px]">[{i + 1}]</span>
                <span>{st}</span>
              </div>
            ))}
          </div>

          {transactionOutput.error && (
            <p className="text-xs font-sans mt-2 pt-2 border-t border-rose-500/20 text-rose-300">
              {transactionOutput.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
