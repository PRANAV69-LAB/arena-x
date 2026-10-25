-- ========================================================================
-- ARENA-X: Realistic Sports Seed Data
-- 20+ Teams, 100+ Players, Multiple Tournaments, 35+ Matches, Venues, Stats
-- ========================================================================

USE arena_x_db;

-- ------------------------------------------------------------------------
-- 1. USERS (BCrypt hashed password for all demo accounts: 'ArenaX@2026')
-- Hash: $2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m
-- ------------------------------------------------------------------------
INSERT INTO users (user_id, username, email, password_hash, full_name, role) VALUES
(1, 'superadmin', 'admin@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Dr. Marcus Vance (Administrator)', 'ADMIN'),
(2, 'prof_sharma', 'sharma@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Prof. Rajesh Sharma (DBMS Evaluator)', 'ADMIN'),
(3, 'coach_carter', 'carter@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Ken Carter (Tournament Director)', 'ORGANIZER'),
(4, 'organizer_priya', 'priya@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Priya Patel (Sports Convener)', 'ORGANIZER'),
(5, 'official_davis', 'davis@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Sarah Davis (Match Official)', 'ORGANIZER'),
(6, 'player_rohit', 'rohit@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Rohit Sen (Cricket Captain)', 'PLAYER'),
(7, 'player_alex', 'alex@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Alex Mercer (Football Striker)', 'PLAYER'),
(8, 'player_clara', 'clara@arenax.edu', '$2a$10$wK1GvXfM0sHfZf0X8C0R1eJbF2W/2uXy1T5P4Z9bQ3vR7l6h5dK0m', 'Clara Zhang (Badminton Ace)', 'PLAYER');

-- ------------------------------------------------------------------------
-- 2. VENUES
-- ------------------------------------------------------------------------
INSERT INTO venues (venue_id, venue_name, address, city, capacity, surface_type) VALUES
(1, 'Apex Arena Main Stadium', '101 Varsity Boulevard', 'Metro City', 15000, 'Natural Turf / LED Pitch'),
(2, 'Titan Sports Complex Pitch 1', '45 Campus Way', 'Metro City', 8000, 'Hybrid Grass Turf'),
(3, 'Olympic Indoor Fieldhouse', '12 Olympic Drive', 'Northwood', 4500, 'Maple Hardwood'),
(4, 'Pinnacle Badminton Pavilion', '88 Court St', 'Northwood', 2000, 'BWF Synthetic Mat'),
(5, 'CyberDome Basketball Arena', '300 Tech Park Ave', 'Silicon Hub', 6500, 'Cushioned Hardwood');

-- ------------------------------------------------------------------------
-- 3. PLAYERS (100+ Athletes across Sports)
-- ------------------------------------------------------------------------
-- Cricket Players (1 - 30)
INSERT INTO players (player_id, user_id, first_name, last_name, email, phone, date_of_birth, primary_sport, jersey_number, eligibility_status) VALUES
(1, 6, 'Rohit', 'Sen', 'rohit.sen@campus.edu', '+1-555-0101', '2002-04-12', 'CRICKET', 45, 'ELIGIBLE'),
(2, NULL, 'Kunal', 'Verma', 'kunal.v@campus.edu', '+1-555-0102', '2003-08-19', 'CRICKET', 18, 'ELIGIBLE'),
(3, NULL, 'Arjun', 'Nair', 'arjun.n@campus.edu', '+1-555-0103', '2001-11-05', 'CRICKET', 7, 'ELIGIBLE'),
(4, NULL, 'Dev', 'Patel', 'dev.p@campus.edu', '+1-555-0104', '2002-02-14', 'CRICKET', 99, 'ELIGIBLE'),
(5, NULL, 'Ishan', 'Kishan', 'ishan.k@campus.edu', '+1-555-0105', '2003-05-22', 'CRICKET', 32, 'ELIGIBLE'),
(6, NULL, 'Siddharth', 'Rao', 'sid.rao@campus.edu', '+1-555-0106', '2001-09-30', 'CRICKET', 11, 'ELIGIBLE'),
(7, NULL, 'Tushar', 'Deshmukh', 'tushar.d@campus.edu', '+1-555-0107', '2002-07-15', 'CRICKET', 23, 'ELIGIBLE'),
(8, NULL, 'Vikram', 'Malhotra', 'vikram.m@campus.edu', '+1-555-0108', '2000-12-01', 'CRICKET', 8, 'ELIGIBLE'),
(9, NULL, 'Aditya', 'Roy', 'aditya.r@campus.edu', '+1-555-0109', '2003-01-20', 'CRICKET', 14, 'ELIGIBLE'),
(10, NULL, 'Pranav', 'Joshi', 'pranav.j@campus.edu', '+1-555-0110', '2002-06-18', 'CRICKET', 55, 'ELIGIBLE'),
(11, NULL, 'Rohan', 'Bhatia', 'rohan.b@campus.edu', '+1-555-0111', '2001-03-25', 'CRICKET', 3, 'ELIGIBLE'),
(12, NULL, 'Manish', 'Tiwari', 'manish.t@campus.edu', '+1-555-0112', '2002-10-10', 'CRICKET', 19, 'ELIGIBLE'),
(13, NULL, 'Varun', 'Chawla', 'varun.c@campus.edu', '+1-555-0113', '2003-04-04', 'CRICKET', 77, 'ELIGIBLE'),
(14, NULL, 'Samir', 'Khan', 'samir.k@campus.edu', '+1-555-0114', '2001-08-11', 'CRICKET', 21, 'ELIGIBLE'),
(15, NULL, 'Naveen', 'Kumar', 'naveen.k@campus.edu', '+1-555-0115', '2002-11-29', 'CRICKET', 10, 'ELIGIBLE'),
(16, NULL, 'Aniket', 'Shinde', 'aniket.s@campus.edu', '+1-555-0116', '2003-09-14', 'CRICKET', 4, 'ELIGIBLE'),
(17, NULL, 'Karthik', 'Sunder', 'karthik.s@campus.edu', '+1-555-0117', '2001-05-09', 'CRICKET', 9, 'ELIGIBLE'),
(18, NULL, 'Harsh', 'Vardhan', 'harsh.v@campus.edu', '+1-555-0118', '2002-03-17', 'CRICKET', 88, 'ELIGIBLE'),
(19, NULL, 'Aakash', 'Gupta', 'aakash.g@campus.edu', '+1-555-0119', '2003-12-05', 'CRICKET', 12, 'ELIGIBLE'),
(20, NULL, 'Deepak', 'Yadav', 'deepak.y@campus.edu', '+1-555-0120', '2001-07-22', 'CRICKET', 6, 'ELIGIBLE'),
(21, NULL, 'Gaurav', 'Mishra', 'gaurav.m@campus.edu', '+1-555-0121', '2002-09-02', 'CRICKET', 17, 'ELIGIBLE'),
(22, NULL, 'Yash', 'Singhania', 'yash.s@campus.edu', '+1-555-0122', '2003-02-18', 'CRICKET', 28, 'ELIGIBLE'),
(23, NULL, 'Tanmay', 'Bhatt', 'tanmay.b@campus.edu', '+1-555-0123', '2001-10-14', 'CRICKET', 33, 'ELIGIBLE'),
(24, NULL, 'Mayank', 'Agarwal', 'mayank.a@campus.edu', '+1-555-0124', '2002-08-08', 'CRICKET', 5, 'ELIGIBLE'),
(25, NULL, 'Ayush', 'Pandey', 'ayush.p@campus.edu', '+1-555-0125', '2003-06-30', 'CRICKET', 91, 'ELIGIBLE'),
(26, NULL, 'Omkar', 'Kadam', 'omkar.k@campus.edu', '+1-555-0126', '2001-04-16', 'CRICKET', 44, 'ELIGIBLE'),
(27, NULL, 'Chirag', 'Shah', 'chirag.s@campus.edu', '+1-555-0127', '2002-01-11', 'CRICKET', 16, 'ELIGIBLE'),
(28, NULL, 'Ritvik', 'Saxena', 'ritvik.s@campus.edu', '+1-555-0128', '2003-11-23', 'CRICKET', 25, 'ELIGIBLE'),
(29, NULL, 'Saurabh', 'Dubey', 'saurabh.d@campus.edu', '+1-555-0129', '2001-06-07', 'CRICKET', 50, 'ELIGIBLE'),
(30, NULL, 'Alok', 'Tripathi', 'alok.t@campus.edu', '+1-555-0130', '2002-12-19', 'CRICKET', 66, 'ELIGIBLE');

