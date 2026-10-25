import {
  User, Player, Team, TeamMember, Venue, Tournament,
  Registration, Match, MatchScore, PlayerStatistic, AuditLog, SportType
} from '../types';

export const INITIAL_USERS: User[] = [
  { user_id: 1, username: 'superadmin', email: 'admin@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Dr. Marcus Vance', role: 'ADMIN', is_active: true, created_at: '2026-09-01T08:00:00Z' },
  { user_id: 2, username: 'prof_sharma', email: 'sharma@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Prof. Rajesh Sharma', role: 'ADMIN', is_active: true, created_at: '2026-09-01T09:00:00Z' },
  { user_id: 3, username: 'coach_carter', email: 'carter@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Ken Carter', role: 'ORGANIZER', is_active: true, created_at: '2026-09-02T10:00:00Z' },
  { user_id: 4, username: 'organizer_priya', email: 'priya@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Priya Patel', role: 'ORGANIZER', is_active: true, created_at: '2026-09-02T11:00:00Z' },
  { user_id: 5, username: 'official_davis', email: 'davis@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Sarah Davis', role: 'ORGANIZER', is_active: true, created_at: '2026-09-03T12:00:00Z' },
  { user_id: 6, username: 'player_rohit', email: 'rohit@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Rohit Sen', role: 'PLAYER', is_active: true, created_at: '2026-09-05T14:00:00Z' },
  { user_id: 7, username: 'player_alex', email: 'alex@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Alex Mercer', role: 'PLAYER', is_active: true, created_at: '2026-09-05T14:30:00Z' },
  { user_id: 8, username: 'player_clara', email: 'clara@arenax.edu', password_hash: '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', full_name: 'Clara Zhang', role: 'PLAYER', is_active: true, created_at: '2026-09-05T15:00:00Z' }
];

export const INITIAL_VENUES: Venue[] = [
  { venue_id: 1, venue_name: 'Apex Arena Main Stadium', address: '101 Varsity Boulevard', city: 'Metro City', capacity: 15000, surface_type: 'Natural Turf / LED Pitch', created_at: '2026-09-01T08:00:00Z' },
  { venue_id: 2, venue_name: 'Titan Sports Complex Pitch 1', address: '45 Campus Way', city: 'Metro City', capacity: 8000, surface_type: 'Hybrid Grass Turf', created_at: '2026-09-01T08:00:00Z' },
  { venue_id: 3, venue_name: 'Olympic Indoor Fieldhouse', address: '12 Olympic Drive', city: 'Northwood', capacity: 4500, surface_type: 'Maple Hardwood', created_at: '2026-09-01T08:00:00Z' },
  { venue_id: 4, venue_name: 'Pinnacle Badminton Pavilion', address: '88 Court St', city: 'Northwood', capacity: 2000, surface_type: 'BWF Synthetic Mat', created_at: '2026-09-01T08:00:00Z' },
  { venue_id: 5, venue_name: 'CyberDome Basketball Arena', address: '300 Tech Park Ave', city: 'Silicon Hub', capacity: 6500, surface_type: 'Cushioned Hardwood', created_at: '2026-09-01T08:00:00Z' }
];

