-- ========================================================================
-- ARENA-X: Database Schema Definition
-- Target DBMS: MySQL 8.0+
-- Database Name: arena_x_db
-- ========================================================================

CREATE DATABASE IF NOT EXISTS arena_x_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE arena_x_db;

-- ------------------------------------------------------------------------
-- 1. USERS TABLE (Authentication & Role-Based Access Control)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt 60-char hash',
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'ORGANIZER', 'PLAYER') NOT NULL DEFAULT 'PLAYER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 2. PLAYERS TABLE (Individual Athlete Profiles)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    date_of_birth DATE NULL,
    primary_sport ENUM('CRICKET', 'FOOTBALL', 'BADMINTON', 'BASKETBALL') NOT NULL,
    jersey_number INT NULL,
    eligibility_status ENUM('ELIGIBLE', 'SUSPENDED', 'UNDER_REVIEW') DEFAULT 'ELIGIBLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_player_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_player_sport (primary_sport),
    INDEX idx_player_name (last_name, first_name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 3. TEAMS TABLE (Sports Squads & Rosters)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL UNIQUE,
    sport_type ENUM('CRICKET', 'FOOTBALL', 'BADMINTON', 'BASKETBALL') NOT NULL,
    captain_id INT NULL,
    coach_name VARCHAR(100) NULL,
    city VARCHAR(80) NOT NULL,
    logo_color VARCHAR(10) DEFAULT '#10B981',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_captain FOREIGN KEY (captain_id) 
        REFERENCES players(player_id) ON DELETE SET NULL,
    INDEX idx_team_sport (sport_type)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 4. TEAM_MEMBERS TABLE (Player-to-Team Junction with Active Flag)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_members (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    role_in_team VARCHAR(50) DEFAULT 'Player',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tm_team FOREIGN KEY (team_id) 
        REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_tm_player FOREIGN KEY (player_id) 
        REFERENCES players(player_id) ON DELETE CASCADE,
    CONSTRAINT uq_team_player UNIQUE (team_id, player_id),
    INDEX idx_tm_player (player_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 5. VENUES TABLE (Stadiums, Courts & Grounds)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(80) NOT NULL,
    capacity INT DEFAULT 5000,
    surface_type VARCHAR(50) DEFAULT 'Turf / Hardwood',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 6. TOURNAMENTS TABLE (Core Competition Entity)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournaments (
    tournament_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sport_type ENUM('CRICKET', 'FOOTBALL', 'BADMINTON', 'BASKETBALL') NOT NULL,
    format ENUM('KNOCKOUT', 'ROUND_ROBIN', 'LEAGUE') NOT NULL DEFAULT 'KNOCKOUT',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue_id INT NULL,
    max_teams INT NOT NULL DEFAULT 8,
    status ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    organizer_id INT NOT NULL,
    rules_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tournament_venue FOREIGN KEY (venue_id) 
        REFERENCES venues(venue_id) ON DELETE SET NULL,
    CONSTRAINT fk_tournament_organizer FOREIGN KEY (organizer_id) 
        REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_tournament_status (status),
    INDEX idx_tournament_sport (sport_type)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 7. REGISTRATIONS TABLE (Team Entry into Tournaments)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    team_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    seed_number INT NULL,
    CONSTRAINT fk_reg_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    CONSTRAINT fk_reg_team FOREIGN KEY (team_id) 
        REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT uq_tourn_team UNIQUE (tournament_id, team_id),
    INDEX idx_reg_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 8. MATCHES TABLE (Fixtures, Rounds & Outcomes)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    round_number INT NOT NULL DEFAULT 1 COMMENT '1=Round 1, 2=Quarter, 3=Semi, 4=Final',
    match_number INT NOT NULL,
    team_a_id INT NOT NULL,
    team_b_id INT NULL COMMENT 'NULL indicates BYE in Knockout round',
    venue_id INT NULL,
    scheduled_time DATETIME NOT NULL,
    status ENUM('SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    winner_team_id INT NULL,
    is_draw BOOLEAN NOT NULL DEFAULT FALSE,
    match_summary VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_match_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    CONSTRAINT fk_match_team_a FOREIGN KEY (team_a_id) 
        REFERENCES teams(team_id) ON DELETE RESTRICT,
    CONSTRAINT fk_match_team_b FOREIGN KEY (team_b_id) 
        REFERENCES teams(team_id) ON DELETE RESTRICT,
    CONSTRAINT fk_match_winner FOREIGN KEY (winner_team_id) 
        REFERENCES teams(team_id) ON DELETE SET NULL,
    CONSTRAINT fk_match_venue FOREIGN KEY (venue_id) 
        REFERENCES venues(venue_id) ON DELETE SET NULL,
    INDEX idx_match_tournament_round (tournament_id, round_number),
    INDEX idx_match_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 9. MATCH_SCORES TABLE (Sport-Specific Granular Scores)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    period_or_inning INT NOT NULL DEFAULT 1 COMMENT 'Innings / Half / Set / Quarter',
    score_primary INT NOT NULL DEFAULT 0 COMMENT 'Runs / Goals / Sets / Points',
    score_secondary INT DEFAULT 0 COMMENT 'Wickets / Fouls / Extras',
    overs_or_minutes DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Overs in cricket or minutes played',
    extra_details JSON NULL COMMENT 'Sport-specific metadata (run rate, penalties)',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_score_match FOREIGN KEY (match_id) 
        REFERENCES matches(match_id) ON DELETE CASCADE,
    CONSTRAINT fk_score_team FOREIGN KEY (team_id) 
        REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT uq_match_team_period UNIQUE (match_id, team_id, period_or_inning)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 10. PLAYER_STATISTICS TABLE (Aggregated Performance Metrics)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS player_statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    tournament_id INT NOT NULL,
    matches_played INT NOT NULL DEFAULT 0,
    primary_metric INT NOT NULL DEFAULT 0 COMMENT 'Runs / Goals / Smash Points',
    secondary_metric INT NOT NULL DEFAULT 0 COMMENT 'Wickets / Assists / Rebounds',
    mvp_awards INT NOT NULL DEFAULT 0,
    rating_score DECIMAL(4,2) DEFAULT 7.50,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_stat_player FOREIGN KEY (player_id) 
        REFERENCES players(player_id) ON DELETE CASCADE,
    CONSTRAINT fk_stat_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    CONSTRAINT uq_player_tournament UNIQUE (player_id, tournament_id),
    INDEX idx_stat_leaderboard (tournament_id, primary_metric DESC)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------
-- 11. AUDIT_LOGS TABLE (Security, Score Changes & Transaction Audit)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action_type VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, SCORE_OVERRIDE, TRANSACTION_COMMIT',
    entity_name VARCHAR(50) NOT NULL,
    entity_id INT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;