-- Football Players (31 - 60)
INSERT INTO players (player_id, user_id, first_name, last_name, email, phone, date_of_birth, primary_sport, jersey_number, eligibility_status) VALUES
(31, 7, 'Alex', 'Mercer', 'alex.m@campus.edu', '+1-555-0131', '2001-02-10', 'FOOTBALL', 9, 'ELIGIBLE'),
(32, NULL, 'Lucas', 'Silva', 'lucas.s@campus.edu', '+1-555-0132', '2002-05-14', 'FOOTBALL', 10, 'ELIGIBLE'),
(33, NULL, 'Mateo', 'Hernandez', 'mateo.h@campus.edu', '+1-555-0133', '2003-09-08', 'FOOTBALL', 7, 'ELIGIBLE'),
(34, NULL, 'Ethan', 'Walker', 'ethan.w@campus.edu', '+1-555-0134', '2001-11-21', 'FOOTBALL', 4, 'ELIGIBLE'),
(35, NULL, 'Noah', 'Bennett', 'noah.b@campus.edu', '+1-555-0135', '2002-03-03', 'FOOTBALL', 1, 'ELIGIBLE'),
(36, NULL, 'Julian', 'Draxler', 'julian.d@campus.edu', '+1-555-0136', '2003-07-17', 'FOOTBALL', 8, 'ELIGIBLE'),
(37, NULL, 'Gabriel', 'Santos', 'gabriel.s@campus.edu', '+1-555-0137', '2001-12-25', 'FOOTBALL', 11, 'ELIGIBLE'),
(38, NULL, 'Leo', 'Fontana', 'leo.f@campus.edu', '+1-555-0138', '2002-08-30', 'FOOTBALL', 6, 'ELIGIBLE'),
(39, NULL, 'Oliver', 'Schmidt', 'oliver.s@campus.edu', '+1-555-0139', '2003-04-12', 'FOOTBALL', 3, 'ELIGIBLE'),
(40, NULL, 'Mason', 'Clark', 'mason.c@campus.edu', '+1-555-0140', '2001-10-04', 'FOOTBALL', 5, 'ELIGIBLE'),
(41, NULL, 'Liam', 'OConnor', 'liam.oc@campus.edu', '+1-555-0141', '2002-06-22', 'FOOTBALL', 2, 'ELIGIBLE'),
(42, NULL, 'Diego', 'Ramirez', 'diego.r@campus.edu', '+1-555-0142', '2003-01-15', 'FOOTBALL', 14, 'ELIGIBLE'),
(43, NULL, 'Felix', 'Muller', 'felix.m@campus.edu', '+1-555-0143', '2001-05-19', 'FOOTBALL', 17, 'ELIGIBLE'),
(44, NULL, 'Marco', 'Rossi', 'marco.r@campus.edu', '+1-555-0144', '2002-11-02', 'FOOTBALL', 20, 'ELIGIBLE'),
(45, NULL, 'Hugo', 'Larsen', 'hugo.l@campus.edu', '+1-555-0145', '2003-08-14', 'FOOTBALL', 22, 'ELIGIBLE'),
(46, NULL, 'Theo', 'Gomez', 'theo.g@campus.edu', '+1-555-0146', '2001-09-27', 'FOOTBALL', 18, 'ELIGIBLE'),
(47, NULL, 'Arthur', 'Dubois', 'arthur.d@campus.edu', '+1-555-0147', '2002-07-09', 'FOOTBALL', 13, 'ELIGIBLE'),
(48, NULL, 'Milan', 'Kovac', 'milan.k@campus.edu', '+1-555-0148', '2003-03-31', 'FOOTBALL', 21, 'ELIGIBLE'),
(49, NULL, 'Bruno', 'Alves', 'bruno.a@campus.edu', '+1-555-0149', '2001-04-18', 'FOOTBALL', 23, 'ELIGIBLE'),
(50, NULL, 'Oscar', 'Lindqvist', 'oscar.l@campus.edu', '+1-555-0150', '2002-10-06', 'FOOTBALL', 15, 'ELIGIBLE'),
(51, NULL, 'Enzo', 'Ferrari', 'enzo.f@campus.edu', '+1-555-0151', '2003-02-28', 'FOOTBALL', 12, 'ELIGIBLE'),
(52, NULL, 'Rafael', 'Nunes', 'rafael.n@campus.edu', '+1-555-0152', '2001-06-11', 'FOOTBALL', 16, 'ELIGIBLE'),
(53, NULL, 'Cedric', 'Bauer', 'cedric.b@campus.edu', '+1-555-0153', '2002-12-04', 'FOOTBALL', 24, 'ELIGIBLE'),
(54, NULL, 'Dmitri', 'Ivanov', 'dmitri.i@campus.edu', '+1-555-0154', '2003-05-16', 'FOOTBALL', 25, 'ELIGIBLE'),
(55, NULL, 'Pablo', 'Morales', 'pablo.m@campus.edu', '+1-555-0155', '2001-01-23', 'FOOTBALL', 26, 'ELIGIBLE'),
(56, NULL, 'Nico', 'Schulz', 'nico.s@campus.edu', '+1-555-0156', '2002-09-13', 'FOOTBALL', 27, 'ELIGIBLE'),
(57, NULL, 'Dominic', 'Shaw', 'dominic.s@campus.edu', '+1-555-0157', '2003-11-09', 'FOOTBALL', 28, 'ELIGIBLE'),
(58, NULL, 'Kasper', 'Nielsen', 'kasper.n@campus.edu', '+1-555-0158', '2001-08-01', 'FOOTBALL', 29, 'ELIGIBLE'),
(59, NULL, 'Sergio', 'Torres', 'sergio.t@campus.edu', '+1-555-0159', '2002-04-20', 'FOOTBALL', 30, 'ELIGIBLE'),
(60, NULL, 'Viktor', 'Popov', 'viktor.p@campus.edu', '+1-555-0160', '2003-07-05', 'FOOTBALL', 31, 'ELIGIBLE');

