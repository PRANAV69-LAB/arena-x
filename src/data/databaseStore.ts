import {
  User, Player, Team, TeamMember, Venue, Tournament,
  Registration, Match, MatchScore, PlayerStatistic, AuditLog, UserRole, SportType
} from '../types';
import {
  INITIAL_USERS, INITIAL_VENUES, INITIAL_TEAMS, INITIAL_PLAYERS,
  INITIAL_TEAM_MEMBERS, INITIAL_TOURNAMENTS, INITIAL_REGISTRATIONS,
  INITIAL_MATCHES, INITIAL_MATCH_SCORES, INITIAL_PLAYER_STATS, INITIAL_AUDIT_LOGS
} from './seedData';
import { generateKnockoutFixtures, generateRoundRobinFixtures } from '../utils/algorithms';

export interface DatabaseState {
  users: User[];
  players: Player[];
  teams: Team[];
  teamMembers: TeamMember[];
  venues: Venue[];
  tournaments: Tournament[];
  registrations: Registration[];
  matches: Match[];
  matchScores: MatchScore[];
  playerStatistics: PlayerStatistic[];
  auditLogs: AuditLog[];
  currentUser: User;
  dataMode: 'DEMO' | 'LOCAL' | 'API';
  apiConfig: {
    apiKey: string;
    endpoint: string;
    lastUpdated: string | null;
    isRefreshing: boolean;
  };
  sqlReadOnly: boolean;
}

const STORAGE_KEY = 'arena_x_database_v1';

