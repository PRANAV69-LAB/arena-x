package com.arenax.algorithm;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Generates Round Robin tournament fixtures using the standard Polygon / Circle rotation algorithm.
 * Guarantees that every team plays every other team exactly once, eliminates duplicate pairings,
 * and handles odd team counts by inserting a BYE round.
 */
public class RoundRobinScheduler {

    public static class ScheduledMatch {
        public final int roundNumber;
        public final int matchNumber;
        public final Integer teamAId;
        public final Integer teamBId;

        public ScheduledMatch(int roundNumber, int matchNumber, Integer teamAId, Integer teamBId) {
            this.roundNumber = roundNumber;
            this.matchNumber = matchNumber;
            this.teamAId = teamAId;
            this.teamBId = teamBId;
        }
    }

    /**
     * Generates all round-robin fixtures.
     * @param teamIds List of participating team IDs
     * @return Complete list of matches grouped by rounds
     */
    public static List<ScheduledMatch> generateFixtures(List<Integer> teamIds) {
        if (teamIds == null || teamIds.size() < 2) {
            throw new IllegalArgumentException("Round Robin requires at least 2 teams.");
        }

        List<Integer> teams = new ArrayList<>(teamIds);
        boolean hasGhost = false;

        // If odd number of teams, add dummy team ID (-1) representing a BYE
        if (teams.size() % 2 != 0) {
            teams.add(-1);
            hasGhost = true;
        }

        int numTeams = teams.size();
        int totalRounds = numTeams - 1;
        int matchesPerRound = numTeams / 2;

        List<ScheduledMatch> allMatches = new ArrayList<>();
        int globalMatchCounter = 1;

        for (int round = 0; round < totalRounds; round++) {
            for (int match = 0; match < matchesPerRound; match++) {
                int home = (round + match) % (numTeams - 1);
                int away = (numTeams - 1 - match + round) % (numTeams - 1);

                // Last team stays fixed in position
                if (match == 0) {
                    away = numTeams - 1;
                }

                Integer teamA = teams.get(home);
                Integer teamB = teams.get(away);

                // Ignore match if one of the opponents is the BYE placeholder
                if (teamA != -1 && teamB != -1) {
                    // Alternate home/away to ensure venue fairness
                    if (round % 2 == 1) {
                        Integer temp = teamA;
                        teamA = teamB;
                        teamB = temp;
                    }
                    allMatches.add(new ScheduledMatch(round + 1, globalMatchCounter++, teamA, teamB));
                }
            }
        }

        return allMatches;
    }
}
