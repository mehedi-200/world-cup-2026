const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const predictionController = require('./prediction.controller');
const predictionValidation = require('./prediction.validation');

router.get('/', auth, predictionController.getAll);
router.post('/', auth, predictionValidation.createPrediction, predictionController.create);
router.put('/:id', auth, predictionValidation.updatePrediction, predictionController.update);
router.get('/match/:matchId', auth, predictionController.getByMatch);
router.post('/score/:matchId', auth, adminOnly, predictionController.scoreMatch);

module.exports = router;
