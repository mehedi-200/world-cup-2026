const catchAsync = require('../../utils/catchAsync');
const votingService = require('./voting.service');

const getAll = catchAsync(async (req, res) => {
  const polls = await votingService.getAll();

  res.json({
    status: 'success',
    data: { polls },
  });
});

const getById = catchAsync(async (req, res) => {
  const poll = await votingService.getById(req.params.id);

  res.json({
    status: 'success',
    data: { poll },
  });
});

const castVote = catchAsync(async (req, res) => {
  const poll = await votingService.castVote(
    req.user.id,
    req.params.id,
    req.body.option_id
  );

  res.status(201).json({
    status: 'success',
    data: { poll },
  });
});

module.exports = { getAll, getById, castVote };
