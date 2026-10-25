export type UserRole = 'ADMIN' | 'ORGANIZER' | 'PLAYER';

export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type SportType = 'CRICKET' | 'FOOTBALL' | 'BADMINTON' | 'BASKETBALL';
export type EligibilityStatus = 'ELIGIBLE' | 'SUSPENDED' | 'UNDER_REVIEW';

export interface Player {
  player_id: number;
  user_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  primary_sport: SportType;
  jersey_number?: number;
  eligibility_status: EligibilityStatus;
  created_at: string;
}

export interface Team {
  team_id: number;
  team_name: string;
  sport_type: SportType;
  captain_id?: number | null;
  coach_name?: string;
  city: string;
  logo_color: string;
  created_at: string;
}

export interface TeamMember {
  membership_id: number;
  team_id: number;
  player_id: number;
  role_in_team: string;
  is_active: boolean;
  joined_at: string;
}

export interface Venue {
  venue_id: number;
  venue_name: string;
  address: string;
  city: string;
  capacity: number;
  surface_type: string;
  created_at: string;
}

export type TournamentFormat = 'KNOCKOUT' | 'ROUND_ROBIN' | 'LEAGUE';
export type TournamentStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Tournament {
  tournament_id: number;
  name: string;
  sport_type: SportType;
  format: TournamentFormat;
  start_date: string;
  end_date: string;
  venue_id?: number | null;
  max_teams: number;
  status: TournamentStatus;
  organizer_id: number;
  rules_notes?: string;
  created_at: string;
}

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Registration {
  registration_id: number;
  tournament_id: number;
  team_id: number;
  registration_date: string;
  status: RegistrationStatus;
  seed_number?: number;
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED';

export interface Match {
  match_id: number;
  tournament_id: number;
  round_number: number;
  match_number: number;
  team_a_id: number;
  team_b_id: number | null; // null indicates BYE
  venue_id?: number | null;
  scheduled_time: string;
  status: MatchStatus;
  winner_team_id?: number | null;
  is_draw: boolean;
  match_summary?: string;
  created_at: string;
}

export interface MatchScore {
  score_id: number;
  match_id: number;
  team_id: number;
  period_or_inning: number;
  score_primary: number; // Runs, Goals, Sets, Points
  score_secondary: number; // Wickets, Fouls, Extras
  overs_or_minutes: number;
  extra_details?: Record<string, any>;
  updated_at: string;
}

export interface PlayerStatistic {
  stat_id: number;
  player_id: number;
  tournament_id: number;
  matches_played: number;
  primary_metric: number; // Runs / Goals / Points
  secondary_metric: number; // Wickets / Assists / Rebounds
  mvp_awards: number;
  rating_score: number;
  updated_at: string;
}

export interface AuditLog {
  log_id: number;
  user_id: number | null;
  action_type: string;
  entity_name: string;
  entity_id: number | null;
  details: string;
  ip_address: string;
  created_at: string;
}

// SQL Visualizer & Optimization Types
export interface SqlPipelineStep {
  stepNumber: number;
  phaseName: string;
  clause: string;
  technicalExplanation: string;
  visualHighlight: string;
  sampleInputRows: number;
  sampleOutputRows: number;
}

export interface ExplainPlanRow {
  id: number;
  select_type: string;
  table: string;
  partitions: string | null;
  type: 'ALL' | 'ref' | 'eq_ref' | 'range' | 'index' | 'const';
  possible_keys: string | null;
  key: string | null;
  key_len: string | null;
  ref: string | null;
  rows: number;
  filtered: number;
  Extra: string;
}
