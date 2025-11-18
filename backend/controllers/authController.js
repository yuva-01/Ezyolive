const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Log = require('../models/logModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    // Only allow specific fields to be set during signup for security
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
      dateOfBirth,
      gender,
      address,
      specialization,
      licenseNumber,
      yearsOfExperience
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields'
      });
    }

    const allowedRoles = ['patient', 'doctor'];
    const userRole = allowedRoles.includes(role) ? role : 'patient';

    if (userRole === 'doctor') {
      if (!specialization || !licenseNumber) {
        return res.status(400).json({
          status: 'fail',
          message: 'Doctors must provide specialization and license number'
        });
      }
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role: userRole,
      dateOfBirth,
      gender,
      address,
      specialization: userRole === 'doctor' ? specialization : undefined,
      licenseNumber: userRole === 'doctor' ? licenseNumber : undefined,
      yearsOfExperience: userRole === 'doctor' ? yearsOfExperience : undefined
    });

    // Log user creation
    await Log.createLog({
      user: newUser._id,
      action: 'create',
      resourceType: 'user',
      resourceId: newUser._id,
      description: 'New user registered',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
  const { email, password, role } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      // Log failed login attempt
      if (user) {
        await Log.logLogin(
          user,
          req.ip,
          req.headers['user-agent'],
          false,
          { reason: 'Invalid password' }
        );
      }

      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // 3) Ensure requested role matches account role if provided
    if (role && role !== user.role) {
      return res.status(403).json({
        status: 'fail',
        message: `This account is registered as a ${user.role}. Please log in using the correct portal.`
      });
    }

    // 4) Log successful login
    await Log.logLogin(
      user,
      req.ip,
      req.headers['user-agent'],
      true
    );

    // 5) If everything ok, send token to client
    createSendToken(user, 200, req, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.logout = (req, res) => {
  // In a JWT setup, client-side should remove the token
  // Here we just send a success response
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your current password is incorrect'
      });
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // 4) Log password change
    await Log.createLog({
      user: user._id,
      action: 'password_change',
      resourceType: 'user',
      resourceId: user._id,
      description: 'User changed password',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // 5) Log user in, send JWT
    createSendToken(user, 200, req, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with this email address'
      });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/resetPassword/${resetToken}`;

    // In a real app, send email with reset URL
    // For this implementation, just return the URL in the response
    console.log(`Reset URL: ${resetURL}`);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
      resetURL // Remove this in production
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email. Try again later!'
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Log the password reset
    await Log.createLog({
      user: user._id,
      action: 'password_reset',
      resourceType: 'user',
      resourceId: user._id,
      description: 'User reset password',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
