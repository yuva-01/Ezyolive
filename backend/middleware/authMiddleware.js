const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const Log = require('../models/logModel');

// Middleware to check if the user is authenticated
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password. Please log in again.'
      });
    }

    // 5) Log the authentication check
    await Log.createLog({
      user: currentUser._id,
      action: 'read',
      resourceType: 'system',
      description: 'User accessed protected route',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Authentication failed. Please log in again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Middleware to restrict access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'doctor']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or has admin/doctor privileges
exports.checkOwnership = (Model, paramIdField = 'id') => {
  return async (req, res, next) => {
    try {
      // Skip for admins, they can access everything
      if (req.user.role === 'admin') return next();
      
      const resourceId = req.params[paramIdField];
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          status: 'fail',
          message: 'No document found with that ID'
        });
      }

      // Check if the user owns the resource
      // For patients, they can only access their own resources
      if (req.user.role === 'patient') {
        const isOwner = resource.patient && 
          resource.patient.toString() === req.user.id;
          
        if (!isOwner) {
          return res.status(403).json({
            status: 'fail',
            message: 'You do not have permission to access this resource'
          });
        }
      } 
      // For doctors, they can access resources of their patients
      else if (req.user.role === 'doctor') {
        const isAssignedDoctor = resource.doctor && 
          resource.doctor.toString() === req.user.id;
          
        if (!isAssignedDoctor) {
          return res.status(403).json({
            status: 'fail',
            message: 'You are not authorized to access this patient\'s information'
          });
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
