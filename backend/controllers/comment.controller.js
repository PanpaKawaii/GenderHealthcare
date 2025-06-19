const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const bannedWords = require("../utils/filterWords");

function containsBannedWords(content) {
  if (!content) return false;

  const lower = content.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}

exports.replyToComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content, accountId } = req.body;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment)
      return res.status(404).json({ message: "Parent comment not found" });

    const hasBannedWords = containsBannedWords(content);
    const status = hasBannedWords ? "pending" : "approved";

    const reply = new Comment({
      postId: parentComment.postId,
      content,
      accountId,
      parentCommentId: commentId,
      status,
    });

    await reply.save();

    if (status === "approved") {
      await Post.findByIdAndUpdate(parentComment.postId, {
        $inc: { answerCount: 1 },
      });
    }

    const populatedReply = await Comment.findById(reply._id).populate(
      "accountId"
    );
    res.status(201).json({
      comment: populatedReply,
      message:
        status === "approved"
          ? "Phản hồi đã được đăng"
          : "Phản hồi đang chờ duyệt",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.voteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { voteType, accountId } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Bình luận không tồn tại" });

    comment.voteUp = comment.voteUp.filter((id) => id.toString() !== accountId);
    comment.voteDown = comment.voteDown.filter(
      (id) => id.toString() !== accountId
    );

    if (voteType === "up") {
      comment.voteUp.push(accountId);
    } else if (voteType === "down") {
      comment.voteDown.push(accountId);
    } else if (voteType !== null) {
      return res
        .status(400)
        .json({ message: "Loại vote không hợp lệ (chỉ up, down, hoặc null)" });
    }
    await comment.save();

    const upvotes = comment.voteUp.length;
    const downvotes = comment.voteDown.length;
    const rawTotal = upvotes - downvotes;
    const displayTotal = Math.max(0, rawTotal);

    res.json({
      comment,
      voteStats: {
        upvotes,
        downvotes,
        rawTotal,
        displayTotal,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentReplies = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }
    const replies = await Comment.find({
      parentCommentId: commentId,
      status: "approved",
    })
      .populate("accountId")
      .sort({ createdAt: 1 });
    const formattedReplies = replies.map((reply) => {
      const replyObj = reply.toObject();
      replyObj.voteCount = reply.voteUp.length - reply.voteDown.length;
      replyObj.displayVoteCount = Math.max(0, replyObj.voteCount);
      return replyObj;
    });

    res.json(formattedReplies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