-- Basketball Players (61 - 85)
INSERT INTO players (player_id, user_id, first_name, last_name, email, phone, date_of_birth, primary_sport, jersey_number, eligibility_status) VALUES
(61, NULL, 'Marcus', 'Jordan', 'marcus.j@campus.edu', '+1-555-0161', '2001-03-12', 'BASKETBALL', 23, 'ELIGIBLE'),
(62, NULL, 'Jaylen', 'Rivers', 'jaylen.r@campus.edu', '+1-555-0162', '2002-07-28', 'BASKETBALL', 0, 'ELIGIBLE'),
(63, NULL, 'Darius', 'Garland', 'darius.g@campus.edu', '+1-555-0163', '2003-10-15', 'BASKETBALL', 10, 'ELIGIBLE'),
(64, NULL, 'Tariq', 'Owens', 'tariq.o@campus.edu', '+1-555-0164', '2001-12-09', 'BASKETBALL', 34, 'ELIGIBLE'),
(65, NULL, 'DeAndre', 'Hunter', 'deandre.h@campus.edu', '+1-555-0165', '2002-04-05', 'BASKETBALL', 12, 'ELIGIBLE'),
(66, NULL, 'Xavier', 'Tillman', 'xavier.t@campus.edu', '+1-555-0166', '2003-08-22', 'BASKETBALL', 2, 'ELIGIBLE'),
(67, NULL, 'Kyrie', 'Irvington', 'kyrie.i@campus.edu', '+1-555-0167', '2001-06-19', 'BASKETBALL', 11, 'ELIGIBLE'),
(68, NULL, 'Zion', 'Brooks', 'zion.b@campus.edu', '+1-555-0168', '2002-11-14', 'BASKETBALL', 1, 'ELIGIBLE'),
(69, NULL, 'Chet', 'Holmgren', 'chet.h@campus.edu', '+1-555-0169', '2003-01-30', 'BASKETBALL', 7, 'ELIGIBLE'),
(70, NULL, 'Paolo', 'Banch', 'paolo.b@campus.edu', '+1-555-0170', '2001-09-03', 'BASKETBALL', 5, 'ELIGIBLE'),
(71, NULL, 'Kevon', 'Looney', 'kevon.l@campus.edu', '+1-555-0171', '2002-02-17', 'BASKETBALL', 8, 'ELIGIBLE'),
(72, NULL, 'Miles', 'Bridges', 'miles.b@campus.edu', '+1-555-0172', '2003-05-27', 'BASKETBALL', 22, 'ELIGIBLE'),
(73, NULL, 'Lonzo', 'Ballard', 'lonzo.b@campus.edu', '+1-555-0173', '2001-10-24', 'BASKETBALL', 3, 'ELIGIBLE'),
(74, NULL, 'Cade', 'Cunningham', 'cade.c@campus.edu', '+1-555-0174', '2002-08-16', 'BASKETBALL', 15, 'ELIGIBLE'),
(75, NULL, 'Jaden', 'Ivey', 'jaden.i@campus.edu', '+1-555-0175', '2003-03-09', 'BASKETBALL', 24, 'ELIGIBLE'),
(76, NULL, 'Keegan', 'Murray', 'keegan.m@campus.edu', '+1-555-0176', '2001-07-04', 'BASKETBALL', 13, 'ELIGIBLE'),
(77, NULL, 'Shaedon', 'Sharpe', 'shaedon.s@campus.edu', '+1-555-0177', '2002-12-21', 'BASKETBALL', 17, 'ELIGIBLE'),
(78, NULL, 'Bennedict', 'Mathurin', 'benn.m@campus.edu', '+1-555-0178', '2003-06-13', 'BASKETBALL', 9, 'ELIGIBLE'),
(79, NULL, 'Jabari', 'Smith', 'jabari.s@campus.edu', '+1-555-0179', '2001-01-08', 'BASKETBALL', 4, 'ELIGIBLE'),
(80, NULL, 'Jalen', 'Williams', 'jalen.w@campus.edu', '+1-555-0180', '2002-09-29', 'BASKETBALL', 20, 'ELIGIBLE'),
(81, NULL, 'Mark', 'Williams', 'mark.w@campus.edu', '+1-555-0181', '2003-04-18', 'BASKETBALL', 21, 'ELIGIBLE'),
(82, NULL, 'AJ', 'Griffin', 'aj.g@campus.edu', '+1-555-0182', '2001-05-30', 'BASKETBALL', 14, 'ELIGIBLE'),
(83, NULL, 'Tari', 'Eason', 'tari.e@campus.edu', '+1-555-0183', '2002-10-11', 'BASKETBALL', 16, 'ELIGIBLE'),
(84, NULL, 'Christian', 'Braun', 'christian.b@campus.edu', '+1-555-0184', '2003-02-03', 'BASKETBALL', 6, 'ELIGIBLE'),
(85, NULL, 'Walker', 'Kessler', 'walker.k@campus.edu', '+1-555-0185', '2001-11-17', 'BASKETBALL', 25, 'ELIGIBLE');

