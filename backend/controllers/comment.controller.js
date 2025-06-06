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
  const { questionId } = req.params;
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
