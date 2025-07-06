const Account = require('../models/account.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

// Get all users with pagination, search, and filters
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role, status } = req.query;
    const skip = (page - 1) * limit;
    
    // Build the query
    const query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }
    
    // Filter by status
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    // Get users with pagination
    const users = await Account.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count
    const total = await Account.countDocuments(query);
    
    res.json({
      users,
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

// Get user by ID with additional activity info
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user data
    const user = await Account.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get count of user posts
    const postsCount = await Post.countDocuments({ accountId: userId });
    
    // Get count of user comments
    const commentsCount = await Comment.countDocuments({ accountId: userId });
    
    // Return user with counts
    res.json({
      ...user.toJSON(),
      postsCount,
      commentsCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user (admin function)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;
    
    // Check if email already exists
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create new user
    const newUser = new Account({
      name,
      email,
      password, // Should be hashed in the model's pre-save hook
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true
    });
    
    await newUser.save();
    
    // Return user without password
    const user = newUser.toJSON();
    delete user.password;
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user (admin function)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, isActive } = req.body;
    
    // Don't allow password changes here - use specific endpoint for that
    const updates = {
      name,
      email,
      role,
      isActive
    };
    
    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    
    // Update the user
    const updatedUser = await Account.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (admin function)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete user
    const deletedUser = await Account.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Optionally: Delete or anonymize user's posts and comments
    // await Post.updateMany({ accountId: userId }, { accountId: null, isAnonymous: true });
    // await Comment.updateMany({ accountId: userId }, { accountId: null, isAnonymous: true });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change user role
exports.changeUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    if (!['user', 'counselor', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const updatedUser = await Account.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activate user
exports.activateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const updatedUser = await Account.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const updatedUser = await Account.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await Account.countDocuments();
    const usersByRole = await Account.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const activeUsers = await Account.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;
    
    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = await Account.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Calculate growth rate
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const prevPeriodRegistrations = await Account.countDocuments({
      createdAt: { 
        $gte: sixtyDaysAgo,
        $lt: thirtyDaysAgo
      }
    });
    
    const growthRate = prevPeriodRegistrations > 0 
      ? ((recentRegistrations - prevPeriodRegistrations) / prevPeriodRegistrations) * 100
      : 100; // If prev period had 0, then growth is 100%
    
    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr._id || 'unknown'] = curr.count;
        return acc;
      }, {}),
      recentRegistrations,
      growthRate: parseFloat(growthRate.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
