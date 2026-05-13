-- FIFA World Cup 2026 Seed Data
-- ===============================
-- Teams and matches are synced from football-data.org API
-- This file only seeds: users, quizzes, polls

USE worldcup2026;

-- -----------------------------------------
-- Users (admin + sample users, password: password123)
-- -----------------------------------------
INSERT INTO users (username, email, password_hash, avatar_url, total_points, role, is_admin) VALUES
('admin', 'admin@worldcup2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'admin', 1),
('testuser', 'testuser@worldcup2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user', 0),
('FootballKing', 'king@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('GoalMaster', 'goal@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('SoccerPro99', 'pro@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('WorldCupFan', 'fan@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('PredictorX', 'pred@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('MatchDay', 'match@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('TacticsGuru', 'tactics@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('FutbolLover', 'futbol@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('StadiumHero', 'stadium@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user'),
('CupChaser', 'cup@wc2026.com', '$2a$10$BTlh3sIYA2qXU6MIM3MOreGqsPZJApZCsXXOaA.O6rpAYxt4/eP0W', NULL, 0, 'user');

-- -----------------------------------------
-- Quizzes
-- -----------------------------------------
INSERT INTO quizzes (title, description, difficulty, is_active) VALUES
('World Cup Trivia', 'Test your knowledge about FIFA World Cup history and the 2026 tournament!', 'medium', TRUE),
('World Cup Legends', 'How well do you know the greatest players in World Cup history?', 'hard', TRUE);

-- -----------------------------------------
-- Quiz Questions (quiz_id = 1)
-- -----------------------------------------
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, sort_order) VALUES
(1, 'Which country won the first FIFA World Cup in 1930?', 'Brazil', 'Argentina', 'Uruguay', 'Italy', 'c', 10, 1),
(1, 'How many teams will participate in the 2026 FIFA World Cup?', '32', '40', '48', '64', 'c', 10, 2),
(1, 'Which three countries are co-hosting the 2026 World Cup?', 'USA, Canada, Mexico', 'USA, Brazil, Argentina', 'England, France, Germany', 'Spain, Portugal, Morocco', 'a', 10, 3),
(1, 'Who holds the record for most World Cup goals scored?', 'Ronaldo Nazario', 'Miroslav Klose', 'Pele', 'Just Fontaine', 'b', 10, 4),
(1, 'Which team has won the most FIFA World Cup titles?', 'Germany', 'Italy', 'Argentina', 'Brazil', 'd', 10, 5);

-- Quiz Questions (quiz_id = 2)
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, sort_order) VALUES
(2, 'Who scored the ''Hand of God'' goal in 1986?', 'Pele', 'Diego Maradona', 'Zinedine Zidane', 'Ronaldo', 'b', 10, 1),
(2, 'Which player received a red card in the 2006 World Cup Final?', 'Thierry Henry', 'Marco Materazzi', 'Zinedine Zidane', 'Fabio Cannavaro', 'c', 10, 2),
(2, 'Who is the youngest player to score in a World Cup Final?', 'Pele', 'Kylian Mbappe', 'Michael Owen', 'Lionel Messi', 'a', 10, 3),
(2, 'Which goalkeeper saved the most penalties in World Cup history?', 'Gianluigi Buffon', 'Manuel Neuer', 'Harald Schumacher', 'Emiliano Martinez', 'd', 10, 4),
(2, 'How many World Cup goals did Ronaldo (R9) score in total?', '12', '15', '18', '10', 'b', 10, 5);

-- -----------------------------------------
-- Polls
-- -----------------------------------------
INSERT INTO polls (title, description, poll_type, is_active, expires_at) VALUES
('Who will win the 2026 FIFA World Cup?', 'Cast your vote for the team you think will lift the trophy in 2026!', 'trophy', TRUE, '2026-07-19 00:00:00'),
('Best Player of the Tournament?', 'Who do you think will be named the Golden Ball winner?', 'default', TRUE, '2026-07-19 00:00:00');

-- -----------------------------------------
-- Poll Options (with trophy counts for World Cup winners)
-- -----------------------------------------
INSERT INTO poll_options (poll_id, option_text, vote_count, trophy_count, sort_order) VALUES
(1, 'Brazil', 34, 5, 1),
(1, 'Argentina', 28, 3, 2),
(1, 'France', 22, 2, 3),
(1, 'England', 18, 1, 4),
(1, 'United States', 15, 0, 5);

INSERT INTO poll_options (poll_id, option_text, vote_count, trophy_count, sort_order) VALUES
(2, 'Lionel Messi', 42, 0, 1),
(2, 'Kylian Mbappe', 38, 0, 2),
(2, 'Vinicius Jr', 25, 0, 3),
(2, 'Jude Bellingham', 20, 0, 4),
(2, 'Erling Haaland', 18, 0, 5);
