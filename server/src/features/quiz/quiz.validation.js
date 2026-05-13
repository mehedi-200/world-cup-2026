const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const submitAttempt = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid quiz ID is required'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be a non-empty array'),
  body('answers.*.question_id')
    .isInt({ min: 1 })
    .withMessage('Each answer must have a valid question ID'),
  body('answers.*.selected_option')
    .notEmpty()
    .withMessage('Each answer must have a selected option'),
  validate,
];

const createQuiz = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Quiz title is required'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('questions')
    .optional()
    .isArray()
    .withMessage('Questions must be an array'),
  validate,
];

const createQuestion = [
  body('question_text')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  body('option_a')
    .trim()
    .notEmpty()
    .withMessage('Option A is required'),
  body('option_b')
    .trim()
    .notEmpty()
    .withMessage('Option B is required'),
  body('option_c')
    .trim()
    .notEmpty()
    .withMessage('Option C is required'),
  body('option_d')
    .trim()
    .notEmpty()
    .withMessage('Option D is required'),
  body('correct_option')
    .isIn(['a', 'b', 'c', 'd'])
    .withMessage('Correct option must be a, b, c, or d'),
  body('points')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Points must be a positive integer'),
  validate,
];

module.exports = { submitAttempt, createQuiz, createQuestion };
