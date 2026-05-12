-- FIFA World Cup 2026 Seed Data
-- ===============================

USE worldcup2026;

-- -----------------------------------------
-- Users (2 sample users)
-- -----------------------------------------
INSERT INTO users (username, email, password_hash, avatar_url, total_points, role) VALUES
('admin', 'admin@worldcup2026.com', '$2a$10$xPPMnR1aBbKNfxqp6sTMYOJSKMvGrNOOFmFHPLDBqMp2PeAeBuN2S', NULL, 0, 'admin'),
('testuser', 'testuser@worldcup2026.com', '$2a$10$Yx5EHWXh0B5RJXwFGWb5IuDdBVXeGGmGn4dIiGNGGPD1p0VnSJKYi', NULL, 0, 'user');

-- -----------------------------------------
-- Groups (A through L for 48-team format)
-- -----------------------------------------
INSERT INTO `groups` (name) VALUES
('A'), ('B'), ('C'), ('D'), ('E'), ('F'),
('G'), ('H'), ('I'), ('J'), ('K'), ('L');

-- -----------------------------------------
-- Teams (48 teams, 4 per group)
-- -----------------------------------------

-- Group A (id=1)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('United States', 'USA', '/flags/usa.png', 1),
('Mexico', 'MEX', '/flags/mex.png', 1),
('Colombia', 'COL', '/flags/col.png', 1),
('New Zealand', 'NZL', '/flags/nzl.png', 1);

-- Group B (id=2)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Canada', 'CAN', '/flags/can.png', 2),
('Argentina', 'ARG', '/flags/arg.png', 2),
('Egypt', 'EGY', '/flags/egy.png', 2),
('Uzbekistan', 'UZB', '/flags/uzb.png', 2);

-- Group C (id=3)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Brazil', 'BRA', '/flags/bra.png', 3),
('Japan', 'JPN', '/flags/jpn.png', 3),
('Serbia', 'SRB', '/flags/srb.png', 3),
('Cameroon', 'CMR', '/flags/cmr.png', 3);

-- Group D (id=4)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Germany', 'GER', '/flags/ger.png', 4),
('South Korea', 'KOR', '/flags/kor.png', 4),
('Saudi Arabia', 'KSA', '/flags/ksa.png', 4),
('Peru', 'PER', '/flags/per.png', 4);

-- Group E (id=5)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('France', 'FRA', '/flags/fra.png', 5),
('Australia', 'AUS', '/flags/aus.png', 5),
('Ecuador', 'ECU', '/flags/ecu.png', 5),
('Nigeria', 'NGA', '/flags/nga.png', 5);

-- Group F (id=6)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('England', 'ENG', '/flags/eng.png', 6),
('Denmark', 'DEN', '/flags/den.png', 6),
('Iran', 'IRN', '/flags/irn.png', 6),
('Costa Rica', 'CRC', '/flags/crc.png', 6);

-- Group G (id=7)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Spain', 'ESP', '/flags/esp.png', 7),
('Croatia', 'CRO', '/flags/cro.png', 7),
('Morocco', 'MAR', '/flags/mar.png', 7),
('Jamaica', 'JAM', '/flags/jam.png', 7);

-- Group H (id=8)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Portugal', 'POR', '/flags/por.png', 8),
('Uruguay', 'URU', '/flags/uru.png', 8),
('Ghana', 'GHA', '/flags/gha.png', 8),
('Panama', 'PAN', '/flags/pan.png', 8);

-- Group I (id=9)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Netherlands', 'NED', '/flags/ned.png', 9),
('Senegal', 'SEN', '/flags/sen.png', 9),
('Chile', 'CHI', '/flags/chi.png', 9),
('Indonesia', 'IDN', '/flags/idn.png', 9);

-- Group J (id=10)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Belgium', 'BEL', '/flags/bel.png', 10),
('Switzerland', 'SUI', '/flags/sui.png', 10),
('Tunisia', 'TUN', '/flags/tun.png', 10),
('Honduras', 'HON', '/flags/hon.png', 10);

-- Group K (id=11)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Italy', 'ITA', '/flags/ita.png', 11),
('Poland', 'POL', '/flags/pol.png', 11),
('Algeria', 'ALG', '/flags/alg.png', 11),
('Paraguay', 'PAR', '/flags/par.png', 11);