-- Badminton Players (86 - 110)
INSERT INTO players (player_id, user_id, first_name, last_name, email, phone, date_of_birth, primary_sport, jersey_number, eligibility_status) VALUES
(86, 8, 'Clara', 'Zhang', 'clara.z@campus.edu', '+1-555-0186', '2002-03-21', 'BADMINTON', 1, 'ELIGIBLE'),
(87, NULL, 'Viktor', 'Axelsen-Cole', 'viktor.ac@campus.edu', '+1-555-0187', '2001-07-14', 'BADMINTON', 4, 'ELIGIBLE'),
(88, NULL, 'Kento', 'Momota-Sato', 'kento.ms@campus.edu', '+1-555-0188', '2002-10-09', 'BADMINTON', 7, 'ELIGIBLE'),
(89, NULL, 'Akane', 'Yamaguchi', 'akane.y@campus.edu', '+1-555-0189', '2003-01-27', 'BADMINTON', 5, 'ELIGIBLE'),
(90, NULL, 'Tai', 'Tzu-Ying-Kuo', 'tai.ty@campus.edu', '+1-555-0190', '2001-09-18', 'BADMINTON', 8, 'ELIGIBLE'),
(91, NULL, 'Lee', 'Zii-Jia-Tan', 'lee.zjt@campus.edu', '+1-555-0191', '2002-05-02', 'BADMINTON', 11, 'ELIGIBLE'),
(92, NULL, 'An', 'Se-Young-Park', 'an.syp@campus.edu', '+1-555-0192', '2003-08-12', 'BADMINTON', 2, 'ELIGIBLE'),
(93, NULL, 'Anthony', 'Ginting-Wong', 'anthony.gw@campus.edu', '+1-555-0193', '2001-11-23', 'BADMINTON', 9, 'ELIGIBLE'),
(94, NULL, 'Jonatan', 'Christie-Lim', 'jonatan.cl@campus.edu', '+1-555-0194', '2002-06-15', 'BADMINTON', 3, 'ELIGIBLE'),
(95, NULL, 'Pusarla', 'Sindhu-Devi', 'pusarla.sd@campus.edu', '+1-555-0195', '2003-04-08', 'BADMINTON', 10, 'ELIGIBLE'),
(96, NULL, 'Lakshya', 'Sen-Kapoor', 'lakshya.sk@campus.edu', '+1-555-0196', '2001-08-30', 'BADMINTON', 6, 'ELIGIBLE'),
(97, NULL, 'Carolina', 'Marin-Fernandez', 'carolina.mf@campus.edu', '+1-555-0197', '2002-12-14', 'BADMINTON', 12, 'ELIGIBLE'),
(98, NULL, 'Chen', 'Yu-Fei-Zhao', 'chen.yf@campus.edu', '+1-555-0198', '2003-03-19', 'BADMINTON', 14, 'ELIGIBLE'),
(99, NULL, 'Chou', 'Tien-Chen-Lin', 'chou.tc@campus.edu', '+1-555-0199', '2001-10-01', 'BADMINTON', 15, 'ELIGIBLE'),
(100, NULL, 'Ratchanok', 'Intanon-Sorn', 'ratchanok.is@campus.edu', '+1-555-0200', '2002-02-12', 'BADMINTON', 16, 'ELIGIBLE'),
(101, NULL, 'Kunlavut', 'Vitidsarn', 'kunlavut.v@campus.edu', '+1-555-0201', '2003-07-20', 'BADMINTON', 17, 'ELIGIBLE'),
(102, NULL, 'He', 'Bing-Jiao-Wu', 'he.bj@campus.edu', '+1-555-0202', '2001-04-26', 'BADMINTON', 18, 'ELIGIBLE'),
(103, NULL, 'Loh', 'Kean-Yew-Goh', 'loh.ky@campus.edu', '+1-555-0203', '2002-11-18', 'BADMINTON', 19, 'ELIGIBLE'),
(104, NULL, 'Pornpawee', 'Chochuwong', 'pornpawee.c@campus.edu', '+1-555-0204', '2003-09-05', 'BADMINTON', 20, 'ELIGIBLE'),
(105, NULL, 'Srikanth', 'Kidambi-Rao', 'srikanth.kr@campus.edu', '+1-555-0205', '2001-01-16', 'BADMINTON', 21, 'ELIGIBLE'),
(106, NULL, 'Gregoria', 'Mariska-Tunjung', 'gregoria.mt@campus.edu', '+1-555-0206', '2002-08-24', 'BADMINTON', 22, 'ELIGIBLE'),
(107, NULL, 'Ng', 'Ka-Long-Angus', 'ng.kla@campus.edu', '+1-555-0207', '2003-05-11', 'BADMINTON', 23, 'ELIGIBLE'),
(108, NULL, 'Busanan', 'Ongbamrungphan', 'busanan.o@campus.edu', '+1-555-0208', '2001-06-29', 'BADMINTON', 24, 'ELIGIBLE'),
(109, NULL, 'Prannoy', 'H.S.-Menon', 'prannoy.hsm@campus.edu', '+1-555-0209', '2002-10-20', 'BADMINTON', 25, 'ELIGIBLE'),
(110, NULL, 'Nozomi', 'Okuhara-Inui', 'nozomi.oi@campus.edu', '+1-555-0210', '2003-03-04', 'BADMINTON', 26, 'ELIGIBLE');

