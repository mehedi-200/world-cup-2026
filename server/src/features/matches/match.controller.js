const catchAsync = require('../../utils/catchAsync');
const matchService = require('./match.service');
const matchSync = require('./match.sync');

const getAll = catchAsync(async (req, res) => {
  const { page, limit, status, stage, date } = req.query;
  const result = await matchService.getAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
    stage,
    date,
  });

  res.json({
    status: 'success',
    data: result.matches,
    pagination: result.pagination,
  });
});

const getById = catchAsync(async (req, res) => {
  const match = await matchService.getById(req.params.id);

  res.json({
    status: 'success',
    data: { match },
  });
});

const getLive = catchAsync(async (req, res) => {
  const matches = await matchService.getLive();

  res.json({
    status: 'success',
    data: { matches },
  });
});

const create = catchAsync(async (req, res) => {
  const match = await matchService.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { match },
  });
});

const update = catchAsync(async (req, res) => {
  const match = await matchService.update(req.params.id, req.body);

  if (req.io) {
    if (req.body.status === 'live') {
      req.io.emit('match:live', match);
    }
    if (req.body.home_score !== undefined || req.body.away_score !== undefined) {
      req.io.emit('match:scoreUpdate', match);
    }
    req.io.emit('match:updated', match);
  }

  res.json({
    status: 'success',
    data: { match },
  });
});

const addEvent = catchAsync(async (req, res) => {
  const event = await matchService.addEvent(req.params.id, req.body);

  if (req.io) {
    req.io.emit('match:event', {
      matchId: parseInt(req.params.id),
      event,
    });
  }

  res.status(201).json({
    status: 'success',
    data: { event },
  });
});

// Sync today's matches from football-data.org
const syncToday = catchAsync(async (req, res) => {
  const result = await matchSync.syncTodayMatches();
  res.json({ status: 'success', data: result });
});

// Sync matches by date range
const syncByDate = catchAsync(async (req, res) => {
  const { dateFrom, dateTo } = req.query;
  if (!dateFrom || !dateTo) {
    return res.status(400).json({ status: 'fail', message: 'dateFrom and dateTo required (YYYY-MM-DD)' });
  }
  const result = await matchSync.syncByDate(dateFrom, dateTo);
  res.json({ status: 'success', data: result });
});

// Sync a specific competition (e.g., 2000 = World Cup, 2001 = Champions League, 2021 = Premier League)
const syncCompetition = catchAsync(async (req, res) => {
  const result = await matchSync.syncCompetition(req.params.competitionId);
  res.json({ status: 'success', data: result });
});

module.exports = { getAll, getById, getLive, create, update, addEvent, syncToday, syncByDate, syncCompetition };
