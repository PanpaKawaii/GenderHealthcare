const express = require('express');
const commentCtrl = require('../controllers/comment.controller');
const router = express.Router();

router.post('/:commentId/replies', commentCtrl.replyToComment );
router.post('/:commentId/vote', commentCtrl.voteComment);
router.get('/:commentId/replies', commentCtrl.getCommentReplies); 

module.exports = router;