const router = require('express').Router();
const auth = require('../../middleware/auth');
const quizController = require('./quiz.controller');
const quizValidation = require('./quiz.validation');

router.get('/', quizController.getAll);
router.get('/history', auth, quizController.getHistory);
router.get('/:id', auth, quizController.getById);
router.post('/:id/attempt', auth, quizValidation.submitAttempt, quizController.submitAttempt);

module.exports = router;
