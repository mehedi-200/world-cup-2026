const AppError = require('../utils/AppError');

const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return next(new AppError('Access denied. Admin only.', 403));
  }
  next();
};

module.exports = adminOnly;
