const router = require('express').Router();
const teamController = require('./team.controller');

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);

module.exports = router;
