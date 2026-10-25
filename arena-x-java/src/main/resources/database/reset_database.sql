-- ========================================================================
-- ARENA-X: Database Clean Reset Script
-- Target: Drops tables in reverse foreign-key dependency order
-- ========================================================================

USE arena_x_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS player_statistics;
DROP TABLE IF EXISTS match_scores;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database arena_x_db reset successfully.' AS Status;
