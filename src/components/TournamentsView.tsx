import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Calendar,
  MapPin,
  Users,
  Play,
  CheckCircle,
  XCircle,
  Filter,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { dbStore } from '../data/databaseStore';
import { Tournament, SportType, TournamentFormat, TournamentStatus } from '../types';

interface TournamentsViewProps {
  onOpenFixtures: (tournamentId: number) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({ onOpenFixtures }) => {
  const state = dbStore.getState();
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [activeTournamentId, setActiveTournamentId] = useState<number | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSport, setFormSport] = useState<SportType>('CRICKET');
  const [formFormat, setFormFormat] = useState<TournamentFormat>('KNOCKOUT');
  const [formStartDate, setFormStartDate] = useState('2026-11-01');
  const [formEndDate, setFormEndDate] = useState('2026-11-20');
  const [formVenueId, setFormVenueId] = useState<number>(1);
  const [formMaxTeams, setFormMaxTeams] = useState<number>(8);
  const [formRules, setFormRules] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const filteredTournaments = state.tournaments.filter(t => {
    if (selectedSport !== 'ALL' && t.sport_type !== selectedSport) return false;
    return true;
  });

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMessage('Tournament title is required.');
      return;
    }
    if (new Date(formStartDate) > new Date(formEndDate)) {
      setErrorMessage('End date must be after start date.');
      return;
    }

    try {
      dbStore.createTournament({
        name: formName,
        sport_type: formSport,
        format: formFormat,
        start_date: formStartDate,
        end_date: formEndDate,
        venue_id: formVenueId,
        max_teams: formMaxTeams,
        status: 'UPCOMING',
        rules_notes: formRules
      });
      setShowCreateModal(false);
      setFormName('');
      setFormRules('');
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create tournament.');
    }
  };

  const handleGenerateFixtures = (tournamentId: number) => {
    try {
      dbStore.generateFixturesForTournament(tournamentId);
      onOpenFixtures(tournamentId);
    } catch (err: any) {
      alert(`Fixture Generation Error: ${err.message}`);
    }
  };

  const activeTourn = state.tournaments.find(t => t.tournament_id === activeTournamentId);
  const activeRegistrations = state.registrations.filter(r => r.tournament_id === activeTournamentId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Actions Bar */}
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
          <span>Create Tournament</span>
        </button>
      </div>

      {/* Tournament Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTournaments.map(t => {
          const venue = state.venues.find(v => v.venue_id === t.venue_id);
          const regs = state.registrations.filter(r => r.tournament_id === t.tournament_id);
          const approvedCount = regs.filter(r => r.status === 'APPROVED').length;
          const matchCount = state.matches.filter(m => m.tournament_id === t.tournament_id).length;

          return (
            <div
              key={t.tournament_id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {t.sport_type} · {t.format}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'ONGOING'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : t.status === 'COMPLETED'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors">
                  {t.name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t.start_date} to {t.end_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{venue?.venue_name || 'Campus Grounds'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {approvedCount} / {t.max_teams} Teams Enrolled ({matchCount} Fixtures)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveTournamentId(t.tournament_id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Manage Roster ({regs.length})
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleGenerateFixtures(t.tournament_id)}
                    title="Generate automated fixtures using Knockout/Round Robin algorithm"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Fixtures</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete tournament "${t.name}" and associated matches?`)) {
                        dbStore.deleteTournament(t.tournament_id);
                      }
                    }}
                    title="Delete tournament"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roster & Registrations Drawer/Modal */}
      {activeTourn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-heading">{activeTourn.name}</h3>
                <p className="text-xs text-slate-400">Team Registrations &amp; Seed Approval Workflow</p>
              </div>
              <button
                onClick={() => setActiveTournamentId(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Squads ({activeRegistrations.length})
              </h4>

              {activeRegistrations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-xl">
                  No teams currently registered for this tournament.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-800/20 overflow-hidden">
                  {activeRegistrations.map((reg) => {
                    const team = state.teams.find(tm => tm.team_id === reg.team_id);
                    return (
                      <div key={reg.registration_id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: team?.logo_color || '#10B981' }}
                          />
                          <div>
                            <div className="font-bold text-white">{team?.team_name || `Team #${reg.team_id}`}</div>
                            <div className="text-[10px] text-slate-400">
                              City: {team?.city} · Coach: {team?.coach_name || 'None'} · Seed #{reg.seed_number || '-'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              reg.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : reg.status === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {reg.status}
                          </span>

                          {reg.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => dbStore.approveRegistration(reg.registration_id)}
                                className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                title="Approve Registration"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => dbStore.rejectRegistration(reg.registration_id)}
                                className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                                title="Reject Registration"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Register an Existing Team */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Need to register more teams?</span>
              <button
                onClick={() => {
                  const unreg = state.teams.find(
                    t => t.sport_type === activeTourn.sport_type && !activeRegistrations.some(r => r.team_id === t.team_id)
                  );
                  if (unreg) {
                    dbStore.registerTeamForTournament(activeTourn.tournament_id, unreg.team_id);
                  } else {
                    alert('All eligible squads of this sport are already registered.');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                + Register Next Available Squad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateTournament}
            className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Create New Tournament</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Varsity Cup 2026"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sport Type</label>
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
                  <label className="block text-slate-400 font-medium mb-1">Tournament Format</label>
                  <select
                    value={formFormat}
                    onChange={e => setFormFormat(e.target.value as TournamentFormat)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  >
                    <option value="KNOCKOUT">Knockout (Single Elimination)</option>
                    <option value="ROUND_ROBIN">Round Robin</option>
                    <option value="LEAGUE">League Table</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Host Venue</label>
                  <select
                    value={formVenueId}
                    onChange={e => setFormVenueId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  >
                    {state.venues.map(v => (
                      <option key={v.venue_id} value={v.venue_id}>
                        {v.venue_name} ({v.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Team Capacity</label>
                  <input
                    type="number"
                    min={2}
                    max={32}
                    value={formMaxTeams}
                    onChange={e => setFormMaxTeams(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Rules &amp; Bylaws</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Standard FIBA/ICC rules, tiebreaker criteria"
                  value={formRules}
                  onChange={e => setFormRules(e.target.value)}
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
                Save Tournament to MySQL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
