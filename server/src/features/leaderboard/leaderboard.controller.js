const catchAsync = require('../../utils/catchAsync');
const leaderboardService = require('./leaderboard.service');

const getLeaderboard = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await leaderboardService.getLeaderboard(
    parseInt(page) || 1,
    parseInt(limit) || 50
  );

  res.json({
    status: 'success',
    data: result.leaderboard,
    pagination: result.pagination,
  });
});

const getMyRank = catchAsync(async (req, res) => {
  const user = await leaderboardService.getMyRank(req.user.id);

  res.json({
    status: 'success',
    data: { user },
  });
});

module.exports = { getLeaderboard, getMyRank };
