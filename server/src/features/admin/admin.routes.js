const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const adminController = require('./admin.controller');
const adminValidation = require('./admin.validation');

// All admin routes require auth + admin role
router.use(auth, adminOnly);

router.get('/stats', adminController.getStats);
router.get('/activity', adminController.getActivity);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminValidation.updateRole, adminController.updateUserRole);
router.delete('/users/:id', adminValidation.deleteUser, adminController.deleteUser);

module.exports = router;
