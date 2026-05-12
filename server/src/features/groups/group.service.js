const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getAll = async () => {
  const [groups] = await db.query(
    'SELECT * FROM `groups` ORDER BY name ASC'
  );

  const [teams] = await db.query(
    `SELECT t.*
     FROM teams t
     ORDER BY t.points DESC, t.goal_difference DESC, t.goals_for DESC, t.name ASC`
  );

  return groups.map((group) => ({
    ...group,
    teams: teams.filter((team) => team.group_id === group.id),
  }));
};

const getById = async (id) => {
  const [groups] = await db.query(
    'SELECT * FROM `groups` WHERE id = ?',
    [id]
  );

  if (groups.length === 0) {
    throw new AppError('Group not found', 404);
  }

  const group = groups[0];

  const [teams] = await db.query(
    `SELECT t.*
     FROM teams t
     WHERE t.group_id = ?
     ORDER BY t.points DESC, t.goal_difference DESC, t.goals_for DESC, t.name ASC`,
    [id]
  );

  const [matches] = await db.query(
    `SELECT m.*,
            ht.name AS home_team_name, ht.flag_url AS home_team_flag, ht.code AS home_team_code,
            at.name AS away_team_name, at.flag_url AS away_team_flag, at.code AS away_team_code
     FROM matches m
     LEFT JOIN teams ht ON m.home_team_id = ht.id
     LEFT JOIN teams at ON m.away_team_id = at.id
     WHERE m.group_id = ?
     ORDER BY m.match_date ASC`,
    [id]
  );

  group.teams = teams;
  group.matches = matches;

  return group;
};

module.exports = { getAll, getById };
