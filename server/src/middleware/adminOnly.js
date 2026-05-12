const AppError = require('../utils/AppError');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin only.', 403);
  }
  next();
};

module.exports = adminOnly;
