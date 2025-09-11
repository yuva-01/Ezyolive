const Appointment = require('../models/appointmentModel');
const Log = require('../models/logModel');

// Add missing controller methods
exports.getAllSessions = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Get all sessions feature coming soon'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createSession = async (req, res) => {
  try {
    res.status(201).json({
      status: 'success',
      message: 'Create session feature coming soon'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getSession = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Get session feature coming soon',
      sessionId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateSession = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Update session feature coming soon',
      sessionId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Cancel session feature coming soon',
      sessionId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.joinSession = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Join session feature coming soon',
      sessionId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.endSession = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'End session feature coming soon',
      sessionId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getAllRecordings = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Get all recordings feature coming soon'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getRecording = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Get recording feature coming soon',
      recordingId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTelehealthSession = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'No appointment found with that ID'
      });
    }

    // Check if appointment is a telehealth appointment
    if (appointment.type !== 'telehealth') {
      return res.status(400).json({
        status: 'fail',
        message: 'This is not a telehealth appointment'
      });
    }

    // Authorization check
    // Only the patient, doctor, or admin can access the telehealth session
    const isAuthorized = 
      req.user.role === 'admin' ||
      appointment.patient.id === req.user.id ||
      appointment.doctor.id === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to access this telehealth session'
      });
    }

    // Check if appointment time is valid for joining
    const now = new Date();
    const appointmentStart = new Date(appointment.startTime);
    const appointmentEnd = new Date(appointment.endTime);
    
    // Allow joining 10 minutes before appointment starts
    const joinWindow = new Date(appointmentStart);
    joinWindow.setMinutes(joinWindow.getMinutes() - 10);
    
    if (now < joinWindow) {
      return res.status(400).json({
        status: 'fail',
        message: 'This telehealth session is not yet available for joining. You can join 10 minutes before the scheduled time.'
      });
    }
    
    if (now > appointmentEnd) {
      return res.status(400).json({
        status: 'fail',
        message: 'This telehealth session has ended'
      });
    }

    // Generate telehealth link if not already generated
    if (!appointment.telehealthLink) {
      appointment.generateTelehealthLink();
      await appointment.save();
    }

    // Log telehealth session access
    await Log.createLog({
      user: req.user._id,
      action: 'telehealth_join',
      resourceType: 'telehealth',
      resourceId: appointment._id,
      description: 'Joined telehealth session',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        telehealth: {
          appointment: {
            id: appointment._id,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            patient: {
              id: appointment.patient._id,
              name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
            },
            doctor: {
              id: appointment.doctor._id,
              name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
              specialization: appointment.doctor.specialization
            }
          },
          sessionUrl: appointment.telehealthLink,
          sessionId: appointment.telehealthLink.split('/').pop(),
          userRole: req.user.role,
          currentTime: new Date().toISOString()
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.endTelehealthSession = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'No appointment found with that ID'
      });
    }

    // Check if this is a telehealth appointment
    if (appointment.type !== 'telehealth') {
      return res.status(400).json({
        status: 'fail',
        message: 'This is not a telehealth appointment'
      });
    }

    // Authorization check - only doctor can end the session
    if (appointment.doctor.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only the doctor or admin can end the telehealth session'
      });
    }

    // Update appointment status to completed if ended by doctor
    if (req.user.role === 'doctor') {
      appointment.status = 'completed';
      await appointment.save();
    }

    // Log telehealth session end
    await Log.createLog({
      user: req.user._id,
      action: 'telehealth_leave',
      resourceType: 'telehealth',
      resourceId: appointment._id,
      description: 'Ended telehealth session',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        endedBy: req.user.role,
        appointmentMarkedCompleted: req.user.role === 'doctor'
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Telehealth session ended successfully',
      data: {
        appointment: {
          id: appointment._id,
          status: appointment.status
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getUpcomingTelehealthSessions = async (req, res) => {
  try {
    const now = new Date();
    let filter = {
      type: 'telehealth',
      startTime: { $gte: now },
      status: 'confirmed'
    };

    // Filter based on user role
    if (req.user.role === 'patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user.id;
    }

    // Get upcoming telehealth sessions
    const upcomingSessions = await Appointment.find(filter)
      .sort({ startTime: 1 })
      .limit(10);

    res.status(200).json({
      status: 'success',
      results: upcomingSessions.length,
      data: {
        sessions: upcomingSessions
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getPatientSessionHistory = async (req, res) => {
  try {
    // Only doctors or the patient themselves can see their session history
    if (req.user.role !== 'admin' && 
        req.user.role !== 'doctor' && 
        req.user.id !== req.params.patientId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to access this patient\'s telehealth history'
      });
    }

    // For doctors, check if they have had sessions with this patient
    if (req.user.role === 'doctor') {
      const hasAccess = await Appointment.findOne({
        doctor: req.user.id,
        patient: req.params.patientId,
        type: 'telehealth'
      });

      if (!hasAccess) {
        return res.status(403).json({
          status: 'fail',
          message: 'You have not had any telehealth sessions with this patient'
        });
      }
    }

    // Get completed telehealth sessions for this patient
    const sessions = await Appointment.find({
      patient: req.params.patientId,
      type: 'telehealth',
      status: 'completed'
    }).sort({ startTime: -1 });

    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: {
        sessions
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
