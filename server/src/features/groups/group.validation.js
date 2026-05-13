const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const createGroup = [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  validate,
];

const updateGroup = [
  param('id').isInt({ min: 1 }).withMessage('Valid group ID is required'),
  body('name').trim().notEmpty().withMessage('Group name is required'),
  validate,
];

const deleteGroup = [
  param('id').isInt({ min: 1 }).withMessage('Valid group ID is required'),
  validate,
];

module.exports = { createGroup, updateGroup, deleteGroup };
