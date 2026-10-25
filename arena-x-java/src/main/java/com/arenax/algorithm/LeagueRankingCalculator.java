package com.arenax.algorithm;

import java.util.*;

/**
 * Calculates league standings dynamically from match results.
 * Standard points system: 3 for WIN, 1 for DRAW, 0 for LOSS.
 * Tie-breakers: Points -> Goal Difference / Score Diff -> Goals Scored -> Wins.
 */
public class LeagueRankingCalculator {

    public static class TeamStanding implements Comparable<TeamStanding> {
        public final int teamId;
        public final String teamName;
        public int matchesPlayed = 0;
        public int wins = 0;
        public int draws = 0;
        public int losses = 0;
        public int points = 0;
        public int scoredFor = 0;
        public int scoredAgainst = 0;
        public int goalDifference = 0;

        public TeamStanding(int teamId, String teamName) {
            this.teamId = teamId;
            this.teamName = teamName;
        }

        public void recordResult(int forScore, int againstScore) {
            matchesPlayed++;
            scoredFor += forScore;
            scoredAgainst += againstScore;
            goalDifference = scoredFor - scoredAgainst;

            if (forScore > againstScore) {
                wins++;
                points += 3;
            } else if (forScore == againstScore) {
                draws++;
                points += 1;
            } else {
                losses++;
            }
        }

        @Override
        public int compareTo(TeamStanding other) {
            if (this.points != other.points) {
                return Integer.compare(other.points, this.points); // Highest points first
            }
            if (this.goalDifference != other.goalDifference) {
                return Integer.compare(other.goalDifference, this.goalDifference); // Highest goal diff first
            }
            if (this.scoredFor != other.scoredFor) {
                return Integer.compare(other.scoredFor, this.scoredFor); // Highest goals scored first
            }
            return Integer.compare(other.wins, this.wins);
        }
    }

    public static class MatchResultData {
        public final int teamAId;
        public final int teamBId;
        public final int scoreA;
        public final int scoreB;

        public MatchResultData(int teamAId, int teamBId, int scoreA, int scoreB) {
            this.teamAId = teamAId;
            this.teamBId = teamBId;
            this.scoreA = scoreA;
            this.scoreB = scoreB;
        }
    }

    public static List<TeamStanding> computeStandings(Map<Integer, String> teams, List<MatchResultData> results) {
        Map<Integer, TeamStanding> table = new HashMap<>();
        for (Map.Entry<Integer, String> entry : teams.entrySet()) {
            table.put(entry.getKey(), new TeamStanding(entry.getKey(), entry.getValue()));
        }

        for (MatchResultData match : results) {
            TeamStanding standingA = table.get(match.teamAId);
            TeamStanding standingB = table.get(match.teamBId);

            if (standingA != null && standingB != null) {
                standingA.recordResult(match.scoreA, match.scoreB);
                standingB.recordResult(match.scoreB, match.scoreA);
            }
        }

        List<TeamStanding> sortedList = new ArrayList<>(table.values());
        Collections.sort(sortedList);
        return sortedList;
    }
}