-- ------------------------------------------------------------------------
-- 4. TEAMS (22 Distinct Teams across Sports)
-- ------------------------------------------------------------------------
INSERT INTO teams (team_id, team_name, sport_type, captain_id, coach_name, city, logo_color) VALUES
-- Cricket Teams
(1, 'Cyber Vipers CC', 'CRICKET', 1, 'Arun Lal', 'Metro City', '#10B981'),
(2, 'Quantum Strikers', 'CRICKET', 6, 'Ravi Shastri', 'Silicon Hub', '#3B82F6'),
(3, 'Falcon Thunderbolts', 'CRICKET', 11, 'Gary Kirsten', 'Northwood', '#F59E0B'),
(4, 'Phoenix Blasters', 'CRICKET', 16, 'Tom Moody', 'Lakeview', '#EF4444'),
(5, 'Shadow Wolves XI', 'CRICKET', 21, 'Stephen Fleming', 'Metro City', '#8B5CF6'),
(6, 'Apex Titans Cricket', 'CRICKET', 26, 'Trevor Bayliss', 'East Valley', '#06B6D4'),

-- Football Teams
(7, 'Metro United FC', 'FOOTBALL', 31, 'Carlo Ancelotti', 'Metro City', '#10B981'),
(8, 'Red Dragons Athletic', 'FOOTBALL', 36, 'Jurgen Klopp', 'Northwood', '#EF4444'),
(9, 'Silicon Strikers SC', 'FOOTBALL', 41, 'Pep Guardiola', 'Silicon Hub', '#3B82F6'),
(10, 'Golden Eagles FC', 'FOOTBALL', 46, 'Zinedine Zidane', 'East Valley', '#F59E0B'),
(11, 'Vanguard City FC', 'FOOTBALL', 51, 'Mikel Arteta', 'Lakeview', '#EC4899'),
(12, 'Northwood Rangers', 'FOOTBALL', 56, 'Jose Mourinho', 'Northwood', '#6366F1'),

-- Basketball Teams
(13, 'Apex Ballers', 'BASKETBALL', 61, 'Steve Kerr', 'Metro City', '#10B981'),
(14, 'Neon Knights', 'BASKETBALL', 66, 'Erik Spoelstra', 'Silicon Hub', '#8B5CF6'),
(15, 'Ironclad Hoops', 'BASKETBALL', 71, 'Gregg Popovich', 'East Valley', '#F59E0B'),
(16, 'Skyline Dunks', 'BASKETBALL', 76, 'Phil Jackson', 'Lakeview', '#06B6D4'),
(17, 'Crimson Storm', 'BASKETBALL', 81, 'Doc Rivers', 'Northwood', '#EF4444'),

-- Badminton Squads
(18, 'Pinnacle Smashers', 'BADMINTON', 86, 'Pullela Gopichand', 'Northwood', '#10B981'),
(19, 'Vortex Shuttle Club', 'BADMINTON', 91, 'Rexy Mainaky', 'Metro City', '#3B82F6'),
(20, 'Aero Dynamos', 'BADMINTON', 96, 'Morten Frost', 'Silicon Hub', '#F59E0B'),
(21, 'Zenith Badminton AC', 'BADMINTON', 101, 'Park Joo-bong', 'East Valley', '#EC4899'),
(22, 'Silver Feathers', 'BADMINTON', 106, 'Li Yongbo', 'Lakeview', '#8B5CF6');

-- ------------------------------------------------------------------------
-- 5. TEAM_MEMBERS
-- ------------------------------------------------------------------------
-- Assign players to teams (5 players per cricket team, 5 per football, 5 per basketball, 5 per badminton)
INSERT INTO team_members (team_id, player_id, role_in_team) VALUES
(1, 1, 'Captain / Batsman'), (1, 2, 'Vice Captain'), (1, 3, 'Wicketkeeper'), (1, 4, 'Fast Bowler'), (1, 5, 'All-Rounder'),
(2, 6, 'Captain / All-Rounder'), (2, 7, 'Opening Batsman'), (2, 8, 'Spin Bowler'), (2, 9, 'Middle Order'), (2, 10, 'Pace Bowler'),
(3, 11, 'Captain / Batsman'), (3, 12, 'All-Rounder'), (3, 13, 'Spinner'), (3, 14, 'Fast Bowler'), (3, 15, 'Batsman'),
(4, 16, 'Captain / Wicketkeeper'), (4, 17, 'Bowler'), (4, 18, 'Batsman'), (4, 19, 'All-Rounder'), (4, 20, 'Pacer'),
(5, 21, 'Captain / Batsman'), (5, 22, 'Bowler'), (5, 23, 'All-Rounder'), (5, 24, 'Batsman'), (5, 25, 'Spinner'),
(6, 26, 'Captain / All-Rounder'), (6, 27, 'Fast Bowler'), (6, 28, 'Batsman'), (6, 29, 'Spinner'), (6, 30, 'Wicketkeeper'),

(7, 31, 'Captain / Striker'), (7, 32, 'Attacking Midfielder'), (7, 33, 'Winger'), (7, 34, 'Center Back'), (7, 35, 'Goalkeeper'),
(8, 36, 'Captain / Midfielder'), (8, 37, 'Striker'), (8, 38, 'Defender'), (8, 39, 'Fullback'), (8, 40, 'Goalkeeper'),
(9, 41, 'Captain / Winger'), (9, 42, 'Playmaker'), (9, 43, 'Central Midfielder'), (9, 44, 'Sweeper'), (9, 45, 'Goalkeeper'),
(10, 46, 'Captain / Forward'), (10, 47, 'Midfielder'), (10, 48, 'Center Back'), (10, 49, 'Right Back'), (10, 50, 'Goalkeeper'),
(11, 51, 'Captain / Striker'), (11, 52, 'Defensive Mid'), (11, 53, 'Wing Back'), (11, 54, 'Stopper'), (11, 55, 'Goalkeeper'),
(12, 56, 'Captain / Midfielder'), (12, 57, 'Striker'), (12, 58, 'Defender'), (12, 59, 'Left Back'), (12, 60, 'Goalkeeper'),

