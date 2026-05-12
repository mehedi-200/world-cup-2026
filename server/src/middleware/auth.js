const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const auth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authenticated. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwt.secret);
  req.user = { id: decoded.id, role: decoded.role };
  next();
});

module.exports = auth;