-- Group L (id=12)
INSERT INTO teams (name, code, flag_url, group_id) VALUES
('Ukraine', 'UKR', '/flags/ukr.png', 12),
('Wales', 'WAL', '/flags/wal.png', 12),
('Turkey', 'TUR', '/flags/tur.png', 12),
('Bolivia', 'BOL', '/flags/bol.png', 12);

-- -----------------------------------------
-- Matches (16 sample matches)
-- -----------------------------------------

-- Match 1: Group A - Completed
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status) VALUES
(1, 3, 1, 'group', '2026-06-11 18:00:00', 'MetLife Stadium', 'East Rutherford', 2, 1, 'completed');

-- Match 2: Group A - Completed
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status) VALUES
(2, 4, 1, 'group', '2026-06-11 21:00:00', 'Estadio Azteca', 'Mexico City', 3, 0, 'completed');

-- Match 3: Group B - Completed
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status) VALUES
(6, 7, 2, 'group', '2026-06-12 15:00:00', 'BMO Field', 'Toronto', 1, 1, 'completed');

-- Match 4: Group B - Completed
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status) VALUES
(5, 8, 2, 'group', '2026-06-12 18:00:00', 'SoFi Stadium', 'Los Angeles', 4, 0, 'completed');

-- Match 5: Group C - Live
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status, minute) VALUES
(9, 11, 3, 'group', '2026-06-13 18:00:00', 'AT&T Stadium', 'Dallas', 1, 0, 'live', 67);

-- Match 6: Group C - Half Time
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status, minute) VALUES
(10, 12, 3, 'group', '2026-06-13 18:00:00', 'Hard Rock Stadium', 'Miami', 0, 0, 'half_time', 45);

-- Match 7: Group D - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(13, 15, 4, 'group', '2026-06-14 15:00:00', 'Lincoln Financial Field', 'Philadelphia', 'scheduled');

-- Match 8: Group E - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(17, 19, 5, 'group', '2026-06-14 18:00:00', 'Lumen Field', 'Seattle', 'scheduled');

-- Match 9: Group F - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(21, 23, 6, 'group', '2026-06-15 15:00:00', 'Gillette Stadium', 'Foxborough', 'scheduled');

-- Match 10: Group G - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(25, 27, 7, 'group', '2026-06-15 18:00:00', 'Mercedes-Benz Stadium', 'Atlanta', 'scheduled');

-- Match 11: Group H - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(29, 31, 8, 'group', '2026-06-16 15:00:00', 'NRG Stadium', 'Houston', 'scheduled');

-- Match 12: Group A - Completed (Matchday 2)
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, home_score, away_score, status) VALUES
(1, 2, 1, 'group', '2026-06-16 21:00:00', 'MetLife Stadium', 'East Rutherford', 0, 0, 'completed');

-- Match 13: Round of 32 - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(1, 10, NULL, 'round_of_32', '2026-07-01 18:00:00', 'AT&T Stadium', 'Dallas', 'scheduled');

-- Match 14: Round of 16 - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(9, 17, NULL, 'round_of_16', '2026-07-05 18:00:00', 'SoFi Stadium', 'Los Angeles', 'scheduled');

-- Match 15: Semi Final - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(6, 9, NULL, 'semi_final', '2026-07-11 18:00:00', 'AT&T Stadium', 'Dallas', 'scheduled');

-- Match 16: Final - Scheduled
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, status) VALUES
(1, 9, NULL, 'final', '2026-07-19 16:00:00', 'MetLife Stadium', 'East Rutherford', 'scheduled');

-- -----------------------------------------
-- Match Events (for completed/live matches)
-- -----------------------------------------

-- Match 1: USA 2-1 Colombia
INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details) VALUES
(1, 1, 'goal', 'Christian Pulisic', 23, 'Left-footed shot from outside the box'),
(1, 3, 'goal', 'Luis Diaz', 38, 'Header from corner kick'),
(1, 1, 'goal', 'Weston McKennie', 72, 'Tap-in from close range'),
(1, 3, 'yellow_card', 'Davinson Sanchez', 55, 'Tactical foul'),
(1, 1, 'yellow_card', 'Tyler Adams', 81, 'Time wasting');