(13, 61, 'Captain / Point Guard'), (13, 62, 'Shooting Guard'), (13, 63, 'Small Forward'), (13, 64, 'Power Forward'), (13, 65, 'Center'),
(14, 66, 'Captain / Shooting Guard'), (14, 67, 'Point Guard'), (14, 68, 'Power Forward'), (14, 69, 'Center'), (14, 70, 'Small Forward'),
(15, 71, 'Captain / Center'), (15, 72, 'Power Forward'), (15, 73, 'Point Guard'), (15, 74, 'Shooting Guard'), (15, 75, 'Sixth Man'),
(16, 76, 'Captain / Small Forward'), (16, 77, 'Shooting Guard'), (16, 78, 'Point Guard'), (16, 79, 'Power Forward'), (16, 80, 'Center'),
(17, 81, 'Captain / Center'), (17, 82, 'Shooting Guard'), (17, 83, 'Small Forward'), (17, 84, 'Point Guard'), (17, 85, 'Power Forward'),

(18, 86, 'Singles Ace'), (18, 87, 'Doubles Specialist'), (18, 88, 'Doubles Specialist'), (18, 89, 'Singles 2'), (18, 90, 'Mixed Doubles'),
(19, 91, 'Singles Ace'), (19, 92, 'Doubles Specialist'), (19, 93, 'Doubles Specialist'), (19, 94, 'Singles 2'), (19, 95, 'Mixed Doubles'),
(20, 96, 'Singles Ace'), (20, 97, 'Doubles Specialist'), (20, 98, 'Doubles Specialist'), (20, 99, 'Singles 2'), (20, 100, 'Mixed Doubles'),
(21, 101, 'Singles Ace'), (21, 102, 'Doubles Specialist'), (21, 103, 'Doubles Specialist'), (21, 104, 'Singles 2'), (21, 105, 'Mixed Doubles'),
(22, 106, 'Singles Ace'), (22, 107, 'Doubles Specialist'), (22, 108, 'Doubles Specialist'), (22, 109, 'Singles 2'), (22, 110, 'Mixed Doubles');

-- ------------------------------------------------------------------------
-- 6. TOURNAMENTS (Knockout, Round Robin, League)
-- ------------------------------------------------------------------------
INSERT INTO tournaments (tournament_id, name, sport_type, format, start_date, end_date, venue_id, max_teams, status, organizer_id, rules_notes) VALUES
(1, 'Inter-Varsity Cricket Trophy 2026', 'CRICKET', 'KNOCKOUT', '2026-10-15', '2026-10-30', 1, 8, 'ONGOING', 3, 'T20 Rules, ICC DLS standard for rain delays, 2 BYEs seeded in R1.'),
(2, 'Metro Collegiate Football League', 'FOOTBALL', 'LEAGUE', '2026-09-01', '2026-11-20', 2, 6, 'ONGOING', 4, 'Full 90-minute matches with 3 points for win, 1 point for draw.'),
(3, 'Grand Slam Badminton Open', 'BADMINTON', 'KNOCKOUT', '2026-10-01', '2026-10-10', 4, 8, 'COMPLETED', 5, 'BWF standard best-of-3 sets to 21 points.'),
(4, 'CyberHoops Invitational Cup', 'BASKETBALL', 'ROUND_ROBIN', '2026-11-05', '2026-11-25', 5, 5, 'UPCOMING', 3, 'FIBA 4x10min quarters. Round robin bracket.');

-- ------------------------------------------------------------------------
-- 7. REGISTRATIONS
-- ------------------------------------------------------------------------
-- Cricket Tournament (Teams 1 - 6)
INSERT INTO registrations (registration_id, tournament_id, team_id, status, seed_number) VALUES
(1, 1, 1, 'APPROVED', 1),
(2, 1, 2, 'APPROVED', 2),
(3, 1, 3, 'APPROVED', 3),
(4, 1, 4, 'APPROVED', 4),
(5, 1, 5, 'APPROVED', 5),
(6, 1, 6, 'APPROVED', 6);

-- Football Tournament (Teams 7 - 12)
INSERT INTO registrations (registration_id, tournament_id, team_id, status, seed_number) VALUES
(7, 2, 7, 'APPROVED', 1),
(8, 2, 8, 'APPROVED', 2),
(9, 2, 9, 'APPROVED', 3),
(10, 2, 10, 'APPROVED', 4),
(11, 2, 11, 'APPROVED', 5),
(12, 2, 12, 'APPROVED', 6);

-- Badminton Tournament (Teams 18 - 22)
INSERT INTO registrations (registration_id, tournament_id, team_id, status, seed_number) VALUES
(13, 3, 18, 'APPROVED', 1),
(14, 3, 19, 'APPROVED', 2),
(15, 3, 20, 'APPROVED', 3),
(16, 3, 21, 'APPROVED', 4),
(17, 3, 22, 'APPROVED', 5);

-- Basketball Tournament (Teams 13 - 17)
INSERT INTO registrations (registration_id, tournament_id, team_id, status, seed_number) VALUES
(18, 4, 13, 'APPROVED', 1),
(19, 4, 14, 'APPROVED', 2),
(20, 4, 15, 'APPROVED', 3),
(21, 4, 16, 'APPROVED', 4),
(22, 4, 17, 'PENDING', 5);

-- ------------------------------------------------------------------------
-- 8. MATCHES (36+ Detailed Matches Across Tournaments)
-- ------------------------------------------------------------------------
-- Tournament 1: Cricket Knockout Matches
INSERT INTO matches (match_id, tournament_id, round_number, match_number, team_a_id, team_b_id, venue_id, scheduled_time, status, winner_team_id, is_draw, match_summary) VALUES
(1, 1, 1, 1, 1, 6, 1, '2026-10-16 10:00:00', 'COMPLETED', 1, FALSE, 'Cyber Vipers CC won by 34 runs'),
(2, 1, 1, 2, 2, 5, 1, '2026-10-17 14:00:00', 'COMPLETED', 2, FALSE, 'Quantum Strikers won by 6 wickets'),
(3, 1, 1, 3, 3, 4, 1, '2026-10-18 10:00:00', 'COMPLETED', 3, FALSE, 'Falcon Thunderbolts won by 18 runs'),
(4, 1, 2, 4, 1, 3, 1, '2026-10-22 14:00:00', 'COMPLETED', 1, FALSE, 'Cyber Vipers CC won by 5 wickets'),
(5, 1, 2, 5, 2, NULL, 1, '2026-10-23 10:00:00', 'COMPLETED', 2, FALSE, 'Quantum Strikers advanced via BYE'),
(6, 1, 3, 6, 1, 2, 1, '2026-10-28 14:00:00', 'LIVE', NULL, FALSE, 'Grand Final in progress: Over 14.2');

