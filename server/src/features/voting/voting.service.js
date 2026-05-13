const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getAll = async (userId = null) => {
  const [rows] = await db.query(
    'SELECT * FROM polls WHERE is_active = 1 ORDER BY created_at DESC'
  );

  for (const poll of rows) {
    const [options] = await db.query(
      'SELECT * FROM poll_options WHERE poll_id = ? ORDER BY sort_order ASC, id ASC',
      [poll.id]
    );
    poll.options = options;
    poll.option_count = options.length;
    if (userId) {
      const [uv] = await db.query('SELECT option_id FROM votes WHERE user_id = ? AND poll_id = ?', [userId, poll.id]);
      poll.user_vote = uv.length > 0 ? uv[0].option_id : null;
    } else {
      poll.user_vote = null;
    }
  }

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
    'SELECT id, option_id FROM votes WHERE user_id = ? AND poll_id = ?',
    [userId, pollId]
  );

  if (existingVote.length > 0) {
    const oldOptionId = existingVote[0].option_id;
    if (oldOptionId === optionId) {
      return getUserPoll(userId, pollId);
    }
    // Change vote: decrement old, update vote row, increment new
    await db.query('UPDATE poll_options SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = ?', [oldOptionId]);
    await db.query('UPDATE votes SET option_id = ? WHERE id = ?', [optionId, existingVote[0].id]);
    await db.query('UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?', [optionId]);
  } else {
    await db.query(
      'INSERT INTO votes (user_id, poll_id, option_id) VALUES (?, ?, ?)',
      [userId, pollId, optionId]
    );
    await db.query(
      'UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?',
      [optionId]
    );
  }

  return getUserPoll(userId, pollId);
};

// Get poll with user's vote info
const getUserPoll = async (userId, pollId) => {
  const poll = await getById(pollId);
  const [userVote] = await db.query(
    'SELECT option_id FROM votes WHERE user_id = ? AND poll_id = ?',
    [userId, pollId]
  );
  poll.user_vote = userVote.length > 0 ? userVote[0].option_id : null;
  return poll;
};

const getAllAdmin = async () => {
  const [rows] = await db.query(
    `SELECT p.*,
            COUNT(DISTINCT po.id) AS option_count,
            COALESCE(SUM(po.vote_count), 0) AS total_votes
     FROM polls p
     LEFT JOIN poll_options po ON p.id = po.poll_id
     GROUP BY p.id
     ORDER BY p.created_at DESC`
  );

  return rows;
};

const createPoll = async ({ title, description, is_active, expires_at, options }) => {
  const [result] = await db.query(
    `INSERT INTO polls (title, description, is_active, expires_at)
     VALUES (?, ?, ?, ?)`,
    [title, description || null, is_active !== undefined ? is_active : 1, expires_at || null]
  );

  const pollId = result.insertId;

  if (options && options.length > 0) {
    for (const opt of options) {
      await db.query(
        `INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)`,
        [pollId, opt.option_text || opt]
      );
    }
  }

  return getById(pollId);
};

const updatePoll = async (id, { title, description, is_active, expires_at }) => {
  const [polls] = await db.query('SELECT id FROM polls WHERE id = ?', [id]);
  if (polls.length === 0) {
    throw new AppError('Poll not found', 404);
  }

  const fields = [];
  const params = [];

  if (title !== undefined) { fields.push('title = ?'); params.push(title); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description); }
  if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active); }
  if (expires_at !== undefined) { fields.push('expires_at = ?'); params.push(expires_at); }

  if (fields.length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  params.push(id);

  await db.query(
    `UPDATE polls SET ${fields.join(', ')} WHERE id = ?`,
    params
  );

  return getById(id);
};

const deletePoll = async (id) => {
  const [polls] = await db.query('SELECT id FROM polls WHERE id = ?', [id]);
  if (polls.length === 0) {
    throw new AppError('Poll not found', 404);
  }

  await db.query('DELETE FROM polls WHERE id = ?', [id]);
  return { id };
};

const addOption = async (pollId, { option_text }) => {
  const [polls] = await db.query('SELECT id FROM polls WHERE id = ?', [pollId]);
  if (polls.length === 0) {
    throw new AppError('Poll not found', 404);
  }

  const [result] = await db.query(
    `INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)`,
    [pollId, option_text]
  );

  const [rows] = await db.query('SELECT * FROM poll_options WHERE id = ?', [result.insertId]);
  return rows[0];
};

const deleteOption = async (optionId) => {
  const [options] = await db.query('SELECT id FROM poll_options WHERE id = ?', [optionId]);
  if (options.length === 0) {
    throw new AppError('Poll option not found', 404);
  }

  await db.query('DELETE FROM poll_options WHERE id = ?', [optionId]);
  return { id: optionId };
};

module.exports = { getAll, getById, castVote, getAllAdmin, createPoll, updatePoll, deletePoll, addOption, deleteOption };
