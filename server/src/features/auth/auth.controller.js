const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service');

const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    data: { user, token },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.json({
    status: 'success',
    data: { user, token },
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.json({
    status: 'success',
    data: { user },
  });
});

module.exports = { register, login, getMe };
