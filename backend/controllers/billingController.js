const Billing = require('../models/billingModel');
const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const Log = require('../models/logModel');

exports.getAllBillings = async (req, res) => {
  try {
    let filter = {};

    // Filter billings based on user role
    if (req.user.role === 'patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user.id;
    }

    // Add additional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.patientId && req.user.role !== 'patient') {
      filter.patient = req.query.patientId;
    }

    if (req.query.doctorId && req.user.role === 'admin') {
      filter.doctor = req.query.doctorId;
    }

    // Filter by date range
    if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      if (!filter.date) filter.date = {};
      filter.date.$lte = new Date(req.query.endDate);
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const billings = await Billing.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const total = await Billing.countDocuments(filter);

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'billing',
      description: 'Retrieved billing list',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { filter }
    });

    res.status(200).json({
      status: 'success',
      results: billings.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        billings
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getBilling = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return res.status(404).json({
        status: 'fail',
        message: 'No billing found with that ID'
      });
    }

    // Authorization check already handled by checkOwnership middleware

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'billing',
      resourceId: billing._id,
      description: 'Viewed billing details',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        billing
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createBilling = async (req, res) => {
  try {
    // Only doctors or admins can create billings
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors or admins can create billings'
      });
    }

    // If doctor, automatically set doctor ID to current user
    if (req.user.role === 'doctor') {
      req.body.doctor = req.user.id;
    }

    // Check if patient exists
    const patient = await User.findById(req.body.patient);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        status: 'fail',
        message: 'No patient found with that ID'
      });
    }

    // Check if doctor exists
    const doctor = await User.findById(req.body.doctor);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        status: 'fail',
        message: 'No doctor found with that ID'
      });
    }

    // Set created by
    req.body.createdBy = req.user.id;
    req.body.lastModifiedBy = req.user.id;

    // If associated with appointment, check if it exists
    if (req.body.appointment) {
      const appointment = await Appointment.findById(req.body.appointment);
      if (!appointment) {
        return res.status(404).json({
          status: 'fail',
          message: 'No appointment found with that ID'
        });
      }

      // Verify that appointment belongs to the specified patient and doctor
      if (appointment.patient.id !== req.body.patient || 
          appointment.doctor.id !== req.body.doctor) {
        return res.status(400).json({
          status: 'fail',
          message: 'The appointment does not match the specified patient and doctor'
        });
      }
    }

    // Calculate totals if not provided
    if (!req.body.subtotal || !req.body.total || !req.body.balance) {
      let subtotal = 0;
      
      // Calculate subtotal from items
      if (req.body.items && req.body.items.length > 0) {
        subtotal = req.body.items.reduce((sum, item) => sum + item.total, 0);
      }
      
      req.body.subtotal = subtotal;
      
      // Calculate total
      const tax = req.body.tax || 0;
      const discount = req.body.discount || 0;
      const total = subtotal + tax - discount;
      req.body.total = total;
      
      // Calculate balance
      const amountPaid = req.body.amountPaid || 0;
      req.body.balance = total - amountPaid;
    }

    // Set due date if not provided (default to 30 days)
    if (!req.body.dueDate) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      req.body.dueDate = dueDate;
    }

    const newBilling = await Billing.create(req.body);

    // Log billing creation
    await Log.createLog({
      user: req.user._id,
      action: 'create',
      resourceType: 'billing',
      resourceId: newBilling._id,
      description: 'Created new billing',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // If associated with an appointment, update its payment status
    if (newBilling.appointment) {
      await Appointment.findByIdAndUpdate(
        newBilling.appointment,
        { paymentStatus: 'pending' }
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        billing: newBilling
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateBilling = async (req, res) => {
  try {
    // Only doctors or admins can update billings
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors or admins can update billings'
      });
    }

    // Prevent changing patient, doctor or appointment
    if (req.body.patient || req.body.doctor || req.body.appointment) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot change the patient, doctor or appointment for an existing billing'
      });
    }

    // Update last modified by
    req.body.lastModifiedBy = req.user.id;

    // If items are updated, recalculate totals
    if (req.body.items || req.body.tax || req.body.discount || req.body.amountPaid) {
      const billing = await Billing.findById(req.params.id);
      if (!billing) {
        return res.status(404).json({
          status: 'fail',
          message: 'No billing found with that ID'
        });
      }

      // Calculate new values
      const items = req.body.items || billing.items;
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = req.body.tax !== undefined ? req.body.tax : billing.tax;
      const discount = req.body.discount !== undefined ? req.body.discount : billing.discount;
      const total = subtotal + tax - discount;
      const amountPaid = req.body.amountPaid !== undefined ? req.body.amountPaid : billing.amountPaid;
      const balance = total - amountPaid;

      // Update the request body with new calculations
      req.body.subtotal = subtotal;
      req.body.total = total;
      req.body.balance = balance;

      // Update status based on balance
      if (balance <= 0) {
        req.body.status = 'paid';
      } else if (billing.dueDate < new Date() && billing.status === 'pending') {
        req.body.status = 'overdue';
      }
    }

    const updatedBilling = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBilling) {
      return res.status(404).json({
        status: 'fail',
        message: 'No billing found with that ID'
      });
    }

    // Log update
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'billing',
      resourceId: updatedBilling._id,
      description: 'Updated billing',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { updatedFields: Object.keys(req.body) }
    });

    // If status changed to paid, update the appointment status
    if (updatedBilling.status === 'paid' && updatedBilling.appointment) {
      await Appointment.findByIdAndUpdate(
        updatedBilling.appointment,
        { paymentStatus: 'paid' }
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        billing: updatedBilling
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteBilling = async (req, res) => {
  try {
    // Only admins can delete billings
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only admins can delete billings'
      });
    }

    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({
        status: 'fail',
        message: 'No billing found with that ID'
      });
    }

    // Instead of deleting, set status to cancelled
    billing.status = 'cancelled';
    billing.lastModifiedBy = req.user.id;
    await billing.save();

    // Log deletion/cancellation
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'billing',
      resourceId: billing._id,
      description: 'Cancelled billing',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        billing
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({
        status: 'fail',
        message: 'No billing found with that ID'
      });
    }

    // Check if billing is already paid
    if (billing.status === 'paid') {
      return res.status(400).json({
        status: 'fail',
        message: 'This invoice has already been paid'
      });
    }

    // Get payment details from request
    const { amount, paymentMethod, transactionId, cardLast4 } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment amount and method are required'
      });
    }

    // In a real app, this would integrate with a payment gateway
    // For now, we'll simulate a payment process
    const paymentDetails = {
      transactionId: transactionId || `txn_${Date.now()}`,
      cardLast4: cardLast4 || 'N/A',
      paymentDate: new Date(),
      paymentGateway: 'Stripe Sandbox', // example
      receiptUrl: `https://receipts.ezyolive.com/${Date.now()}` // placeholder
    };

    // Process the payment
    await billing.processPayment(amount, paymentMethod, paymentDetails);

    // Log payment
    await Log.createLog({
      user: req.user._id,
      action: 'payment',
      resourceType: 'billing',
      resourceId: billing._id,
      description: 'Processed payment for billing',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        amount,
        paymentMethod,
        transactionId: paymentDetails.transactionId
      }
    });

    // Update appointment payment status if applicable
    if (billing.appointment && billing.status === 'paid') {
      await Appointment.findByIdAndUpdate(
        billing.appointment,
        { paymentStatus: 'paid' }
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        billing
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.generateInvoicePDF = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({
        status: 'fail',
        message: 'No billing found with that ID'
      });
    }

    // In a real app, this would generate a PDF
    // For now, return a success message with placeholder
    const pdfFilename = billing.generatePDF();

    // Log PDF generation
    await Log.createLog({
      user: req.user._id,
      action: 'export',
      resourceType: 'billing',
      resourceId: billing._id,
      description: 'Generated invoice PDF',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      message: 'Invoice PDF generated successfully',
      data: {
        pdfUrl: `/api/billing/invoices/${pdfFilename}`, // Placeholder URL
        filename: pdfFilename
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.detectBillingAnomalies = async (req, res) => {
  try {
    // This would be a more complex AI function in a real app
    // For now, let's implement a simple anomaly detection

    // Get recent billings for analysis
    const recentBillings = await Billing.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }).sort({ createdAt: -1 });

    // Simple anomaly detection examples:
    const anomalies = [];

    // 1. Check for duplicate billings (same patient, doctor, date with similar amounts)
    const billingMap = {};

    recentBillings.forEach(billing => {
      const key = `${billing.patient}-${billing.doctor}-${billing.date.toDateString()}`;
      if (!billingMap[key]) {
        billingMap[key] = [billing];
      } else {
        // Check if the amount is similar (within 5%)
        const existingBilling = billingMap[key][0];
        const amountDiff = Math.abs(existingBilling.total - billing.total) / existingBilling.total;
        
        if (amountDiff < 0.05) {
          anomalies.push({
            type: 'duplicate_billing',
            severity: 'high',
            details: {
              billing1: {
                id: existingBilling._id,
                invoiceNumber: existingBilling.invoiceNumber,
                total: existingBilling.total,
                date: existingBilling.date
              },
              billing2: {
                id: billing._id,
                invoiceNumber: billing.invoiceNumber,
                total: billing.total,
                date: billing.date
              }
            }
          });
        }
        billingMap[key].push(billing);
      }
    });

    // 2. Check for unusually high amounts
    // Calculate average and standard deviation
    if (recentBillings.length > 5) {
      const amounts = recentBillings.map(b => b.total);
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / amounts.length;
      const stdDev = Math.sqrt(variance);

      // Flag billings that are more than 2 standard deviations above average
      const threshold = avg + 2 * stdDev;
      
      recentBillings.forEach(billing => {
        if (billing.total > threshold) {
          anomalies.push({
            type: 'unusually_high_amount',
            severity: 'medium',
            details: {
              id: billing._id,
              invoiceNumber: billing.invoiceNumber,
              total: billing.total,
              date: billing.date,
              avgAmount: avg.toFixed(2),
              threshold: threshold.toFixed(2)
            }
          });
        }
      });
    }

    // 3. Check for missing items (billings with zero items)
    recentBillings.forEach(billing => {
      if (!billing.items || billing.items.length === 0) {
        anomalies.push({
          type: 'missing_items',
          severity: 'medium',
          details: {
            id: billing._id,
            invoiceNumber: billing.invoiceNumber,
            date: billing.date
          }
        });
      }
    });

    // Log the anomaly detection
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'billing',
      description: 'Ran billing anomaly detection',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        anomaliesFound: anomalies.length
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        anomalies,
        count: anomalies.length
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
