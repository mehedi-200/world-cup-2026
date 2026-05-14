const express = require('express');
const ttsController = require('./tts.controller');

const router = express.Router();

router.post('/', ttsController.speak);
router.post('/google', ttsController.googleSpeak);

module.exports = router;
