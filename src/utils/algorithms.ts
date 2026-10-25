export interface ScheduledMatchPair {
  roundNumber: number;
  matchNumber: number;
  teamAId: number;
  teamBId: number | null; // null represents BYE
  isBye: boolean;
}

/**
 * Knockout / Single Elimination Fixture Generator
 * Uses power-of-2 expansion and seeds BYEs to top-ranked teams.
 */
export function generateKnockoutFixtures(teamIds: number[]): ScheduledMatchPair[] {
  if (teamIds.length < 2) {
    throw new Error('Knockout tournament requires at least 2 teams.');
  }

  const teamCount = teamIds.length;
  // Next power of 2
  let bracketSize = 1;
  while (bracketSize < teamCount) {
    bracketSize <<= 1;
  }
  const byeCount = bracketSize - teamCount;

  const fixtures: ScheduledMatchPair[] = [];
  let matchIndex = 1;

  // Top 'byeCount' seeds receive BYE directly to Round 2
  for (let i = 0; i < byeCount; i++) {
    fixtures.push({
      roundNumber: 1,
      matchNumber: matchIndex++,
      teamAId: teamIds[i],
      teamBId: null,
      isBye: true
    });
  }

  // Remaining teams play Round 1
  const remainingStart = byeCount;
  const remainingCount = teamCount - byeCount;
  for (let i = 0; i < Math.floor(remainingCount / 2); i++) {
    const teamA = teamIds[remainingStart + i];
    const teamB = teamIds[remainingStart + remainingCount - 1 - i];
    fixtures.push({
      roundNumber: 1,
      matchNumber: matchIndex++,
      teamAId: teamA,
      teamBId: teamB,
      isBye: false
    });
  }

  return fixtures;
}

/**
 * Round Robin Fixture Generator
 * Implements Polygon / Circle rotation algorithm (Berger tables).
 * Guarantees every team plays each other once with no duplicate pairings.
 */
export function generateRoundRobinFixtures(teamIds: number[]): ScheduledMatchPair[] {
  if (teamIds.length < 2) {
    throw new Error('Round Robin requires at least 2 teams.');
  }

  const teams = [...teamIds];
  // If odd count, add dummy -1 for BYE
  if (teams.length % 2 !== 0) {
    teams.push(-1);
  }

  const numTeams = teams.length;
  const totalRounds = numTeams - 1;
  const matchesPerRound = Math.floor(numTeams / 2);

  const fixtures: ScheduledMatchPair[] = [];
  let matchCounter = 1;

  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      let home = (round + match) % (numTeams - 1);
      let away = (numTeams - 1 - match + round) % (numTeams - 1);

      if (match === 0) {
        away = numTeams - 1;
      }

      let teamA = teams[home];
      let teamB = teams[away];

      if (teamA !== -1 && teamB !== -1) {
        // Alternate home/away each round
        if (round % 2 === 1) {
          const temp = teamA;
          teamA = teamB;
          teamB = temp;
        }
        fixtures.push({
          roundNumber: round + 1,
          matchNumber: matchCounter++,
          teamAId: teamA,
          teamBId: teamB,
          isBye: false
        });
      }
    }
  }

  return fixtures;
}

export interface StandingRow {
  teamId: number;
  teamName: string;
  sportType: string;
  logoColor: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  scoredFor: number;
  scoredAgainst: number;
  diff: number;
  form: ('W' | 'D' | 'L')[];
}

/**
 * Computes League table standings dynamically from completed matches
 */
export function computeLeagueStandings(
  teams: { team_id: number; team_name: string; sport_type: string; logo_color: string }[],
  matches: { match_id: number; team_a_id: number; team_b_id: number | null; status: string; winner_team_id?: number | null; is_draw: boolean }[],
  scores: { match_id: number; team_id: number; score_primary: number }[]
): StandingRow[] {
  const standingsMap: Record<number, StandingRow> = {};

  teams.forEach(t => {
    standingsMap[t.team_id] = {
      teamId: t.team_id,
      teamName: t.team_name,
      sportType: t.sport_type,
      logoColor: t.logo_color,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
      scoredFor: 0,
      scoredAgainst: 0,
      diff: 0,
      form: []
    };
  });

  const completedMatches = matches.filter(m => m.status === 'COMPLETED' && m.team_b_id !== null);

  completedMatches.forEach(m => {
    const sA = scores.find(s => s.match_id === m.match_id && s.team_id === m.team_a_id)?.score_primary ?? 0;
    const sB = scores.find(s => s.match_id === m.match_id && s.team_id === m.team_b_id)?.score_primary ?? 0;

    const rowA = standingsMap[m.team_a_id];
    const rowB = standingsMap[m.team_b_id!];

    if (rowA && rowB) {
      rowA.played++;
      rowB.played++;
      rowA.scoredFor += sA;
      rowA.scoredAgainst += sB;
      rowB.scoredFor += sB;
      rowB.scoredAgainst += sA;

      if (m.is_draw || sA === sB) {
        rowA.drawn++;
        rowB.drawn++;
        rowA.points += 1;
        rowB.points += 1;
        rowA.form.push('D');
        rowB.form.push('D');
      } else if (m.winner_team_id === m.team_a_id || sA > sB) {
        rowA.won++;
        rowB.lost++;
        rowA.points += 3;
        rowA.form.push('W');
        rowB.form.push('L');
      } else {
        rowB.won++;
        rowA.lost++;
        rowB.points += 3;
        rowB.form.push('W');
        rowA.form.push('L');
      }

      rowA.diff = rowA.scoredFor - rowA.scoredAgainst;
      rowB.diff = rowB.scoredFor - rowB.scoredAgainst;
    }
  });

  return Object.values(standingsMap).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    if (b.scoredFor !== a.scoredFor) return b.scoredFor - a.scoredFor;
    return b.won - a.won;
  });
}
