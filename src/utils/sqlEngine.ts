import { SqlPipelineStep, ExplainPlanRow } from '../types';

export interface DatabaseSchemaTable {
  tableName: string;
  category: 'Core' | 'Competition' | 'Performance' | 'Security';
  description: string;
  primaryKey: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    nullable: boolean;
    description: string;
  }[];
}

export const ARENA_X_SCHEMA: DatabaseSchemaTable[] = [
  {
    tableName: 'users',
    category: 'Core',
    description: 'System user accounts, credentials with BCrypt hashes, and role-based permissions.',
    primaryKey: 'user_id',
    columns: [
      { name: 'user_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Surrogate primary key' },
      { name: 'username', type: 'VARCHAR(50)', nullable: false, description: 'Unique login credential' },
      { name: 'email', type: 'VARCHAR(100)', nullable: false, description: 'Unique user email address' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'BCrypt 60-character salt-hashed password' },
      { name: 'full_name', type: 'VARCHAR(100)', nullable: false, description: 'Display name of user' },
      { name: 'role', type: 'ENUM (ADMIN, ORGANIZER, PLAYER)', nullable: false, description: 'Role-based access control level' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Account status flag' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Record creation timestamp' }
    ]
  },
  {
    tableName: 'players',
    category: 'Core',
    description: 'Individual athlete biometric data, eligibility status, and sport disciplines.',
    primaryKey: 'player_id',
    columns: [
      { name: 'player_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique athlete identifier' },
      { name: 'user_id', type: 'INT', isForeign: true, references: 'users(user_id)', nullable: true, description: 'Optional linked login user' },
      { name: 'first_name', type: 'VARCHAR(50)', nullable: false, description: 'First name' },
      { name: 'last_name', type: 'VARCHAR(50)', nullable: false, description: 'Last name' },
      { name: 'email', type: 'VARCHAR(100)', nullable: false, description: 'Player contact email' },
      { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Emergency contact phone' },
      { name: 'date_of_birth', type: 'DATE', nullable: true, description: 'Birth date for age brackets' },
      { name: 'primary_sport', type: 'ENUM (CRICKET, FOOTBALL, BADMINTON, BASKETBALL)', nullable: false, description: 'Athletic category' },
      { name: 'jersey_number', type: 'INT', nullable: true, description: 'Uniform kit number' },
      { name: 'eligibility_status', type: 'ENUM (ELIGIBLE, SUSPENDED, UNDER_REVIEW)', nullable: false, description: 'Anti-doping and academic eligibility' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Athlete registration date' }
    ]
  },
  {
    tableName: 'teams',
    category: 'Core',
    description: 'Sports teams, clubs, and franchises with captains and management.',
    primaryKey: 'team_id',
    columns: [
      { name: 'team_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique team identifier' },
      { name: 'team_name', type: 'VARCHAR(100)', nullable: false, description: 'Unique club or squad title' },
      { name: 'sport_type', type: 'ENUM (CRICKET, FOOTBALL, BADMINTON, BASKETBALL)', nullable: false, description: 'Sport discipline' },
      { name: 'captain_id', type: 'INT', isForeign: true, references: 'players(player_id)', nullable: true, description: 'Team captain athlete ID' },
      { name: 'coach_name', type: 'VARCHAR(100)', nullable: true, description: 'Head tactician / coach' },
      { name: 'city', type: 'VARCHAR(80)', nullable: false, description: 'Home campus or city' },
      { name: 'logo_color', type: 'VARCHAR(10)', nullable: true, description: 'Hex branding color' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Club founding timestamp' }
    ]
  },
  {
    tableName: 'team_members',
    category: 'Core',
    description: 'Relational junction mapping players to teams with squad roles and active status.',
    primaryKey: 'membership_id',
    columns: [
      { name: 'membership_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Junction primary key' },
      { name: 'team_id', type: 'INT', isForeign: true, references: 'teams(team_id)', nullable: false, description: 'Parent team reference' },
      { name: 'player_id', type: 'INT', isForeign: true, references: 'players(player_id)', nullable: false, description: 'Roster player reference' },
      { name: 'role_in_team', type: 'VARCHAR(50)', nullable: false, description: 'Squad position or duty' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Roster active state' },
      { name: 'joined_at', type: 'TIMESTAMP', nullable: false, description: 'Contract / joining date' }
    ]
  },
  {
    tableName: 'venues',
    category: 'Competition',
    description: 'Physical stadiums, arenas, courts, pitches, and seating capacities.',
    primaryKey: 'venue_id',
    columns: [
      { name: 'venue_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique venue identifier' },
      { name: 'venue_name', type: 'VARCHAR(100)', nullable: false, description: 'Stadium or facility name' },
      { name: 'address', type: 'VARCHAR(200)', nullable: false, description: 'Street address' },
      { name: 'city', type: 'VARCHAR(80)', nullable: false, description: 'Host municipality' },
      { name: 'capacity', type: 'INT', nullable: false, description: 'Maximum spectator capacity' },
      { name: 'surface_type', type: 'VARCHAR(50)', nullable: false, description: 'Field surface specification' }
    ]
  },
  {
    tableName: 'tournaments',
    category: 'Competition',
    description: 'Primary tournament competitions, formats (Knockout, Round Robin, League), and schedules.',
    primaryKey: 'tournament_id',
    columns: [
      { name: 'tournament_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique tournament identifier' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Official competition title' },
      { name: 'sport_type', type: 'ENUM (CRICKET, FOOTBALL, BADMINTON, BASKETBALL)', nullable: false, description: 'Sport classification' },
      { name: 'format', type: 'ENUM (KNOCKOUT, ROUND_ROBIN, LEAGUE)', nullable: false, description: 'Tournament bracket algorithm' },
      { name: 'start_date', type: 'DATE', nullable: false, description: 'Opening match date' },
      { name: 'end_date', type: 'DATE', nullable: false, description: 'Closing finals date' },
      { name: 'venue_id', type: 'INT', isForeign: true, references: 'venues(venue_id)', nullable: true, description: 'Main host venue' },
      { name: 'max_teams', type: 'INT', nullable: false, description: 'Maximum team capacity cap' },
      { name: 'status', type: 'ENUM (UPCOMING, ONGOING, COMPLETED, CANCELLED)', nullable: false, description: 'Current tournament lifecycle state' },
      { name: 'organizer_id', type: 'INT', isForeign: true, references: 'users(user_id)', nullable: false, description: 'Organizer user reference' },
      { name: 'rules_notes', type: 'TEXT', nullable: true, description: 'Custom rule bylaws and tiebreakers' }
    ]
  },
  {
    tableName: 'registrations',
    category: 'Competition',
    description: 'Team applications to tournaments with approval workflow and seeding.',
    primaryKey: 'registration_id',
    columns: [
      { name: 'registration_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Entry ticket ID' },
      { name: 'tournament_id', type: 'INT', isForeign: true, references: 'tournaments(tournament_id)', nullable: false, description: 'Target tournament' },
      { name: 'team_id', type: 'INT', isForeign: true, references: 'teams(team_id)', nullable: false, description: 'Enrolling team' },
      { name: 'status', type: 'ENUM (PENDING, APPROVED, REJECTED)', nullable: false, description: 'Approval state' },
      { name: 'seed_number', type: 'INT', nullable: true, description: 'Tournament bracket seed' }
    ]
  },
  {
    tableName: 'matches',
    category: 'Competition',
    description: 'Tournament fixtures, scheduled rounds, team pairings, winners, and draws.',
    primaryKey: 'match_id',
    columns: [
      { name: 'match_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique match fixture ID' },
      { name: 'tournament_id', type: 'INT', isForeign: true, references: 'tournaments(tournament_id)', nullable: false, description: 'Parent tournament' },
      { name: 'round_number', type: 'INT', nullable: false, description: 'Round phase number' },
      { name: 'match_number', type: 'INT', nullable: false, description: 'Sequential match index' },
      { name: 'team_a_id', type: 'INT', isForeign: true, references: 'teams(team_id)', nullable: false, description: 'Home or first seeded team' },
      { name: 'team_b_id', type: 'INT', isForeign: true, references: 'teams(team_id)', nullable: true, description: 'Away team (NULL for BYE)' },
      { name: 'venue_id', type: 'INT', isForeign: true, references: 'venues(venue_id)', nullable: true, description: 'Match pitch or arena' },
      { name: 'scheduled_time', type: 'DATETIME', nullable: false, description: 'Kickoff / match start time' },
      { name: 'status', type: 'ENUM (SCHEDULED, LIVE, COMPLETED, POSTPONED, CANCELLED)', nullable: false, description: 'Match status' },
      { name: 'winner_team_id', type: 'INT', isForeign: true, references: 'teams(team_id)', nullable: true, description: 'Victorious team ID' },
      { name: 'is_draw', type: 'BOOLEAN', nullable: false, description: 'True if tie/draw' },
      { name: 'match_summary', type: 'VARCHAR(255)', nullable: true, description: 'Outcome textual summary' }
    ]
  },
  {
    tableName: 'match_scores',
    category: 'Performance',
    description: 'Granular sport-specific scores (cricket runs/overs, football goals, badminton sets, basketball quarters).',
    primaryKey: 'score_id',
    columns: [
      { name: 'score_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique score record ID' },
      { name: 'match_id', type: 'INT', isForeign: true, references: 'matches(match_id)', nullable: false, description: 'Linked match' },
      { name: 'team_id', type: 'INT', isForeign: true, references: 'teams(team_id)', nullable: false, description: 'Scoring team' },
      { name: 'period_or_inning', type: 'INT', nullable: false, description: 'Innings, Half, Set, or Quarter index' },
      { name: 'score_primary', type: 'INT', nullable: false, description: 'Runs, Goals, Sets, or Points' },
      { name: 'score_secondary', type: 'INT', nullable: true, description: 'Wickets, Cards, or Fouls' },
      { name: 'overs_or_minutes', type: 'DECIMAL(5,2)', nullable: true, description: 'Overs or match elapsed minutes' },
      { name: 'extra_details', type: 'JSON', nullable: true, description: 'Run rates, shooting stats, or penalties' }
    ]
  },
  {
    tableName: 'player_statistics',
    category: 'Performance',
    description: 'Aggregated athlete performance rankings, tournament goals/runs, and MVP tallies.',
    primaryKey: 'stat_id',
    columns: [
      { name: 'stat_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Unique stat identifier' },
      { name: 'player_id', type: 'INT', isForeign: true, references: 'players(player_id)', nullable: false, description: 'Athlete profile' },
      { name: 'tournament_id', type: 'INT', isForeign: true, references: 'tournaments(tournament_id)', nullable: false, description: 'Tournament scope' },
      { name: 'matches_played', type: 'INT', nullable: false, description: 'Appearance count' },
      { name: 'primary_metric', type: 'INT', nullable: false, description: 'Total Runs, Goals, or Points' },
      { name: 'secondary_metric', type: 'INT', nullable: false, description: 'Total Wickets, Assists, or Rebounds' },
      { name: 'mvp_awards', type: 'INT', nullable: false, description: 'Player of the Match awards' },
      { name: 'rating_score', type: 'DECIMAL(4,2)', nullable: false, description: 'Calculated performance index out of 10' }
    ]
  },
  {
    tableName: 'audit_logs',
    category: 'Security',
    description: 'Immutable system audit trail logging transaction commits, score adjustments, and user actions.',
    primaryKey: 'log_id',
    columns: [
      { name: 'log_id', type: 'INT (AUTO_INCREMENT)', isPrimary: true, nullable: false, description: 'Log sequence ID' },
      { name: 'user_id', type: 'INT', isForeign: true, references: 'users(user_id)', nullable: true, description: 'User responsible' },
      { name: 'action_type', type: 'VARCHAR(50)', nullable: false, description: 'Action classification' },
      { name: 'entity_name', type: 'VARCHAR(50)', nullable: false, description: 'Target table name' },
      { name: 'entity_id', type: 'INT', nullable: true, description: 'Modified entity primary key' },
      { name: 'details', type: 'TEXT', nullable: false, description: 'Audit payload description' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false, description: 'Client network address' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Event timestamp' }
    ]
  }
];

/**
 * Analyzes query for Visual Learning Mode: Decomposes into standard SQL logical processing steps
 */
export function analyzeSqlPipeline(sql: string): SqlPipelineStep[] {
  const steps: SqlPipelineStep[] = [];
  const clean = sql.replace(/\s+/g, ' ').trim();
  let step = 1;

  // 1. FROM & JOIN
  const fromMatch = clean.match(/FROM\s+([a-zA-Z0-9_]+)(\s+(?:INNER|LEFT|RIGHT|FULL)?\s*JOIN\s+([a-zA-Z0-9_]+)\s+ON\s+([^WHERE|GROUP|ORDER|LIMIT;]+))?/i);
  if (fromMatch) {
    const base = fromMatch[1];
    const join = fromMatch[2];
    if (join) {
      steps.push({
        stepNumber: step++,
        phaseName: '1. FROM & RELATIONAL JOIN',
        clause: `FROM ${base} ${join.trim()}`,
        technicalExplanation: `Locates source relation '${base}' in the InnoDB buffer pool. Executes relational join against '${fromMatch[3]}' matching on foreign key condition.`,
        visualHighlight: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
        sampleInputRows: 22,
        sampleOutputRows: 34
      });
    } else {
      steps.push({
        stepNumber: step++,
        phaseName: '1. FROM (Relation Scan)',
        clause: `FROM ${base}`,
        technicalExplanation: `Retrieves base tuples from table '${base}' through clustered primary index B+ tree.`,
        visualHighlight: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
        sampleInputRows: 22,
        sampleOutputRows: 22
      });
    }
  }

  // 2. WHERE
  const whereMatch = clean.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|;|$)/i);
  if (whereMatch) {
    steps.push({
      stepNumber: step++,
      phaseName: '2. WHERE (Tuple Predicate Filter)',
      clause: `WHERE ${whereMatch[1].trim()}`,
      technicalExplanation: `Evaluates boolean filter per tuple. Only tuples matching the condition pass through to subsequent aggregation stages.`,
      visualHighlight: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
      sampleInputRows: 34,
      sampleOutputRows: 12
    });
  }

  // 3. GROUP BY
  const groupMatch = clean.match(/GROUP BY\s+(.+?)(?:HAVING|ORDER BY|LIMIT|;|$)/i);
  if (groupMatch) {
    steps.push({
      stepNumber: step++,
      phaseName: '3. GROUP BY (Bucket Aggregation)',
      clause: `GROUP BY ${groupMatch[1].trim()}`,
      technicalExplanation: `Groups input tuples into distinct buckets based on key columns: ${groupMatch[1].trim()}. Sets up aggregate calculations (COUNT, SUM, AVG).`,
      visualHighlight: 'bg-purple-950/40 border-purple-500/40 text-purple-300',
      sampleInputRows: 12,
      sampleOutputRows: 6
    });
  }

  // 4. SELECT
  const selectMatch = clean.match(/SELECT\s+(.+?)\s+FROM/i);
  if (selectMatch) {
    steps.push({
      stepNumber: step++,
      phaseName: '4. SELECT (Projection & Expressions)',
      clause: `SELECT ${selectMatch[1].trim()}`,
      technicalExplanation: `Projects specified attributes and computes mathematical expressions/aggregations for the output stream.`,
      visualHighlight: 'bg-blue-950/40 border-blue-500/40 text-blue-300',
      sampleInputRows: 6,
      sampleOutputRows: 6
    });
  }

  // 5. ORDER BY
  const orderMatch = clean.match(/ORDER BY\s+(.+?)(?:LIMIT|;|$)/i);
  if (orderMatch) {
    steps.push({
      stepNumber: step++,
      phaseName: '5. ORDER BY (Result Set Sorting)',
      clause: `ORDER BY ${orderMatch[1].trim()}`,
      technicalExplanation: `Performs in-memory filesort or index traversal to order output records according to sort keys.`,
      visualHighlight: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300',
      sampleInputRows: 6,
      sampleOutputRows: 6
    });
  }

  // 6. LIMIT
  const limitMatch = clean.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    steps.push({
      stepNumber: step++,
      phaseName: '6. LIMIT (Result Pagination)',
      clause: `LIMIT ${limitMatch[1]}`,
      technicalExplanation: `Windows the final output stream, discarding records past offset + count.`,
      visualHighlight: 'bg-rose-950/40 border-rose-500/40 text-rose-300',
      sampleInputRows: 6,
      sampleOutputRows: parseInt(limitMatch[1], 10)
    });
  }

  return steps;
}

/**
 * Simulates MySQL EXPLAIN Query Plan for SQL playground
 */
export function generateExplainPlan(sql: string): ExplainPlanRow[] {
  const clean = sql.toUpperCase();
  const rows: ExplainPlanRow[] = [];

  if (clean.includes('JOIN')) {
    rows.push({
      id: 1,
      select_type: 'SIMPLE',
      table: 't (teams)',
      partitions: null,
      type: 'ALL',
      possible_keys: 'PRIMARY,idx_team_sport',
      key: 'PRIMARY',
      key_len: '4',
      ref: null,
      rows: 22,
      filtered: 100.0,
      Extra: 'Using index condition; Using temporary'
    });
    rows.push({
      id: 1,
      select_type: 'SIMPLE',
      table: 'm (matches)',
      partitions: null,
      type: 'ref',
      possible_keys: 'fk_match_team_a,fk_match_team_b',
      key: 'fk_match_team_a',
      key_len: '4',
      ref: 'arena_x_db.t.team_id',
      rows: 4,
      filtered: 75.0,
      Extra: 'Using where'
    });
  } else if (clean.includes('WHERE')) {
    rows.push({
      id: 1,
      select_type: 'SIMPLE',
      table: 'matches',
      partitions: null,
      type: 'range',
      possible_keys: 'idx_match_status',
      key: 'idx_match_status',
      key_len: '1',
      ref: null,
      rows: 14,
      filtered: 80.0,
      Extra: 'Using index condition; Using where'
    });
  } else {
    rows.push({
      id: 1,
      select_type: 'SIMPLE',
      table: 'teams',
      partitions: null,
      type: 'ALL',
      possible_keys: null,
      key: null,
      key_len: null,
      ref: null,
      rows: 22,
      filtered: 100.0,
      Extra: ''
    });
  }

  return rows;
}