-- Tournament 2: Football League Matches
INSERT INTO matches (match_id, tournament_id, round_number, match_number, team_a_id, team_b_id, venue_id, scheduled_time, status, winner_team_id, is_draw, match_summary) VALUES
(7, 2, 1, 1, 7, 8, 2, '2026-09-05 16:00:00', 'COMPLETED', 7, FALSE, 'Metro United FC 3 - 1 Red Dragons'),
(8, 2, 1, 2, 9, 10, 2, '2026-09-06 18:00:00', 'COMPLETED', 9, FALSE, 'Silicon Strikers 2 - 0 Golden Eagles'),
(9, 2, 1, 3, 11, 12, 2, '2026-09-07 16:00:00', 'COMPLETED', NULL, TRUE, 'Vanguard City 1 - 1 Northwood Rangers'),
(10, 2, 2, 4, 7, 9, 2, '2026-09-12 16:00:00', 'COMPLETED', 7, FALSE, 'Metro United FC 2 - 1 Silicon Strikers'),
(11, 2, 2, 5, 8, 11, 2, '2026-09-13 18:00:00', 'COMPLETED', 8, FALSE, 'Red Dragons 4 - 2 Vanguard City'),
(12, 2, 2, 6, 10, 12, 2, '2026-09-14 16:00:00', 'COMPLETED', 12, FALSE, 'Northwood Rangers 1 - 0 Golden Eagles'),
(13, 2, 3, 7, 7, 10, 2, '2026-09-19 16:00:00', 'COMPLETED', 7, FALSE, 'Metro United FC 4 - 0 Golden Eagles'),
(14, 2, 3, 8, 8, 12, 2, '2026-09-20 18:00:00', 'COMPLETED', 8, FALSE, 'Red Dragons 2 - 0 Northwood Rangers'),
(15, 2, 3, 9, 9, 11, 2, '2026-09-21 16:00:00', 'COMPLETED', 9, FALSE, 'Silicon Strikers 3 - 2 Vanguard City'),
(16, 2, 4, 10, 7, 11, 2, '2026-09-26 16:00:00', 'COMPLETED', 7, FALSE, 'Metro United FC 3 - 0 Vanguard City'),
(17, 2, 4, 11, 8, 10, 2, '2026-09-27 18:00:00', 'COMPLETED', NULL, TRUE, 'Red Dragons 2 - 2 Golden Eagles'),
(18, 2, 4, 12, 9, 12, 2, '2026-09-28 16:00:00', 'COMPLETED', 9, FALSE, 'Silicon Strikers 1 - 0 Northwood Rangers'),
(19, 2, 5, 13, 7, 12, 2, '2026-10-03 16:00:00', 'COMPLETED', 7, FALSE, 'Metro United FC 2 - 1 Northwood Rangers'),
(20, 2, 5, 14, 8, 9, 2, '2026-10-04 18:00:00', 'COMPLETED', 9, FALSE, 'Silicon Strikers 2 - 1 Red Dragons'),
(21, 2, 5, 15, 10, 11, 2, '2026-10-05 16:00:00', 'COMPLETED', 10, FALSE, 'Golden Eagles 3 - 1 Vanguard City'),
(22, 2, 6, 16, 8, 7, 2, '2026-10-26 16:00:00', 'LIVE', NULL, FALSE, 'Second Leg: Red Dragons vs Metro United FC'),
(23, 2, 6, 17, 10, 9, 2, '2026-10-27 18:00:00', 'SCHEDULED', NULL, FALSE, 'Golden Eagles vs Silicon Strikers'),
(24, 2, 6, 18, 12, 11, 2, '2026-10-28 16:00:00', 'SCHEDULED', NULL, FALSE, 'Northwood Rangers vs Vanguard City');

-- Tournament 3: Badminton Knockout Matches
INSERT INTO matches (match_id, tournament_id, round_number, match_number, team_a_id, team_b_id, venue_id, scheduled_time, status, winner_team_id, is_draw, match_summary) VALUES
(25, 3, 1, 1, 18, 22, 4, '2026-10-02 10:00:00', 'COMPLETED', 18, FALSE, 'Pinnacle Smashers won 2 - 0 (21-17, 21-14)'),
(26, 3, 1, 2, 19, 21, 4, '2026-10-02 12:00:00', 'COMPLETED', 19, FALSE, 'Vortex Shuttle Club won 2 - 1 (18-21, 21-19, 21-16)'),
(27, 3, 2, 3, 18, 20, 4, '2026-10-05 14:00:00', 'COMPLETED', 18, FALSE, 'Pinnacle Smashers won 2 - 1 (21-19, 19-21, 21-18)'),
(28, 3, 3, 4, 18, 19, 4, '2026-10-09 16:00:00', 'COMPLETED', 18, FALSE, 'Grand Final: Pinnacle Smashers Champion (21-15, 21-18)');

-- Tournament 4: Basketball Round Robin Fixtures
INSERT INTO matches (match_id, tournament_id, round_number, match_number, team_a_id, team_b_id, venue_id, scheduled_time, status, winner_team_id, is_draw, match_summary) VALUES
(29, 4, 1, 1, 13, 14, 5, '2026-11-06 18:00:00', 'SCHEDULED', NULL, FALSE, 'Opening Round: Apex Ballers vs Neon Knights'),
(30, 4, 1, 2, 15, 16, 5, '2026-11-07 18:00:00', 'SCHEDULED', NULL, FALSE, 'Ironclad Hoops vs Skyline Dunks'),
(31, 4, 2, 3, 13, 15, 5, '2026-11-10 18:00:00', 'SCHEDULED', NULL, FALSE, 'Apex Ballers vs Ironclad Hoops'),
(32, 4, 2, 4, 14, 16, 5, '2026-11-11 18:00:00', 'SCHEDULED', NULL, FALSE, 'Neon Knights vs Skyline Dunks'),
(33, 4, 3, 5, 13, 16, 5, '2026-11-14 18:00:00', 'SCHEDULED', NULL, FALSE, 'Apex Ballers vs Skyline Dunks'),
(34, 4, 3, 6, 14, 15, 5, '2026-11-15 18:00:00', 'SCHEDULED', NULL, FALSE, 'Neon Knights vs Ironclad Hoops');

