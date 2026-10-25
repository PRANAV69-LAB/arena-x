import React from 'react';
import { BarChart3, TrendingUp, PieChart, Award, Activity, ShieldCheck } from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { computeLeagueStandings } from '../utils/algorithms';

export const AnalyticsView: React.FC = () => {
  const state = dbStore.getState();

  const standings = computeLeagueStandings(state.teams, state.matches, state.matchScores);
  const topTeams = standings.slice(0, 8);

  // Outcome breakdown
  const completedMatches = state.matches.filter(m => m.status === 'COMPLETED');
  const homeWins = completedMatches.filter(m => m.winner_team_id === m.team_a_id).length;
  const awayWins = completedMatches.filter(m => m.winner_team_id === m.team_b_id).length;
  const draws = completedMatches.filter(m => m.is_draw).length;
  const totalCompleted = completedMatches.length || 1;

  // Max score for SVG scale
  const maxPoints = Math.max(...topTeams.map(t => t.points), 10);

  // Sport distribution
  const sportsCount: Record<string, number> = { CRICKET: 0, FOOTBALL: 0, BADMINTON: 0, BASKETBALL: 0 };
  state.tournaments.forEach(t => {
    sportsCount[t.sport_type] = (sportsCount[t.sport_type] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Total Matches Evaluated</div>
          <div className="text-2xl font-heading font-black text-white mt-1">{completedMatches.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1">100% In Database</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Home Pitch Advantage</div>
          <div className="text-2xl font-heading font-black text-emerald-400 mt-1">
            {Math.round((homeWins / totalCompleted) * 100)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{homeWins} Home Victories</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Away Pitch Wins</div>
          <div className="text-2xl font-heading font-black text-cyan-400 mt-1">
            {Math.round((awayWins / totalCompleted) * 100)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{awayWins} Away Upsets</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Draw / Tie Frequency</div>
          <div className="text-2xl font-heading font-black text-amber-400 mt-1">
            {Math.round((draws / totalCompleted) * 100)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{draws} Equalized Matches</div>
        </div>
      </div>

      {/* Analytics Chart 1: Team Points & Win Comparison */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                Team Championship Points Comparison
              </h3>
              <p className="text-xs text-slate-400">Dynamically compiled from stored tournament matches</p>
            </div>
          </div>
          <span className="text-xs font-mono-code text-slate-400">JavaFX BarChart Equivalent</span>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="space-y-3 pt-2">
          {topTeams.map((team) => {
            const widthPct = Math.max(5, (team.points / maxPoints) * 100);
            return (
              <div key={team.teamId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.logoColor }} />
                    <span className="font-semibold text-slate-200">{team.teamName}</span>
                    <span className="text-[10px] text-slate-400">({team.sportType})</span>
                  </div>
                  <div className="font-mono-code font-bold text-white">
                    {team.points} Pts <span className="text-slate-400 font-normal">({team.won}W / {team.played}P)</span>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: team.logoColor || '#10B981'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Win Rates + Sport Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Win Percentage Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-white text-sm">Win Percentage Efficiency</h3>
          </div>

          <div className="space-y-3">
            {topTeams.slice(0, 5).map(team => {
              const winRate = team.played > 0 ? Math.round((team.won / team.played) * 100) : 0;
              return (
                <div key={team.teamId} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: team.logoColor }} />
                    <div>
                      <div className="font-bold text-white">{team.teamName}</div>
                      <div className="text-[10px] text-slate-400">
                        {team.won} wins out of {team.played} games
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-black text-sm text-emerald-400">{winRate}%</span>
                    <div className="text-[10px] text-slate-400">Win Rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcome Breakdown Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-white text-sm">Tournament Outcome Distribution</h3>
          </div>

          <div className="space-y-4 pt-2">
            {/* Visual Segment Bar */}
            <div className="w-full h-5 rounded-xl bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${(homeWins / totalCompleted) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`Home Wins: ${homeWins}`}
              />
              <div
                style={{ width: `${(awayWins / totalCompleted) * 100}%` }}
                className="bg-cyan-500 h-full"
                title={`Away Wins: ${awayWins}`}
              />
              <div
                style={{ width: `${(draws / totalCompleted) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Draws: ${draws}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mb-1" />
                <div className="font-bold text-white">{homeWins}</div>
                <div className="text-[10px] text-slate-400">Home Wins</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block mb-1" />
                <div className="font-bold text-white">{awayWins}</div>
                <div className="text-[10px] text-slate-400">Away Wins</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mb-1" />
                <div className="font-bold text-white">{draws}</div>
                <div className="text-[10px] text-slate-400">Draws</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 text-[11px] text-slate-400">
              Database Verification: All metrics update automatically as live scores are recorded in the Live Scores module.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
