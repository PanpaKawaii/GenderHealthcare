const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', postCtrl.getPosts);
router.get('/:postId', postCtrl.getPostById);
router.get('/:postId/comments', postCtrl.getCommentsByPostId);

// Protected routes - require authentication
router.post('/', authenticate, postCtrl.createPost);
router.put('/:postId', authenticate, postCtrl.updatePost);
router.patch('/:postId', authenticate, postCtrl.updatePost);
router.delete('/:postId', authenticate, postCtrl.deletePost);
router.put('/:postId/edit', authenticate, postCtrl.editPost);
router.post('/:postId/comments', authenticate, postCtrl.addComment);
router.post('/:postId/vote', authenticate, postCtrl.votePost);
router.patch('/:postId/view', authenticate, postCtrl.incrementView);

module.exports = router;