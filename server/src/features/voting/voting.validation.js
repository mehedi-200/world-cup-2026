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

module.exports = { castVote };
