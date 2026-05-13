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

const getAllAdmin = catchAsync(async (req, res) => {
  const quizzes = await quizService.getAllAdmin();

  res.json({
    status: 'success',
    data: { quizzes },
  });
});

const createQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);

  res.status(201).json({
    status: 'success',
    data: { quiz },
  });
});

const updateQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);

  res.json({
    status: 'success',
    data: { quiz },
  });
});

const deleteQuiz = catchAsync(async (req, res) => {
  await quizService.deleteQuiz(req.params.id);

  res.json({
    status: 'success',
    message: 'Quiz deleted successfully',
  });
});

const addQuestion = catchAsync(async (req, res) => {
  const question = await quizService.addQuestion(req.params.id, req.body);

  res.status(201).json({
    status: 'success',
    data: { question },
  });
});

const updateQuestion = catchAsync(async (req, res) => {
  const question = await quizService.updateQuestion(req.params.questionId, req.body);

  res.json({
    status: 'success',
    data: { question },
  });
});

const deleteQuestion = catchAsync(async (req, res) => {
  await quizService.deleteQuestion(req.params.questionId);

  res.json({
    status: 'success',
    message: 'Question deleted successfully',
  });
});

module.exports = { getAll, getById, submitAttempt, getHistory, getAllAdmin, createQuiz, updateQuiz, deleteQuiz, addQuestion, updateQuestion, deleteQuestion };
