const mongoose = require('mongoose');

const ehrSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'EHR must belong to a patient']
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'EHR must be created by a doctor']
    },
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment'
    },
    // Main health record components
    chiefComplaint: {
      type: String,
      required: [true, 'Chief complaint is required']
    },
    vitalSigns: {
      temperature: Number, // in Celsius
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      heartRate: Number, // beats per minute
      respiratoryRate: Number, // breaths per minute
      oxygenSaturation: Number, // percentage
      height: Number, // in cm
      weight: Number // in kg
    },
    diagnosis: [{
      code: String, // ICD-10 code
      description: String,
      isPrimary: Boolean
    }],
    treatment: {
      type: String,
      required: [true, 'Treatment plan is required']
    },
    notes: String,
    
    // Medications prescribed
    prescriptions: [{
      medication: {
        name: String,
        dosage: String,
        frequency: String,
        duration: String
      },
      instructions: String,
      dispenseAmount: String,
      refills: Number,
      startDate: Date,
      endDate: Date
    }],
    
    // Lab tests ordered
    labTests: [{
      name: String,
      code: String,
      instructions: String,
      isCompleted: {
        type: Boolean,
        default: false
      },
      results: {
        value: String,
        unit: String,
        normalRange: String,
        isAbnormal: Boolean,
        notes: String,
        documentUrl: String,
        resultDate: Date
      }
    }],
    
    // Imaging studies
    imaging: [{
      type: String, // e.g., X-ray, MRI, CT
      region: String, // body region
      instructions: String,
      isCompleted: {
        type: Boolean,
        default: false
      },
      results: {
        findings: String,
        impression: String,
        documentUrl: String,
        resultDate: Date
      }
    }],
    
    // Follow-up recommendations
    followUp: {
      recommended: Boolean,
      timeframe: String, // e.g., "2 weeks", "3 months"
      notes: String
    },
    
    // Encrypted medical attachments - file paths or URLs
    attachments: [String],
    
    // Audit trail for HIPAA compliance
    accessLogs: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      action: {
        type: String,
        enum: ['view', 'create', 'update', 'delete']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }],
    
    // Encryption fields for sensitive data
    encryptionMetadata: {
      algorithm: String,
      keyId: String,
      version: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient querying
ehrSchema.index({ patient: 1, createdAt: -1 });
ehrSchema.index({ doctor: 1, createdAt: -1 });
ehrSchema.index({ appointment: 1 });

// Populate patient and doctor info on query
ehrSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName dateOfBirth gender'
  }).populate({
    path: 'doctor',
    select: 'firstName lastName specialization'
  });
  
  next();
});

// Log access when EHR is retrieved
ehrSchema.post(/^find/, function(docs) {
  // In a real app with authentication, you would log the current user's access
  // This is a placeholder for the logging functionality
  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  
  docs.forEach(doc => {
    if (doc && doc.accessLogs) {
      // In real implementation, would push to accessLogs array
      console.log(`EHR ${doc._id} accessed at ${new Date()}`);
    }
  });
});

// Create audit log entry
ehrSchema.methods.logAccess = function(userId, action, notes = '') {
  this.accessLogs.push({
    user: userId,
    action,
    timestamp: Date.now(),
    notes
  });
  return this.save({ validateBeforeSave: false });
};

// Calculate BMI as a virtual field
ehrSchema.virtual('bmi').get(function() {
  if (this.vitalSigns && this.vitalSigns.height && this.vitalSigns.weight) {
    // BMI formula: weight(kg) / (height(m))^2
    const heightInMeters = this.vitalSigns.height / 100;
    return (this.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

const EHR = mongoose.model('EHR', ehrSchema);

module.exports = EHR;
