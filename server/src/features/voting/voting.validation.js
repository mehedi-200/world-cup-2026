const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const castVote = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid poll ID is required'),
  body('option_id')
    .isInt({ min: 1 })
    .withMessage('Valid option ID is required'),
  validate,
];

const createPoll = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Poll title is required'),
  body('options')
    .optional()
    .isArray()
    .withMessage('Options must be an array'),
  validate,
];

const createOption = [
  body('option_text')
    .trim()
    .notEmpty()
    .withMessage('Option text is required'),
  validate,
];

module.exports = { castVote, createPoll, createOption };
