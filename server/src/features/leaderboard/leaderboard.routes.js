const router = require('express').Router();
const auth = require('../../middleware/auth');
const leaderboardController = require('./leaderboard.controller');

router.get('/', leaderboardController.getLeaderboard);
router.get('/me', auth, leaderboardController.getMyRank);

module.exports = router;
