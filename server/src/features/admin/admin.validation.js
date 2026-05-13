const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const updateRole = [
  param('id').isInt({ min: 1 }).withMessage('Valid user ID required'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  validate,
];

const deleteUser = [
  param('id').isInt({ min: 1 }).withMessage('Valid user ID required'),
  validate,
];

module.exports = { updateRole, deleteUser };