export const INITIAL_TEAMS: Team[] = [
  // Cricket Teams
  { team_id: 1, team_name: 'Cyber Vipers CC', sport_type: 'CRICKET', captain_id: 1, coach_name: 'Arun Lal', city: 'Metro City', logo_color: '#10B981', created_at: '2026-09-01T09:00:00Z' },
  { team_id: 2, team_name: 'Quantum Strikers', sport_type: 'CRICKET', captain_id: 6, coach_name: 'Ravi Shastri', city: 'Silicon Hub', logo_color: '#3B82F6', created_at: '2026-09-01T09:00:00Z' },
  { team_id: 3, team_name: 'Falcon Thunderbolts', sport_type: 'CRICKET', captain_id: 11, coach_name: 'Gary Kirsten', city: 'Northwood', logo_color: '#F59E0B', created_at: '2026-09-01T09:00:00Z' },
  { team_id: 4, team_name: 'Phoenix Blasters', sport_type: 'CRICKET', captain_id: 16, coach_name: 'Tom Moody', city: 'Lakeview', logo_color: '#EF4444', created_at: '2026-09-01T09:00:00Z' },
  { team_id: 5, team_name: 'Shadow Wolves XI', sport_type: 'CRICKET', captain_id: 21, coach_name: 'Stephen Fleming', city: 'Metro City', logo_color: '#8B5CF6', created_at: '2026-09-01T09:00:00Z' },
  { team_id: 6, team_name: 'Apex Titans Cricket', sport_type: 'CRICKET', captain_id: 26, coach_name: 'Trevor Bayliss', city: 'East Valley', logo_color: '#06B6D4', created_at: '2026-09-01T09:00:00Z' },

  // Football Teams
  { team_id: 7, team_name: 'Metro United FC', sport_type: 'FOOTBALL', captain_id: 31, coach_name: 'Carlo Ancelotti', city: 'Metro City', logo_color: '#10B981', created_at: '2026-09-01T10:00:00Z' },
  { team_id: 8, team_name: 'Red Dragons Athletic', sport_type: 'FOOTBALL', captain_id: 36, coach_name: 'Jurgen Klopp', city: 'Northwood', logo_color: '#EF4444', created_at: '2026-09-01T10:00:00Z' },
  { team_id: 9, team_name: 'Silicon Strikers SC', sport_type: 'FOOTBALL', captain_id: 41, coach_name: 'Pep Guardiola', city: 'Silicon Hub', logo_color: '#3B82F6', created_at: '2026-09-01T10:00:00Z' },
  { team_id: 10, team_name: 'Golden Eagles FC', sport_type: 'FOOTBALL', captain_id: 46, coach_name: 'Zinedine Zidane', city: 'East Valley', logo_color: '#F59E0B', created_at: '2026-09-01T10:00:00Z' },
  { team_id: 11, team_name: 'Vanguard City FC', sport_type: 'FOOTBALL', captain_id: 51, coach_name: 'Mikel Arteta', city: 'Lakeview', logo_color: '#EC4899', created_at: '2026-09-01T10:00:00Z' },
  { team_id: 12, team_name: 'Northwood Rangers', sport_type: 'FOOTBALL', captain_id: 56, coach_name: 'Jose Mourinho', city: 'Northwood', logo_color: '#6366F1', created_at: '2026-09-01T10:00:00Z' },

  // Basketball Teams
  { team_id: 13, team_name: 'Apex Ballers', sport_type: 'BASKETBALL', captain_id: 61, coach_name: 'Steve Kerr', city: 'Metro City', logo_color: '#10B981', created_at: '2026-09-01T11:00:00Z' },
  { team_id: 14, team_name: 'Neon Knights', sport_type: 'BASKETBALL', captain_id: 66, coach_name: 'Erik Spoelstra', city: 'Silicon Hub', logo_color: '#8B5CF6', created_at: '2026-09-01T11:00:00Z' },
  { team_id: 15, team_name: 'Ironclad Hoops', sport_type: 'BASKETBALL', captain_id: 71, coach_name: 'Gregg Popovich', city: 'East Valley', logo_color: '#F59E0B', created_at: '2026-09-01T11:00:00Z' },
  { team_id: 16, team_name: 'Skyline Dunks', sport_type: 'BASKETBALL', captain_id: 76, coach_name: 'Phil Jackson', city: 'Lakeview', logo_color: '#06B6D4', created_at: '2026-09-01T11:00:00Z' },
  { team_id: 17, team_name: 'Crimson Storm', sport_type: 'BASKETBALL', captain_id: 81, coach_name: 'Doc Rivers', city: 'Northwood', logo_color: '#EF4444', created_at: '2026-09-01T11:00:00Z' },

  // Badminton Squads
  { team_id: 18, team_name: 'Pinnacle Smashers', sport_type: 'BADMINTON', captain_id: 86, coach_name: 'Pullela Gopichand', city: 'Northwood', logo_color: '#10B981', created_at: '2026-09-01T12:00:00Z' },
  { team_id: 19, team_name: 'Vortex Shuttle Club', sport_type: 'BADMINTON', captain_id: 91, coach_name: 'Rexy Mainaky', city: 'Metro City', logo_color: '#3B82F6', created_at: '2026-09-01T12:00:00Z' },
  { team_id: 20, team_name: 'Aero Dynamos', sport_type: 'BADMINTON', captain_id: 96, coach_name: 'Morten Frost', city: 'Silicon Hub', logo_color: '#F59E0B', created_at: '2026-09-01T12:00:00Z' },
  { team_id: 21, team_name: 'Zenith Badminton AC', sport_type: 'BADMINTON', captain_id: 101, coach_name: 'Park Joo-bong', city: 'East Valley', logo_color: '#EC4899', created_at: '2026-09-01T12:00:00Z' },
  { team_id: 22, team_name: 'Silver Feathers', sport_type: 'BADMINTON', captain_id: 106, coach_name: 'Li Yongbo', city: 'Lakeview', logo_color: '#8B5CF6', created_at: '2026-09-01T12:00:00Z' }
];

