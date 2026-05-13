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

  // If token is old (missing is_admin), fetch fresh from DB
  if (decoded.is_admin === undefined) {
    const db = require('../config/db');
    const [rows] = await db.query('SELECT role, is_admin FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) throw new AppError('User no longer exists', 401);
    req.user = { id: decoded.id, role: rows[0].role, is_admin: rows[0].is_admin };
  } else {
    req.user = { id: decoded.id, role: decoded.role, is_admin: decoded.is_admin };
  }
  next();
});

module.exports = auth;
