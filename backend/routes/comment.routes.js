const express = require('express');
const commentCtrl = require('../controllers/comment.controller');
const router = express.Router();

router.post('/:commentId/replies', commentCtrl.replyToComment );
router.post('/:commentId/vote', commentCtrl.voteComment);
// router.get('/:id', commentCtrl.getOne);
// router.put('/:id', commentCtrl.update);
// router.delete('/:id', commentCtrl.remove);

module.exports = router;
// 684a2d5ae6b262908479eb15 pót
//684a1ac7dfae966e9818e257 acc
//684a2e9de6b262908479eb25 comment