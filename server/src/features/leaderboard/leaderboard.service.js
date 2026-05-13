const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getLeaderboard = async (page = 1, limit = 50) => {
  const offset = (page - 1) * limit;

  const [countRows] = await db.query(
    'SELECT COUNT(*) AS total FROM users'
  );
  const total = countRows[0].total;

  const [rows] = await db.query(
    `SELECT id, username, avatar_url, total_points,
            RANK() OVER (ORDER BY total_points DESC) AS \`rank\`
     FROM users
     ORDER BY total_points DESC, username ASC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return {
    leaderboard: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMyRank = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, username, avatar_url, total_points,
            (SELECT COUNT(*) + 1 FROM users u2 WHERE u2.total_points > u1.total_points) AS \`rank\`
     FROM users u1
     WHERE id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  return rows[0];
};

module.exports = { getLeaderboard, getMyRank };
