const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must belong to a patient']
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must be assigned to a doctor']
    },
    startTime: {
      type: Date,
      required: [true, 'Appointment must have a start time']
    },
    endTime: {
      type: Date,
      required: [true, 'Appointment must have an end time']
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    type: {
      type: String,
      enum: ['in-person', 'telehealth'],
      required: [true, 'Appointment type is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required']
    },
    notes: {
      type: String
    },
    followUp: {
      type: Boolean,
      default: false
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    telehealthLink: {
      type: String
    },
    cancellationReason: {
      type: String
    },
    lastModifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for efficient appointment lookup
appointmentSchema.index({ patient: 1, startTime: 1 });
appointmentSchema.index({ doctor: 1, startTime: 1 });

// Virtual populate for related medical records
appointmentSchema.virtual('medicalRecords', {
  ref: 'EHR',
  foreignField: 'appointment',
  localField: '_id'
});

// Virtual populate for related billing
appointmentSchema.virtual('billing', {
  ref: 'Billing',
  foreignField: 'appointment',
  localField: '_id'
});

// Middleware to populate patient and doctor info
appointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName email phoneNumber'
  }).populate({
    path: 'doctor',
    select: 'firstName lastName specialization'
  });
  
  next();
});

// Method to check if there are conflicts with other appointments
appointmentSchema.statics.checkConflicts = async function(doctorId, startTime, endTime, excludeId = null) {
  const conflictQuery = {
    doctor: doctorId,
    status: { $nin: ['cancelled', 'no-show'] },
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  };
  
  // Exclude current appointment if updating
  if (excludeId) {
    conflictQuery._id = { $ne: excludeId };
  }
  
  const conflictingAppointments = await this.find(conflictQuery);
  return conflictingAppointments.length > 0;
};

// Method to generate telehealth link
appointmentSchema.methods.generateTelehealthLink = function() {
  if (this.type === 'telehealth' && !this.telehealthLink) {
    // Generate a unique room ID using appointment ID and timestamp
    const roomId = `ezyolive-${this._id}-${Date.now()}`;
    // In a real app, this would integrate with a video service API
    // For now, we'll create a placeholder link
    this.telehealthLink = `https://telehealth.ezyolive.com/room/${roomId}`;
  }
  return this.telehealthLink;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
