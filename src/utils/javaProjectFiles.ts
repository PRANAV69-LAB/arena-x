import JSZip from 'jszip';

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  content: string;
}

export const JAVA_PROJECT_FILES: ProjectFile[] = [
  {
    name: 'pom.xml',
    path: 'pom.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.arenax</groupId>
    <artifactId>arena-x-sports-system</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>ARENA-X Sports Tournament &amp; SQL Visualization System</name>
    <description>Enterprise Java 21 + JavaFX + MySQL DBMS College Capstone Project</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <javafx.version>21.0.2</javafx.version>
        <mysql.connector.version>8.3.0</mysql.connector.version>
        <bcrypt.version>0.10.2</bcrypt.version>
        <junit.version>5.10.2</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>\${mysql.connector.version}</version>
        </dependency>
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.1.0</version>
        </dependency>
        <dependency>
            <groupId>at.favre.lib</groupId>
            <artifactId>bcrypt</artifactId>
            <version>\${bcrypt.version}</version>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>\${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>21</release>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.8</version>
                <configuration>
                    <mainClass>com.arenax.app.ArenaXApp</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    content: `# ARENA-X — Java 21 + JavaFX + MySQL Sports Tournament & SQL Visualization System

## Quick Start
1. Import \`src/main/resources/database/schema.sql\` in MySQL Workbench.
2. Import \`src/main/resources/database/seed_data.sql\` in MySQL Workbench.
3. Configure \`src/main/resources/db.properties\` with your password.
4. Run \`mvn clean compile javafx:run\` to start the desktop JavaFX application!
`
  },
  {
    name: 'schema.sql',
    path: 'src/main/resources/database/schema.sql',
    language: 'sql',
    content: `-- MySQL 8.0 Normalized Schema for arena_x_db
CREATE DATABASE IF NOT EXISTS arena_x_db;
USE arena_x_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'ORGANIZER', 'PLAYER') NOT NULL DEFAULT 'PLAYER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(80) NOT NULL,
    capacity INT DEFAULT 5000,
    surface_type VARCHAR(50) DEFAULT 'Turf'
);

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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL UNIQUE,
    sport_type ENUM('CRICKET', 'FOOTBALL', 'BADMINTON', 'BASKETBALL') NOT NULL,
    captain_id INT NULL,
    coach_name VARCHAR(100) NULL,
    city VARCHAR(80) NOT NULL,
    logo_color VARCHAR(10) DEFAULT '#10B981',
    FOREIGN KEY (captain_id) REFERENCES players(player_id) ON DELETE SET NULL
);

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
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE SET NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    round_number INT NOT NULL DEFAULT 1,
    match_number INT NOT NULL,
    team_a_id INT NOT NULL,
    team_b_id INT NULL,
    venue_id INT NULL,
    scheduled_time DATETIME NOT NULL,
    status ENUM('SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    winner_team_id INT NULL,
    is_draw BOOLEAN NOT NULL DEFAULT FALSE,
    match_summary VARCHAR(255) NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (team_a_id) REFERENCES teams(team_id) ON DELETE RESTRICT,
    FOREIGN KEY (team_b_id) REFERENCES teams(team_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS match_scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    period_or_inning INT NOT NULL DEFAULT 1,
    score_primary INT NOT NULL DEFAULT 0,
    score_secondary INT DEFAULT 0,
    overs_or_minutes DECIMAL(5,2) DEFAULT 0.00,
    extra_details JSON NULL,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id INT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);`
  },
  {
    name: 'ArenaXApp.java',
    path: 'src/main/java/com/arenax/app/ArenaXApp.java',
    language: 'java',
    content: `package com.arenax.app;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

public class ArenaXApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        BorderPane root = new BorderPane();
        Scene scene = new Scene(root, 1380, 860);
        scene.getStylesheets().add(getClass().getResource("/css/arena-x.css").toExternalForm());
        primaryStage.setTitle("ARENA-X Sports Tournament Management");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    public static void main(String[] args) { launch(args); }
}`
  },
  {
    name: 'KnockoutScheduler.java',
    path: 'src/main/java/com/arenax/algorithm/KnockoutScheduler.java',
    language: 'java',
    content: `package com.arenax.algorithm;

import java.util.*;

public class KnockoutScheduler {
    public static List<int[]> generateRound1(List<Integer> teamIds) {
        int teamCount = teamIds.size();
        int bracketSize = 1;
        while (bracketSize < teamCount) bracketSize <<= 1;
        int byeCount = bracketSize - teamCount;

        List<int[]> fixtures = new ArrayList<>();
        // Assign BYEs to top seeds
        for (int i = 0; i < byeCount; i++) {
            fixtures.add(new int[]{teamIds.get(i), -1}); // -1 = BYE
        }
        int remainingStart = byeCount;
        int remaining = teamCount - byeCount;
        for (int i = 0; i < remaining / 2; i++) {
            fixtures.add(new int[]{teamIds.get(remainingStart + i), teamIds.get(remainingStart + remaining - 1 - i)});
        }
        return fixtures;
    }
}`
  },
  {
    name: 'RoundRobinScheduler.java',
    path: 'src/main/java/com/arenax/algorithm/RoundRobinScheduler.java',
    language: 'java',
    content: `package com.arenax.algorithm;

import java.util.*;

public class RoundRobinScheduler {
    public static List<int[]> generateFixtures(List<Integer> teamIds) {
        List<Integer> teams = new ArrayList<>(teamIds);
        if (teams.size() % 2 != 0) teams.add(-1); // dummy BYE

        int num = teams.size();
        int rounds = num - 1;
        List<int[]> matches = new ArrayList<>();

        for (int r = 0; r < rounds; r++) {
            for (int m = 0; m < num / 2; m++) {
                int home = (r + m) % (num - 1);
                int away = (num - 1 - m + r) % (num - 1);
                if (m == 0) away = num - 1;

                int tA = teams.get(home);
                int tB = teams.get(away);
                if (tA != -1 && tB != -1) {
                    matches.add(new int[]{tA, tB, r + 1});
                }
            }
        }
        return matches;
    }
}`
  },
  {
    name: 'ScoreManagementService.java',
    path: 'src/main/java/com/arenax/service/ScoreManagementService.java',
    language: 'java',
    content: `package com.arenax.service;

import com.arenax.database.DatabaseConnection;
import java.sql.*;

public class ScoreManagementService {
    public boolean updateMatchScoreTransaction(int matchId, int teamA, int teamB, int scoreA, int scoreB, Integer winnerId) {
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Begin ACID Transaction

            String s1 = "INSERT INTO match_scores (match_id, team_id, score_primary) VALUES (?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE score_primary = VALUES(score_primary)";
            try (PreparedStatement ps = conn.prepareStatement(s1)) {
                ps.setInt(1, matchId); ps.setInt(2, teamA); ps.setInt(3, scoreA); ps.executeUpdate();
                ps.setInt(1, matchId); ps.setInt(2, teamB); ps.setInt(3, scoreB); ps.executeUpdate();
            }

            String s2 = "UPDATE matches SET status = 'COMPLETED', winner_team_id = ? WHERE match_id = ?";
            try (PreparedStatement ps = conn.prepareStatement(s2)) {
                if (winnerId != null) ps.setInt(1, winnerId); else ps.setNull(1, Types.INTEGER);
                ps.setInt(2, matchId);
                ps.executeUpdate();
            }

            conn.commit(); // ACID Commit
            return true;
        } catch (SQLException e) {
            DatabaseConnection.rollback(conn);
            return false;
        } finally {
            if (conn != null) try { conn.setAutoCommit(true); conn.close(); } catch (Exception ignored) {}
        }
    }
}`
  }
];

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('arena-x-sports-system');

  JAVA_PROJECT_FILES.forEach(file => {
    folder?.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'arena-x-java21-mysql-capstone.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
