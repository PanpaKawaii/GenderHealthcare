const jwt = require('jsonwebtoken');
const Account = require('../models/account.model');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided or invalid format');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token from Bearer prefix
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token.substring(0, 15) + '...');
    
    try {
      // Verify token
      console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
      console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token successful:', decoded);
      
      // Find user by id from token
      const user = await Account.findById(decoded._id).select('-password');
      console.log('User found by ID:', !!user, decoded._id);
      
      if (!user) {
        console.log('User not found for ID:', decoded._id);
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        console.log('User account is inactive:', decoded._id);
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated.'
        });
      }

      // Add user to request object
      req.user = user;
      console.log('User authenticated successfully:', user._id);
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.name, jwtError.message);
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      } else if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired.'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Optional: Role-based authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not authorized for this resource.'
      });
    }
    
    next();
  };
};
