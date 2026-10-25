import React, { useState } from 'react';
import { Award, Trophy, TrendingUp, Filter, ShieldCheck, Flame, Star } from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { computeLeagueStandings } from '../utils/algorithms';
import { SportType } from '../types';

export const LeaderboardsView: React.FC = () => {
  const state = dbStore.getState();
  const [selectedSport, setSelectedSport] = useState<string>('ALL');

  const allStandings = computeLeagueStandings(state.teams, state.matches, state.matchScores);
  const filteredStandings = allStandings.filter(s => {
    if (selectedSport !== 'ALL' && s.sportType !== selectedSport) return false;
    return true;
  });

  const topScorers = [...state.playerStatistics]
    .sort((a, b) => b.primary_metric - a.primary_metric)
    .slice(0, 6)
    .map(stat => {
      const p = state.players.find(x => x.player_id === stat.player_id);
      const team = state.teams.find(t => {
        const tm = state.teamMembers.find(m => m.player_id === stat.player_id);
        return tm ? tm.team_id === t.team_id : false;
      });
      return {
        ...stat,
        name: p ? `${p.first_name} ${p.last_name}` : `Athlete #${stat.player_id}`,
        sport: p?.primary_sport || 'CRICKET',
        teamName: team?.team_name || 'Free Agent'
      };
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {['ALL', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'BASKETBALL'].map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSport === sport
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono-code flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Calculated from match scores in MySQL</span>
        </div>
      </div>

      {/* Main Points Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-white text-sm">
              Official Championship Standings &amp; Points Table
            </h3>
          </div>
          <span className="text-slate-400 font-mono-code text-[11px]">Tie-breaker: Pts &gt; Diff &gt; Scored &gt; Wins</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] bg-slate-950/40">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Club / Squad</th>
                <th className="py-3 px-3">Discipline</th>
                <th className="py-3 px-3 text-center">Played</th>
                <th className="py-3 px-3 text-center">Won</th>
                <th className="py-3 px-3 text-center">Drawn</th>
                <th className="py-3 px-3 text-center">Lost</th>
                <th className="py-3 px-3 text-center">GF / Scored</th>
                <th className="py-3 px-3 text-center">GA / Against</th>
                <th className="py-3 px-3 text-center">Net Diff</th>
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4 text-center">Recent Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStandings.map((row, idx) => (
                <tr key={row.teamId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono-code">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black'
                          : idx === 1
                          ? 'bg-slate-300/20 text-slate-200'
                          : idx === 2
                          ? 'bg-amber-700/20 text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.logoColor }} />
                      <span className="font-bold text-white text-sm truncate">{row.teamName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{row.sportType}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-300 font-mono-code">{row.played}</td>
                  <td className="py-3.5 px-3 text-center text-emerald-400 font-bold font-mono-code">{row.won}</td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono-code">{row.drawn}</td>
                  <td className="py-3.5 px-3 text-center text-rose-400 font-mono-code">{row.lost}</td>
                  <td className="py-3.5 px-3 text-center text-slate-300 font-mono-code">{row.scoredFor}</td>
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono-code">{row.scoredAgainst}</td>
                  <td className="py-3.5 px-3 text-center font-mono-code font-bold">
                    <span className={row.diff > 0 ? 'text-emerald-400' : row.diff < 0 ? 'text-rose-400' : 'text-slate-400'}>
                      {row.diff > 0 ? `+${row.diff}` : row.diff}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-heading font-black text-base text-white">{row.points}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.length === 0 ? (
                        <span className="text-[10px] text-slate-500 font-mono-code">-</span>
                      ) : (
                        row.form.slice(-4).map((f, i) => (
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
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Scorers Spotlight */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <h3 className="font-heading font-bold text-white text-sm tracking-wide">
            Individual Performance Leaders &amp; MVP Honors
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topScorers.map((scorer, i) => (
            <div
              key={scorer.stat_id}
              className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 text-white font-black font-mono-code flex items-center justify-center text-xs">
                  #{i + 1}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm">{scorer.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {scorer.teamName} · {scorer.sport}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-heading font-black text-amber-400">
                  {scorer.primary_metric}{' '}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {scorer.sport === 'CRICKET' ? 'Runs' : scorer.sport === 'FOOTBALL' ? 'Goals' : 'Pts'}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">{scorer.mvp_awards} MVP Honors</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
