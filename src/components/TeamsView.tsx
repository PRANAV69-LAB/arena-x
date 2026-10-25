import React, { useState } from 'react';
import { Users, Plus, Shield, User, MapPin, Award, Filter, Trash2, Edit } from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { Team, SportType } from '../types';

export const TeamsView: React.FC = () => {
  const state = dbStore.getState();
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedTeamRoster, setSelectedTeamRoster] = useState<Team | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSport, setFormSport] = useState<SportType>('CRICKET');
  const [formCoach, setFormCoach] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formColor, setFormColor] = useState('#10B981');

  const filteredTeams = state.teams.filter(t => {
    if (selectedSport !== 'ALL' && t.sport_type !== selectedSport) return false;
    return true;
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    dbStore.createTeam({
      team_name: formName,
      sport_type: formSport,
      coach_name: formCoach,
      city: formCity || 'Campus Metro',
      logo_color: formColor,
      captain_id: null
    });

    setShowCreateModal(false);
    setFormName('');
    setFormCoach('');
    setFormCity('');
  };

  const getRosterPlayers = (teamId: number) => {
    const memberIds = state.teamMembers
      .filter(tm => tm.team_id === teamId)
      .map(tm => tm.player_id);
    return state.players.filter(p => memberIds.includes(p.player_id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filter and Create Toolbar */}
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

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map(team => {
          const roster = getRosterPlayers(team.team_id);
          const captain = state.players.find(p => p.player_id === team.captain_id) || roster[0];
          const matchesCount = state.matches.filter(m => m.team_a_id === team.team_id || m.team_b_id === team.team_id).length;
          const winsCount = state.matches.filter(m => m.winner_team_id === team.team_id).length;

          return (
            <div
              key={team.team_id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md"
                      style={{ backgroundColor: team.logo_color }}
                    >
                      {team.team_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base leading-snug">{team.team_name}</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {team.sport_type} · {team.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Team Captain:</span>
                    <span className="font-semibold text-white">
                      {captain ? `${captain.first_name} ${captain.last_name}` : 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Head Coach:</span>
                    <span>{team.coach_name || 'Campus Faculty'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Active Roster:</span>
                    <span className="text-emerald-400 font-bold">{roster.length} Athletes</span>
                  </div>
                </div>

                {/* Match Record Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400">Competition Record</span>
                  <span className="font-mono-code text-[11px] text-white">
                    {matchesCount} Played · <span className="text-emerald-400 font-bold">{winsCount} Wins</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTeamRoster(team)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors text-center"
                >
                  View Roster &amp; Profiles ({roster.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Roster Modal */}
      {selectedTeamRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: selectedTeamRoster.logo_color }}
                >
                  {selectedTeamRoster.team_name.substring(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{selectedTeamRoster.team_name}</h3>
                  <p className="text-xs text-slate-400">Official Roster &amp; Player Eligibility</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeamRoster(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-800/20">
              {getRosterPlayers(selectedTeamRoster.team_id).map((player, idx) => (
                <div key={player.player_id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono-code text-[11px] font-bold flex items-center justify-center">
                      #{player.jersey_number || idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        {player.first_name} {player.last_name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {player.email} · DOB: {player.date_of_birth || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      player.eligibility_status === 'ELIGIBLE'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {player.eligibility_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateTeam}
            className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Register New Squad</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Squad / Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Predators XI"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sport</label>
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
                  <label className="block text-slate-400 font-medium mb-1">Team Color</label>
                  <input
                    type="color"
                    value={formColor}
                    onChange={e => setFormColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Home Campus / City</label>
                <input
                  type="text"
                  placeholder="e.g. Metro City"
                  value={formCity}
                  onChange={e => setFormCity(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Coach Name</label>
                <input
                  type="text"
                  placeholder="e.g. Coach Reynolds"
                  value={formCoach}
                  onChange={e => setFormCoach(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                />
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
                Insert Team into MySQL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
