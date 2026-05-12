const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');

const register = async ({ username, email, password }) => {
  const [existing] = await db.query(
    'SELECT id FROM users WHERE email = ? OR username = ?',
    [email, username]
  );

  if (existing.length > 0) {
    throw new AppError('User with this email or username already exists', 409);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const [result] = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, password_hash]
  );

  const [rows] = await db.query(
    'SELECT id, username, email, avatar_url, role, total_points, created_at FROM users WHERE id = ?',
    [result.insertId]
  );

  const newUser = rows[0];
  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return { user: newUser, token };
};

const login = async (email, password) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  const { password_hash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const getProfile = async (userId) => {
  const [rows] = await db.query(
    'SELECT id, username, email, avatar_url, role, total_points, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  return rows[0];
};

module.exports = { register, login, getProfile };