export class DatabaseStore {
  private state: DatabaseState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): DatabaseState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved database state; resetting to seed.', e);
      }
    }
    return this.getFreshSeedState();
  }

  private getFreshSeedState(): DatabaseState {
    return {
      users: [...INITIAL_USERS],
      venues: [...INITIAL_VENUES],
      teams: [...INITIAL_TEAMS],
      players: [...INITIAL_PLAYERS],
      teamMembers: [...INITIAL_TEAM_MEMBERS],
      tournaments: [...INITIAL_TOURNAMENTS],
      registrations: [...INITIAL_REGISTRATIONS],
      matches: [...INITIAL_MATCHES],
      matchScores: [...INITIAL_MATCH_SCORES],
      playerStatistics: [...INITIAL_PLAYER_STATS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      currentUser: INITIAL_USERS[0], // Dr. Marcus Vance (ADMIN)
      dataMode: 'DEMO',
      apiConfig: {
        apiKey: 'demo_key_college_2026',
        endpoint: 'https://api.sportsdata.io/v3/college/scores/json',
        lastUpdated: new Date().toISOString(),
        isRefreshing: false
      },
      sqlReadOnly: false
    };
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private persistAndNotify() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.listeners.forEach(fn => fn());
  }

  // Role switching
  public switchRole(role: UserRole) {
    const targetUser = this.state.users.find(u => u.role === role) || this.state.users[0];
    this.state.currentUser = targetUser;
    this.logAudit('USER_ROLE_SWITCH', 'users', targetUser.user_id, `Switched current session user to ${targetUser.full_name} [${role}]`);
    this.persistAndNotify();
  }

  public setDataMode(mode: 'DEMO' | 'LOCAL' | 'API') {
    this.state.dataMode = mode;
    this.logAudit('DATA_MODE_CHANGE', 'DATABASE', 0, `Switched active data mode to: ${mode} MODE`);
    this.persistAndNotify();
  }

  public setSqlReadOnly(readOnly: boolean) {
    this.state.sqlReadOnly = readOnly;
    this.persistAndNotify();
  }

  public resetDatabase() {
    this.state = this.getFreshSeedState();
    this.logAudit('DATABASE_RESET', 'DATABASE', 0, 'Database reset to factory clean seed dataset.');
    this.persistAndNotify();
  }

  public logAudit(action: string, entity: string, entityId: number | null, details: string) {
    const newLog: AuditLog = {
      log_id: Date.now(),
      user_id: this.state.currentUser.user_id,
      action_type: action,
      entity_name: entity,
      entity_id: entityId,
      details,
      ip_address: '127.0.0.1 (Web Preview)',
      created_at: new Date().toISOString()
    };
    this.state.auditLogs.unshift(newLog);
    if (this.state.auditLogs.length > 50) this.state.auditLogs.pop();
  }

  // --- TOURNAMENT OPERATIONS ---
  public createTournament(t: Omit<Tournament, 'tournament_id' | 'created_at' | 'organizer_id'>) {
    const newId = Math.max(0, ...this.state.tournaments.map(x => x.tournament_id)) + 1;
    const newTournament: Tournament = {
      ...t,
      tournament_id: newId,
      organizer_id: this.state.currentUser.user_id,
      created_at: new Date().toISOString()
    };
    this.state.tournaments.push(newTournament);
    this.logAudit('TOURNAMENT_CREATE', 'tournaments', newId, `Created tournament: ${newTournament.name} (${newTournament.format})`);
    this.persistAndNotify();
    return newTournament;
  }

  public updateTournamentStatus(tournamentId: number, status: Tournament['status']) {
    const t = this.state.tournaments.find(x => x.tournament_id === tournamentId);
    if (t) {
      t.status = status;
      this.logAudit('TOURNAMENT_STATUS_UPDATE', 'tournaments', tournamentId, `Updated status to ${status}`);
      this.persistAndNotify();
    }
  }

  public deleteTournament(tournamentId: number) {
    this.state.tournaments = this.state.tournaments.filter(x => x.tournament_id !== tournamentId);
    this.state.registrations = this.state.registrations.filter(x => x.tournament_id !== tournamentId);
    this.state.matches = this.state.matches.filter(x => x.tournament_id !== tournamentId);
    this.logAudit('TOURNAMENT_DELETE', 'tournaments', tournamentId, `Deleted tournament ID ${tournamentId}`);
    this.persistAndNotify();
  }

  // --- REGISTRATIONS ---
  public approveRegistration(regId: number) {
    const r = this.state.registrations.find(x => x.registration_id === regId);
    if (r) {
      r.status = 'APPROVED';
      this.logAudit('REGISTRATION_APPROVE', 'registrations', regId, `Approved team registration ${regId}`);
      this.persistAndNotify();
    }
  }

  public rejectRegistration(regId: number) {
    const r = this.state.registrations.find(x => x.registration_id === regId);
    if (r) {
      r.status = 'REJECTED';
      this.logAudit('REGISTRATION_REJECT', 'registrations', regId, `Rejected team registration ${regId}`);
      this.persistAndNotify();
    }
  }

  public registerTeamForTournament(tournamentId: number, teamId: number) {
    const existing = this.state.registrations.find(r => r.tournament_id === tournamentId && r.team_id === teamId);
    if (existing) throw new Error('Team is already registered for this tournament.');

    const newId = Math.max(0, ...this.state.registrations.map(r => r.registration_id)) + 1;
    this.state.registrations.push({
      registration_id: newId,
      tournament_id: tournamentId,
      team_id: teamId,
      status: 'APPROVED',
      seed_number: this.state.registrations.filter(r => r.tournament_id === tournamentId).length + 1,
      registration_date: new Date().toISOString()
    });
    this.logAudit('REGISTRATION_CREATE', 'registrations', newId, `Registered team ${teamId} for tournament ${tournamentId}`);
    this.persistAndNotify();
  }

  // --- AUTOMATED FIXTURE GENERATION ---
  public generateFixturesForTournament(tournamentId: number) {
    const tourn = this.state.tournaments.find(t => t.tournament_id === tournamentId);
    if (!tourn) throw new Error('Tournament not found.');

    const approvedTeams = this.state.registrations
      .filter(r => r.tournament_id === tournamentId && r.status === 'APPROVED')
      .map(r => r.team_id);

    if (approvedTeams.length < 2) {
      throw new Error('Tournament must have at least 2 approved teams to generate fixtures.');
    }

    // Remove existing matches for this tournament
    this.state.matches = this.state.matches.filter(m => m.tournament_id !== tournamentId);

    let matchPairs: { roundNumber: number; matchNumber: number; teamAId: number; teamBId: number | null }[] = [];

    if (tourn.format === 'KNOCKOUT') {
      matchPairs = generateKnockoutFixtures(approvedTeams);
    } else {
      matchPairs = generateRoundRobinFixtures(approvedTeams);
    }

    let nextMatchId = Math.max(0, ...this.state.matches.map(m => m.match_id)) + 1;
    const now = new Date();

    matchPairs.forEach((pair, idx) => {
      const matchDate = new Date(now.getTime() + (idx + 1) * 24 * 60 * 60 * 1000);
      const isBye = pair.teamBId === null;
      this.state.matches.push({
        match_id: nextMatchId++,
        tournament_id: tournamentId,
        round_number: pair.roundNumber,
        match_number: pair.matchNumber,
        team_a_id: pair.teamAId,
        team_b_id: pair.teamBId,
        venue_id: tourn.venue_id || 1,
        scheduled_time: matchDate.toISOString(),
        status: isBye ? 'COMPLETED' : 'SCHEDULED',
        winner_team_id: isBye ? pair.teamAId : null,
        is_draw: false,
        match_summary: isBye ? `Team advanced directly via BYE seed.` : undefined,
        created_at: new Date().toISOString()
      });
    });

    tourn.status = 'ONGOING';
    this.logAudit('FIXTURE_GENERATE', 'matches', tournamentId, `Algorithm generated ${matchPairs.length} fixtures for tournament '${tourn.name}' (${tourn.format})`);
    this.persistAndNotify();
  }

  // --- MATCH & LIVE SCORE OPERATIONS ---
  public updateScore(
    matchId: number,
    teamAId: number,
    teamBId: number,
    scoreA: number,
    scoreB: number,
    isLive: boolean,
    oversA?: number,
    wicketsA?: number,
    oversB?: number,
    wicketsB?: number
  ) {
    const match = this.state.matches.find(m => m.match_id === matchId);
    if (!match) throw new Error('Match not found.');

    // Upsert Team A score
    let sA = this.state.matchScores.find(s => s.match_id === matchId && s.team_id === teamAId);
    if (!sA) {
      const nextId = Math.max(0, ...this.state.matchScores.map(s => s.score_id)) + 1;
      sA = {
        score_id: nextId,
        match_id: matchId,
        team_id: teamAId,
        period_or_inning: 1,
        score_primary: scoreA,
        score_secondary: wicketsA ?? 0,
        overs_or_minutes: oversA ?? 0,
        updated_at: new Date().toISOString()
      };
      this.state.matchScores.push(sA);
    } else {
      sA.score_primary = scoreA;
      if (wicketsA !== undefined) sA.score_secondary = wicketsA;
      if (oversA !== undefined) sA.overs_or_minutes = oversA;
      sA.updated_at = new Date().toISOString();
    }

    // Upsert Team B score
    let sB = this.state.matchScores.find(s => s.match_id === matchId && s.team_id === teamBId);
    if (!sB) {
      const nextId = Math.max(0, ...this.state.matchScores.map(s => s.score_id)) + 1;
      sB = {
        score_id: nextId,
        match_id: matchId,
        team_id: teamBId,
        period_or_inning: 1,
        score_primary: scoreB,
        score_secondary: wicketsB ?? 0,
        overs_or_minutes: oversB ?? 0,
        updated_at: new Date().toISOString()
      };
      this.state.matchScores.push(sB);
    } else {
      sB.score_primary = scoreB;
      if (wicketsB !== undefined) sB.score_secondary = wicketsB;
      if (oversB !== undefined) sB.overs_or_minutes = oversB;
      sB.updated_at = new Date().toISOString();
    }

    if (isLive) {
      match.status = 'LIVE';
      match.match_summary = `Live Match Ongoing — Score: ${scoreA} - ${scoreB}`;
    } else {
      match.status = 'COMPLETED';
      if (scoreA > scoreB) {
        match.winner_team_id = teamAId;
        match.is_draw = false;
        match.match_summary = `Final: Team won with score ${scoreA} to ${scoreB}`;
      } else if (scoreB > scoreA) {
        match.winner_team_id = teamBId;
        match.is_draw = false;
        match.match_summary = `Final: Team won with score ${scoreB} to ${scoreA}`;
      } else {
        match.winner_team_id = null;
        match.is_draw = true;
        match.match_summary = `Final: Match ended in a draw (${scoreA} - ${scoreB})`;
      }
    }

    this.logAudit('SCORE_UPDATE', 'matches', matchId, `Score updated: Team ${teamAId} (${scoreA}) vs Team ${teamBId} (${scoreB}) [Status: ${match.status}]`);
    this.persistAndNotify();
  }

  // --- ACID TRANSACTION DEMONSTRATOR ---
  public executeAcidTransaction(params: {
    matchId: number;
    teamAId: number;
    teamBId: number;
    scoreA: number;
    scoreB: number;
    simulateFailure: boolean;
  }): { success: boolean; steps: string[]; error?: string } {
    const steps: string[] = [];
    steps.push('1. BEGIN TRANSACTION; -- Connection autoCommit = false');

    if (params.simulateFailure) {
      steps.push('2. INSERT INTO match_scores ... executed');
      steps.push('3. ERROR: Foreign Key Constraint Violation (Simulated Server / Network Dropout)');
      steps.push('4. ROLLBACK; -- Reverting all intermediate table alterations to preserve ACID consistency');
      this.logAudit('TRANSACTION_ROLLBACK', 'matches', params.matchId, 'Simulated ACID rollback executed safely.');
      this.persistAndNotify();
      return {
        success: false,
        steps,
        error: 'Transaction rolled back safely: Constraint violation detected. Database state preserved in pristine consistency.'
      };
    }

    // Actual atomic commit
    this.updateScore(params.matchId, params.teamAId, params.teamBId, params.scoreA, params.scoreB, false);
    steps.push('2. INSERT INTO match_scores (match_id, team_id, score_primary) VALUES (?, ?, ?); -- Updated Team A score');
    steps.push('3. INSERT INTO match_scores (match_id, team_id, score_primary) VALUES (?, ?, ?); -- Updated Team B score');
    steps.push('4. UPDATE matches SET status = "COMPLETED", winner_team_id = ? WHERE match_id = ?;');
    steps.push('5. INSERT INTO audit_logs (action_type, details) VALUES ("TRANSACTION_COMMIT", ...);');
    steps.push('6. COMMIT; -- All changes permanently persisted to InnoDB storage');

    this.logAudit('TRANSACTION_COMMIT', 'matches', params.matchId, `ACID transaction finalized successfully for match #${params.matchId}`);
    this.persistAndNotify();

    return { success: true, steps };
  }

  // --- PLAYER & TEAM OPERATIONS ---
  public createPlayer(p: Omit<Player, 'player_id' | 'created_at'>) {
    const newId = Math.max(0, ...this.state.players.map(x => x.player_id)) + 1;
    const newPlayer: Player = {
      ...p,
      player_id: newId,
      created_at: new Date().toISOString()
    };
    this.state.players.push(newPlayer);
    this.logAudit('PLAYER_CREATE', 'players', newId, `Registered player: ${newPlayer.first_name} ${newPlayer.last_name} (${newPlayer.primary_sport})`);
    this.persistAndNotify();
    return newPlayer;
  }

  public createTeam(t: Omit<Team, 'team_id' | 'created_at'>) {
    const newId = Math.max(0, ...this.state.teams.map(x => x.team_id)) + 1;
    const newTeam: Team = {
      ...t,
      team_id: newId,
      created_at: new Date().toISOString()
    };
    this.state.teams.push(newTeam);
    this.logAudit('TEAM_CREATE', 'teams', newId, `Created team: ${newTeam.team_name} [${newTeam.sport_type}]`);
    this.persistAndNotify();
    return newTeam;
  }

  // --- DYNAMIC SQL PLAYGROUND EXECUTOR ---
  public executeSql(sql: string): { columns: string[]; rows: any[][]; executionTimeMs: number; affectedRows?: number; error?: string } {
    const startTime = performance.now();
    const clean = sql.trim();
    const upper = clean.toUpperCase();

    // Check read only mode
    if (this.state.sqlReadOnly && (upper.startsWith('INSERT') || upper.startsWith('UPDATE') || upper.startsWith('DELETE') || upper.startsWith('DROP'))) {
      return {
        columns: [],
        rows: [],
        executionTimeMs: 0.1,
        error: 'SQL Execution Denied: Read-Only Mode is currently active in Settings. Disable read-only mode to run data manipulation statements.'
      };
    }

    try {
      // 1. SELECT queries
      if (upper.startsWith('SELECT')) {
        let resultCols: string[] = [];
        let resultRows: any[][] = [];

        if (upper.includes('FROM TEAMS') && upper.includes('JOIN MATCHES')) {
          resultCols = ['team_name', 'sport_type', 'city', 'matches_played'];
          resultRows = this.state.teams.slice(0, 10).map(t => {
            const count = this.state.matches.filter(m => m.team_a_id === t.team_id || m.team_b_id === t.team_id).length;
            return [t.team_name, t.sport_type, t.city, count];
          });
        } else if (upper.includes('FROM PLAYERS') && (upper.includes('WHERE ELIGIBILITY') || upper.includes('CRICKET'))) {
          resultCols = ['player_id', 'full_name', 'primary_sport', 'jersey_number', 'eligibility_status'];
          resultRows = this.state.players
            .filter(p => p.primary_sport === 'CRICKET')
            .slice(0, 10)
            .map(p => [p.player_id, `${p.first_name} ${p.last_name}`, p.primary_sport, p.jersey_number || '-', p.eligibility_status]);
        } else if (upper.includes('FROM TOURNAMENTS')) {
          resultCols = ['tournament_id', 'name', 'sport_type', 'format', 'status', 'max_teams'];
          resultRows = this.state.tournaments.map(t => [t.tournament_id, t.name, t.sport_type, t.format, t.status, t.max_teams]);
        } else if (upper.includes('FROM MATCHES') || upper.includes('FROM MATCH_SCORES')) {
          resultCols = ['match_id', 'round', 'status', 'summary'];
          resultRows = this.state.matches.slice(0, 10).map(m => [m.match_id, `Round ${m.round_number}`, m.status, m.match_summary || 'Pending']);
        } else if (upper.includes('FROM AUDIT_LOGS')) {
          resultCols = ['log_id', 'action_type', 'entity_name', 'details', 'created_at'];
          resultRows = this.state.auditLogs.slice(0, 10).map(a => [a.log_id, a.action_type, a.entity_name, a.details, a.created_at]);
        } else {
          // Default: Teams
          resultCols = ['team_id', 'team_name', 'sport_type', 'city', 'coach_name'];
          resultRows = this.state.teams.slice(0, 8).map(t => [t.team_id, t.team_name, t.sport_type, t.city, t.coach_name || 'N/A']);
        }

        const endTime = performance.now();
        return {
          columns: resultCols,
          rows: resultRows,
          executionTimeMs: parseFloat((endTime - startTime + 1.25).toFixed(2)),
          affectedRows: resultRows.length
        };
      }

      // 2. INSERT Demo
      if (upper.startsWith('INSERT INTO PLAYERS')) {
        const dummyPlayer = this.createPlayer({
          user_id: null,
          first_name: 'SQL',
          last_name: 'DemoAthlete',
          email: `sql.athlete.${Date.now()}@campus.edu`,
          primary_sport: 'CRICKET',
          jersey_number: 99,
          eligibility_status: 'ELIGIBLE'
        });
        const endTime = performance.now();
        return {
          columns: ['status', 'inserted_player_id'],
          rows: [['Row inserted successfully into players relation', dummyPlayer.player_id]],
          executionTimeMs: parseFloat((endTime - startTime + 2.1).toFixed(2)),
          affectedRows: 1
        };
      }

      // 3. UPDATE Demo
      if (upper.startsWith('UPDATE')) {
        this.logAudit('SQL_UPDATE', 'MANUAL_SQL', 0, `Manual SQL UPDATE executed: ${clean.substring(0, 80)}`);
        this.persistAndNotify();
        const endTime = performance.now();
        return {
          columns: ['status', 'message'],
          rows: [['SUCCESS', 'Query OK, 1 row affected (Rows matched: 1, Changed: 1)']],
          executionTimeMs: parseFloat((endTime - startTime + 1.8).toFixed(2)),
          affectedRows: 1
        };
      }

      // 4. DELETE Demo
      if (upper.startsWith('DELETE')) {
        this.logAudit('SQL_DELETE', 'MANUAL_SQL', 0, `Manual SQL DELETE executed: ${clean.substring(0, 80)}`);
        this.persistAndNotify();
        const endTime = performance.now();
        return {
          columns: ['status', 'message'],
          rows: [['SUCCESS', 'Query OK, 1 row affected']],
          executionTimeMs: parseFloat((endTime - startTime + 1.5).toFixed(2)),
          affectedRows: 1
        };
      }

      return {
        columns: ['status'],
        rows: [['Query executed successfully on MySQL InnoDB storage engine']],
        executionTimeMs: 1.5,
        affectedRows: 1
      };
    } catch (err: any) {
      return {
        columns: [],
        rows: [],
        executionTimeMs: 0.8,
        error: `MySQL Syntax / Execution Error: ${err.message || 'Unknown error'}`
      };
    }
  }
}

export const dbStore = new DatabaseStore();
