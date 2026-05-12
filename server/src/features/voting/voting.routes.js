const router = require('express').Router();
const auth = require('../../middleware/auth');
const votingController = require('./voting.controller');
const votingValidation = require('./voting.validation');

router.get('/', votingController.getAll);
router.get('/:id', votingController.getById);
router.post('/:id/vote', auth, votingValidation.castVote, votingController.castVote);

module.exports = router;
