const express = require("express");
const commentCtrl = require("../controllers/comment.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const router = express.Router();

// Public routes
router.get("/:commentId/replies", commentCtrl.getCommentReplies);

// Protected routes - require authentication
router.post("/:commentId/replies", authenticate, commentCtrl.replyToComment);
router.post("/:commentId/vote", authenticate, commentCtrl.voteComment);

module.exports = router;
