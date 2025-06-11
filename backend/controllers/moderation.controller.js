const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'pending' });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approvePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(
      postId,
      { status: 'approved' },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(
      postId,
      { status: 'rejected' },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingComments = async (req, res) => {
  try {
    const comments = await Comment.find({ status: 'pending' });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { status: 'approved' },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment không tồn tại' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { status: 'rejected' },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment không tồn tại' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};