const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const matchController = require('./match.controller');
const matchValidation = require('./match.validation');

router.get('/', matchController.getAll);
router.get('/live', matchController.getLive);
router.get('/sync/today', matchController.syncToday);
router.get('/sync/date', matchController.syncByDate);
router.get('/sync/competition/:competitionId', matchController.syncCompetition);
router.get('/:id', matchController.getById);
router.post('/', auth, adminOnly, matchValidation.createMatch, matchController.create);
router.put('/:id', auth, adminOnly, matchController.update);
router.post('/:id/events', auth, adminOnly, matchValidation.createEvent, matchController.addEvent);

module.exports = router;
