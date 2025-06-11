const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags, user } = req.body;
    const post = new Post({ title, content, category, tags, user });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.getAll = async (req, res) => res.json(await Post.find().populate('accountId'));
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = tag;  // Giả sử tags là mảng, giá trị đơn sẽ tìm phần tử mảng
    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.getOne = async (req, res) => {
//   const post = await Post.findById(req.params.id).populate('accountId');
//   if (!post) return res.sendStatus(404);
//   const comments = await Comment.find({ postId: post._id }).populate('accountId').sort({ createDate: 1 });
//   res.json({ post, comments });
// };
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });

    // Lấy comment cấp 1 (chưa có parent)
    const comments = await Comment.find({ post: postId, parentComment: null });
    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found!' });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found!' });
    // Xoá luôn cái comment có trong post này
    await Comment.deleteMany({ post: postId });
    res.json({ message: 'Đã xoá bài viết và các comment liên quan' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Nested comment routes
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ postId })
      .populate('accountId')
      .sort({ createDate: 1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.createComment = async (req, res) => {
//   try {
//     const postId = req.params.id;
    
//     // Kiểm tra question có tồn tại không
//     const postExists = await Post.exists({ _id: postId });
//     if (!postExists) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     // Nếu là reply cho comment khác, kiểm tra parent comment có tồn tại không
//     if (req.body.parentCommentId) {
//       const parentCommentExists = await Comment.exists({ 
//         _id: req.body.parentCommentId,
//        postId: postId // Đảm bảo parent comment thuộc cùng post
//       });
      
//       if (!parentCommentExists) {
//         return res.status(404).json({ message: 'Parent comment not found' });
//       }
//     }

    // Tạo comment
//     const comment = new Comment({
//       postId: postId,
//       content: req.body.content,
//       accountId: req.body.accountId || "6650fe8e8f3a8d6ff13d22a1", // Sử dụng id của user hiện tại
//       parentCommentId: req.body.parentCommentId || null
//     });

//     await comment.save();
    
//     // Trả về comment đã populate
//     const populatedComment = await Comment.findById(comment._id).populate('accountId');
//     res.status(201).json(populatedComment);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content, user } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });

    const comment = new Comment({ post: postId, content, user });
    await comment.save();

    // Thêm tham chiếu comment vào bài viết (nếu có mảng comments)
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.votePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { voteType } = req.body; // 'up' hoặc 'down'
    const update = {};
    if (voteType === 'up') {
      update.$inc = { upvotes: 1 };
    } else if (voteType === 'down') {
      update.$inc = { downvotes: 1 };
    } else {
      return res.status(400).json({ message: 'Loại vote không hợp lệ' });
    }
    const post = await Post.findByIdAndUpdate(postId, update, { new: true });
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.incrementAnswerCount = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { answerCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Bài viết không tồn tại' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};