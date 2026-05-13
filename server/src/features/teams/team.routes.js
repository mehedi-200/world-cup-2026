const router = require('express').Router();
const teamController = require('./team.controller');
const teamValidation = require('./team.validation');
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

router.get('/', teamController.getAll);

router.post('/', auth, adminOnly, teamValidation.createTeam, teamController.create);
router.put('/:id', auth, adminOnly, teamValidation.updateTeam, teamController.update);
router.delete('/:id', auth, adminOnly, teamController.deleteTeam);
router.put('/:id/standings', auth, adminOnly, teamValidation.updateStandings, teamController.updateStandings);

router.get('/:id', teamController.getById);

module.exports = router;
