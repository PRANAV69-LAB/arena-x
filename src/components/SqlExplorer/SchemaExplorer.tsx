import React, { useState } from 'react';
import { Database, Key, Link2, Table, Eye, CheckCircle2, Shield } from 'lucide-react';
import { ARENA_X_SCHEMA, DatabaseSchemaTable } from '../../utils/sqlEngine';
import { dbStore } from '../../data/databaseStore';

export const SchemaExplorer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('tournaments');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showLiveRecords, setShowLiveRecords] = useState<boolean>(true);

  const state = dbStore.getState();

  const categories = ['ALL', 'Core', 'Competition', 'Performance', 'Security'];

  const filteredSchema = ARENA_X_SCHEMA.filter(t => {
    if (activeCategory !== 'ALL' && t.category !== activeCategory) return false;
    return true;
  });

  const tableMeta = ARENA_X_SCHEMA.find(t => t.tableName === selectedTable) || ARENA_X_SCHEMA[0];

  // Helper to fetch live records for the table
  const getTableRecords = (tableName: string): { columns: string[]; rows: any[][] } => {
    switch (tableName) {
      case 'users':
        return {
          columns: ['user_id', 'username', 'email', 'full_name', 'role', 'is_active'],
          rows: state.users.map(u => [u.user_id, u.username, u.email, u.full_name, u.role, u.is_active ? 'TRUE' : 'FALSE'])
        };
      case 'players':
        return {
          columns: ['player_id', 'first_name', 'last_name', 'email', 'primary_sport', 'jersey_number', 'eligibility_status'],
          rows: state.players.slice(0, 15).map(p => [p.player_id, p.first_name, p.last_name, p.email, p.primary_sport, p.jersey_number || '-', p.eligibility_status])
        };
      case 'teams':
        return {
          columns: ['team_id', 'team_name', 'sport_type', 'city', 'coach_name'],
          rows: state.teams.map(t => [t.team_id, t.team_name, t.sport_type, t.city, t.coach_name || 'N/A'])
        };
      case 'tournaments':
        return {
          columns: ['tournament_id', 'name', 'sport_type', 'format', 'status', 'start_date', 'max_teams'],
          rows: state.tournaments.map(t => [t.tournament_id, t.name, t.sport_type, t.format, t.status, t.start_date, t.max_teams])
        };
      case 'registrations':
        return {
          columns: ['registration_id', 'tournament_id', 'team_id', 'status', 'seed_number'],
          rows: state.registrations.slice(0, 15).map(r => [r.registration_id, r.tournament_id, r.team_id, r.status, r.seed_number || '-'])
        };
      case 'matches':
        return {
          columns: ['match_id', 'tournament_id', 'round_number', 'team_a_id', 'team_b_id', 'status', 'match_summary'],
          rows: state.matches.slice(0, 15).map(m => [m.match_id, m.tournament_id, m.round_number, m.team_a_id, m.team_b_id || 'BYE', m.status, m.match_summary || '-'])
        };
      case 'match_scores':
        return {
          columns: ['score_id', 'match_id', 'team_id', 'score_primary', 'score_secondary', 'overs_or_minutes'],
          rows: state.matchScores.slice(0, 15).map(s => [s.score_id, s.match_id, s.team_id, s.score_primary, s.score_secondary || 0, s.overs_or_minutes || 0])
        };
      case 'venues':
        return {
          columns: ['venue_id', 'venue_name', 'city', 'capacity', 'surface_type'],
          rows: state.venues.map(v => [v.venue_id, v.venue_name, v.city, v.capacity, v.surface_type])
        };
      case 'audit_logs':
        return {
          columns: ['log_id', 'action_type', 'entity_name', 'entity_id', 'details', 'created_at'],
          rows: state.auditLogs.slice(0, 15).map(a => [a.log_id, a.action_type, a.entity_name, a.entity_id || '-', a.details, a.created_at])
        };
      default:
        return {
          columns: ['status', 'message'],
          rows: [['OK', `Inspection active for ${tableName}`]]
        };
    }
  };

  const records = getTableRecords(selectedTable);

  return (
    <div className="space-y-6">
      {/* Category Pills & Table Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Table List */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              MySQL Tables ({ARENA_X_SCHEMA.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-mono-code">InnoDB</span>
          </div>

          <div className="space-y-1">
            {ARENA_X_SCHEMA.map(table => {
              const isSelected = selectedTable === table.tableName;
              return (
                <button
                  key={table.tableName}
                  onClick={() => setSelectedTable(table.tableName)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-3 border-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Table className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono-code">{table.tableName}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono-code">
                    {table.columns.length} cols
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Schema Column Details & Constraints */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black font-heading text-white">Table:</span>
                  <span className="font-mono-code text-base font-bold text-emerald-400">`{tableMeta.tableName}`</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tableMeta.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{tableMeta.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLiveRecords(!showLiveRecords)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    showLiveRecords
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showLiveRecords ? 'Hide Live Tuples' : 'Inspect Live Records'}</span>
                </button>
              </div>
            </div>

            {/* Column Definitions Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] bg-slate-950/60">
                    <th className="py-2.5 px-3">Column</th>
                    <th className="py-2.5 px-3">SQL Data Type</th>
                    <th className="py-2.5 px-3 text-center">Keys</th>
                    <th className="py-2.5 px-3 text-center">Nullable</th>
                    <th className="py-2.5 px-4">Description / Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium font-mono-code">
                  {tableMeta.columns.map(col => (
                    <tr key={col.name} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        {col.name}
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300 text-[11px]">{col.type}</td>
                      <td className="py-2.5 px-3 text-center">
                        {col.isPrimary ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Key className="w-2.5 h-2.5" /> PK
                          </span>
                        ) : col.isForeign ? (
                          <span
                            title={`References ${col.references}`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          >
                            <Link2 className="w-2.5 h-2.5" /> FK
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[11px]">
                        {col.nullable ? (
                          <span className="text-slate-400">YES</span>
                        ) : (
                          <span className="text-rose-400 font-bold">NOT NULL</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-sans text-xs">
                        {col.description}
                        {col.references && (
                          <span className="text-purple-400 font-mono-code ml-1 text-[11px]">
                            → {col.references}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Records Grid */}
          {showLiveRecords && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Live Storage Tuples: `{selectedTable}`
                </span>
                <span className="text-slate-400 font-mono-code text-[11px]">
                  SELECT * FROM {selectedTable} LIMIT 15;
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                <table className="w-full text-left text-xs font-mono-code">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900">
                      {records.columns.map(c => (
                        <th key={c} className="py-2.5 px-3">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {records.rows.length === 0 ? (
                      <tr>
                        <td colSpan={records.columns.length} className="p-4 text-center text-slate-500 text-xs">
                          Table is empty (0 records)
                        </td>
                      </tr>
                    ) : (
                      records.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/30">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2.5 px-3 text-slate-300 text-[11px] truncate max-w-xs">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
