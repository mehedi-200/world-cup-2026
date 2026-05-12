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
    'SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?',
    [quizId]
  );

  const correctMap = {};
  for (const q of questions) {
    correctMap[q.id] = q.correct_answer;
  }

  let score = 0;
  for (const answer of answers) {
    if (correctMap[answer.question_id] && correctMap[answer.question_id] === answer.selected_option) {
      score++;
    }
  }

  const totalQuestions = questions.length;
  const pointsPerQuestion = quizzes[0].points_per_question || 1;
  const totalPoints = score * pointsPerQuestion;

  const [result] = await db.query(
    `INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, points_earned)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, quizId, score, totalQuestions, totalPoints]
  );

  await db.query(
    'UPDATE users SET total_points = total_points + ? WHERE id = ?',
    [totalPoints, userId]
  );

  return {
    id: result.insertId,
    quiz_id: quizId,
    score,
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
