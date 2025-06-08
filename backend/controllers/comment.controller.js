const Comment = require('../models/comment.model');

exports.create = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getByQuestion = async (req, res) => {
  const  questionId  = req.params.id;
  const comments = await Comment.find({ questionId }).populate('accountId').sort({ createDate: 1 });
  res.json(comments);
};
exports.update = async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!comment) return res.sendStatus(404);
  res.json(comment);
};
exports.remove = async (req, res) => {
  const c = await Comment.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!c });
};
exports.getOne = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('accountId');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createForQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const commentData = {
      ...req.body,
      questionId: questionId,
      // Thêm accountId từ user đã xác thực nếu có
      accountId: req.user?._id || req.body.accountId
    };
    
    const comment = new Comment(commentData);
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id).populate('accountId');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};