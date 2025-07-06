const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Account = require('../models/account.model');
const mongoose = require('mongoose');

// Get community stats
exports.getCommunityStats = async (req, res) => {
  try {
    // Count unique users who have posted or commented
    const uniqueActiveUsers = await Account.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'accountId',
          as: 'userPosts'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'accountId',
          as: 'userComments'
        }
      },
      {
        $match: {
          $or: [
            { 'userPosts.0': { $exists: true } },
            { 'userComments.0': { $exists: true } }
          ]
        }
      },
      {
        $count: 'activeMembers'
      }
    ]);

    // Count approved posts
    const discussions = await Post.countDocuments({ status: 'approved' });

    // Count comments from counselors or staff (expert answers)
    const expertAccounts = await Account.find({ 
      role: { $in: ['Counselor', 'Doctor'] } 
    }).select('_id');
    
    const expertAccountIds = expertAccounts.map(account => account._id);
    
    const expertAnswers = await Comment.countDocuments({ 
      accountId: { $in: expertAccountIds },
      status: 'approved'
    });

    // Get total count of all tag usages
    const totalTagsCount = await Post.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$tags' },
      { $count: 'total' }
    ]);
    
    const totalTags = totalTagsCount.length > 0 ? totalTagsCount[0].total : 0;
    
    // Get trending topics based on tags
    const trendingTopics = await Post.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$tags' },
      { $group: { 
        _id: '$tags', 
        posts: { $sum: 1 } 
      }},
      { $sort: { posts: -1 } },
      { $limit: 5 },
      { $project: { 
        name: '$_id', 
        posts: 1,
        trend: { 
          $concat: [
            '+', 
            { 
              $toString: { 
                $round: [
                  { 
                    $multiply: [
                      { $divide: ['$posts', totalTags] }, 
                      100
                    ] 
                  }, 
                  1
                ] 
              } 
            }, 
            '%'
          ]
        }
      }}
    ]);

    res.json({
      activeMembers: uniqueActiveUsers.length > 0 ? uniqueActiveUsers[0].activeMembers : 0,
      discussions,
      expertAnswers,
      trendingTopics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
