const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controller');

router.get('/', postCtrl.getPosts);
router.post('/', postCtrl.createPost);
router.get('/:postId', postCtrl.getPostById);
router.put('/:postId', postCtrl.updatePost);
router.patch('/:postId', postCtrl.updatePost);
router.delete('/:postId', postCtrl.deletePost);
router.post('/:postId/comments', postCtrl.addComment);
router.post('/:postId/vote', postCtrl.votePost);
router.patch('/:postId/view', postCtrl.incrementView);

module.exports = router;