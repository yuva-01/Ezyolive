const EHR = require('../models/ehrModel');
const User = require('../models/userModel');
const Log = require('../models/logModel');

exports.getAllEHRs = async (req, res) => {
  try {
    let filter = {};

    // Filter EHRs based on user role
    if (req.user.role === 'patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user.id;
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Additional filters
    if (req.query.patientId) {
      // Only doctors or admins can filter by patient
      if (req.user.role === 'patient' && req.query.patientId !== req.user.id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You are not authorized to access other patients\' records'
        });
      }
      filter.patient = req.query.patientId;
    }

    // Filter by date range
    if (req.query.startDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      if (!filter.createdAt) filter.createdAt = {};
      filter.createdAt.$lte = new Date(req.query.endDate);
    }

    // Execute query with selected fields based on role
    let query = EHR.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    // Execute query
    const ehrs = await query;
    const total = await EHR.countDocuments(filter);

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'ehr',
      description: 'Retrieved EHR list',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { filter }
    });

    res.status(200).json({
      status: 'success',
      results: ehrs.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        ehrs
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getPatientEHRs = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        status: 'fail',
        message: 'No patient found with that ID'
      });
    }

    // Security check - doctors can only access their patients' records
    if (req.user.role === 'doctor') {
      // Check if this doctor has ever created a record for this patient
      const hasAccess = await EHR.findOne({
        doctor: req.user.id,
        patient: patientId
      });

      if (!hasAccess) {
        return res.status(403).json({
          status: 'fail',
          message: 'You are not authorized to access this patient\'s records'
        });
      }
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Find all EHRs for this patient
    const ehrs = await EHR.find({ patient: patientId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EHR.countDocuments({ patient: patientId });

    // Log access to patient's EHRs
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'ehr',
      description: `Accessed patient ${patientId}'s EHR history`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      results: ehrs.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        ehrs
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getEHR = async (req, res) => {
  try {
    const ehr = await EHR.findById(req.params.id);

    if (!ehr) {
      return res.status(404).json({
        status: 'fail',
        message: 'No EHR found with that ID'
      });
    }

    // Authorization check already handled by checkOwnership middleware

    // Log this EHR access in its own access logs
    await ehr.logAccess(req.user._id, 'view');

    // Also create a system-wide log entry
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'ehr',
      resourceId: ehr._id,
      description: 'Viewed EHR details',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        ehr
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createEHR = async (req, res) => {
  try {
    // Only doctors can create EHRs
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors can create medical records'
      });
    }

    // Set doctor to current user
    req.body.doctor = req.user.id;

    // Check if patient exists
    const patient = await User.findById(req.body.patient);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        status: 'fail',
        message: 'No patient found with that ID'
      });
    }

    // Create the EHR
    const newEHR = await EHR.create(req.body);

    // Log EHR creation
    await Log.createLog({
      user: req.user._id,
      action: 'create',
      resourceType: 'ehr',
      resourceId: newEHR._id,
      description: 'Created new medical record',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Add initial access log entry
    await newEHR.logAccess(req.user._id, 'create', 'Initial creation of medical record');

    res.status(201).json({
      status: 'success',
      data: {
        ehr: newEHR
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateEHR = async (req, res) => {
  try {
    // Only doctors can update EHRs
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors can update medical records'
      });
    }

    // Check if EHR exists and the doctor has permission
    const ehr = await EHR.findById(req.params.id);
    if (!ehr) {
      return res.status(404).json({
        status: 'fail',
        message: 'No EHR found with that ID'
      });
    }

    // Check if the doctor is the creator of this record
    if (ehr.doctor.id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this medical record'
      });
    }

    // Prevent changing patient or doctor
    if (req.body.patient || (req.body.doctor && req.body.doctor !== req.user.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot change the patient or doctor for an existing medical record'
      });
    }

    // Update the EHR
    const updatedEHR = await EHR.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Log update
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'ehr',
      resourceId: updatedEHR._id,
      description: 'Updated medical record',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { updatedFields: Object.keys(req.body) }
    });

    // Add access log entry to the EHR
    await updatedEHR.logAccess(req.user._id, 'update', 'Updated medical record details');

    res.status(200).json({
      status: 'success',
      data: {
        ehr: updatedEHR
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.addPrescription = async (req, res) => {
  try {
    // Only doctors can add prescriptions
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors can add prescriptions'
      });
    }

    const ehr = await EHR.findById(req.params.id);
    if (!ehr) {
      return res.status(404).json({
        status: 'fail',
        message: 'No EHR found with that ID'
      });
    }

    // Check if the doctor is the creator of this record
    if (ehr.doctor.id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this medical record'
      });
    }

    // Add the new prescription
    ehr.prescriptions.push(req.body);
    await ehr.save();

    // Log prescription addition
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'ehr',
      resourceId: ehr._id,
      description: 'Added prescription to medical record',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { medication: req.body.medication.name }
    });

    // Add access log entry to the EHR
    await ehr.logAccess(req.user._id, 'update', `Added prescription: ${req.body.medication.name}`);

    res.status(200).json({
      status: 'success',
      data: {
        ehr
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.addLabTest = async (req, res) => {
  try {
    // Only doctors can add lab tests
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors can add lab tests'
      });
    }

    const ehr = await EHR.findById(req.params.id);
    if (!ehr) {
      return res.status(404).json({
        status: 'fail',
        message: 'No EHR found with that ID'
      });
    }

    // Check if the doctor is the creator of this record
    if (ehr.doctor.id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this medical record'
      });
    }

    // Add the new lab test
    ehr.labTests.push(req.body);
    await ehr.save();

    // Log lab test addition
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'ehr',
      resourceId: ehr._id,
      description: 'Added lab test to medical record',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { testName: req.body.name }
    });

    // Add access log entry to the EHR
    await ehr.logAccess(req.user._id, 'update', `Added lab test: ${req.body.name}`);

    res.status(200).json({
      status: 'success',
      data: {
        ehr
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateLabTestResults = async (req, res) => {
  try {
    // Only doctors can update lab test results
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only doctors can update lab test results'
      });
    }

    const ehr = await EHR.findById(req.params.ehrId);
    if (!ehr) {
      return res.status(404).json({
        status: 'fail',
        message: 'No EHR found with that ID'
      });
    }

    // Check if the doctor is the creator of this record
    if (ehr.doctor.id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this medical record'
      });
    }

    // Find the lab test to update
    const labTestIndex = ehr.labTests.findIndex(
      test => test._id.toString() === req.params.testId
    );

    if (labTestIndex === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'No lab test found with that ID in this EHR'
      });
    }

    // Update the lab test results
    ehr.labTests[labTestIndex].results = req.body;
    ehr.labTests[labTestIndex].isCompleted = true;
    await ehr.save();

    // Log lab test results update
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'ehr',
      resourceId: ehr._id,
      description: 'Updated lab test results',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { 
        testName: ehr.labTests[labTestIndex].name,
        testId: req.params.testId
      }
    });

    // Add access log entry to the EHR
    await ehr.logAccess(
      req.user._id, 
      'update', 
      `Updated lab test results for: ${ehr.labTests[labTestIndex].name}`
    );

    res.status(200).json({
      status: 'success',
      data: {
        labTest: ehr.labTests[labTestIndex]
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
