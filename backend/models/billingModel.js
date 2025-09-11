const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Billing must belong to a patient']
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Billing must be associated with a doctor']
    },
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment'
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: [true, 'Invoice number is required']
    },
    date: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded'],
      default: 'draft'
    },
    items: [
      {
        service: {
          type: String,
          required: [true, 'Service name is required']
        },
        description: String,
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: 1
        },
        unitPrice: {
          type: Number,
          required: [true, 'Unit price is required'],
          min: 0
        },
        discount: {
          type: Number,
          default: 0,
          min: 0
        },
        tax: {
          type: Number,
          default: 0,
          min: 0
        },
        total: {
          type: Number,
          required: [true, 'Item total is required']
        }
      }
    ],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Total amount is required']
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required']
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'cash', 'insurance', 'bank_transfer', 'other'],
    },
    paymentDetails: {
      transactionId: String,
      cardLast4: String,
      paymentDate: Date,
      paymentGateway: String,
      receiptUrl: String
    },
    insurance: {
      provider: String,
      policyNumber: String,
      claimNumber: String,
      coverage: Number,
      status: {
        type: String,
        enum: ['pending', 'approved', 'denied', 'partial']
      },
      submissionDate: Date,
      responseDate: Date
    },
    notes: String,
    // For audit and compliance
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
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

// Indexes for efficient querying
billingSchema.index({ patient: 1, date: -1 });
billingSchema.index({ invoiceNumber: 1 });
billingSchema.index({ status: 1, dueDate: 1 });

// Populate patient and doctor info on query
billingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName email address'
  }).populate({
    path: 'doctor',
    select: 'firstName lastName specialization'
  }).populate({
    path: 'appointment',
    select: 'startTime type reason'
  });
  
  next();
});

// Generate invoice number
billingSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Get current year and month
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last invoice with the same prefix
    const prefix = `INV-${year}${month}-`;
    
    // Get last invoice with this prefix
    const lastInvoice = await this.constructor.findOne({
      invoiceNumber: new RegExp(`^${prefix}`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      // Extract sequence number and increment
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10);
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }
    
    // Set the new invoice number
    this.invoiceNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Calculate balance before saving
billingSchema.pre('save', function(next) {
  // Calculate balance
  this.balance = this.total - this.amountPaid;
  
  // Set status based on balance and due date
  if (this.balance <= 0) {
    this.status = 'paid';
  } else if (this.dueDate < new Date() && this.status === 'pending') {
    this.status = 'overdue';
  }
  
  next();
});

// Method to generate a PDF invoice (placeholder)
billingSchema.methods.generatePDF = function() {
  // In a real implementation, this would use a PDF generation library
  return `Invoice_${this.invoiceNumber}.pdf`;
};

// Method to process a payment
billingSchema.methods.processPayment = async function(amount, paymentMethod, details) {
  // Update payment information
  this.amountPaid += amount;
  this.balance = this.total - this.amountPaid;
  this.paymentMethod = paymentMethod;
  
  // Update payment details
  this.paymentDetails = {
    ...this.paymentDetails,
    ...details,
    paymentDate: new Date()
  };
  
  // Update status
  if (this.balance <= 0) {
    this.status = 'paid';
  } else if (this.status === 'overdue') {
    this.status = 'pending';
  }
  
  return this.save();
};

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
