const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getAll = async ({ page = 1, limit = 20, status, stage, date } = {}) => {
  const offset = (page - 1) * limit;
  let where = [];
  let params = [];

  if (status) {
    where.push('m.status = ?');
    params.push(status);
  }
  if (stage) {
    where.push('m.stage = ?');
    params.push(stage);
  }
  if (date) {
    where.push('DATE(m.match_date) = ?');
    params.push(date);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM matches m ${whereClause}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await db.query(
    `SELECT m.*,
            ht.name AS home_team_name, COALESCE(m.home_team_crest, ht.crest_url, ht.flag_url) AS home_team_flag, ht.code AS home_team_code,
            at.name AS away_team_name, COALESCE(m.away_team_crest, at.crest_url, at.flag_url) AS away_team_flag, at.code AS away_team_code
     FROM matches m
     LEFT JOIN teams ht ON m.home_team_id = ht.id
     LEFT JOIN teams at ON m.away_team_id = at.id
     ${whereClause}
     ORDER BY m.match_date ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    matches: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT m.*,
            ht.name AS home_team_name, COALESCE(m.home_team_crest, ht.crest_url, ht.flag_url) AS home_team_flag, ht.code AS home_team_code,
            at.name AS away_team_name, COALESCE(m.away_team_crest, at.crest_url, at.flag_url) AS away_team_flag, at.code AS away_team_code
     FROM matches m
     LEFT JOIN teams ht ON m.home_team_id = ht.id
     LEFT JOIN teams at ON m.away_team_id = at.id
     WHERE m.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('Match not found', 404);
  }

  const match = rows[0];

  const [events] = await db.query(
    `SELECT me.*, t.name AS team_name, t.code AS team_code
     FROM match_events me
     LEFT JOIN teams t ON me.team_id = t.id
     WHERE me.match_id = ?
     ORDER BY me.minute ASC`,
    [id]
  );

  match.events = events;

  return match;
};

const getLive = async () => {
  const [rows] = await db.query(
    `SELECT m.*,
            ht.name AS home_team_name, COALESCE(m.home_team_crest, ht.crest_url, ht.flag_url) AS home_team_flag, ht.code AS home_team_code,
            at.name AS away_team_name, COALESCE(m.away_team_crest, at.crest_url, at.flag_url) AS away_team_flag, at.code AS away_team_code
     FROM matches m
     LEFT JOIN teams ht ON m.home_team_id = ht.id
     LEFT JOIN teams at ON m.away_team_id = at.id
     WHERE m.status = 'live'
     ORDER BY m.match_date ASC`
  );

  return rows;
};

const create = async (data) => {
  const { home_team_id, away_team_id, match_date, venue, stage, group_id } = data;

  const [result] = await db.query(
    `INSERT INTO matches (home_team_id, away_team_id, match_date, venue, stage, group_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [home_team_id, away_team_id, match_date, venue, stage, group_id || null]
  );

  return getById(result.insertId);
};

const update = async (id, data) => {
  const match = await getById(id);

  const fields = [];
  const params = [];

  const allowedFields = [
    'home_team_id', 'away_team_id', 'match_date', 'venue', 'stage',
    'group_id', 'status', 'home_score', 'away_score',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      params.push(data[field]);
    }
  }

  if (fields.length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  params.push(id);

  await db.query(
    `UPDATE matches SET ${fields.join(', ')} WHERE id = ?`,
    params
  );

  return getById(id);
};

const addEvent = async (matchId, data) => {
  await getById(matchId);

  const { event_type, minute, player_name, team_id, details } = data;

  const [result] = await db.query(
    `INSERT INTO match_events (match_id, event_type, minute, player_name, team_id, details)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [matchId, event_type, minute, player_name, team_id, details || null]
  );

  const [rows] = await db.query(
    `SELECT me.*, t.name AS team_name, t.code AS team_code
     FROM match_events me
     LEFT JOIN teams t ON me.team_id = t.id
     WHERE me.id = ?`,
    [result.insertId]
  );

  return rows[0];
};

const deleteMatch = async (id) => {
  const [matches] = await db.query('SELECT id FROM matches WHERE id = ?', [id]);
  if (matches.length === 0) {
    throw new AppError('Match not found', 404);
  }

  await db.query('DELETE FROM match_events WHERE match_id = ?', [id]);
  await db.query('DELETE FROM predictions WHERE match_id = ?', [id]);
  await db.query('DELETE FROM matches WHERE id = ?', [id]);

  return { id };
};

module.exports = { getAll, getById, getLive, create, update, addEvent, deleteMatch };
