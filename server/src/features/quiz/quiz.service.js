const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getAll = async () => {
  const [rows] = await db.query(
    `SELECT q.*, COUNT(qq.id) AS question_count
     FROM quizzes q
     LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
     WHERE q.is_active = 1
     GROUP BY q.id
     ORDER BY q.created_at DESC`
  );

  return rows;
};

const getById = async (quizId) => {
  const [quizzes] = await db.query(
    'SELECT * FROM quizzes WHERE id = ?',
    [quizId]
  );

  if (quizzes.length === 0) {
    throw new AppError('Quiz not found', 404);
  }

  const quiz = quizzes[0];

  const [questions] = await db.query(
    `SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d
     FROM quiz_questions
     WHERE quiz_id = ?
     ORDER BY id ASC`,
    [quizId]
  );

  quiz.questions = questions;

  return quiz;
};

const submitAttempt = async (userId, quizId, answers) => {
  const [quizzes] = await db.query(
    'SELECT * FROM quizzes WHERE id = ? AND is_active = 1',
    [quizId]
  );

  if (quizzes.length === 0) {
    throw new AppError('Quiz not found or is no longer active', 404);
  }

  const [existingAttempt] = await db.query(
    'SELECT id FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?',
    [userId, quizId]
  );

  if (existingAttempt.length > 0) {
    throw new AppError('You have already attempted this quiz', 409);
  }

  const [questions] = await db.query(
    'SELECT id, correct_option, points FROM quiz_questions WHERE quiz_id = ?',
    [quizId]
  );

  const correctMap = {};
  const pointsMap = {};
  for (const q of questions) {
    correctMap[q.id] = q.correct_option;
    pointsMap[q.id] = q.points || 10;
  }

  let correctCount = 0;
  let totalPoints = 0;
  const responses = [];

  for (const answer of answers) {
    const isCorrect = correctMap[answer.question_id] && correctMap[answer.question_id] === answer.selected_option;
    if (isCorrect) {
      correctCount++;
      totalPoints += pointsMap[answer.question_id] || 10;
    }
    responses.push({
      question_id: answer.question_id,
      selected_option: answer.selected_option,
      is_correct: !!isCorrect,
    });
  }

  const totalQuestions = questions.length;

  const [result] = await db.query(
    `INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions)
     VALUES (?, ?, ?, ?)`,
    [userId, quizId, correctCount, totalQuestions]
  );

  // Save individual responses
  for (const resp of responses) {
    await db.query(
      `INSERT INTO quiz_responses (attempt_id, question_id, selected_option, is_correct)
       VALUES (?, ?, ?, ?)`,
      [result.insertId, resp.question_id, resp.selected_option, resp.is_correct]
    );
  }

  await db.query(
    'UPDATE users SET total_points = total_points + ? WHERE id = ?',
    [totalPoints, userId]
  );

  return {
    id: result.insertId,
    quiz_id: quizId,
    score: correctCount,
    total_questions: totalQuestions,
    points_earned: totalPoints,
  };
};

const getHistory = async (userId) => {
  const [rows] = await db.query(
    `SELECT qa.*, q.title AS quiz_title, q.description AS quiz_description
     FROM quiz_attempts qa
     JOIN quizzes q ON qa.quiz_id = q.id
     WHERE qa.user_id = ?
     ORDER BY qa.created_at DESC`,
    [userId]
  );

  return rows;
};

module.exports = { getAll, getById, submitAttempt, getHistory };
