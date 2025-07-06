const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Account = require('../models/account.model');

// Posts moderation
exports.getPendingPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ status: 'pending' })
      .populate('accountId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Post.countDocuments({ status: 'pending' });
    
    res.json({
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    if (!['pending', 'approved', 'rejected', 'flagged'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const posts = await Post.find({ status })
      .populate('accountId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Post.countDocuments({ status });
    
    res.json({
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approvePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { status: 'approved', moderatedAt: new Date(), moderatedBy: req.user?.id },
      { new: true }
    ).populate('accountId', 'name email role');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { reason } = req.body;
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { 
        status: 'rejected', 
        moderatedAt: new Date(), 
        moderatedBy: req.user?.id,
        rejectionReason: reason || 'Content not suitable for the community'
      },
      { new: true }
    ).populate('accountId', 'name email role');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.flagPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { reason } = req.body;
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { 
        status: 'flagged', 
        flaggedAt: new Date(),
        flaggedBy: req.user?.id,
        flagReason: reason || 'Flagged for review'
      },
      { new: true }
    );
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Comments moderation
exports.getPendingComments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const comments = await Comment.find({ status: 'pending' })
      .populate('accountId', 'name email role')
      // .populate('questionId', 'title')
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Comment.countDocuments({ status: 'pending' });
    
    res.json({
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    if (!['pending', 'approved', 'rejected', 'flagged'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const comments = await Comment.find({ status })
      .populate('accountId', 'name email role')
      .populate('questionId', 'title')
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Comment.countDocuments({ status });
    
    res.json({
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { status: 'approved', moderatedAt: new Date(), moderatedBy: req.user?.id },
      { new: true }
    ).populate('accountId', 'name email role');
    
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { reason } = req.body;
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { 
        status: 'rejected', 
        moderatedAt: new Date(), 
        moderatedBy: req.user?.id,
        rejectionReason: reason || 'Content not suitable for the community'
      },
      { new: true }
    ).populate('accountId', 'name email role');
    
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.flagComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { reason } = req.body;
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { 
        status: 'flagged', 
        flaggedAt: new Date(),
        flaggedBy: req.user?.id,
        flagReason: reason || 'Flagged for review'
      },
      { new: true }
    );
    
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dashboard statistics
exports.getModerationStats = async (req, res) => {
  try {
    // Content stats
    const pendingPosts = await Post.countDocuments({ status: 'pending' });
    const approvedPosts = await Post.countDocuments({ status: 'approved' });
    const rejectedPosts = await Post.countDocuments({ status: 'rejected' });
    const flaggedPosts = await Post.countDocuments({ status: 'flagged' });
    
    const pendingComments = await Comment.countDocuments({ status: 'pending' });
    const approvedComments = await Comment.countDocuments({ status: 'approved' });
    const rejectedComments = await Comment.countDocuments({ status: 'rejected' });
    const flaggedComments = await Comment.countDocuments({ status: 'flagged' });
    
    // User stats
    const activeUsers = await Account.countDocuments({ isActive: true });
    const totalUsers = await Account.countDocuments();
    
    // Recent activity
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    
    const postsToday = await Post.countDocuments({ createdAt: { $gte: startOfDay } });
    const commentsToday = await Comment.countDocuments({ createdAt: { $gte: startOfDay } });
    const usersToday = await Account.countDocuments({ createdAt: { $gte: startOfDay } });
    
    res.json({
      posts: {
        pending: pendingPosts,
        approved: approvedPosts,
        rejected: rejectedPosts,
        flagged: flaggedPosts,
        total: pendingPosts + approvedPosts + rejectedPosts + flaggedPosts
      },
      comments: {
        pending: pendingComments,
        approved: approvedComments,
        rejected: rejectedComments,
        flagged: flaggedComments,
        total: pendingComments + approvedComments + rejectedComments + flaggedComments
      },
      users: {
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        total: totalUsers
      },
      activity: {
        postsToday,
        commentsToday,
        usersToday
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};