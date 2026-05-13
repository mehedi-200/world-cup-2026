const catchAsync = require('../../utils/catchAsync');
const adminService = require('./admin.service');

const getStats = catchAsync(async (req, res) => {
  const stats = await adminService.getStats();
  res.json({ status: 'success', data: stats });
});

const getActivity = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const activity = await adminService.getActivity(limit);
  res.json({ status: 'success', data: activity });
});

const getUsers = catchAsync(async (req, res) => {
  const { page, limit, search, role } = req.query;
  const result = await adminService.getUsers({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    search,
    role,
  });
  res.json({ status: 'success', data: result.users, pagination: result.pagination });
});

const updateUserRole = catchAsync(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  res.json({ status: 'success', data: user });
});

const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  res.json({ status: 'success', message: 'User deleted' });
});

module.exports = { getStats, getActivity, getUsers, updateUserRole, deleteUser };
