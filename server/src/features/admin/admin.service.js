const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getStats = async () => {
  const [[users]] = await db.query('SELECT COUNT(*) AS count FROM users');
  const [[matches]] = await db.query('SELECT COUNT(*) AS count FROM matches');
  const [[liveMatches]] = await db.query("SELECT COUNT(*) AS count FROM matches WHERE status IN ('live','half_time')");
  const [[completedMatches]] = await db.query("SELECT COUNT(*) AS count FROM matches WHERE status = 'completed'");
  const [[predictions]] = await db.query('SELECT COUNT(*) AS count FROM predictions');
  const [[quizzes]] = await db.query('SELECT COUNT(*) AS count FROM quizzes WHERE is_active = 1');
  const [[polls]] = await db.query('SELECT COUNT(*) AS count FROM polls WHERE is_active = 1');
  const [[teams]] = await db.query('SELECT COUNT(*) AS count FROM teams');
  const [[groups]] = await db.query('SELECT COUNT(*) AS count FROM `groups`');

  return {
    users: users.count,
    matches: matches.count,
    liveMatches: liveMatches.count,
    completedMatches: completedMatches.count,
    predictions: predictions.count,
    activeQuizzes: quizzes.count,
    activePolls: polls.count,
    teams: teams.count,
    groups: groups.count,
  };
};

const getActivity = async (limit = 20) => {
  const activities = [];

  // Recent predictions
  const [preds] = await db.query(
    `SELECT p.created_at, u.username, ht.code AS home_code, awt.code AS away_code,
            p.predicted_home_score, p.predicted_away_score
     FROM predictions p
     JOIN users u ON p.user_id = u.id
     JOIN matches m ON p.match_id = m.id
     JOIN teams ht ON m.home_team_id = ht.id
     JOIN teams awt ON m.away_team_id = awt.id
     ORDER BY p.created_at DESC LIMIT ?`,
    [Math.ceil(limit / 3)]
  );
  for (const p of preds) {
    activities.push({
      type: 'prediction',
      message: `${p.username} predicted ${p.home_code} ${p.predicted_home_score}-${p.predicted_away_score} ${p.away_code}`,
      timestamp: p.created_at,
    });
  }

  // Recent quiz attempts
  const [attempts] = await db.query(
    `SELECT qa.completed_at, u.username, q.title, qa.score, qa.total_questions
     FROM quiz_attempts qa
     JOIN users u ON qa.user_id = u.id
     JOIN quizzes q ON qa.quiz_id = q.id
     ORDER BY qa.completed_at DESC LIMIT ?`,
    [Math.ceil(limit / 3)]
  );
  for (const a of attempts) {
    activities.push({
      type: 'quiz',
      message: `${a.username} scored ${a.score}/${a.total_questions} on "${a.title}"`,
      timestamp: a.completed_at,
    });
  }

  // Recent votes
  const [votes] = await db.query(
    `SELECT v.created_at, u.username, p.title
     FROM votes v
     JOIN users u ON v.user_id = u.id
     JOIN polls p ON v.poll_id = p.id
     ORDER BY v.created_at DESC LIMIT ?`,
    [Math.ceil(limit / 3)]
  );
  for (const v of votes) {
    activities.push({
      type: 'vote',
      message: `${v.username} voted on "${v.title}"`,
      timestamp: v.created_at,
    });
  }

  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return activities.slice(0, limit);
};

const getUsers = async ({ page = 1, limit = 20, search, role } = {}) => {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (search) {
    where.push('(u.username LIKE ? OR u.email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (role) {
    where.push('u.role = ?');
    params.push(role);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
    params
  );

  const [rows] = await db.query(
    `SELECT u.id, u.username, u.email, u.avatar_url, u.total_points, u.role, u.is_admin, u.created_at,
            (SELECT COUNT(*) FROM predictions WHERE user_id = u.id) AS predictions_count,
            (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id) AS quiz_attempts_count
     FROM users u
     ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    users: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const updateUserRole = async (userId, role) => {
  const [users] = await db.query('SELECT id, role FROM users WHERE id = ?', [userId]);
  if (!users.length) throw new AppError('User not found', 404);

  const isAdmin = role === 'admin' ? 1 : 0;
  await db.query('UPDATE users SET role = ?, is_admin = ? WHERE id = ?', [role, isAdmin, userId]);

  const [updated] = await db.query(
    'SELECT id, username, email, avatar_url, total_points, role, is_admin, created_at FROM users WHERE id = ?',
    [userId]
  );
  return updated[0];
};

const deleteUser = async (userId) => {
  const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
  if (!users.length) throw new AppError('User not found', 404);

  await db.query('DELETE FROM users WHERE id = ?', [userId]);
};

module.exports = { getStats, getActivity, getUsers, updateUserRole, deleteUser };
