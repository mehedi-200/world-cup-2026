const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getAll = async () => {
  const [rows] = await db.query(
    `SELECT t.*, g.name AS group_name
     FROM teams t
     LEFT JOIN \`groups\` g ON t.group_id = g.id
     ORDER BY g.name ASC, t.name ASC`
  );

  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT t.*, g.name AS group_name
     FROM teams t
     LEFT JOIN \`groups\` g ON t.group_id = g.id
     WHERE t.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('Team not found', 404);
  }

  return rows[0];
};

module.exports = { getAll, getById };