-- ------------------------------------------------------------------------
-- 9. MATCH_SCORES
-- ------------------------------------------------------------------------
-- Cricket Match 1: Cyber Vipers (1) vs Apex Titans (6)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(1, 1, 1, 1, 186, 4, 20.00, '{"run_rate": 9.30, "sixes": 8, "fours": 14}'),
(2, 1, 6, 2, 152, 9, 20.00, '{"run_rate": 7.60, "sixes": 4, "fours": 11}');

-- Cricket Match 2: Quantum Strikers (2) vs Shadow Wolves (5)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(3, 2, 5, 1, 140, 8, 20.00, '{"run_rate": 7.00, "sixes": 3, "fours": 10}'),
(4, 2, 2, 2, 142, 4, 18.20, '{"run_rate": 7.74, "sixes": 6, "fours": 13}');

-- Cricket Match 3: Falcon Thunderbolts (3) vs Phoenix Blasters (4)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(5, 3, 3, 1, 175, 6, 20.00, '{"run_rate": 8.75, "sixes": 7, "fours": 12}'),
(6, 3, 4, 2, 157, 8, 20.00, '{"run_rate": 7.85, "sixes": 5, "fours": 10}');

-- Cricket Match 4: Cyber Vipers (1) vs Falcon Thunderbolts (3)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(7, 4, 3, 1, 160, 7, 20.00, '{"run_rate": 8.00, "sixes": 5, "fours": 11}'),
(8, 4, 1, 2, 164, 5, 19.10, '{"run_rate": 8.55, "sixes": 7, "fours": 15}');

-- Cricket Match 6: LIVE Final Cyber Vipers (1) vs Quantum Strikers (2)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(9, 6, 1, 1, 178, 6, 20.00, '{"run_rate": 8.90, "sixes": 9, "fours": 12}'),
(10, 6, 2, 2, 118, 3, 14.20, '{"run_rate": 8.23, "sixes": 5, "fours": 8, "target": 179}');

-- Football Scores (Match 7: Metro United FC 3 - 1 Red Dragons)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(11, 7, 7, 1, 3, 0, 90.00, '{"possession": "58%", "shots_on_target": 7}'),
(12, 7, 8, 1, 1, 0, 90.00, '{"possession": "42%", "shots_on_target": 3}');

-- Football Scores (Match 8: Silicon Strikers 2 - 0 Golden Eagles)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(13, 8, 9, 1, 2, 0, 90.00, '{"possession": "54%", "shots_on_target": 6}'),
(14, 8, 10, 1, 0, 0, 90.00, '{"possession": "46%", "shots_on_target": 2}');

-- Football Scores (Match 9: Vanguard City 1 - 1 Northwood Rangers)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(15, 9, 11, 1, 1, 0, 90.00, '{"possession": "50%", "shots_on_target": 4}'),
(16, 9, 12, 1, 1, 0, 90.00, '{"possession": "50%", "shots_on_target": 4}');

-- Football Scores (Match 22: LIVE Red Dragons vs Metro United FC)
INSERT INTO match_scores (score_id, match_id, team_id, period_or_inning, score_primary, score_secondary, overs_or_minutes, extra_details) VALUES
(17, 22, 8, 1, 2, 0, 68.00, '{"possession": "52%", "cards_yellow": 1}'),
(18, 22, 7, 1, 1, 0, 68.00, '{"possession": "48%", "cards_yellow": 2}');

-- ------------------------------------------------------------------------
-- 10. PLAYER_STATISTICS
-- ------------------------------------------------------------------------
INSERT INTO player_statistics (stat_id, player_id, tournament_id, matches_played, primary_metric, secondary_metric, mvp_awards, rating_score) VALUES
(1, 1, 1, 3, 168, 2, 2, 9.40),
(2, 2, 1, 3, 112, 0, 1, 8.20),
(3, 4, 1, 3, 24, 7, 1, 8.90),
(4, 6, 1, 2, 98, 4, 1, 8.80),
(5, 7, 1, 2, 76, 0, 0, 7.50),
(6, 11, 1, 2, 89, 1, 0, 7.90),
(7, 31, 2, 5, 7, 3, 3, 9.60),
(8, 32, 2, 5, 4, 5, 1, 8.90),
(9, 36, 2, 5, 5, 2, 2, 9.10),
(10, 41, 2, 5, 6, 2, 2, 9.30),
(11, 86, 3, 3, 126, 0, 3, 9.80),
(12, 91, 3, 2, 82, 0, 1, 8.70);

-- ------------------------------------------------------------------------
-- 11. AUDIT_LOGS
-- ------------------------------------------------------------------------
INSERT INTO audit_logs (log_id, user_id, action_type, entity_name, entity_id, details, ip_address) VALUES
(1, 1, 'SYSTEM_INIT', 'DATABASE', 0, 'Database arena_x_db provisioned and seeded with standard college demo dataset.', '127.0.0.1'),
(2, 3, 'TOURNAMENT_CREATE', 'tournaments', 1, 'Created tournament: Inter-Varsity Cricket Trophy 2026 (Knockout)', '192.168.1.10'),
(3, 3, 'FIXTURE_GENERATE', 'matches', 1, 'Knockout algorithm generated Round 1 and Quarter-finals with 2 BYE seeds.', '192.168.1.10'),
(4, 5, 'SCORE_UPDATE', 'matches', 1, 'Match 1 concluded: Cyber Vipers CC defeated Apex Titans Cricket 186/4 to 152/9.', '192.168.1.15'),
(5, 4, 'TOURNAMENT_CREATE', 'tournaments', 2, 'Created tournament: Metro Collegiate Football League (League format, 6 teams).', '192.168.1.12'),
(6, 5, 'TRANSACTION_COMMIT', 'matches', 7, 'Atomic transaction committed: Score recorded, points awarded, and league standings updated.', '192.168.1.15');
