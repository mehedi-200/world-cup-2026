const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// Route imports
const authRoutes = require('./features/auth/auth.routes');
const matchRoutes = require('./features/matches/match.routes');
const teamRoutes = require('./features/teams/team.routes');
const groupRoutes = require('./features/groups/group.routes');
const predictionRoutes = require('./features/predictions/prediction.routes');
const leaderboardRoutes = require('./features/leaderboard/leaderboard.routes');
const quizRoutes = require('./features/quiz/quiz.routes');
const votingRoutes = require('./features/voting/voting.routes');
const adminRoutes = require('./features/admin/admin.routes');
const ttsRoutes = require('./features/tts/tts.routes');

const app = express();

// Middleware
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

// Make io accessible in controllers via req.io
app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'WorldCup2026 API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/polls', votingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tts', ttsRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
