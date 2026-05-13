const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const votingController = require('./voting.controller');
const votingValidation = require('./voting.validation');

router.get('/', votingController.getAll);

// Admin routes
router.get('/admin/all', auth, adminOnly, votingController.getAllAdmin);
router.post('/', auth, adminOnly, votingValidation.createPoll, votingController.createPoll);
router.put('/:id', auth, adminOnly, votingController.updatePoll);
router.delete('/:id', auth, adminOnly, votingController.deletePoll);
router.post('/:id/options', auth, adminOnly, votingValidation.createOption, votingController.addOption);
router.delete('/options/:optionId', auth, adminOnly, votingController.deleteOption);

router.get('/:id', votingController.getById);
router.post('/:id/vote', auth, votingValidation.castVote, votingController.castVote);

module.exports = router;
