# ARENA-X
### Intelligent Sports Tournament Registration, Score Management & SQL Visualization System
**Enterprise Java 21 + JavaFX + MySQL 8.0+ College DBMS Capstone Project**

---

## 1. Project Architecture Overview

ARENA-X implements a layered Model-View-Controller (MVC) and Data Access Object (DAO) architecture:

```
com.arenax
├── algorithm       # Fixture generation algorithms (Knockout BYE, Round Robin polygon, League standings)
├── app             # JavaFX Desktop GUI entry point (ArenaXApp.java)
├── config          # Safe DB credential loading from db.properties / environment variables
├── controller      # JavaFX UI view controllers
├── dao             # JDBC Data Access Objects with PreparedStatements
├── database        # HikariCP pooled connection manager and transaction rollback utilities
├── model           # Strongly-typed domain models (User, Tournament, Team, Player, Match)
├── service         # Business services (TournamentService, ScoreManagementService with ACID transactions)
└── sql             # SQL Visualizer Engine for logical execution pipelines and query explanations
```

---

## 2. MySQL Workbench Setup Instructions

### Step 1: Open MySQL Workbench
Launch MySQL Workbench and connect to your local MySQL 8.0+ Server instance (`localhost:3306`).

### Step 2: Create the Database Schema
1. In MySQL Workbench, click **File** -> **Open SQL Script...**
2. Browse to `src/main/resources/database/schema.sql`.
3. Click the yellow **Lightning Bolt** icon to execute the script.
4. Refresh the **SCHEMAS** panel in the left sidebar. You will see `arena_x_db` with all 11 tables:
   - `users`, `players`, `teams`, `team_members`, `venues`, `tournaments`, `registrations`, `matches`, `match_scores`, `player_statistics`, `audit_logs`.

### Step 3: Populate Realistic Seed Data
1. Click **File** -> **Open SQL Script...**
2. Browse to `src/main/resources/database/seed_data.sql`.
3. Click the **Lightning Bolt** icon to execute.
4. This loads 22 teams, 110 players across Cricket, Football, Badminton, and Basketball, 4 tournaments, 34+ matches with realistic scores, venues, statistics, and audit trails.

---

## 3. Configuring Database Credentials

1. Navigate to `src/main/resources/`.
2. Copy `db.properties.example` to `db.properties`.
3. Open `db.properties` and enter your MySQL credentials:
```properties
db.host=localhost
db.port=3306
db.database=arena_x_db
db.username=root
db.password=YOUR_MYSQL_ROOT_PASSWORD
```

*Note: `db.properties` is git-ignored to prevent credential leaks.*

---

## 4. Running the Application

### Option A: Using Maven Command Line (Recommended)

Ensure you have **Java 21 JDK** and **Maven 3.9+** installed:

```bash
# Verify Java version
java -version

# Clean and compile the project
mvn clean compile

# Launch the JavaFX desktop application
mvn javafx:run

# Run unit tests
mvn test
```

### Option B: Using IntelliJ IDEA
1. Open IntelliJ IDEA -> **File** -> **Open...**
2. Select the `arena-x-java` directory (contains `pom.xml`).
3. IntelliJ will detect the Maven project and download dependencies (JavaFX 21, MySQL Connector/J, HikariCP, BCrypt).
4. Go to **Project Structure** (`Ctrl+Alt+Shift+S`) -> ensure **Project SDK** is set to **Java 21**.
5. Navigate to `src/main/java/com/arenax/app/ArenaXApp.java`.
6. Right-click and choose **Run 'ArenaXApp.main()'**.

### Option C: Using Eclipse IDE
1. Open Eclipse -> **File** -> **Import...** -> **Existing Maven Projects**.
2. Select the `arena-x-java` folder and click **Finish**.
3. Right-click the project -> **Run As** -> **Maven install**.
4. Right-click `ArenaXApp.java` -> **Run As** -> **Java Application**.

---

## 5. Security & Academic Integrity

- **Password Hashing**: Stored using industry-standard BCrypt (60-character salt-hashed strings). Plaintext passwords are never stored.
- **SQL Injection Prevention**: All queries execute via JDBC `PreparedStatement` with parameterized placeholders (`?`).
- **Transaction Atomicity**: Score updates and tournament bracket advancements execute inside atomic transactions (`conn.setAutoCommit(false); ... conn.commit();`) with automatic rollback on error.
- **Audit Trails**: Security actions and score updates generate immutable records in the `audit_logs` table.
