const catchAsync = require('../../utils/catchAsync');
const teamService = require('./team.service');

const getAll = catchAsync(async (req, res) => {
  const teams = await teamService.getAll();

  res.json({
    status: 'success',
    data: { teams },
  });
});

const getById = catchAsync(async (req, res) => {
  const team = await teamService.getById(req.params.id);

  res.json({
    status: 'success',
    data: { team },
  });
});

module.exports = { getAll, getById };
