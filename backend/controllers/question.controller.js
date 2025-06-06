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
