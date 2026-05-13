const catchAsync = require('../../utils/catchAsync');
const predictionService = require('./prediction.service');

const getAll = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await predictionService.getUserPredictions(
    req.user.id,
    parseInt(page) || 1,
    parseInt(limit) || 20
  );

  res.json({
    status: 'success',
    data: result.predictions,
    pagination: result.pagination,
  });
});

const create = catchAsync(async (req, res) => {
  const prediction = await predictionService.createPrediction(req.user.id, req.body);

  res.status(201).json({
    status: 'success',
    data: { prediction },
  });
});

const update = catchAsync(async (req, res) => {
  const prediction = await predictionService.updatePrediction(
    req.params.id,
    req.user.id,
    req.body
  );

  res.json({
    status: 'success',
    data: { prediction },
  });
});

const getByMatch = catchAsync(async (req, res) => {
  const prediction = await predictionService.getByMatch(req.user.id, req.params.matchId);

  res.json({
    status: 'success',
    data: { prediction },
  });
});

const scoreMatch = catchAsync(async (req, res) => {
  const result = await predictionService.scorePredictions(req.params.matchId);

  res.json({
    status: 'success',
    data: result,
  });
});

const scoreAll = catchAsync(async (req, res) => {
  const result = await predictionService.scoreAllCompleted();

  res.json({
    status: 'success',
    data: result,
  });
});

module.exports = { getAll, create, update, getByMatch, scoreMatch, scoreAll };
