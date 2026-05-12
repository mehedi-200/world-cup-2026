const router = require('express').Router();
const auth = require('../../middleware/auth');
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');

router.post('/register', authValidation.register, authController.register);
router.post('/login', authValidation.login, authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
