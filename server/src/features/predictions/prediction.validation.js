const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const createPrediction = [
  body('match_id')
    .isInt({ min: 1 })
    .withMessage('Valid match ID is required'),
  body('predicted_home_score')
    .isInt({ min: 0 })
    .withMessage('Predicted home score must be a non-negative integer'),
  body('predicted_away_score')
    .isInt({ min: 0 })
    .withMessage('Predicted away score must be a non-negative integer'),
  validate,
];

const updatePrediction = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid prediction ID is required'),
  body('predicted_home_score')
    .isInt({ min: 0 })
    .withMessage('Predicted home score must be a non-negative integer'),
  body('predicted_away_score')
    .isInt({ min: 0 })
    .withMessage('Predicted away score must be a non-negative integer'),
  validate,
];

module.exports = { createPrediction, updatePrediction };
