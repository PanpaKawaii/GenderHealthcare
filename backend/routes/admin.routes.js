const express = require('express');
const adminCtrl = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

// All admin routes require authentication and Admin authorization
router.use(authenticate, authorize('Admin'));

// User management routes
router.get('/users', adminCtrl.getAllUsers);
router.get('/users/:id', adminCtrl.getUserById);
router.post('/users', adminCtrl.createUser);
router.put('/users/:id', adminCtrl.updateUser);
router.delete('/users/:id', adminCtrl.deleteUser);

// User status routes
router.patch('/users/:id/activate', adminCtrl.activateUser);
router.patch('/users/:id/deactivate', adminCtrl.deactivateUser);
router.patch('/users/:id/change-role', adminCtrl.changeUserRole);

// Statistics
router.get('/stats/users', adminCtrl.getUserStats);

module.exports = router;
