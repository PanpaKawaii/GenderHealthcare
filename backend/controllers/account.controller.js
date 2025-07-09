const Account = require('../models/account.model');
const Post = require('../models/post.model');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Token expires in 1 day
  );
};

exports.create = async (req, res) => {
  try {
    // Không cho phép client can thiệp isVerified
    delete req.body.isVerified;
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.register = async (req, res) => {
  try {
    // Không cho phép client can thiệp isVerified
    delete req.body.isVerified;
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Check if email already exists
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }
    
    // Create and save new account - password will be hashed by the pre-save middleware
    const account = new Account(req.body);
    await account.save();
    
    // Generate token
    const token = generateToken(account);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        image: account.image,
        gender: account.gender
      }
    });
  } catch (e) {
    res.status(400).json({ 
      success: false,
      message: e.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const account = await Account.findOne({ email });
    
    // Check if account exists
    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if account is active
    if (account.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await account.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login time
    account.lastLogin = new Date();
    await account.save();

    // Generate JWT token
    const token = generateToken(account);

    // Return user info and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        image: account.image,
        gender: account.gender
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getAll = async (req, res) => res.json(await Account.find());

exports.getOne = async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) return res.sendStatus(404);
  res.json(account);
};

exports.update = async (req, res) => {
  const acc = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!acc) return res.sendStatus(404);
  res.json(acc);
};

exports.remove = async (req, res) => {
  const acc = await Account.findByIdAndDelete(req.params.id);
  res.json({ deleted: !!acc });
};

// Get current logged in user
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user comes from auth middleware
    const account = await Account.findById(req.user._id).select('-password');
    if (!account) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: account
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving user data',
      error: error.message 
    });
  }
};

//for email
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await Account.find({ email: email });

    if (user.length >= 2) {
      return res.status(200).json({
        success: true,
        existsNormal: true,
        existsGoogle: true,
        allowRegister: false,
      });
    } else if (user.length == 1) {
      if (user[0].password) {
        return res.status(200).json({
          success: true,
          existsNormal: true,
          existsGoogle: false,
          allowRegister: false,
        });
      } else {
        return res.status(200).json({
          success: true,
          existsNormal: false,
          existsGoogle: true,
          allowRegister: true,
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        existsNormal: false,
        existsGoogle: false,
        allowRegister: true,
      });
    }

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// This will be deprecated in favor of the new login method
exports.authentication = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(200).json({
        success: true,
        allowLogin: false,
        message: 'Invalid email or password'
      });
    } 

    // Verify password
    const isPasswordValid = await account.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(200).json({
        success: true,
        allowLogin: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (account.isActive === false) {
      return res.status(200).json({
        success: true,
        allowLogin: false,
        message: 'Your account has been deactivated'
      });
    }

    // Update last login time
    account.lastLogin = new Date();
    await account.save();

    // Generate JWT token
    const token = generateToken(account);
    
    return res.status(200).json({
      success: true,
      allowLogin: true,
      token: token,
      userInfo: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        image: account.image
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getAccountPosts = async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const posts = await Post.find({ account: accountId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User activation and deactivation
exports.activateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Account.findByIdAndUpdate(
      accountId, 
      { isActive: true },
      { new: true }
    );
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Failed to activate account', error: error.message });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = await Account.findByIdAndUpdate(
      accountId, 
      { isActive: false },
      { new: true }
    );
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({ message: 'Failed to deactivate account', error: error.message });
  }
};