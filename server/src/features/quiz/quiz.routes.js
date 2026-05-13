const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const quizController = require('./quiz.controller');
const quizValidation = require('./quiz.validation');

router.get('/', quizController.getAll);
router.get('/history', auth, quizController.getHistory);

// Admin routes
router.get('/admin/all', auth, adminOnly, quizController.getAllAdmin);
router.post('/', auth, adminOnly, quizValidation.createQuiz, quizController.createQuiz);
router.put('/:id', auth, adminOnly, quizController.updateQuiz);
router.delete('/:id', auth, adminOnly, quizController.deleteQuiz);
router.post('/:id/questions', auth, adminOnly, quizValidation.createQuestion, quizController.addQuestion);
router.put('/questions/:questionId', auth, adminOnly, quizController.updateQuestion);
router.delete('/questions/:questionId', auth, adminOnly, quizController.deleteQuestion);

router.get('/:id', auth, quizController.getById);
router.post('/:id/attempt', auth, quizValidation.submitAttempt, quizController.submitAttempt);

module.exports = router;
