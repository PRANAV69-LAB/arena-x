import React from 'react';
import {
  Trophy,
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  Radio,
  Flame,
  TrendingUp,
  Award,
  ArrowRight,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { NavigationTab } from './Sidebar';
import { computeLeagueStandings } from '../utils/algorithms';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const state = dbStore.getState();

  // Dynamically calculate metrics
  const totalTournaments = state.tournaments.length;
  const totalTeams = state.teams.length;
  const totalPlayers = state.players.length;
  const completedMatches = state.matches.filter(m => m.status === 'COMPLETED').length;
  const upcomingMatches = state.matches.filter(m => m.status === 'SCHEDULED').length;
  const liveMatches = state.matches.filter(m => m.status === 'LIVE');

  // Dynamic Standings
  const standings = computeLeagueStandings(state.teams, state.matches, state.matchScores);
  const topTeams = standings.slice(0, 5);

  // Top Players
  const topPlayers = [...state.playerStatistics]
    .sort((a, b) => b.rating_score - a.rating_score)
    .slice(0, 5)
    .map(stat => {
      const p = state.players.find(x => x.player_id === stat.player_id);
      return {
        ...stat,
        name: p ? `${p.first_name} ${p.last_name}` : `Athlete #${stat.player_id}`,
        sport: p?.primary_sport || 'CRICKET'
      };
    });

  const getTeamName = (id: number | null) => {
    if (id === null) return 'BYE';
    return state.teams.find(t => t.team_id === id)?.team_name || `Team #${id}`;
  };

  const getTeamColor = (id: number | null) => {
    if (id === null) return '#64748B';
    return state.teams.find(t => t.team_id === id)?.logo_color || '#10B981';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 6 Dynamic Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide">Tournaments</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{totalTournaments}</div>
          <div className="text-[10px] text-slate-400 mt-1">4 Formats Active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide">Registered Teams</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{totalTeams}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 4 Sports</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide">Total Athletes</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{totalPlayers}</div>
          <div className="text-[10px] text-emerald-400 mt-1">100% Verified DB</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{completedMatches}</div>
          <div className="text-[10px] text-slate-400 mt-1">Scores Finalized</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium tracking-wide">Upcoming</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">{upcomingMatches}</div>
          <div className="text-[10px] text-slate-400 mt-1">Fixtures Scheduled</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[11px] font-bold tracking-wide uppercase">Live Now</span>
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-heading">{liveMatches.length}</div>
          <div className="text-[10px] text-rose-300 mt-1">Ongoing Battles</div>
        </div>
      </div>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
                Live Tournament Action
              </h2>
            </div>
            <button
              onClick={() => onNavigate('scores')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Enter Live Scoring Console <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => {
              const tourn = state.tournaments.find(t => t.tournament_id === match.tournament_id);
              const scoreA = state.matchScores.find(s => s.match_id === match.match_id && s.team_id === match.team_a_id);
              const scoreB = state.matchScores.find(s => s.match_id === match.match_id && s.team_id === match.team_b_id);

              return (
                <div
                  key={match.match_id}
                  className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B1120] to-slate-900 border border-rose-500/40 relative overflow-hidden shadow-lg"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="font-semibold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Radio className="w-3.5 h-3.5" /> {tourn?.name || 'Tournament'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono-code">Round {match.round_number}</span>
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    {/* Team A */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: getTeamColor(match.team_a_id) }}
                        />
                        <h3 className="font-bold text-white text-sm truncate">{getTeamName(match.team_a_id)}</h3>
                      </div>
                      <div className="mt-1 text-2xl font-black font-heading text-white">
                        {scoreA?.score_primary ?? 0}
                        {scoreA?.score_secondary ? (
                          <span className="text-sm text-slate-400 font-normal">/{scoreA.score_secondary}</span>
                        ) : null}
                      </div>
                      {scoreA?.overs_or_minutes ? (
                        <p className="text-[10px] text-slate-400 font-mono-code">
                          {tourn?.sport_type === 'CRICKET' ? `(${scoreA.overs_or_minutes} ov)` : `${scoreA.overs_or_minutes}'`}
                        </p>
                      ) : null}
                    </div>

                    <div className="px-4 text-center">
                      <span className="text-xs font-black text-rose-500 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30">
                        VS
                      </span>
                    </div>

                    {/* Team B */}
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <h3 className="font-bold text-white text-sm truncate">{getTeamName(match.team_b_id)}</h3>
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: getTeamColor(match.team_b_id) }}
                        />
                      </div>
                      <div className="mt-1 text-2xl font-black font-heading text-white">
                        {scoreB?.score_primary ?? 0}
                        {scoreB?.score_secondary ? (
                          <span className="text-sm text-slate-400 font-normal">/{scoreB.score_secondary}</span>
                        ) : null}
                      </div>
                      {scoreB?.overs_or_minutes ? (
                        <p className="text-[10px] text-slate-400 font-mono-code">
                          {tourn?.sport_type === 'CRICKET' ? `(${scoreB.overs_or_minutes} ov)` : `${scoreB.overs_or_minutes}'`}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate">{match.match_summary || 'Match in progress...'}</span>
                    <button
                      onClick={() => onNavigate('scores')}
                      className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-bold border border-emerald-500/30"
                    >
                      Update Score
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Standings + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Dynamic Standings */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="font-heading font-bold text-white text-sm tracking-wide">
                Dynamic League Standings (Computed from Stored Matches)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('leaderboards')}
              className="text-xs text-slate-400 hover:text-emerald-400 font-medium"
            >
              Full Standings →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Team Name</th>
                  <th className="py-2.5 px-2 text-center">P</th>
                  <th className="py-2.5 px-2 text-center">W</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">L</th>
                  <th className="py-2.5 px-2 text-center">Diff</th>
                  <th className="py-2.5 px-3 text-right">Pts</th>
                  <th className="py-2.5 px-3 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {topTeams.map((row, idx) => (
                  <tr key={row.teamId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono-code text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 flex items-center gap-2 text-white">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.logoColor }} />
                      <span className="font-semibold truncate">{row.teamName}</span>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-400">{row.played}</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-semibold">{row.won}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{row.drawn}</td>
                    <td className="py-3 px-2 text-center text-rose-400">{row.lost}</td>
                    <td className="py-3 px-2 text-center font-mono-code text-slate-300">
                      {row.diff > 0 ? `+${row.diff}` : row.diff}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white font-heading text-sm">
                      {row.points}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.slice(-3).map((f, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                              f === 'W'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : f === 'D'
                                ? 'bg-slate-700 text-slate-300'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 col): Recent Audit Activity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-heading font-bold text-white text-sm tracking-wide">
                Relational Audit Stream
              </h3>
            </div>
            <button
              onClick={() => onNavigate('sql-explorer')}
              className="text-xs text-slate-400 hover:text-emerald-400 font-medium"
            >
              SQL Logs →
            </button>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {state.auditLogs.slice(0, 6).map((log) => (
              <div key={log.log_id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[10px] font-bold text-emerald-400 uppercase">
                    {log.action_type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">{log.details}</p>
                <div className="text-[10px] text-slate-400 font-mono-code pt-0.5">
                  Table: <span className="text-slate-400">{log.entity_name}</span> · ID: {log.entity_id || '0'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers Spotlight */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-white text-sm tracking-wide">
              Top Ranked Athletes Across Tournaments
            </h3>
          </div>
          <button
            onClick={() => onNavigate('players')}
            className="text-xs text-slate-400 hover:text-emerald-400 font-medium"
          >
            All 110 Athletes →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {topPlayers.map((player, idx) => (
            <div
              key={player.stat_id}
              className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center justify-center font-mono-code">
                  #{idx + 1}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                  {player.sport}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-xs truncate">{player.name}</h4>
                <p className="text-[10px] text-slate-400">Matches: {player.matches_played}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Score / MVP</span>
                <span className="font-bold text-white font-heading">{player.primary_metric} ({player.mvp_awards} MVP)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