-- Match 2: Mexico 3-0 New Zealand
INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details) VALUES
(2, 2, 'goal', 'Hirving Lozano', 12, 'Solo run and finish'),
(2, 2, 'penalty_goal', 'Santiago Gimenez', 45, 'Penalty converted after handball'),
(2, 2, 'goal', 'Edson Alvarez', 78, 'Long-range strike'),
(2, 4, 'red_card', 'Chris Wood', 65, 'Serious foul play');

-- Match 3: Argentina 1-1 Egypt
INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details) VALUES
(3, 6, 'goal', 'Lionel Messi', 34, 'Free kick curled into top corner'),
(3, 7, 'goal', 'Mohamed Salah', 61, 'Counter-attack finish'),
(3, 6, 'yellow_card', 'Rodrigo De Paul', 42, 'Late tackle'),
(3, 7, 'yellow_card', 'Ahmed Hegazi', 88, 'Holding');

-- Match 4: Canada 4-0 Uzbekistan
INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details) VALUES
(4, 5, 'goal', 'Alphonso Davies', 15, 'Brilliant solo run'),
(4, 5, 'goal', 'Jonathan David', 29, 'Clinical finish'),
(4, 5, 'goal', 'Jonathan David', 56, 'Header from cross'),
(4, 5, 'goal', 'Cyle Larin', 83, 'Tap-in'),
(4, 8, 'yellow_card', 'Eldor Shomurodov', 40, 'Dissent');

-- Match 5: Brazil 1-0 Serbia (live, 67th minute)
INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details) VALUES
(5, 9, 'goal', 'Vinicius Jr', 52, 'Dribbled past two defenders and scored'),
(5, 11, 'yellow_card', 'Nemanja Gudelj', 60, 'Professional foul');

-- Match 12: USA 0-0 Mexico (completed, no goals)
INSERT INTO match_events (match_id, team_id, event_type, player_name, minute, details) VALUES
(12, 1, 'yellow_card', 'Sergino Dest', 33, 'Reckless challenge'),
(12, 2, 'yellow_card', 'Edson Alvarez', 47, 'Tactical foul'),
(12, 2, 'yellow_card', 'Cesar Montes', 89, 'Time wasting');

-- -----------------------------------------
-- Quizzes
-- -----------------------------------------
INSERT INTO quizzes (title, description, difficulty, is_active) VALUES
('World Cup Trivia', 'Test your knowledge about FIFA World Cup history and the 2026 tournament!', 'medium', TRUE);

-- -----------------------------------------
-- Quiz Questions (quiz_id = 1)
-- -----------------------------------------
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, sort_order) VALUES
(1, 'Which country won the first FIFA World Cup in 1930?', 'Brazil', 'Argentina', 'Uruguay', 'Italy', 'c', 10, 1),
(1, 'How many teams will participate in the 2026 FIFA World Cup?', '32', '40', '48', '64', 'c', 10, 2),
(1, 'Which three countries are co-hosting the 2026 World Cup?', 'USA, Canada, Mexico', 'USA, Brazil, Argentina', 'England, France, Germany', 'Spain, Portugal, Morocco', 'a', 10, 3),
(1, 'Who holds the record for most World Cup goals scored?', 'Ronaldo Nazario', 'Miroslav Klose', 'Pele', 'Just Fontaine', 'b', 10, 4),
(1, 'Which team has won the most FIFA World Cup titles?', 'Germany', 'Italy', 'Argentina', 'Brazil', 'd', 10, 5);

-- -----------------------------------------
-- Polls
-- -----------------------------------------
INSERT INTO polls (title, description, is_active, expires_at) VALUES
('Who will win the 2026 FIFA World Cup?', 'Cast your vote for the team you think will lift the trophy in 2026!', TRUE, '2026-07-19 00:00:00');

-- -----------------------------------------
-- Poll Options (poll_id = 1)
-- -----------------------------------------
INSERT INTO poll_options (poll_id, option_text, vote_count, sort_order) VALUES
(1, 'Brazil', 0, 1),
(1, 'Argentina', 0, 2),
(1, 'France', 0, 3),
(1, 'England', 0, 4),
(1, 'United States', 0, 5);
