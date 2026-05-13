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

const create = catchAsync(async (req, res) => {
  const team = await teamService.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { team },
  });
});

const update = catchAsync(async (req, res) => {
  const team = await teamService.update(req.params.id, req.body);

  res.json({
    status: 'success',
    data: { team },
  });
});

const deleteTeam = catchAsync(async (req, res) => {
  await teamService.deleteTeam(req.params.id);

  res.json({
    status: 'success',
    message: 'Team deleted',
  });
});

const updateStandings = catchAsync(async (req, res) => {
  const team = await teamService.updateStandings(req.params.id, req.body);

  res.json({
    status: 'success',
    data: { team },
  });
});

module.exports = { getAll, getById, create, update, deleteTeam, updateStandings };
