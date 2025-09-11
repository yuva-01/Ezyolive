const User = require('../models/userModel');
const Log = require('../models/logModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res) => {
  try {
    // Add filtering based on role
    let filter = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'user',
      description: 'Retrieved user list',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { filter }
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        users
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'user',
      resourceId: user._id,
      description: 'Retrieved user details',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  // User is already available in req.user from auth middleware
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

exports.updateCurrentUser = async (req, res) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Please use /updateMyPassword'
      });
    }

    // 2) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = filterObj(req.body, 
      'firstName', 'lastName', 'phoneNumber', 'address', 
      'gender', 'profilePicture', 'emergencyContact'
    );

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    // 4) Log update
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'user',
      resourceId: req.user._id,
      description: 'User updated their profile',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Admins can update any field except passwords
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates'
      });
    }
    
    // Determine fields that can be updated based on the role
    let allowedFields = [
      'firstName', 'lastName', 'phoneNumber', 
      'address', 'gender', 'profilePicture', 'active'
    ];
    
    // Admins can update roles
    if (req.user.role === 'admin') {
      allowedFields.push('role');
    }
    
    // If updating a doctor, allow doctor-specific fields
    if (req.body.role === 'doctor' || (await User.findById(req.params.id))?.role === 'doctor') {
      allowedFields = [...allowedFields, 'specialization', 'licenseNumber', 'yearsOfExperience'];
    }
    
    const filteredBody = filterObj(req.body, ...allowedFields);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    // Log update
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'user',
      resourceId: updatedUser._id,
      description: `User profile updated by ${req.user.role}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { updatedFields: Object.keys(filteredBody) }
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }

    // Log deletion
    await Log.createLog({
      user: req.user._id,
      action: 'delete',
      resourceType: 'user',
      resourceId: req.params.id,
      description: `User deactivated by ${req.user.role}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Add filtering by specialization
    let filter = { role: 'doctor' };
    if (req.query.specialization) {
      filter.specialization = req.query.specialization;
    }

    const doctors = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ lastName: 1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: doctors.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        doctors
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
