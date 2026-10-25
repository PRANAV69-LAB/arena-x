import React, { useState } from 'react';
import {
  Activity,
  CheckCircle,
  Radio,
  Clock,
  Trophy,
  AlertCircle,
  Shield,
  Save,
  RotateCcw
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { Match, MatchScore, SportType } from '../types';

interface LiveScoresViewProps {
  initialMatchId?: number | null;
}

export const LiveScoresView: React.FC<LiveScoresViewProps> = ({ initialMatchId }) => {
  const state = dbStore.getState();
  const eligibleMatches = state.matches.filter(m => m.team_b_id !== null);

  const [selectedMatchId, setSelectedMatchId] = useState<number>(
    initialMatchId || (eligibleMatches.find(m => m.status === 'LIVE')?.match_id ?? eligibleMatches[0]?.match_id ?? 1)
  );

  const match = state.matches.find(m => m.match_id === selectedMatchId);
  const tourn = state.tournaments.find(t => t.tournament_id === match?.tournament_id);
  const teamA = state.teams.find(t => t.team_id === match?.team_a_id);
  const teamB = state.teams.find(t => t.team_id === match?.team_b_id);

  const scoreA = state.matchScores.find(s => s.match_id === selectedMatchId && s.team_id === match?.team_a_id);
  const scoreB = state.matchScores.find(s => s.match_id === selectedMatchId && s.team_id === match?.team_b_id);

  // Controlled form values
  const [valScoreA, setValScoreA] = useState<number>(scoreA?.score_primary ?? 0);
  const [valScoreB, setValScoreB] = useState<number>(scoreB?.score_primary ?? 0);
  const [valSecA, setValSecA] = useState<number>(scoreA?.score_secondary ?? 0); // wickets / cards / fouls
  const [valSecB, setValSecB] = useState<number>(scoreB?.score_secondary ?? 0);
  const [valOversA, setValOversA] = useState<number>(scoreA?.overs_or_minutes ?? 0);
  const [valOversB, setValOversB] = useState<number>(scoreB?.overs_or_minutes ?? 0);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state when match changes
  React.useEffect(() => {
    if (match) {
      const sA = state.matchScores.find(s => s.match_id === match.match_id && s.team_id === match.team_a_id);
      const sB = state.matchScores.find(s => s.match_id === match.match_id && s.team_id === match.team_b_id);
      setValScoreA(sA?.score_primary ?? 0);
      setValScoreB(sB?.score_primary ?? 0);
      setValSecA(sA?.score_secondary ?? 0);
      setValSecB(sB?.score_secondary ?? 0);
      setValOversA(sA?.overs_or_minutes ?? 0);
      setValOversB(sB?.overs_or_minutes ?? 0);
      setSuccessMsg('');
    }
  }, [selectedMatchId, state.matchScores, state.matches]);

  if (!match || !teamA || !teamB) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
        No matches available for scoring.
      </div>
    );
  }

  const sport: SportType = tourn?.sport_type || 'FOOTBALL';

  const handleUpdate = (isLive: boolean) => {
    if (!match.team_b_id) return;

    dbStore.updateScore(
      match.match_id,
      match.team_a_id,
      match.team_b_id,
      valScoreA,
      valScoreB,
      isLive,
      valOversA,
      valSecA,
      valOversB,
      valSecB
    );

    setSuccessMsg(
      isLive
        ? `Match marked LIVE! Real-time score recorded in MySQL.`
        : `Match finalized as COMPLETED! Standings and winner updated atomically.`
    );
  };

  // Run rate calculation for cricket
  const runRateA = valOversA > 0 ? (valScoreA / valOversA).toFixed(2) : '0.00';
  const runRateB = valOversB > 0 ? (valScoreB / valOversB).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 pb-12">
      {/* Target Match Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-400 font-semibold">Select Match to Score:</span>
          <select
            value={selectedMatchId}
            onChange={e => setSelectedMatchId(Number(e.target.value))}
            aria-label="Select Target Match"
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-emerald-500 cursor-pointer"
          >
            {eligibleMatches.map(m => {
              const tA = state.teams.find(t => t.team_id === m.team_a_id);
              const tB = state.teams.find(t => t.team_id === m.team_b_id);
              return (
                <option key={m.match_id} value={m.match_id}>
                  Match #{m.match_number}: {tA?.team_name} vs {tB?.team_name} [{m.status}]
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              match.status === 'LIVE'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : match.status === 'COMPLETED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {match.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            {match.status}
          </span>
          <span className="text-xs text-slate-400 font-mono-code">{sport} Discipline</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Scoring Arena Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B1120] via-slate-900 to-[#0B1120] border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center pb-4 border-b border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono-code">
            {tourn?.name} · Round {match.round_number}
          </span>
          <h2 className="text-xl font-heading font-black text-white mt-1">Official Match Scorecard</h2>
        </div>

        {/* Head-to-Head Scoring Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Team A */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: teamA.logo_color }} />
              <div>
                <h3 className="font-heading font-black text-white text-lg">{teamA.team_name}</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{teamA.city} · (Home)</p>
              </div>
            </div>

            {/* Sport Specific Inputs */}
            {sport === 'CRICKET' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Runs Scored</label>
                    <input
                      type="number"
                      min={0}
                      value={valScoreA}
                      onChange={e => setValScoreA(Number(e.target.value))}
                      className="w-full text-center text-3xl font-heading font-black p-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Wickets Lost</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={valSecA}
                      onChange={e => setValSecA(Number(e.target.value))}
                      className="w-full text-center text-3xl font-heading font-black p-2 rounded-xl bg-slate-900 border border-slate-700 text-rose-400 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Overs Bowled</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={50}
                    value={valOversA}
                    onChange={e => setValOversA(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-code text-xs text-center"
                  />
                </div>

                <div className="p-2 rounded-lg bg-slate-900 text-center text-xs text-slate-400 font-mono-code">
                  Current Run Rate: <span className="text-emerald-400 font-bold">{runRateA}</span> RPO
                </div>
              </div>
            ) : sport === 'FOOTBALL' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Goals Scored</label>
                  <input
                    type="number"
                    min={0}
                    value={valScoreA}
                    onChange={e => setValScoreA(Number(e.target.value))}
                    className="w-full text-center text-4xl font-heading font-black p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Yellow Cards</label>
                  <input
                    type="number"
                    min={0}
                    value={valSecA}
                    onChange={e => setValSecA(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 text-xs text-center"
                  />
                </div>
              </div>
            ) : sport === 'BADMINTON' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Sets Won</label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={valScoreA}
                    onChange={e => setValScoreA(Number(e.target.value))}
                    className="w-full text-center text-4xl font-heading font-black p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Current Game Points</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={valSecA}
                    onChange={e => setValSecA(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 text-xs text-center font-mono-code"
                  />
                </div>
              </div>
            ) : (
              /* BASKETBALL */
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Total Points</label>
                  <input
                    type="number"
                    min={0}
                    value={valScoreA}
                    onChange={e => setValScoreA(Number(e.target.value))}
                    className="w-full text-center text-4xl font-heading font-black p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Team Personal Fouls</label>
                  <input
                    type="number"
                    min={0}
                    value={valSecA}
                    onChange={e => setValSecA(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 text-xs text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: teamB.logo_color }} />
              <div>
                <h3 className="font-heading font-black text-white text-lg">{teamB.team_name}</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{teamB.city} · (Away)</p>
              </div>
            </div>

            {/* Sport Specific Inputs for Team B */}
            {sport === 'CRICKET' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Runs Scored</label>
                    <input
                      type="number"
                      min={0}
                      value={valScoreB}
                      onChange={e => setValScoreB(Number(e.target.value))}
                      className="w-full text-center text-3xl font-heading font-black p-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Wickets Lost</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={valSecB}
                      onChange={e => setValSecB(Number(e.target.value))}
                      className="w-full text-center text-3xl font-heading font-black p-2 rounded-xl bg-slate-900 border border-slate-700 text-rose-400 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Overs Bowled</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={50}
                    value={valOversB}
                    onChange={e => setValOversB(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-code text-xs text-center"
                  />
                </div>

                <div className="p-2 rounded-lg bg-slate-900 text-center text-xs text-slate-400 font-mono-code">
                  Current Run Rate: <span className="text-emerald-400 font-bold">{runRateB}</span> RPO
                </div>
              </div>
            ) : sport === 'FOOTBALL' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Goals Scored</label>
                  <input
                    type="number"
                    min={0}
                    value={valScoreB}
                    onChange={e => setValScoreB(Number(e.target.value))}
                    className="w-full text-center text-4xl font-heading font-black p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Yellow Cards</label>
                  <input
                    type="number"
                    min={0}
                    value={valSecB}
                    onChange={e => setValSecB(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 text-xs text-center"
                  />
                </div>
              </div>
            ) : sport === 'BADMINTON' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Sets Won</label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={valScoreB}
                    onChange={e => setValScoreB(Number(e.target.value))}
                    className="w-full text-center text-4xl font-heading font-black p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Current Game Points</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={valSecB}
                    onChange={e => setValSecB(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 text-xs text-center font-mono-code"
                  />
                </div>
              </div>
            ) : (
              /* BASKETBALL */
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Total Points</label>
                  <input
                    type="number"
                    min={0}
                    value={valScoreB}
                    onChange={e => setValScoreB(Number(e.target.value))}
                    className="w-full text-center text-4xl font-heading font-black p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Team Personal Fouls</label>
                  <input
                    type="number"
                    min={0}
                    value={valSecB}
                    onChange={e => setValSecB(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 text-xs text-center"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Scores execute via JDBC PreparedStatement and update audit logs automatically.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleUpdate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
            >
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Broadcast Live Score</span>
            </button>

            <button
              onClick={() => handleUpdate(false)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Finalize &amp; Conclude Match</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
