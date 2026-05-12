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

module.exports = { getAll, getById };
