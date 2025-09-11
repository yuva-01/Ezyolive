const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: [
        'login', 
        'logout', 
        'create', 
        'read', 
        'update', 
        'delete', 
        'export',
        'import',
        'print',
        'payment',
        'password_change',
        'password_reset',
        'telehealth_join',
        'telehealth_leave',
        'failed_login'
      ]
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: [
        'user',
        'appointment',
        'ehr',
        'prescription',
        'billing',
        'payment',
        'telehealth',
        'system'
      ]
    },
    resourceId: {
      type: mongoose.Schema.ObjectId,
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    successful: {
      type: Boolean,
      default: true
    },
    details: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

// Create indexes for efficient querying
logSchema.index({ user: 1, timestamp: -1 });
logSchema.index({ resourceType: 1, resourceId: 1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ timestamp: -1 });

// Populate user info on query
logSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email role'
  });
  next();
});

// Static method to create a log entry
logSchema.statics.createLog = async function(logData) {
  return this.create(logData);
};

// Helper methods for common log scenarios
logSchema.statics.logLogin = function(user, ipAddress, userAgent, successful, details = {}) {
  return this.createLog({
    user: user._id,
    action: successful ? 'login' : 'failed_login',
    resourceType: 'user',
    resourceId: user._id,
    description: successful ? 'User logged in successfully' : 'Failed login attempt',
    ipAddress,
    userAgent,
    successful,
    details
  });
};

logSchema.statics.logAccess = function(user, resourceType, resourceId, description, details = {}) {
  return this.createLog({
    user: user._id,
    action: 'read',
    resourceType,
    resourceId,
    description,
    successful: true,
    details
  });
};

logSchema.statics.logUpdate = function(user, resourceType, resourceId, description, details = {}) {
  return this.createLog({
    user: user._id,
    action: 'update',
    resourceType,
    resourceId,
    description,
    successful: true,
    details
  });
};

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
