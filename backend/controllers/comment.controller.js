const Comment = require('../models/comment.model');

exports.replyToComment = async (req, res) => {
  try {
    const parentCommentId = req.params.commentId;
    const { content, user } = req.body;
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment gốc không tồn tại' });
    }

    const reply = new Comment({
      post: parentComment.post,        // Kế thừa post từ comment gốc
      parentComment: parentCommentId,  // Đánh dấu đây là reply của comment gốc
      content,
      user,
    });
    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.voteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { voteType } = req.body; // 'up' hoặc 'down'
    const update = {};
    if (voteType === 'up') {
      update.$inc = { upvotes: 1 };
    } else if (voteType === 'down') {
      update.$inc = { downvotes: 1 };
    } else {
      return res.status(400).json({ message: 'Loại vote không hợp lệ' });
    }
    const comment = await Comment.findByIdAndUpdate(commentId, update, { new: true });
    if (!comment) return res.status(404).json({ message: 'Comment không tồn tại' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getByPost = async (req, res) => {
//   const  postId  = req.params.id;
//   const comments = await Comment.find({ postId }).populate('accountId').sort({ createDate: 1 });
//   res.json(comments);
// };
// exports.update = async (req, res) => {
//   const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   if (!comment) return res.sendStatus(404);
//   res.json(comment);
// };
// exports.remove = async (req, res) => {
//   const c = await Comment.findByIdAndDelete(req.params.id);
//   res.json({ deleted: !!c });
// };
// exports.getOne = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id).populate('accountId');
//     if (!comment) {
//       return res.status(404).json({ message: 'Comment not found' });
//     }
//     res.json(comment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.createForPost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const commentData = {
//       ...req.body,
//       postId: postId,
//       // Thêm accountId từ user đã xác thực nếu có
//       accountId: req.user?._id || req.body.accountId
//     };
    
//     const comment = new Comment(commentData);
//     await comment.save();
    
//     const populatedComment = await Comment.findById(comment._id).populate('accountId');
//     res.status(201).json(populatedComment);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };