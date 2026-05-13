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

const create = async ({ name, code, flag_url, crest_url, group_id }) => {
  const [result] = await db.query(
    'INSERT INTO teams (name, code, flag_url, crest_url, group_id) VALUES (?, ?, ?, ?, ?)',
    [name, code, flag_url || null, crest_url || null, group_id || null]
  );

  return getById(result.insertId);
};

const update = async (id, data) => {
  const existing = await getById(id);

  const fields = {};
  if (data.name !== undefined) fields.name = data.name;
  if (data.code !== undefined) fields.code = data.code;
  if (data.flag_url !== undefined) fields.flag_url = data.flag_url;
  if (data.crest_url !== undefined) fields.crest_url = data.crest_url;
  if (data.group_id !== undefined) fields.group_id = data.group_id;

  const keys = Object.keys(fields);
  if (keys.length === 0) return existing;

  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => fields[k]);

  await db.query(`UPDATE teams SET ${setClause} WHERE id = ?`, [...values, id]);

  return getById(id);
};

const deleteTeam = async (id) => {
  await getById(id); // throws 404 if not found

  const [matches] = await db.query(
    'SELECT COUNT(*) AS count FROM matches WHERE home_team_id = ? OR away_team_id = ?',
    [id, id]
  );
  if (matches[0].count > 0) {
    throw new AppError('Cannot delete team that is referenced by matches', 400);
  }

  await db.query('DELETE FROM teams WHERE id = ?', [id]);
};

const updateStandings = async (id, data) => {
  await getById(id); // throws 404 if not found

  const { played, won, drawn, lost, goals_for, goals_against } = data;
  const goal_difference = goals_for - goals_against;
  const points = won * 3 + drawn;

  await db.query(
    `UPDATE teams
     SET played = ?, won = ?, drawn = ?, lost = ?,
         goals_for = ?, goals_against = ?,
         goal_difference = ?, points = ?
     WHERE id = ?`,
    [played, won, drawn, lost, goals_for, goals_against, goal_difference, points, id]
  );

  return getById(id);
};

module.exports = { getAll, getById, create, update, deleteTeam, updateStandings };
