import React, { useState } from 'react';
import { UserCheck, Plus, Search, Filter, ShieldCheck, AlertTriangle, XCircle, Award } from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { Player, SportType, EligibilityStatus } from '../types';

export const PlayersView: React.FC = () => {
  const state = dbStore.getState();
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSport, setFormSport] = useState<SportType>('CRICKET');
  const [formJersey, setFormJersey] = useState<number>(10);
  const [formDob, setFormDob] = useState('2003-05-15');
  const [formStatus, setFormStatus] = useState<EligibilityStatus>('ELIGIBLE');

  const filteredPlayers = state.players.filter(p => {
    const full = `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase();
    if (searchTerm && !full.includes(searchTerm.toLowerCase())) return false;
    if (sportFilter !== 'ALL' && p.primary_sport !== sportFilter) return false;
    if (eligibilityFilter !== 'ALL' && p.eligibility_status !== eligibilityFilter) return false;
    return true;
  });

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName.trim() || !formLastName.trim() || !formEmail.trim()) return;

    dbStore.createPlayer({
      user_id: null,
      first_name: formFirstName,
      last_name: formLastName,
      email: formEmail,
      date_of_birth: formDob,
      primary_sport: formSport,
      jersey_number: formJersey,
      eligibility_status: formStatus
    });

    setShowCreateModal(false);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
  };

  const getPlayerTeam = (playerId: number) => {
    const tm = state.teamMembers.find(m => m.player_id === playerId);
    if (!tm) return null;
    return state.teams.find(t => t.team_id === tm.team_id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by athlete name or campus email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-emerald-500"
            />
          </div>

          {/* Sport Filter */}
          <select
            value={sportFilter}
            onChange={e => setSportFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Disciplines</option>
            <option value="CRICKET">Cricket</option>
            <option value="FOOTBALL">Football</option>
            <option value="BADMINTON">Badminton</option>
            <option value="BASKETBALL">Basketball</option>
          </select>

          {/* Eligibility Filter */}
          <select
            value={eligibilityFilter}
            onChange={e => setEligibilityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ELIGIBLE">Eligible Only</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Athlete</span>
        </button>
      </div>

      {/* Athletes Table View */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Showing {filteredPlayers.length} of {state.players.length} Athletes
          </span>
          <span className="text-slate-400 font-mono-code text-[11px]">Relational Table: `players`</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] bg-slate-950/40">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Current Team Affiliation</th>
                <th className="py-3 px-3 text-center">Kit #</th>
                <th className="py-3 px-4 text-center">Eligibility</th>
                <th className="py-3 px-4 text-right">Rating Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredPlayers.slice(0, 30).map((player) => {
                const team = getPlayerTeam(player.player_id);
                const stat = state.playerStatistics.find(s => s.player_id === player.player_id);

                return (
                  <tr key={player.player_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono-code">{player.player_id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {player.first_name} {player.last_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-code">{player.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {player.primary_sport}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {team ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.logo_color }} />
                          <span className="text-slate-200 font-medium truncate">{team.team_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Free Agent</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono-code font-bold text-white">
                      {player.jersey_number || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          player.eligibility_status === 'ELIGIBLE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : player.eligibility_status === 'SUSPENDED'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {player.eligibility_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {stat ? (
                        <span className="font-heading font-black text-sm text-amber-400">
                          {stat.rating_score} <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-mono-code">7.50 Base</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length > 30 && (
          <div className="p-3 bg-slate-950/40 text-center text-[11px] text-slate-400 border-t border-slate-800">
            Showing first 30 athletes out of {filteredPlayers.length}. Refine search above or view full database in SQL Explorer.
          </div>
        )}
      </div>

      {/* Create Player Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreatePlayer}
            className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Register New Athlete</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={formFirstName}
                    onChange={e => setFormFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={formLastName}
                    onChange={e => setFormLastName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Student / Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. liam.vance@campus.edu"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sport Discipline</label>
                  <select
                    value={formSport}
                    onChange={e => setFormSport(e.target.value as SportType)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  >
                    <option value="CRICKET">Cricket</option>
                    <option value="FOOTBALL">Football</option>
                    <option value="BADMINTON">Badminton</option>
                    <option value="BASKETBALL">Basketball</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Jersey Number</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formJersey}
                    onChange={e => setFormJersey(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={formDob}
                    onChange={e => setFormDob(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Eligibility Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as EligibilityStatus)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  >
                    <option value="ELIGIBLE">Eligible</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Insert Player Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
