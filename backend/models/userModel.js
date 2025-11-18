  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  const validator = require('validator');
  const crypto = require('crypto');

  const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
      },
      confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords do not match!'
        }
      },
      role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      dateOfBirth: Date,
      profilePicture: String,
      gender: {
        type: String,
        enum: ['male', 'female', 'other']
      },
      specialization: {
        type: String,
        trim: true,
        maxlength: 120
      },
      licenseNumber: {
        type: String,
        trim: true,
        maxlength: 80
      },
      yearsOfExperience: {
        type: Number,
        min: 0,
        default: undefined
      },
      medicalHistory: {
        allergies: [String],
        chronicConditions: [String],
        surgeries: [String],
        currentMedications: [String]
        // Only applicable for patients
      },
      emergencyContact: {
        name: String,
        relationship: String,
        // Only applicable for patients
      },
      active: {
        type: Boolean,
        default: true,
        select: false
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  // Virtual property to get full name
  userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
  });

  // Middleware to hash the password before saving
  userSchema.pre('save', async function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();
    
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
  });

  // Update passwordChangedAt property when password changes
  userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000; // Small offset for token creation
    next();
  });

  // Only return active users when querying
  userSchema.pre(/^find/, function(next) {
    // 'this' refers to the current query
    this.find({ active: { $ne: false } });
    next();
  });

  // Method to check if password is correct
  userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  // Method to check if user changed password after token was issued
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };

  // Method to create password reset token
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
  };

  const User = mongoose.model('User', userSchema);

  module.exports = User;
