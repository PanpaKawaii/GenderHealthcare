const Question = require('../models/question.model');
const Comment = require('../models/comment.model');

exports.create = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.getAll = async (req, res) => res.json(await Question.find().populate('accountId'));
exports.getOne = async (req, res) => {
  const question = await Question.findById(req.params.id).populate('accountId');
  if (!question) return res.sendStatus(404);
  const comments = await Comment.find({ questionId: question._id }).populate('accountId').sort({ createDate: 1 });
  res.json({ question, comments });
};
exports.update = async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!question) return res.sendStatus(404);
  res.json(question);
};
exports.remove = async (req, res) => {
  const q = await Question.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!q });
};
// Nested comment routes
exports.getComments = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const comments = await Comment.find({ questionId })
      .populate('accountId')
      .sort({ createDate: 1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // Kiểm tra question có tồn tại không
    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Nếu là reply cho comment khác, kiểm tra parent comment có tồn tại không
    if (req.body.parentCommentId) {
      const parentCommentExists = await Comment.exists({ 
        _id: req.body.parentCommentId,
        questionId: questionId // Đảm bảo parent comment thuộc cùng question
      });
      
      if (!parentCommentExists) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    // Tạo comment
    const comment = new Comment({
      questionId: questionId,
      content: req.body.content,
      accountId: req.body.accountId || "6650fe8e8f3a8d6ff13d22a1", // Sử dụng id của user hiện tại
      parentCommentId: req.body.parentCommentId || null
    });

    await comment.save();
    
    // Trả về comment đã populate
    const populatedComment = await Comment.findById(comment._id).populate('accountId');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};