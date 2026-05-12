const catchAsync = require('../../utils/catchAsync');
const quizService = require('./quiz.service');

const getAll = catchAsync(async (req, res) => {
  const quizzes = await quizService.getAll();

  res.json({
    status: 'success',
    data: { quizzes },
  });
});

const getById = catchAsync(async (req, res) => {
  const quiz = await quizService.getById(req.params.id);

  res.json({
    status: 'success',
    data: { quiz },
  });
});

const submitAttempt = catchAsync(async (req, res) => {
  const result = await quizService.submitAttempt(
    req.user.id,
    req.params.id,
    req.body.answers
  );

  res.status(201).json({
    status: 'success',
    data: { attempt: result },
  });
});

const getHistory = catchAsync(async (req, res) => {
  const history = await quizService.getHistory(req.user.id);

  res.json({
    status: 'success',
    data: { history },
  });
});

module.exports = { getAll, getById, submitAttempt, getHistory };
