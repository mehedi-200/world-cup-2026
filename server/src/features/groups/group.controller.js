const catchAsync = require('../../utils/catchAsync');
const groupService = require('./group.service');

const getAll = catchAsync(async (req, res) => {
  const groups = await groupService.getAll();

  res.json({
    status: 'success',
    data: { groups },
  });
});

const getById = catchAsync(async (req, res) => {
  const group = await groupService.getById(req.params.id);

  res.json({
    status: 'success',
    data: { group },
  });
});

const create = catchAsync(async (req, res) => {
  const group = await groupService.create(req.body.name);

  res.status(201).json({
    status: 'success',
    data: { group },
  });
});

const update = catchAsync(async (req, res) => {
  const group = await groupService.update(req.params.id, req.body.name);

  res.json({
    status: 'success',
    data: { group },
  });
});

const deleteGroup = catchAsync(async (req, res) => {
  await groupService.delete(req.params.id);

  res.json({
    status: 'success',
    message: 'Group deleted',
  });
});

module.exports = { getAll, getById, create, update, deleteGroup };
