const router = require('express').Router();
const groupController = require('./group.controller');
const groupValidation = require('./group.validation');
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

router.get('/', groupController.getAll);
router.get('/:id', groupController.getById);

router.post('/', auth, adminOnly, groupValidation.createGroup, groupController.create);
router.put('/:id', auth, adminOnly, groupValidation.updateGroup, groupController.update);
router.delete('/:id', auth, adminOnly, groupValidation.deleteGroup, groupController.deleteGroup);

module.exports = router;
