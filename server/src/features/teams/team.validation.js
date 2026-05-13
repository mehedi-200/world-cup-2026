const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const createTeam = [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('code').trim().isLength({ min: 2, max: 3 }).withMessage('Code must be 2-3 characters'),
  body('group_id').optional().isInt({ min: 1 }).withMessage('Valid group ID is required'),
  validate,
];

const updateTeam = [
  param('id').isInt({ min: 1 }).withMessage('Valid team ID is required'),
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('code').trim().isLength({ min: 2, max: 3 }).withMessage('Code must be 2-3 characters'),
  body('group_id').optional().isInt({ min: 1 }).withMessage('Valid group ID is required'),
  validate,
];

const updateStandings = [
  param('id').isInt({ min: 1 }).withMessage('Valid team ID is required'),
  body('played').isInt({ min: 0 }).withMessage('Played must be a non-negative integer'),
  body('won').isInt({ min: 0 }).withMessage('Won must be a non-negative integer'),
  body('drawn').isInt({ min: 0 }).withMessage('Drawn must be a non-negative integer'),
  body('lost').isInt({ min: 0 }).withMessage('Lost must be a non-negative integer'),
  body('goals_for').isInt({ min: 0 }).withMessage('Goals for must be a non-negative integer'),
  body('goals_against').isInt({ min: 0 }).withMessage('Goals against must be a non-negative integer'),
  validate,
];

module.exports = { createTeam, updateTeam, updateStandings };
