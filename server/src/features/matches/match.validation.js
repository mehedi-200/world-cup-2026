const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const createMatch = [
  body('home_team_id')
    .isInt({ min: 1 })
    .withMessage('Valid home team ID is required'),
  body('away_team_id')
    .isInt({ min: 1 })
    .withMessage('Valid away team ID is required'),
  body('match_date')
    .isISO8601()
    .withMessage('Valid match date is required'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required'),
  body('stage')
    .trim()
    .notEmpty()
    .withMessage('Stage is required'),
  body('group_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid group ID is required'),
  validate,
];

const createEvent = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid match ID is required'),
  body('event_type')
    .trim()
    .isIn(['goal', 'own_goal', 'penalty_goal', 'penalty_miss', 'yellow_card', 'red_card', 'substitution'])
    .withMessage('Valid event type is required'),
  body('minute')
    .isInt({ min: 0, max: 150 })
    .withMessage('Valid minute is required'),
  body('player_name')
    .trim()
    .notEmpty()
    .withMessage('Player name is required'),
  body('team_id')
    .isInt({ min: 1 })
    .withMessage('Valid team ID is required'),
  body('details')
    .optional()
    .trim(),
  validate,
];

module.exports = { createMatch, createEvent };
