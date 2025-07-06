const mongoose = require("mongoose");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const bannedWords = require("../utils/filterWords");

function containsBannedWords(content) {
  if (!content) return false;
  const lower = content.toLowerCase();
  const hasBannedWord = bannedWords.some((word) => lower.includes(word));
  return hasBannedWord;
}

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags, accountId, isAnonymous } = req.body;
    if (!title.trim() || !content.trim()) {
      return res
        .status(400)
        .json({ message: "Tiêu đề và nội dung không được để trống" });
    }
    
    // Check for banned words in title and content
    const titleHasBannedWords = containsBannedWords(title);
    const contentHasBannedWords = containsBannedWords(content);
    
    if (titleHasBannedWords || contentHasBannedWords) {
      return res.status(400).json({ 
        message: "Nội dung hoặc tiêu đề của bạn chứa từ ngữ không phù hợp. Vui lòng chỉnh sửa lại.",
        hasBannedWords: true
      });
    }
    
    const post = new Post({ title, content, category, tags, accountId, isAnonymous });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sort = "newest",
      type = "all",
      accountId,
    } = req.query;

    const filter = { status: "approved" };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (type === "questions") {
    } else if (type === "expert") {
    } else if (type === "following" && accountId) {
      filter.voteUp = accountId;
    } else if (type === "myPosts" && accountId) {
      filter.$or = [
        { status: "approved", accountId: new mongoose.Types.ObjectId(accountId) },
        { status: "pending", accountId: new mongoose.Types.ObjectId(accountId) },
      ];
      delete filter.status; // Remove the default status filter since we're using $or
    }

    let sortOption = { createdAt: -1 };
    if (sort === "popular") {
      sortOption = { viewCount: -1 };
    }
    // else if (sort === 'votes') {
    //   // We'll handle this after the query since it's a derived field

    // }

    let posts = await Post.find(filter)
      .populate("accountId category")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortOption);
    if (sort === "votes") {
      posts = posts.sort(
        (a, b) =>
          b.voteUp.length -
          b.voteDown.length -
          (a.voteUp.length - a.voteDown.length)
      );
    }

    const postIds = posts.map((post) => post._id);

    const counselorComments = await Comment.aggregate([
      {
        $match: {
          postId: { $in: postIds },
          status: "approved",
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: "$account" },
      { $match: { "account.role": "Counselor" } },
      { $group: { _id: "$postId" } },
    ]);

    const expertPostIds = counselorComments.map((item) => item._id.toString());

    posts = posts.map((post) => {
      const postObj = post.toObject ? post.toObject() : { ...post };
      postObj.hasExpertAnswer = expertPostIds.includes(post._id.toString());
      return postObj;
    });

    if (type === "questions") {
      posts = posts.filter((post) => !post.hasExpertAnswer);
    }

    if (type === "expert") {
      const postIds = await Post.find(filter).distinct("_id");
      const counselorComments = await Comment.aggregate([
        {
          $match: {
            postId: { $in: postIds },
            status: "approved",
          },
        },
        {
          $lookup: {
            from: "accounts",
            localField: "accountId",
            foreignField: "_id",
            as: "account",
          },
        },
        { $unwind: "$account" },
        { $match: { "account.role": "Counselor" } },
        { $group: { _id: "$postId" } },
      ]);

      const expertPostIds = counselorComments.map((item) =>
        item._id.toString()
      );

      posts = await Post.find({
        ...filter,
        _id: { $in: counselorComments.map((item) => item._id) },
      })
        .populate("accountId category")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort(sortOption);
      posts = posts.map((post) => {
        const postObj = post.toObject ? post.toObject() : { ...post };
        postObj.hasExpertAnswer = true;
        return postObj;
      });
    }
    posts = posts.map((post) => {
      const postObj = post.toObject ? post.toObject() : { ...post };

      const voteCount =
        (post.voteUp?.length || 0) - (post.voteDown?.length || 0);

      const displayVoteCount = Math.max(0, voteCount);
      
      // Make sure the post status is included in the response for UI display
      const statusInfo = {
        isPending: post.status === "pending",
        isApproved: post.status === "approved",
        isRejected: post.status === "rejected",
        statusText: post.status === "pending" ? "Đang chờ duyệt" : 
                   post.status === "approved" ? "Đã duyệt" : 
                   post.status === "rejected" ? "Đã từ chối" : "",
      };
      
      return { 
        ...postObj, 
        voteCount, 
        displayVoteCount,
        statusInfo
      };
    });

    const totalPosts = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        total: totalPosts,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("accountId category");
    if (!post)
      return res.status(404).json({ message: "Bài viết không tồn tại" }); // Get only approved comments for this post and populate the account info
    const allComments = await Comment.find({
      postId,
      status: "approved",
    })
      .populate("accountId")
      .sort({ createdAt: 1 });

    const approvedCommentsCount = allComments.length;

    if (post.answerCount !== approvedCommentsCount) {
      post.answerCount = approvedCommentsCount;
      await post.save();
    }

    const rootComments = allComments.filter(
      (comment) => !comment.parentCommentId
    );
    const replies = allComments.filter((comment) => comment.parentCommentId);

    const buildCommentTree = (comment) => {
      const commentObj = comment.toObject();

      const children = replies
        .filter(
          (reply) => reply.parentCommentId.toString() === comment._id.toString()
        )
        .map(buildCommentTree);

      if (children.length > 0) {
        commentObj.children = children;
      }

      commentObj.voteCount = comment.voteUp.length - comment.voteDown.length;
      commentObj.displayVoteCount = Math.max(0, commentObj.voteCount);

      if (comment.accountId && comment.accountId.role === "Counselor") {
        commentObj.isExpertComment = true;
      } else {
        commentObj.isExpertComment = false;
      }

      return commentObj;
    };

    const commentTree = rootComments.map(buildCommentTree);

    const postObj = post.toObject();
    postObj.voteCount = post.voteUp.length - post.voteDown.length;
    postObj.displayVoteCount = Math.max(0, postObj.voteCount);

    const hasExpertAnswer = allComments.some(
      (comment) => comment.accountId && comment.accountId.role === "Counselor"
    );
    postObj.hasExpertAnswer = hasExpertAnswer;

    res.json({
      post: postObj,
      comments: commentTree,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found!" });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found!" }); // Xoá luôn các comment có trong post này
    await Comment.deleteMany({ postId: postId });
    res.json({ message: "Đã xoá bài viết và các comment liên quan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function for editing posts with time and ownership restrictions
exports.editPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content, tags, accountId } = req.body;

    // Find the post first to check permissions
    const post = await Post.findById(postId);
    
    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    
    // Check if the current user is the author of the post
    if (post.accountId.toString() !== accountId) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa bài viết này" });
    }
    
    // Check if post was created less than 15 minutes ago
    const createdAt = new Date(post.createdAt);
    const now = new Date();
    const diffInMinutes = (now - createdAt) / (1000 * 60);
    
    if (diffInMinutes > 15) {
      return res.status(403).json({ 
        message: "Bài viết chỉ có thể được chỉnh sửa trong vòng 15 phút sau khi đăng" 
      });
    }
    
    // Check for banned words in title and content
    const titleHasBannedWords = containsBannedWords(title);
    const contentHasBannedWords = containsBannedWords(content);
    
    if (titleHasBannedWords || contentHasBannedWords) {
      return res.status(400).json({ 
        message: "Nội dung hoặc tiêu đề của bạn chứa từ ngữ không phù hợp. Vui lòng chỉnh sửa lại.",
        hasBannedWords: true
      });
    }
    
    // Update the post with new data and add editedAt timestamp
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      { 
        title, 
        content, 
        
        editedAt: new Date() 
      }, 
      { new: true }
    );
    
    res.json({
      message: "Cập nhật bài viết thành công",
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content, accountId, parentCommentId = null } = req.body;
    if (!content?.trim()) {
      return res
        .status(400)
        .json({
          message:
            "Nội dung bình luận không được để trống hoặc chỉ có khoảng trắng",
        });
    }
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    // Nếu có parentCommentId thì kiểm tra hợp lệ
    if (parentCommentId) {
      const parent = await Comment.findOne({ _id: parentCommentId, postId });
      if (!parent)
        return res
          .status(404)
          .json({ message: "Bình luận cha không tồn tại hoặc không hợp lệ" });
    }

    const hasBannedWords = containsBannedWords(content);
    const status = hasBannedWords ? "pending" : "approved";
    console.log("Comment status:", status, "Has banned words:", hasBannedWords);

    const comment = new Comment({
      postId,
      content,
      accountId,
      parentCommentId,
      status,
    });
    await comment.save();
    console.log("Saved comment with status:", comment.status);
    if (status === "approved") {
      console.log("Comment approved, incrementing answer count");
      const updateData = { $inc: { answerCount: 1 } };

      const account = await mongoose.model("Account").findById(accountId);
      if (account && account.role === "Counselor") {
        updateData.hasExpertAnswer = true;
        console.log("Expert answer detected, updating post");
      }

      await Post.findByIdAndUpdate(postId, updateData);
    }

    const populated = await Comment.findById(comment._id).populate("accountId");
    res.status(201).json({
      message:
        status === "approved"
          ? "Bình luận đã được đăng"
          : "Bình luận đang chờ duyệt",
      comment: populated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.votePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { voteType, accountId } = req.body;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Bài viết không tồn tại" });

    post.voteUp = post.voteUp.filter((id) => id.toString() !== accountId);
    post.voteDown = post.voteDown.filter((id) => id.toString() !== accountId);

    if (voteType === "up") {
      post.voteUp.push(accountId);
    } else if (voteType === "down") {
      post.voteDown.push(accountId);
    } else if (voteType !== null) {
      return res
        .status(400)
        .json({ message: "Loại vote không hợp lệ (chỉ up, down, hoặc null)" });
    }

    await post.save();

    const upvotes = post.voteUp.length;
    const downvotes = post.voteDown.length;
    const rawTotal = upvotes - downvotes;

    const displayTotal = Math.max(0, rawTotal);

    res.json({
      post,
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

exports.incrementView = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!post)
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { accountId, page = 1, limit = 10 } = req.query;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const allComments = await Comment.find({
      postId,
      status: "approved",
    })
      .populate("accountId")
      .sort({ createdAt: 1 });

    const rootComments = allComments.filter(
      (comment) => !comment.parentCommentId
    );
    const replies = allComments.filter((comment) => comment.parentCommentId);

    const buildCommentTree = (comment) => {
      const commentObj = comment.toObject();

      const children = replies
        .filter(
          (reply) => reply.parentCommentId.toString() === comment._id.toString()
        )
        .map(buildCommentTree);

      if (children.length > 0) {
        commentObj.replies = children;
      } else {
        commentObj.replies = [];
      }

      commentObj.voteCount = comment.voteUp.length - comment.voteDown.length;
      commentObj.displayVoteCount = Math.max(0, commentObj.voteCount);

      if (comment.accountId && comment.accountId.role === "Counselor") {
        commentObj.isExpertComment = true;
      } else {
        commentObj.isExpertComment = false;
      }

      if (accountId) {
        if (comment.voteUp.includes(accountId)) {
          commentObj.userVote = "up";
        } else if (comment.voteDown.includes(accountId)) {
          commentObj.userVote = "down";
        } else {
          commentObj.userVote = null;
        }
      }

      return commentObj;
    };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedRootComments = rootComments.slice(startIndex, endIndex);

    const commentTree = paginatedRootComments.map(buildCommentTree);

    res.json({
      comments: commentTree,
      pagination: {
        total: allComments.length,
        totalRootComments: rootComments.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(rootComments.length / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.status !== "approved") {
      comment.status = "approved";
      await comment.save();

      await Post.findByIdAndUpdate(comment.postId, {
        $inc: { answerCount: 1 },
      });

      const account = await mongoose
        .model("Account")
        .findById(comment.accountId);
      if (account && account.role === "Counselor") {
        await Post.findByIdAndUpdate(comment.postId, {
          hasExpertAnswer: true,
        });
      }
    }

    res.json({
      message: "Comment approved successfully",
      comment: await Comment.findById(commentId).populate("accountId"),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
