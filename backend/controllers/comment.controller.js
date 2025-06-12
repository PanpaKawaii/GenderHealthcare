const Comment = require('../models/comment.model');

// exports.replyToComment = async (req, res) => {
//   try {
//     const parentCommentId = req.params.commentId;
//     const { content, accountId } = req.body;
//     const parentComment = await Comment.findById(parentCommentId);
//     if (!parentComment) {
//       return res.status(404).json({ message: 'Comment gốc không tồn tại' });
//     }

//     const reply = new Comment({
//        postId: parentComment.postId, // Kế thừa post từ comment gốc
//      parentCommentId,  
//       content,
//       accountId,
//     });
    
//     await reply.save();
    exports.replyToComment = async (req, res) => {
  try {
    const parentCommentId = req.params.commentId;
    const { content, accountId } = req.body;
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment gốc không tồn tại' });
    }

    const reply = new Comment({
       postId: parentComment.postId, // Kế thừa post từ comment gốc
     parentCommentId,  
      content,
      accountId,
    });
      await reply.save();
    const populatedReply = await Comment.findById(reply._id).populate('accountId parentCommentId');
res.status(201).json(populatedReply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.voteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { voteType, accountId } = req.body; // 'up' hoặc 'down'
const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Bình luận không tồn tại' });
    
      comment.voteUp = comment.voteUp.filter(id => id.toString() !== accountId);
    comment.voteDown = comment.voteDown.filter(id => id.toString() !== accountId);

    if (voteType === 'up') comment.voteUp.push(accountId);
    else if (voteType === 'down') comment.voteDown.push(accountId);
    else return res.status(400).json({ message: 'Loại vote không hợp lệ' });
    await comment.save();
   res.json({
      comment,
      voteStats: {
        upvotes: comment.voteUp.length,
        downvotes: comment.voteDown.length,
        total: comment.voteUp.length - comment.voteDown.length
      }
    });
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