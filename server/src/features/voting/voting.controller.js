const catchAsync = require('../../utils/catchAsync');
const votingService = require('./voting.service');

const getAll = catchAsync(async (req, res) => {
  // Try to extract userId from token if present (optional auth)
  let userId = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = require('jsonwebtoken');
      const env = require('../../config/env');
      const decoded = jwt.verify(authHeader.split(' ')[1], env.jwt.secret);
      userId = decoded.id;
    }
  } catch {}

  const polls = await votingService.getAll(userId);

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

const getAllAdmin = catchAsync(async (req, res) => {
  const polls = await votingService.getAllAdmin();

  res.json({
    status: 'success',
    data: { polls },
  });
});

const createPoll = catchAsync(async (req, res) => {
  const poll = await votingService.createPoll(req.body);

  res.status(201).json({
    status: 'success',
    data: { poll },
  });
});

const updatePoll = catchAsync(async (req, res) => {
  const poll = await votingService.updatePoll(req.params.id, req.body);

  res.json({
    status: 'success',
    data: { poll },
  });
});

const deletePoll = catchAsync(async (req, res) => {
  await votingService.deletePoll(req.params.id);

  res.json({
    status: 'success',
    message: 'Poll deleted successfully',
  });
});

const addOption = catchAsync(async (req, res) => {
  const option = await votingService.addOption(req.params.id, req.body);

  res.status(201).json({
    status: 'success',
    data: { option },
  });
});

const deleteOption = catchAsync(async (req, res) => {
  await votingService.deleteOption(req.params.optionId);

  res.json({
    status: 'success',
    message: 'Poll option deleted successfully',
  });
});

module.exports = { getAll, getById, castVote, getAllAdmin, createPoll, updatePoll, deletePoll, addOption, deleteOption };
