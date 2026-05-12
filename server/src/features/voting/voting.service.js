const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getAll = async () => {
  const [rows] = await db.query(
    `SELECT p.*, COUNT(po.id) AS option_count
     FROM polls p
     LEFT JOIN poll_options po ON p.id = po.poll_id
     WHERE p.is_active = 1
     GROUP BY p.id
     ORDER BY p.created_at DESC`
  );

  return rows;
};

const getById = async (pollId) => {
  const [polls] = await db.query(
    'SELECT * FROM polls WHERE id = ?',
    [pollId]
  );

  if (polls.length === 0) {
    throw new AppError('Poll not found', 404);
  }

  const poll = polls[0];

  const [options] = await db.query(
    'SELECT * FROM poll_options WHERE poll_id = ? ORDER BY id ASC',
    [pollId]
  );

  poll.options = options;

  return poll;
};

const castVote = async (userId, pollId, optionId) => {
  const [polls] = await db.query(
    'SELECT * FROM polls WHERE id = ? AND is_active = 1',
    [pollId]
  );

  if (polls.length === 0) {
    throw new AppError('Poll not found or is no longer active', 404);
  }

  const [options] = await db.query(
    'SELECT * FROM poll_options WHERE id = ? AND poll_id = ?',
    [optionId, pollId]
  );

  if (options.length === 0) {
    throw new AppError('Invalid poll option', 400);
  }

  const [existingVote] = await db.query(
    'SELECT id FROM votes WHERE user_id = ? AND poll_id = ?',
    [userId, pollId]
  );

  if (existingVote.length > 0) {
    throw new AppError('You have already voted on this poll', 409);
  }

  await db.query(
    'INSERT INTO votes (user_id, poll_id, option_id) VALUES (?, ?, ?)',
    [userId, pollId, optionId]
  );

  await db.query(
    'UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?',
    [optionId]
  );

  const updatedPoll = await getById(pollId);

  return updatedPoll;
};

module.exports = { getAll, getById, castVote };
