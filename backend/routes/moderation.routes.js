const express = require('express');
const moderationCtrl = require('../controllers/moderation.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

// All moderation routes require authentication and Manager or Admin authorization
router.use(authenticate, authorize( 'Admin'));

// Posts moderation
router.get('/posts/pending', moderationCtrl.getPendingPosts);
router.get('/posts/:status', moderationCtrl.getPostsByStatus);
router.post('/posts/:postId/approve', moderationCtrl.approvePost);
router.post('/posts/:postId/reject', moderationCtrl.rejectPost);
router.post('/posts/:postId/flag', moderationCtrl.flagPost);

// Comments moderation
router.get('/comments/pending', moderationCtrl.getPendingComments);
router.get('/comments/:status', moderationCtrl.getCommentsByStatus);
router.post('/comments/:commentId/approve', moderationCtrl.approveComment);
router.post('/comments/:commentId/reject', moderationCtrl.rejectComment);
router.post('/comments/:commentId/flag', moderationCtrl.flagComment);

// Dashboard statistics
router.get('/stats', moderationCtrl.getModerationStats);

module.exports = router;
