const router = require('express').Router();
const groupController = require('./group.controller');

router.get('/', groupController.getAll);
router.get('/:id', groupController.getById);

module.exports = router;
