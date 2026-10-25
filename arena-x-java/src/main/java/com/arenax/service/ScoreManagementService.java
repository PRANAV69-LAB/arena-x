package com.arenax.service;

import com.arenax.database.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service managing sport scores inside atomic JDBC transactions.
 * Demonstrates ACID guarantees (Atomicity, Consistency, Isolation, Durability).
 */
public class ScoreManagementService {

    private static final Logger logger = LoggerFactory.getLogger(ScoreManagementService.class);

    public static class MatchScoreRecord {
        public final int matchId;
        public final int teamAId;
        public final int teamBId;
        public final int scoreA;
        public final int scoreB;
        public final Integer winnerId;
        public final boolean isDraw;
        public final String summary;

        public MatchScoreRecord(int matchId, int teamAId, int teamBId, int scoreA, int scoreB, Integer winnerId, boolean isDraw, String summary) {
            this.matchId = matchId;
            this.teamAId = teamAId;
            this.teamBId = teamBId;
            this.scoreA = scoreA;
            this.scoreB = scoreB;
            this.winnerId = winnerId;
            this.isDraw = isDraw;
            this.summary = summary;
        }
    }

    /**
     * Executes atomic multi-table score update within a single transaction.
     * Rolls back completely if any step fails.
     */
    public boolean updateMatchScoreTransaction(MatchScoreRecord record) {
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Begin ACID Transaction

            // Step 1: Update or insert Team A score
            String sqlScoreA = "INSERT INTO match_scores (match_id, team_id, score_primary) VALUES (?, ?, ?) " +
                               "ON DUPLICATE KEY UPDATE score_primary = VALUES(score_primary)";
            try (PreparedStatement psA = conn.prepareStatement(sqlScoreA)) {
                psA.setInt(1, record.matchId);
                psA.setInt(2, record.teamAId);
                psA.setInt(3, record.scoreA);
                psA.executeUpdate();
            }

            // Step 2: Update or insert Team B score
            String sqlScoreB = "INSERT INTO match_scores (match_id, team_id, score_primary) VALUES (?, ?, ?) " +
                               "ON DUPLICATE KEY UPDATE score_primary = VALUES(score_primary)";
            try (PreparedStatement psB = conn.prepareStatement(sqlScoreB)) {
                psB.setInt(1, record.matchId);
                psB.setInt(2, record.teamBId);
                psB.setInt(3, record.scoreB);
                psB.executeUpdate();
            }

            // Step 3: Update Match status, winner, and summary
            String sqlMatch = "UPDATE matches SET status = 'COMPLETED', winner_team_id = ?, is_draw = ?, match_summary = ? WHERE match_id = ?";
            try (PreparedStatement psMatch = conn.prepareStatement(sqlMatch)) {
                if (record.winnerId != null) {
                    psMatch.setInt(1, record.winnerId);
                } else {
                    psMatch.setNull(1, java.sql.Types.INTEGER);
                }
                psMatch.setBoolean(2, record.isDraw);
                psMatch.setString(3, record.summary);
                psMatch.setInt(4, record.matchId);
                psMatch.executeUpdate();
            }

            // Step 4: Write Audit Trail Log
            String sqlAudit = "INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, details) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement psAudit = conn.prepareStatement(sqlAudit)) {
                psAudit.setInt(1, 1);
                psAudit.setString(2, "TRANSACTION_COMMIT");
                psAudit.setString(3, "matches");
                psAudit.setInt(4, record.matchId);
                psAudit.setString(5, "Atomic score update finalized: " + record.summary);
                psAudit.executeUpdate();
            }

            conn.commit(); // Finalize ACID Commit
            logger.info("Match score transaction committed successfully for matchId: {}", record.matchId);
            return true;
        } catch (SQLException e) {
            logger.error("Transaction failed! Initiating rollback...", e);
            DatabaseConnection.rollback(conn);
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {}
            }
        }
    }
}
