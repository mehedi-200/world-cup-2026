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

module.exports = { submitAttempt };
