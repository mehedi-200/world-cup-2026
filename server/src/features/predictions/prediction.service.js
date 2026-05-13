const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getUserPredictions = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const [countRows] = await db.query(
    'SELECT COUNT(*) AS total FROM predictions WHERE user_id = ?',
    [userId]
  );
  const total = countRows[0].total;

  const [rows] = await db.query(
    `SELECT p.*,
            m.home_score, m.away_score, m.status AS match_status, m.status, m.match_date,
            ht.name AS home_team_name, COALESCE(m.home_team_crest, ht.crest_url, ht.flag_url) AS home_team_flag, ht.code AS home_team_code,
            at.name AS away_team_name, COALESCE(m.away_team_crest, at.crest_url, at.flag_url) AS away_team_flag, at.code AS away_team_code
     FROM predictions p
     JOIN matches m ON p.match_id = m.id
     LEFT JOIN teams ht ON m.home_team_id = ht.id
     LEFT JOIN teams at ON m.away_team_id = at.id
     WHERE p.user_id = ?
     ORDER BY m.match_date DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  return {
    predictions: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createPrediction = async (userId, data) => {
  const { match_id, predicted_home_score, predicted_away_score } = data;

  const [matches] = await db.query(
    'SELECT id, status FROM matches WHERE id = ?',
    [match_id]
  );

  if (matches.length === 0) {
    throw new AppError('Match not found', 404);
  }

  if (matches[0].status !== 'scheduled') {
    throw new AppError('Predictions can only be made for scheduled matches', 400);
  }

  const [existing] = await db.query(
    'SELECT id FROM predictions WHERE user_id = ? AND match_id = ?',
    [userId, match_id]
  );

  if (existing.length > 0) {
    throw new AppError('You have already predicted this match', 409);
  }

  const [result] = await db.query(
    `INSERT INTO predictions (user_id, match_id, predicted_home_score, predicted_away_score)
     VALUES (?, ?, ?, ?)`,
    [userId, match_id, predicted_home_score, predicted_away_score]
  );

  const [rows] = await db.query(
    'SELECT * FROM predictions WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
};

const updatePrediction = async (id, userId, data) => {
  const { predicted_home_score, predicted_away_score } = data;

  const [predictions] = await db.query(
    'SELECT p.*, m.status AS match_status FROM predictions p JOIN matches m ON p.match_id = m.id WHERE p.id = ?',
    [id]
  );

  if (predictions.length === 0) {
    throw new AppError('Prediction not found', 404);
  }

  const prediction = predictions[0];

  if (prediction.user_id !== userId) {
    throw new AppError('You can only update your own predictions', 403);
  }

  if (prediction.match_status !== 'scheduled') {
    throw new AppError('Cannot update prediction for a match that has already started', 400);
  }

  await db.query(
    'UPDATE predictions SET predicted_home_score = ?, predicted_away_score = ? WHERE id = ?',
    [predicted_home_score, predicted_away_score, id]
  );

  const [rows] = await db.query(
    'SELECT * FROM predictions WHERE id = ?',
    [id]
  );

  return rows[0];
};

const getByMatch = async (userId, matchId) => {
  const [rows] = await db.query(
    `SELECT p.*,
            m.home_score, m.away_score, m.status AS match_status,
            ht.name AS home_team_name, ht.code AS home_team_code,
            at.name AS away_team_name, at.code AS away_team_code
     FROM predictions p
     JOIN matches m ON p.match_id = m.id
     LEFT JOIN teams ht ON m.home_team_id = ht.id
     LEFT JOIN teams at ON m.away_team_id = at.id
     WHERE p.user_id = ? AND p.match_id = ?`,
    [userId, matchId]
  );

  if (rows.length === 0) {
    throw new AppError('Prediction not found for this match', 404);
  }

  return rows[0];
};

const scorePredictions = async (matchId) => {
  const [matches] = await db.query(
    'SELECT * FROM matches WHERE id = ? AND status = ?',
    [matchId, 'completed']
  );

  if (matches.length === 0) {
    throw new AppError('Match not found or not yet completed', 400);
  }

  const match = matches[0];

  const [predictions] = await db.query(
    'SELECT * FROM predictions WHERE match_id = ? AND points_earned IS NULL',
    [matchId]
  );

  let scored = 0;

  for (const prediction of predictions) {
    const points = scorePrediction(prediction, match);

    await db.query(
      'UPDATE predictions SET points_earned = ? WHERE id = ?',
      [points, prediction.id]
    );

    await db.query(
      'UPDATE users SET total_points = total_points + ? WHERE id = ?',
      [points, prediction.user_id]
    );

    scored++;
  }

  return { scored, matchId };
};

const scorePrediction = (prediction, match) => {
  const { predicted_home_score, predicted_away_score } = prediction;
  const { home_score, away_score } = match;

  // Exact score match
  if (predicted_home_score === home_score && predicted_away_score === away_score) {
    return 10;
  }

  // Correct goal difference
  if (
    predicted_home_score - predicted_away_score ===
    home_score - away_score
  ) {
    return 5;
  }

  // Correct outcome (win/draw/loss)
  const predictedOutcome = Math.sign(predicted_home_score - predicted_away_score);
  const actualOutcome = Math.sign(home_score - away_score);

  if (predictedOutcome === actualOutcome) {
    return 3;
  }

  return 0;
};

const scoreAllCompleted = async () => {
  const scorePredictionUtil = require('../../utils/scorePrediction');

  const [completedMatches] = await db.query(
    "SELECT * FROM matches WHERE status = 'completed'"
  );

  let totalScored = 0;

  for (const match of completedMatches) {
    const [predictions] = await db.query(
      'SELECT * FROM predictions WHERE match_id = ? AND is_scored = 0',
      [match.id]
    );

    for (const prediction of predictions) {
      const points = scorePredictionUtil(
        { home_score: prediction.predicted_home_score, away_score: prediction.predicted_away_score },
        { home_score: match.home_score, away_score: match.away_score }
      );

      await db.query(
        'UPDATE predictions SET points_earned = ?, is_scored = 1 WHERE id = ?',
        [points, prediction.id]
      );

      await db.query(
        'UPDATE users SET total_points = total_points + ? WHERE id = ?',
        [points, prediction.user_id]
      );

      totalScored++;
    }
  }

  return { scored: totalScored };
};

module.exports = {
  getUserPredictions,
  createPrediction,
  updatePrediction,
  getByMatch,
  scorePredictions,
  scoreAllCompleted,
};