// Helper to generate 110 realistic athletes
export function generatePlayersList(): Player[] {
  const sports: { type: SportType; count: number; prefix: string; startId: number }[] = [
    { type: 'CRICKET', count: 30, prefix: 'Cricket', startId: 1 },
    { type: 'FOOTBALL', count: 30, prefix: 'Football', startId: 31 },
    { type: 'BASKETBALL', count: 25, prefix: 'Hoops', startId: 61 },
    { type: 'BADMINTON', count: 25, prefix: 'Shuttle', startId: 86 }
  ];

  const firstNames = [
    'Rohit', 'Kunal', 'Arjun', 'Dev', 'Ishan', 'Siddharth', 'Tushar', 'Vikram', 'Aditya', 'Pranav',
    'Rohan', 'Manish', 'Varun', 'Samir', 'Naveen', 'Aniket', 'Karthik', 'Harsh', 'Aakash', 'Deepak',
    'Gaurav', 'Yash', 'Tanmay', 'Mayank', 'Ayush', 'Omkar', 'Chirag', 'Ritvik', 'Saurabh', 'Alok',
    'Alex', 'Lucas', 'Mateo', 'Ethan', 'Noah', 'Julian', 'Gabriel', 'Leo', 'Oliver', 'Mason',
    'Liam', 'Diego', 'Felix', 'Marco', 'Hugo', 'Theo', 'Arthur', 'Milan', 'Bruno', 'Oscar',
    'Enzo', 'Rafael', 'Cedric', 'Dmitri', 'Pablo', 'Nico', 'Dominic', 'Kasper', 'Sergio', 'Viktor',
    'Marcus', 'Jaylen', 'Darius', 'Tariq', 'DeAndre', 'Xavier', 'Kyrie', 'Zion', 'Chet', 'Paolo',
    'Kevon', 'Miles', 'Lonzo', 'Cade', 'Jaden', 'Keegan', 'Shaedon', 'Bennedict', 'Jabari', 'Jalen',
    'Mark', 'AJ', 'Tari', 'Christian', 'Walker', 'Clara', 'Viktor', 'Kento', 'Akane', 'Tai',
    'Lee', 'An', 'Anthony', 'Jonatan', 'Pusarla', 'Lakshya', 'Carolina', 'Chen', 'Chou', 'Ratchanok',
    'Kunlavut', 'He', 'Loh', 'Pornpawee', 'Srikanth', 'Gregoria', 'Ng', 'Busanan', 'Prannoy', 'Nozomi'
  ];

  const lastNames = [
    'Sen', 'Verma', 'Nair', 'Patel', 'Kishan', 'Rao', 'Deshmukh', 'Malhotra', 'Roy', 'Joshi',
    'Bhatia', 'Tiwari', 'Chawla', 'Khan', 'Kumar', 'Shinde', 'Sunder', 'Vardhan', 'Gupta', 'Yadav',
    'Mishra', 'Singhania', 'Bhatt', 'Agarwal', 'Pandey', 'Kadam', 'Shah', 'Saxena', 'Dubey', 'Tripathi',
    'Mercer', 'Silva', 'Hernandez', 'Walker', 'Bennett', 'Draxler', 'Santos', 'Fontana', 'Schmidt', 'Clark',
    'OConnor', 'Ramirez', 'Muller', 'Rossi', 'Larsen', 'Gomez', 'Dubois', 'Kovac', 'Alves', 'Lindqvist',
    'Jordan', 'Rivers', 'Garland', 'Owens', 'Hunter', 'Tillman', 'Irvington', 'Brooks', 'Holmgren', 'Banch',
    'Zhang', 'Axelsen', 'Momota', 'Yamaguchi', 'Tzu-Ying', 'Zii-Jia', 'Se-Young', 'Ginting', 'Sindhu', 'Sen'
  ];

  const players: Player[] = [];
  for (let i = 1; i <= 110; i++) {
    let sport: SportType = 'CRICKET';
    if (i > 30 && i <= 60) sport = 'FOOTBALL';
    else if (i > 60 && i <= 85) sport = 'BASKETBALL';
    else if (i > 85) sport = 'BADMINTON';

    const fn = firstNames[i - 1] || `Athlete${i}`;
    const ln = lastNames[(i - 1) % lastNames.length] || `Pro`;
    
    players.push({
      player_id: i,
      user_id: i === 1 ? 6 : (i === 31 ? 7 : (i === 86 ? 8 : null)),
      first_name: fn,
      last_name: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@campus.edu`,
      phone: `+1-555-${1000 + i}`,
      date_of_birth: `200${(i % 4) + 1}-0${(i % 9) + 1}-15`,
      primary_sport: sport,
      jersey_number: (i % 99) + 1,
      eligibility_status: i === 15 ? 'SUSPENDED' : (i === 45 ? 'UNDER_REVIEW' : 'ELIGIBLE'),
      created_at: '2026-09-01T10:00:00Z'
    });
  }
  return players;
}

export const INITIAL_PLAYERS = generatePlayersList();

export const INITIAL_TEAM_MEMBERS: TeamMember[] = (() => {
  const members: TeamMember[] = [];
  let memId = 1;

  // Assign 5 players per team
  for (let teamId = 1; teamId <= 22; teamId++) {
    const startPlayer = (teamId - 1) * 5 + 1;
    for (let pOffset = 0; pOffset < 5; pOffset++) {
      const pid = startPlayer + pOffset;
      if (pid <= 110) {
        members.push({
          membership_id: memId++,
          team_id: teamId,
          player_id: pid,
          role_in_team: pOffset === 0 ? 'Captain' : (pOffset === 1 ? 'Vice Captain' : 'Player'),
          is_active: true,
          joined_at: '2026-09-05T09:00:00Z'
        });
      }
    }
  }
  return members;
})();

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    tournament_id: 1,
    name: 'Inter-Varsity Cricket Trophy 2026',
    sport_type: 'CRICKET',
    format: 'KNOCKOUT',
    start_date: '2026-10-15',
    end_date: '2026-10-30',
    venue_id: 1,
    max_teams: 8,
    status: 'ONGOING',
    organizer_id: 3,
    rules_notes: 'T20 Rules, ICC standard, 2 BYEs seeded in R1.',
    created_at: '2026-09-10T10:00:00Z'
  },
  {
    tournament_id: 2,
    name: 'Metro Collegiate Football League',
    sport_type: 'FOOTBALL',
    format: 'LEAGUE',
    start_date: '2026-09-01',
    end_date: '2026-11-20',
    venue_id: 2,
    max_teams: 6,
    status: 'ONGOING',
    organizer_id: 4,
    rules_notes: 'Standard 90-min matches. 3 pts for win, 1 for draw.',
    created_at: '2026-08-15T10:00:00Z'
  },
  {
    tournament_id: 3,
    name: 'Grand Slam Badminton Open',
    sport_type: 'BADMINTON',
    format: 'KNOCKOUT',
    start_date: '2026-10-01',
    end_date: '2026-10-10',
    venue_id: 4,
    max_teams: 8,
    status: 'COMPLETED',
    organizer_id: 5,
    rules_notes: 'BWF standard best-of-3 sets to 21 points.',
    created_at: '2026-09-12T10:00:00Z'
  },
  {
    tournament_id: 4,
    name: 'CyberHoops Invitational Cup',
    sport_type: 'BASKETBALL',
    format: 'ROUND_ROBIN',
    start_date: '2026-11-05',
    end_date: '2026-11-25',
    venue_id: 5,
    max_teams: 5,
    status: 'UPCOMING',
    organizer_id: 3,
    rules_notes: 'FIBA 4x10min quarters. Round robin bracket.',
    created_at: '2026-09-20T10:00:00Z'
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  // Tourn 1: Cricket
  { registration_id: 1, tournament_id: 1, team_id: 1, registration_date: '2026-09-15T10:00:00Z', status: 'APPROVED', seed_number: 1 },
  { registration_id: 2, tournament_id: 1, team_id: 2, registration_date: '2026-09-15T11:00:00Z', status: 'APPROVED', seed_number: 2 },
  { registration_id: 3, tournament_id: 1, team_id: 3, registration_date: '2026-09-16T09:00:00Z', status: 'APPROVED', seed_number: 3 },
  { registration_id: 4, tournament_id: 1, team_id: 4, registration_date: '2026-09-16T12:00:00Z', status: 'APPROVED', seed_number: 4 },
  { registration_id: 5, tournament_id: 1, team_id: 5, registration_date: '2026-09-17T14:00:00Z', status: 'APPROVED', seed_number: 5 },
  { registration_id: 6, tournament_id: 1, team_id: 6, registration_date: '2026-09-18T10:00:00Z', status: 'APPROVED', seed_number: 6 },
  // Tourn 2: Football
  { registration_id: 7, tournament_id: 2, team_id: 7, registration_date: '2026-08-20T10:00:00Z', status: 'APPROVED', seed_number: 1 },
  { registration_id: 8, tournament_id: 2, team_id: 8, registration_date: '2026-08-20T11:00:00Z', status: 'APPROVED', seed_number: 2 },
  { registration_id: 9, tournament_id: 2, team_id: 9, registration_date: '2026-08-21T09:00:00Z', status: 'APPROVED', seed_number: 3 },
  { registration_id: 10, tournament_id: 2, team_id: 10, registration_date: '2026-08-21T12:00:00Z', status: 'APPROVED', seed_number: 4 },
  { registration_id: 11, tournament_id: 2, team_id: 11, registration_date: '2026-08-22T14:00:00Z', status: 'APPROVED', seed_number: 5 },
  { registration_id: 12, tournament_id: 2, team_id: 12, registration_date: '2026-08-22T15:00:00Z', status: 'APPROVED', seed_number: 6 },
  // Tourn 3: Badminton
  { registration_id: 13, tournament_id: 3, team_id: 18, registration_date: '2026-09-15T10:00:00Z', status: 'APPROVED', seed_number: 1 },
  { registration_id: 14, tournament_id: 3, team_id: 19, registration_date: '2026-09-15T11:00:00Z', status: 'APPROVED', seed_number: 2 },
  { registration_id: 15, tournament_id: 3, team_id: 20, registration_date: '2026-09-16T10:00:00Z', status: 'APPROVED', seed_number: 3 },
  { registration_id: 16, tournament_id: 3, team_id: 21, registration_date: '2026-09-16T11:00:00Z', status: 'APPROVED', seed_number: 4 },
  { registration_id: 17, tournament_id: 3, team_id: 22, registration_date: '2026-09-17T10:00:00Z', status: 'APPROVED', seed_number: 5 },
  // Tourn 4: Basketball
  { registration_id: 18, tournament_id: 4, team_id: 13, registration_date: '2026-10-01T10:00:00Z', status: 'APPROVED', seed_number: 1 },
  { registration_id: 19, tournament_id: 4, team_id: 14, registration_date: '2026-10-02T10:00:00Z', status: 'APPROVED', seed_number: 2 },
  { registration_id: 20, tournament_id: 4, team_id: 15, registration_date: '2026-10-02T11:00:00Z', status: 'APPROVED', seed_number: 3 },
  { registration_id: 21, tournament_id: 4, team_id: 16, registration_date: '2026-10-03T10:00:00Z', status: 'APPROVED', seed_number: 4 },
  { registration_id: 22, tournament_id: 4, team_id: 17, registration_date: '2026-10-04T12:00:00Z', status: 'PENDING', seed_number: 5 }
];

export const INITIAL_MATCHES: Match[] = [
  // Tourn 1: Cricket Knockout
  { match_id: 1, tournament_id: 1, round_number: 1, match_number: 1, team_a_id: 1, team_b_id: 6, venue_id: 1, scheduled_time: '2026-10-16T10:00:00Z', status: 'COMPLETED', winner_team_id: 1, is_draw: false, match_summary: 'Cyber Vipers CC won by 34 runs', created_at: '2026-09-25T10:00:00Z' },
  { match_id: 2, tournament_id: 1, round_number: 1, match_number: 2, team_a_id: 2, team_b_id: 5, venue_id: 1, scheduled_time: '2026-10-17T14:00:00Z', status: 'COMPLETED', winner_team_id: 2, is_draw: false, match_summary: 'Quantum Strikers won by 6 wickets', created_at: '2026-09-25T10:00:00Z' },
  { match_id: 3, tournament_id: 1, round_number: 1, match_number: 3, team_a_id: 3, team_b_id: 4, venue_id: 1, scheduled_time: '2026-10-18T10:00:00Z', status: 'COMPLETED', winner_team_id: 3, is_draw: false, match_summary: 'Falcon Thunderbolts won by 18 runs', created_at: '2026-09-25T10:00:00Z' },
  { match_id: 4, tournament_id: 1, round_number: 2, match_number: 4, team_a_id: 1, team_b_id: 3, venue_id: 1, scheduled_time: '2026-10-22T14:00:00Z', status: 'COMPLETED', winner_team_id: 1, is_draw: false, match_summary: 'Cyber Vipers CC won by 5 wickets', created_at: '2026-09-25T10:00:00Z' },
  { match_id: 5, tournament_id: 1, round_number: 2, match_number: 5, team_a_id: 2, team_b_id: null, venue_id: 1, scheduled_time: '2026-10-23T10:00:00Z', status: 'COMPLETED', winner_team_id: 2, is_draw: false, match_summary: 'Quantum Strikers advanced via BYE', created_at: '2026-09-25T10:00:00Z' },
  { match_id: 6, tournament_id: 1, round_number: 3, match_number: 6, team_a_id: 1, team_b_id: 2, venue_id: 1, scheduled_time: '2026-10-28T14:00:00Z', status: 'LIVE', winner_team_id: null, is_draw: false, match_summary: 'Grand Final: Cyber Vipers 178/6 vs Quantum Strikers 118/3 (14.2 ov)', created_at: '2026-09-25T10:00:00Z' },

  // Tourn 2: Football League Matches
  { match_id: 7, tournament_id: 2, round_number: 1, match_number: 1, team_a_id: 7, team_b_id: 8, venue_id: 2, scheduled_time: '2026-09-05T16:00:00Z', status: 'COMPLETED', winner_team_id: 7, is_draw: false, match_summary: 'Metro United FC 3 - 1 Red Dragons', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 8, tournament_id: 2, round_number: 1, match_number: 2, team_a_id: 9, team_b_id: 10, venue_id: 2, scheduled_time: '2026-09-06T18:00:00Z', status: 'COMPLETED', winner_team_id: 9, is_draw: false, match_summary: 'Silicon Strikers 2 - 0 Golden Eagles', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 9, tournament_id: 2, round_number: 1, match_number: 3, team_a_id: 11, team_b_id: 12, venue_id: 2, scheduled_time: '2026-09-07T16:00:00Z', status: 'COMPLETED', winner_team_id: null, is_draw: true, match_summary: 'Vanguard City 1 - 1 Northwood Rangers', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 10, tournament_id: 2, round_number: 2, match_number: 4, team_a_id: 7, team_b_id: 9, venue_id: 2, scheduled_time: '2026-09-12T16:00:00Z', status: 'COMPLETED', winner_team_id: 7, is_draw: false, match_summary: 'Metro United FC 2 - 1 Silicon Strikers', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 11, tournament_id: 2, round_number: 2, match_number: 5, team_a_id: 8, team_b_id: 11, venue_id: 2, scheduled_time: '2026-09-13T18:00:00Z', status: 'COMPLETED', winner_team_id: 8, is_draw: false, match_summary: 'Red Dragons 4 - 2 Vanguard City', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 12, tournament_id: 2, round_number: 2, match_number: 6, team_a_id: 10, team_b_id: 12, venue_id: 2, scheduled_time: '2026-09-14T16:00:00Z', status: 'COMPLETED', winner_team_id: 12, is_draw: false, match_summary: 'Northwood Rangers 1 - 0 Golden Eagles', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 13, tournament_id: 2, round_number: 3, match_number: 7, team_a_id: 7, team_b_id: 10, venue_id: 2, scheduled_time: '2026-09-19T16:00:00Z', status: 'COMPLETED', winner_team_id: 7, is_draw: false, match_summary: 'Metro United FC 4 - 0 Golden Eagles', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 14, tournament_id: 2, round_number: 3, match_number: 8, team_a_id: 8, team_b_id: 12, venue_id: 2, scheduled_time: '2026-09-20T18:00:00Z', status: 'COMPLETED', winner_team_id: 8, is_draw: false, match_summary: 'Red Dragons 2 - 0 Northwood Rangers', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 15, tournament_id: 2, round_number: 3, match_number: 9, team_a_id: 9, team_b_id: 11, venue_id: 2, scheduled_time: '2026-09-21T16:00:00Z', status: 'COMPLETED', winner_team_id: 9, is_draw: false, match_summary: 'Silicon Strikers 3 - 2 Vanguard City', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 16, tournament_id: 2, round_number: 4, match_number: 10, team_a_id: 7, team_b_id: 11, venue_id: 2, scheduled_time: '2026-09-26T16:00:00Z', status: 'COMPLETED', winner_team_id: 7, is_draw: false, match_summary: 'Metro United FC 3 - 0 Vanguard City', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 17, tournament_id: 2, round_number: 4, match_number: 11, team_a_id: 8, team_b_id: 10, venue_id: 2, scheduled_time: '2026-09-27T18:00:00Z', status: 'COMPLETED', winner_team_id: null, is_draw: true, match_summary: 'Red Dragons 2 - 2 Golden Eagles', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 18, tournament_id: 2, round_number: 4, match_number: 12, team_a_id: 9, team_b_id: 12, venue_id: 2, scheduled_time: '2026-09-28T16:00:00Z', status: 'COMPLETED', winner_team_id: 9, is_draw: false, match_summary: 'Silicon Strikers 1 - 0 Northwood Rangers', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 19, tournament_id: 2, round_number: 5, match_number: 13, team_a_id: 7, team_b_id: 12, venue_id: 2, scheduled_time: '2026-10-03T16:00:00Z', status: 'COMPLETED', winner_team_id: 7, is_draw: false, match_summary: 'Metro United FC 2 - 1 Northwood Rangers', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 20, tournament_id: 2, round_number: 5, match_number: 14, team_a_id: 8, team_b_id: 9, venue_id: 2, scheduled_time: '2026-10-04T18:00:00Z', status: 'COMPLETED', winner_team_id: 9, is_draw: false, match_summary: 'Silicon Strikers 2 - 1 Red Dragons', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 21, tournament_id: 2, round_number: 5, match_number: 15, team_a_id: 10, team_b_id: 11, venue_id: 2, scheduled_time: '2026-10-05T16:00:00Z', status: 'COMPLETED', winner_team_id: 10, is_draw: false, match_summary: 'Golden Eagles 3 - 1 Vanguard City', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 22, tournament_id: 2, round_number: 6, match_number: 16, team_a_id: 8, team_b_id: 7, venue_id: 2, scheduled_time: '2026-10-26T16:00:00Z', status: 'LIVE', winner_team_id: null, is_draw: false, match_summary: 'Red Dragons 2 - 1 Metro United (68 min)', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 23, tournament_id: 2, round_number: 6, match_number: 17, team_a_id: 10, team_b_id: 9, venue_id: 2, scheduled_time: '2026-10-27T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Golden Eagles vs Silicon Strikers', created_at: '2026-08-25T10:00:00Z' },
  { match_id: 24, tournament_id: 2, round_number: 6, match_number: 18, team_a_id: 12, team_b_id: 11, venue_id: 2, scheduled_time: '2026-10-28T16:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Northwood Rangers vs Vanguard City', created_at: '2026-08-25T10:00:00Z' },

  // Tourn 3: Badminton Matches
  { match_id: 25, tournament_id: 3, round_number: 1, match_number: 1, team_a_id: 18, team_b_id: 22, venue_id: 4, scheduled_time: '2026-10-02T10:00:00Z', status: 'COMPLETED', winner_team_id: 18, is_draw: false, match_summary: 'Pinnacle Smashers 2 - 0 (21-17, 21-14)', created_at: '2026-09-20T10:00:00Z' },
  { match_id: 26, tournament_id: 3, round_number: 1, match_number: 2, team_a_id: 19, team_b_id: 21, venue_id: 4, scheduled_time: '2026-10-02T12:00:00Z', status: 'COMPLETED', winner_team_id: 19, is_draw: false, match_summary: 'Vortex Shuttle Club 2 - 1 (18-21, 21-19, 21-16)', created_at: '2026-09-20T10:00:00Z' },
  { match_id: 27, tournament_id: 3, round_number: 2, match_number: 3, team_a_id: 18, team_b_id: 20, venue_id: 4, scheduled_time: '2026-10-05T14:00:00Z', status: 'COMPLETED', winner_team_id: 18, is_draw: false, match_summary: 'Pinnacle Smashers 2 - 1 (21-19, 19-21, 21-18)', created_at: '2026-09-20T10:00:00Z' },
  { match_id: 28, tournament_id: 3, round_number: 3, match_number: 4, team_a_id: 18, team_b_id: 19, venue_id: 4, scheduled_time: '2026-10-09T16:00:00Z', status: 'COMPLETED', winner_team_id: 18, is_draw: false, match_summary: 'Grand Final: Pinnacle Smashers Champion (21-15, 21-18)', created_at: '2026-09-20T10:00:00Z' },

  // Tourn 4: Basketball Round Robin Fixtures
  { match_id: 29, tournament_id: 4, round_number: 1, match_number: 1, team_a_id: 13, team_b_id: 14, venue_id: 5, scheduled_time: '2026-11-06T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Round 1: Apex Ballers vs Neon Knights', created_at: '2026-10-05T10:00:00Z' },
  { match_id: 30, tournament_id: 4, round_number: 1, match_number: 2, team_a_id: 15, team_b_id: 16, venue_id: 5, scheduled_time: '2026-11-07T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Round 1: Ironclad Hoops vs Skyline Dunks', created_at: '2026-10-05T10:00:00Z' },
  { match_id: 31, tournament_id: 4, round_number: 2, match_number: 3, team_a_id: 13, team_b_id: 15, venue_id: 5, scheduled_time: '2026-11-10T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Round 2: Apex Ballers vs Ironclad Hoops', created_at: '2026-10-05T10:00:00Z' },
  { match_id: 32, tournament_id: 4, round_number: 2, match_number: 4, team_a_id: 14, team_b_id: 16, venue_id: 5, scheduled_time: '2026-11-11T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Round 2: Neon Knights vs Skyline Dunks', created_at: '2026-10-05T10:00:00Z' },
  { match_id: 33, tournament_id: 4, round_number: 3, match_number: 5, team_a_id: 13, team_b_id: 16, venue_id: 5, scheduled_time: '2026-11-14T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Round 3: Apex Ballers vs Skyline Dunks', created_at: '2026-10-05T10:00:00Z' },
  { match_id: 34, tournament_id: 4, round_number: 3, match_number: 6, team_a_id: 14, team_b_id: 15, venue_id: 5, scheduled_time: '2026-11-15T18:00:00Z', status: 'SCHEDULED', winner_team_id: null, is_draw: false, match_summary: 'Round 3: Neon Knights vs Ironclad Hoops', created_at: '2026-10-05T10:00:00Z' }
];

export const INITIAL_MATCH_SCORES: MatchScore[] = [
  // Cricket Match 1
  { score_id: 1, match_id: 1, team_id: 1, period_or_inning: 1, score_primary: 186, score_secondary: 4, overs_or_minutes: 20.00, extra_details: { run_rate: 9.30, sixes: 8, fours: 14 }, updated_at: '2026-10-16T13:30:00Z' },
  { score_id: 2, match_id: 1, team_id: 6, period_or_inning: 2, score_primary: 152, score_secondary: 9, overs_or_minutes: 20.00, extra_details: { run_rate: 7.60, sixes: 4, fours: 11 }, updated_at: '2026-10-16T17:00:00Z' },
  // Cricket Match 2
  { score_id: 3, match_id: 2, team_id: 5, period_or_inning: 1, score_primary: 140, score_secondary: 8, overs_or_minutes: 20.00, extra_details: { run_rate: 7.00, sixes: 3, fours: 10 }, updated_at: '2026-10-17T17:00:00Z' },
  { score_id: 4, match_id: 2, team_id: 2, period_or_inning: 2, score_primary: 142, score_secondary: 4, overs_or_minutes: 18.20, extra_details: { run_rate: 7.74, sixes: 6, fours: 13 }, updated_at: '2026-10-17T17:45:00Z' },
  // Cricket Match 6: LIVE
  { score_id: 5, match_id: 6, team_id: 1, period_or_inning: 1, score_primary: 178, score_secondary: 6, overs_or_minutes: 20.00, extra_details: { run_rate: 8.90, sixes: 9, fours: 12 }, updated_at: '2026-10-28T16:00:00Z' },
  { score_id: 6, match_id: 6, team_id: 2, period_or_inning: 2, score_primary: 118, score_secondary: 3, overs_or_minutes: 14.20, extra_details: { run_rate: 8.23, sixes: 5, fours: 8, target: 179 }, updated_at: '2026-10-28T17:15:00Z' },

  // Football Match 7: Metro United (7) vs Red Dragons (8)
  { score_id: 7, match_id: 7, team_id: 7, period_or_inning: 1, score_primary: 3, score_secondary: 0, overs_or_minutes: 90.00, extra_details: { possession: '58%', shots_on_target: 7 }, updated_at: '2026-09-05T18:00:00Z' },
  { score_id: 8, match_id: 7, team_id: 8, period_or_inning: 1, score_primary: 1, score_secondary: 0, overs_or_minutes: 90.00, extra_details: { possession: '42%', shots_on_target: 3 }, updated_at: '2026-09-05T18:00:00Z' },
  // Football Match 8: Silicon Strikers (9) vs Golden Eagles (10)
  { score_id: 9, match_id: 8, team_id: 9, period_or_inning: 1, score_primary: 2, score_secondary: 0, overs_or_minutes: 90.00, extra_details: { possession: '54%', shots_on_target: 6 }, updated_at: '2026-09-06T20:00:00Z' },
  { score_id: 10, match_id: 8, team_id: 10, period_or_inning: 1, score_primary: 0, score_secondary: 0, overs_or_minutes: 90.00, extra_details: { possession: '46%', shots_on_target: 2 }, updated_at: '2026-09-06T20:00:00Z' },
  // Football Match 22: LIVE Red Dragons (8) vs Metro United (7)
  { score_id: 11, match_id: 22, team_id: 8, period_or_inning: 1, score_primary: 2, score_secondary: 0, overs_or_minutes: 68.00, extra_details: { possession: '52%', yellow_cards: 1 }, updated_at: '2026-10-26T17:10:00Z' },
  { score_id: 12, match_id: 22, team_id: 7, period_or_inning: 1, score_primary: 1, score_secondary: 0, overs_or_minutes: 68.00, extra_details: { possession: '48%', yellow_cards: 2 }, updated_at: '2026-10-26T17:10:00Z' }
];

export const INITIAL_PLAYER_STATS: PlayerStatistic[] = [
  { stat_id: 1, player_id: 1, tournament_id: 1, matches_played: 3, primary_metric: 168, secondary_metric: 2, mvp_awards: 2, rating_score: 9.40, updated_at: '2026-10-22T17:00:00Z' },
  { stat_id: 2, player_id: 2, tournament_id: 1, matches_played: 3, primary_metric: 112, secondary_metric: 0, mvp_awards: 1, rating_score: 8.20, updated_at: '2026-10-22T17:00:00Z' },
  { stat_id: 3, player_id: 4, tournament_id: 1, matches_played: 3, primary_metric: 24, secondary_metric: 7, mvp_awards: 1, rating_score: 8.90, updated_at: '2026-10-22T17:00:00Z' },
  { stat_id: 4, player_id: 6, tournament_id: 1, matches_played: 2, primary_metric: 98, secondary_metric: 4, mvp_awards: 1, rating_score: 8.80, updated_at: '2026-10-22T17:00:00Z' },
  { stat_id: 5, player_id: 31, tournament_id: 2, matches_played: 5, primary_metric: 7, secondary_metric: 3, mvp_awards: 3, rating_score: 9.60, updated_at: '2026-10-05T18:00:00Z' },
  { stat_id: 6, player_id: 32, tournament_id: 2, matches_played: 5, primary_metric: 4, secondary_metric: 5, mvp_awards: 1, rating_score: 8.90, updated_at: '2026-10-05T18:00:00Z' },
  { stat_id: 7, player_id: 36, tournament_id: 2, matches_played: 5, primary_metric: 5, secondary_metric: 2, mvp_awards: 2, rating_score: 9.10, updated_at: '2026-10-05T18:00:00Z' },
  { stat_id: 8, player_id: 41, tournament_id: 2, matches_played: 5, primary_metric: 6, secondary_metric: 2, mvp_awards: 2, rating_score: 9.30, updated_at: '2026-10-05T18:00:00Z' },
  { stat_id: 9, player_id: 86, tournament_id: 3, matches_played: 3, primary_metric: 126, secondary_metric: 0, mvp_awards: 3, rating_score: 9.80, updated_at: '2026-10-09T18:00:00Z' },
  { stat_id: 10, player_id: 91, tournament_id: 3, matches_played: 2, primary_metric: 82, secondary_metric: 0, mvp_awards: 1, rating_score: 8.70, updated_at: '2026-10-09T18:00:00Z' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { log_id: 1, user_id: 1, action_type: 'SYSTEM_INIT', entity_name: 'DATABASE', entity_id: 0, details: 'Database arena_x_db provisioned and seeded with collegiate tournament dataset.', ip_address: '127.0.0.1', created_at: '2026-09-01T08:00:00Z' },
  { log_id: 2, user_id: 3, action_type: 'TOURNAMENT_CREATE', entity_name: 'tournaments', entity_id: 1, details: 'Created tournament: Inter-Varsity Cricket Trophy 2026 (Knockout format).', ip_address: '192.168.1.10', created_at: '2026-09-10T10:00:00Z' },
  { log_id: 3, user_id: 3, action_type: 'FIXTURE_GENERATE', entity_name: 'matches', entity_id: 1, details: 'Knockout algorithm generated Round 1 fixtures with 2 BYE seeds.', ip_address: '192.168.1.10', created_at: '2026-09-25T10:00:00Z' },
  { log_id: 4, user_id: 5, action_type: 'SCORE_UPDATE', entity_name: 'matches', entity_id: 1, details: 'Match 1 concluded: Cyber Vipers CC defeated Apex Titans Cricket 186/4 to 152/9.', ip_address: '192.168.1.15', created_at: '2026-10-16T17:05:00Z' },
  { log_id: 5, user_id: 4, action_type: 'TOURNAMENT_CREATE', entity_name: 'tournaments', entity_id: 2, details: 'Created tournament: Metro Collegiate Football League (6 teams).', ip_address: '192.168.1.12', created_at: '2026-08-15T10:00:00Z' },
  { log_id: 6, user_id: 5, action_type: 'TRANSACTION_COMMIT', entity_name: 'matches', entity_id: 7, details: 'Atomic transaction committed: Score recorded, points awarded, and league standings updated.', ip_address: '192.168.1.15', created_at: '2026-09-05T18:05:00Z' }
];
