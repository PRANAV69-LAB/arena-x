package com.arenax.algorithm;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Tournament fixture generator for Single Elimination / Knockout brackets.
 * Implements standard seeding, power-of-2 expansion, and BYE assignments for odd numbers of teams.
 */
public class KnockoutScheduler {

    public static class ScheduledMatch {
        public final int roundNumber;
        public final int matchNumber;
        public final Integer teamAId;
        public final Integer teamBId; // null represents BYE
        public final boolean isBye;

        public ScheduledMatch(int roundNumber, int matchNumber, Integer teamAId, Integer teamBId) {
            this.roundNumber = roundNumber;
            this.matchNumber = matchNumber;
            this.teamAId = teamAId;
            this.teamBId = teamBId;
            this.isBye = (teamBId == null);
        }
    }

    /**
     * Generates first-round Knockout fixtures.
     * @param teamIds List of participating team IDs (sorted by seed rank)
     * @return List of generated matches for Round 1
     */
    public static List<ScheduledMatch> generateRound1(List<Integer> teamIds) {
        if (teamIds == null || teamIds.size() < 2) {
            throw new IllegalArgumentException("Knockout requires at least 2 teams.");
        }

        int teamCount = teamIds.size();
        int bracketSize = nextPowerOfTwo(teamCount);
        int byeCount = bracketSize - teamCount;

        List<ScheduledMatch> fixtures = new ArrayList<>();
        int matchIndex = 1;

        // Top 'byeCount' seeds receive a BYE to advance directly to Round 2
        for (int i = 0; i < byeCount; i++) {
            fixtures.add(new ScheduledMatch(1, matchIndex++, teamIds.get(i), null));
        }

        // Remaining teams play against each other
        int remainingStart = byeCount;
        int remainingCount = teamCount - byeCount;
        for (int i = 0; i < remainingCount / 2; i++) {
            Integer teamA = teamIds.get(remainingStart + i);
            Integer teamB = teamIds.get(remainingStart + remainingCount - 1 - i);
            fixtures.add(new ScheduledMatch(1, matchIndex++, teamA, teamB));
        }

        return fixtures;
    }

    private static int nextPowerOfTwo(int n) {
        int power = 1;
        while (power < n) {
            power <<= 1;
        }
        return power;
    }
}
