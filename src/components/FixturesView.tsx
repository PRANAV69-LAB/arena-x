import React, { useState } from 'react';
import {
  CalendarDays,
  Play,
  CheckCircle2,
  Clock,
  Radio,
  Trophy,
  Filter,
  RefreshCw,
  GitBranch,
  List
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { Tournament } from '../types';

interface FixturesViewProps {
  initialTournamentId?: number | null;
  onOpenLiveScore?: (matchId: number) => void;
}

export const FixturesView: React.FC<FixturesViewProps> = ({ initialTournamentId, onOpenLiveScore }) => {
  const state = dbStore.getState();
  const [selectedTournId, setSelectedTournId] = useState<number>(
    initialTournamentId || (state.tournaments[0]?.tournament_id ?? 1)
  );
  const [viewFormat, setViewFormat] = useState<'BRACKET' | 'LIST'>('BRACKET');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const currentTourn = state.tournaments.find(t => t.tournament_id === selectedTournId);
  const matches = state.matches.filter(m => {
    if (m.tournament_id !== selectedTournId) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  const getTeam = (id: number | null) => {
    if (id === null) return null;
    return state.teams.find(t => t.team_id === id) || null;
  };

  const getMatchScore = (matchId: number, teamId: number | null) => {
    if (!teamId) return null;
    return state.matchScores.find(s => s.match_id === matchId && s.team_id === teamId);
  };

  const rounds = Array.from(new Set(matches.map(m => m.round_number))).sort((a, b) => a - b);

  const handleRegenerate = () => {
    try {
      dbStore.generateFixturesForTournament(selectedTournId);
    } catch (err: any) {
      alert(`Error generating fixtures: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Controls & Tournament Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Tournament Dropdown */}
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={selectedTournId}
              onChange={e => setSelectedTournId(Number(e.target.value))}
              aria-label="Select Target Tournament"
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-emerald-500 cursor-pointer"
            >
              {state.tournaments.map(t => (
                <option key={t.tournament_id} value={t.tournament_id}>
                  {t.name} ({t.format} · {t.sport_type})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter Matches by Status"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Matches</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="LIVE">Live Matches</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <button
              onClick={() => setViewFormat('BRACKET')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewFormat === 'BRACKET' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Tree Bracket</span>
            </button>
            <button
              onClick={() => setViewFormat('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewFormat === 'LIST' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Schedule List</span>
            </button>
          </div>

          <button
            onClick={handleRegenerate}
            title="Re-run scheduling algorithm for this tournament"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate Algorithm</span>
          </button>
        </div>
      </div>

      {/* Algorithm Explainer Box */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400 uppercase tracking-wider font-mono-code text-[11px]">
            {currentTourn?.format} ALGORITHM:
          </span>
          <span>
            {currentTourn?.format === 'KNOCKOUT'
              ? 'Computes nearest power-of-2 bracket. Distributes BYEs to top seeds so higher-ranked teams advance directly.'
              : 'Polygon Circle rotation algorithm. Generates (N - 1) rounds with strictly zero duplicate pairings and alternating venues.'}
          </span>
        </div>
        <span className="text-[11px] font-mono-code text-slate-400">
          {matches.length} Total Fixtures
        </span>
      </div>

      {/* View 1: Tree Bracket View (Knockout / Rounds) */}
      {viewFormat === 'BRACKET' ? (
        <div className="p-6 rounded-2xl bg-[#090D1A] border border-slate-800/80 overflow-x-auto min-h-[480px]">
          <div className="flex gap-12 min-w-max items-start py-4">
            {rounds.map((roundNum) => {
              const roundMatches = matches.filter(m => m.round_number === roundNum);
              const roundTitle =
                roundNum === rounds.length
                  ? 'Grand Final'
                  : roundNum === rounds.length - 1
                  ? 'Semifinals'
                  : `Round ${roundNum}`;

              return (
                <div key={roundNum} className="w-72 space-y-4">
                  <div className="text-center pb-2 border-b border-slate-800">
                    <h3 className="font-heading font-black text-white text-xs uppercase tracking-wider">
                      {roundTitle}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono-code">{roundMatches.length} Fixtures</p>
                  </div>

                  <div className="space-y-6">
                    {roundMatches.map(m => {
                      const teamA = getTeam(m.team_a_id);
                      const teamB = getTeam(m.team_b_id);
                      const scoreA = getMatchScore(m.match_id, m.team_a_id);
                      const scoreB = getMatchScore(m.match_id, m.team_b_id);
                      const isBye = m.team_b_id === null;

                      return (
                        <div
                          key={m.match_id}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            m.status === 'LIVE'
                              ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                              : m.status === 'COMPLETED'
                              ? 'bg-slate-900/90 border-slate-800'
                              : 'bg-slate-900/50 border-slate-800/70'
                          }`}
                        >
                          {/* Match Header Tag */}
                          <div className="px-3 py-1.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-[10px]">
                            <span className="font-mono-code text-slate-400">Match #{m.match_number}</span>
                            <span
                              className={`font-bold ${
                                m.status === 'LIVE'
                                  ? 'text-rose-400 animate-pulse'
                                  : m.status === 'COMPLETED'
                                  ? 'text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>

                          {/* Team A */}
                          <div
                            className={`p-2.5 flex items-center justify-between text-xs ${
                              m.winner_team_id === m.team_a_id ? 'bg-emerald-500/10 font-bold text-white' : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: teamA?.logo_color || '#10B981' }}
                              />
                              <span className="truncate">{teamA?.team_name || 'TBD'}</span>
                            </div>
                            <span className="font-mono-code text-white shrink-0 ml-2">
                              {scoreA?.score_primary ?? (isBye ? 'BYE' : '-')}
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-slate-800" />

                          {/* Team B */}
                          <div
                            className={`p-2.5 flex items-center justify-between text-xs ${
                              m.winner_team_id === m.team_b_id ? 'bg-emerald-500/10 font-bold text-white' : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: teamB?.logo_color || '#64748B' }}
                              />
                              <span className="truncate">{isBye ? '(Automatic BYE)' : teamB?.team_name || 'TBD'}</span>
                            </div>
                            <span className="font-mono-code text-white shrink-0 ml-2">
                              {isBye ? 'ADV' : scoreB?.score_primary ?? '-'}
                            </span>
                          </div>

                          {/* Score update button if clicked */}
                          {onOpenLiveScore && !isBye && (
                            <button
                              onClick={() => onOpenLiveScore(m.match_id)}
                              className="w-full py-1 bg-slate-950/80 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-white border-t border-slate-800 transition-colors"
                            >
                              Manage Match Score →
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View 2: Chronological Schedule List */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] bg-slate-950/40">
                  <th className="py-3 px-4">Match #</th>
                  <th className="py-3 px-4">Round</th>
                  <th className="py-3 px-4">Team A (Home)</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-4">Team B (Away)</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {matches.map(m => {
                  const teamA = getTeam(m.team_a_id);
                  const teamB = getTeam(m.team_b_id);
                  const scoreA = getMatchScore(m.match_id, m.team_a_id);
                  const scoreB = getMatchScore(m.match_id, m.team_b_id);
                  const isBye = m.team_b_id === null;

                  return (
                    <tr key={m.match_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono-code">#{m.match_number}</td>
                      <td className="py-3 px-4 text-slate-300 font-semibold">Round {m.round_number}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamA?.logo_color }} />
                          <span className="text-white font-bold">{teamA?.team_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-heading font-black text-sm text-white font-mono-code">
                        {isBye ? (
                          <span className="text-emerald-400 text-xs">BYE</span>
                        ) : (
                          `${scoreA?.score_primary ?? '-'} : ${scoreB?.score_primary ?? '-'}`
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamB?.logo_color || '#64748B' }} />
                          <span className={isBye ? 'text-slate-400 italic' : 'text-white font-bold'}>
                            {isBye ? 'None (BYE Seed)' : teamB?.team_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono-code text-[11px]">
                        {new Date(m.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'LIVE'
                              ? 'bg-rose-500/20 text-rose-400'
                              : m.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onOpenLiveScore && !isBye && (
                          <button
                            onClick={() => onOpenLiveScore(m.match_id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                          >
                            Score Console
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
