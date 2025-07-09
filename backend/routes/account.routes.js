const express = require('express');
const accountCtrl = require('../controllers/account.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

// Public routes
router.post('/register', accountCtrl.register);
router.post('/login', accountCtrl.login);
router.post('/check-email', accountCtrl.checkEmail);

// Legacy routes for backward compatibility
router.post('/authentication', accountCtrl.authentication);

// Protected routes (require authentication)
router.get('/me', authenticate, accountCtrl.getCurrentUser);
router.get('/:accountId/posts', authenticate, accountCtrl.getAccountPosts);

// Admin only routes
router.get('/', authenticate, authorize('Admin'), accountCtrl.getAll);
router.get('/:id', authenticate, accountCtrl.getOne);
router.post('/', authenticate, authorize('Admin'), accountCtrl.create);
router.put('/:id', authenticate, accountCtrl.update);
router.delete('/:id', authenticate, authorize('Admin'), accountCtrl.remove);
router.patch('/:id/activate', authenticate, authorize('Admin'), accountCtrl.activateAccount);
router.patch('/:id/deactivate', authenticate, authorize('Admin'), accountCtrl.deactivateAccount);

module.exports = router;
