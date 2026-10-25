package com.arenax;

import com.arenax.algorithm.KnockoutScheduler;
import com.arenax.algorithm.RoundRobinScheduler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests validating tournament fixture algorithms.
 */
public class TournamentAlgorithmTest {

    @Test
    @DisplayName("Knockout: 6 teams should produce next power-of-2 (8) with 2 BYEs")
    public void testKnockoutByeCalculation() {
        List<Integer> teams = Arrays.asList(1, 2, 3, 4, 5, 6);
        List<KnockoutScheduler.ScheduledMatch> r1 = KnockoutScheduler.generateRound1(teams);

        assertNotNull(r1);
        assertEquals(4, r1.size(), "8-bracket requires 4 matches in round 1");

        long byeCount = r1.stream().filter(m -> m.isBye).count();
        assertEquals(2, byeCount, "6 teams must yield exactly 2 BYEs");

        // Top seeds (team 1 and 2) must receive the BYEs
        assertTrue(r1.get(0).isBye && r1.get(0).teamAId.equals(1));
        assertTrue(r1.get(1).isBye && r1.get(1).teamAId.equals(2));
    }

    @Test
    @DisplayName("Round Robin: 4 teams should produce 6 distinct pairings with no self-play")
    public void testRoundRobinPairings() {
        List<Integer> teams = Arrays.asList(10, 20, 30, 40);
        List<RoundRobinScheduler.ScheduledMatch> matches = RoundRobinScheduler.generateFixtures(teams);

        assertEquals(6, matches.size(), "4 teams in round robin must play (4*3)/2 = 6 matches");

        Set<String> uniquePairings = new HashSet<>();
        for (RoundRobinScheduler.ScheduledMatch m : matches) {
            assertNotEquals(m.teamAId, m.teamBId, "A team cannot play itself!");
            int min = Math.min(m.teamAId, m.teamBId);
            int max = Math.max(m.teamAId, m.teamBId);
            String pairKey = min + " vs " + max;
            assertFalse(uniquePairings.contains(pairKey), "Duplicate match pairing detected: " + pairKey);
            uniquePairings.add(pairKey);
        }

        assertEquals(6, uniquePairings.size());
    }
}
