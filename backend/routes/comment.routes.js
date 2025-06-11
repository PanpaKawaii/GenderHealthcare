const express = require('express');
const commentCtrl = require('../controllers/comment.controller');
const router = express.Router();

router.post('/:commentId/replies', commentCtrl.replyToComment );
router.post('/:commentId/vote', commentCtrl.voteComment);
// router.get('/:id', commentCtrl.getOne);
// router.put('/:id', commentCtrl.update);
// router.delete('/:id', commentCtrl.remove);

module.exports = router;
