package com.arenax;

import com.arenax.service.ScoreManagementService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Validates JDBC transaction atomicity and rollback semantics.
 */
public class JdbcTransactionTest {

    @Test
    @DisplayName("Transaction: Invalid foreign key or duplicate key must safely abort and roll back")
    public void testTransactionRollbackOnInvalidData() {
        ScoreManagementService service = new ScoreManagementService();

        // Deliberately specify an invalid non-existent match ID and foreign keys
        ScoreManagementService.MatchScoreRecord invalidRecord = new ScoreManagementService.MatchScoreRecord(
                -99999, // match_id does not exist in foreign key table
                -1,
                -2,
                100,
                80,
                -1,
                false,
                "Test intentional rollback"
        );

        // When executed against MySQL with strict foreign keys, this should return false and not throw an uncaught exception
        boolean success = service.updateMatchScoreTransaction(invalidRecord);
        assertFalse(success, "Transaction must fail and roll back safely when encountering constraint violations.");
    }
}
