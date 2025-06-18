const express = require('express');
const moderationCtrl = require('../controllers/moderation.controller');
const router = express.Router();

router.get('/posts/pending', moderationCtrl.getPendingPosts);
router.post('/posts/:postId/approve', moderationCtrl.approvePost);
router.post('/posts/:postId/reject', moderationCtrl.rejectPost);

router.get('/comments/pending', moderationCtrl.getPendingComments);
router.post('/comments/:commentId/approve', moderationCtrl.approveComment);
router.post('/comments/:commentId/reject', moderationCtrl.rejectComment);


module.exports = router;
