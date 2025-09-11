const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const Log = require('../models/logModel');

exports.getAllAppointments = async (req, res) => {
  try {
    let filter = {};

    // Filter appointments based on user role
    if (req.user.role === 'patient') {
      filter.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user.id;
    }

    // Apply additional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Filter by date range
    if (req.query.startDate) {
      filter.startTime = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      if (!filter.startTime) filter.startTime = {};
      filter.startTime.$lte = new Date(req.query.endDate);
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const appointments = await Appointment.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ startTime: 1 });

    const total = await Appointment.countDocuments(filter);

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'appointment',
      description: 'Retrieved appointment list',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { filter }
    });

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: {
        appointments
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'No appointment found with that ID'
      });
    }

    // Check authorization - already handled by checkOwnership middleware

    // Log access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'appointment',
      resourceId: appointment._id,
      description: 'Viewed appointment details',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    // For patient users, automatically set the patient ID to their own ID
    if (req.user.role === 'patient') {
      req.body.patient = req.user.id;
    }

    // Check if doctor exists
    const doctor = await User.findById(req.body.doctor);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        status: 'fail',
        message: 'No doctor found with that ID'
      });
    }

    // Check for appointment conflicts
    const { startTime, endTime } = req.body;
    const hasConflicts = await Appointment.checkConflicts(
      req.body.doctor, 
      new Date(startTime), 
      new Date(endTime)
    );

    if (hasConflicts) {
      return res.status(400).json({
        status: 'fail',
        message: 'The selected time slot is not available for this doctor'
      });
    }

    const newAppointment = await Appointment.create(req.body);
    
    // Generate telehealth link if needed
    if (newAppointment.type === 'telehealth') {
      newAppointment.generateTelehealthLink();
      await newAppointment.save();
    }

    // Log appointment creation
    await Log.createLog({
      user: req.user._id,
      action: 'create',
      resourceType: 'appointment',
      resourceId: newAppointment._id,
      description: 'Created new appointment',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      status: 'success',
      data: {
        appointment: newAppointment
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    // Prevent changing patient or doctor
    if (req.body.patient || req.body.doctor) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot change the patient or doctor for an existing appointment'
      });
    }

    // Check for appointment conflicts if changing time
    if (req.body.startTime || req.body.endTime) {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({
          status: 'fail',
          message: 'No appointment found with that ID'
        });
      }

      const startTime = req.body.startTime 
        ? new Date(req.body.startTime) 
        : appointment.startTime;
        
      const endTime = req.body.endTime 
        ? new Date(req.body.endTime) 
        : appointment.endTime;
      
      const hasConflicts = await Appointment.checkConflicts(
        appointment.doctor, 
        startTime, 
        endTime,
        appointment._id
      );

      if (hasConflicts) {
        return res.status(400).json({
          status: 'fail',
          message: 'The selected time slot is not available for this doctor'
        });
      }
    }

    // Record who modified the appointment
    req.body.lastModifiedBy = req.user.id;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'No appointment found with that ID'
      });
    }

    // Generate telehealth link if type changed to telehealth
    if (updatedAppointment.type === 'telehealth' && !updatedAppointment.telehealthLink) {
      updatedAppointment.generateTelehealthLink();
      await updatedAppointment.save();
    }

    // Log update
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'appointment',
      resourceId: updatedAppointment._id,
      description: 'Updated appointment details',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { updatedFields: Object.keys(req.body) }
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointment: updatedAppointment
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'No appointment found with that ID'
      });
    }

    // Check if the appointment is already cancelled
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        status: 'fail',
        message: 'This appointment is already cancelled'
      });
    }

    // Check if appointment is in the past
    if (new Date(appointment.startTime) < new Date()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot cancel past appointments'
      });
    }

    // Update status and record cancellation reason
    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason || 'No reason provided';
    appointment.lastModifiedBy = req.user.id;
    
    await appointment.save();

    // Log cancellation
    await Log.createLog({
      user: req.user._id,
      action: 'update',
      resourceType: 'appointment',
      resourceId: appointment._id,
      description: 'Cancelled appointment',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { 
        reason: appointment.cancellationReason 
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    
    if (!doctorId || !date) {
      return res.status(400).json({
        status: 'fail',
        message: 'Doctor ID and date are required'
      });
    }

    // Get the doctor to check their schedule
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        status: 'fail',
        message: 'No doctor found with that ID'
      });
    }

    // Parse date to get the start and end of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find all appointments for this doctor on the given day
    const appointments = await Appointment.find({
      doctor: doctorId,
      startTime: { $gte: startDate, $lte: endDate },
      status: { $nin: ['cancelled', 'no-show'] }
    }).sort({ startTime: 1 });

    // Generate available time slots (e.g., every 30 minutes from 9 AM to 5 PM)
    // This is a simplified example - in a real app, you would check doctor's working hours
    const availableSlots = [];
    const busySlots = [];
    
    // Default working hours: 9 AM to 5 PM, 30-minute slots
    const workStart = 9; // 9 AM
    const workEnd = 17; // 5 PM
    const slotDuration = 30; // minutes
    
    // Format the date string for the current day
    const dateStr = startDate.toISOString().split('T')[0];
    
    // Create all possible slots
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotStart.getMinutes() + slotDuration);
        
        // Check if the slot conflicts with any existing appointment
        const isConflicting = appointments.some(appt => {
          const apptStart = new Date(appt.startTime);
          const apptEnd = new Date(appt.endTime);
          return (
            (slotStart >= apptStart && slotStart < apptEnd) || 
            (slotEnd > apptStart && slotEnd <= apptEnd) ||
            (slotStart <= apptStart && slotEnd >= apptEnd)
          );
        });
        
        if (isConflicting) {
          busySlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString()
          });
        } else {
          // Only add future slots
          if (slotStart > new Date()) {
            availableSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString()
            });
          }
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        doctor: {
          id: doctor._id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          specialization: doctor.specialization
        },
        date: dateStr,
        availableSlots,
        busySlots
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.suggestAppointmentSlots = async (req, res) => {
  try {
    const { doctorId, patientId } = req.query;
    
    if (!doctorId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Doctor ID is required'
      });
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        status: 'fail',
        message: 'No doctor found with that ID'
      });
    }

    // Define the date range (next 7 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    // Find all appointments for this doctor in the date range
    const doctorAppointments = await Appointment.find({
      doctor: doctorId,
      startTime: { $gte: startDate, $lte: endDate },
      status: { $nin: ['cancelled', 'no-show'] }
    });

    // For AI suggestions, find patterns in the patient's previous appointments
    let patientPreference = {
      dayOfWeek: null,
      timeOfDay: null
    };

    if (patientId) {
      const pastPatientAppointments = await Appointment.find({
        patient: patientId,
        status: 'completed',
      }).sort({ startTime: -1 }).limit(5);

      // Simple pattern detection
      if (pastPatientAppointments.length > 0) {
        // Check day of week preference
        const dayCount = {};
        const timeCount = {};
        
        pastPatientAppointments.forEach(appt => {
          const day = new Date(appt.startTime).getDay();
          const hour = new Date(appt.startTime).getHours();
          
          dayCount[day] = (dayCount[day] || 0) + 1;
          
          let timeOfDay;
          if (hour < 12) timeOfDay = 'morning';
          else if (hour < 17) timeOfDay = 'afternoon';
          else timeOfDay = 'evening';
          
          timeCount[timeOfDay] = (timeCount[timeOfDay] || 0) + 1;
        });
        
        // Find most common day and time
        patientPreference.dayOfWeek = parseInt(
          Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, 0)
        );
        
        patientPreference.timeOfDay = Object.keys(timeCount).reduce(
          (a, b) => timeCount[a] > timeCount[b] ? a : b, 'morning'
        );
      }
    }

    // Generate suggested slots
    const suggestedSlots = [];
    const currentDate = new Date(startDate);
    
    // Iterate through the next 7 days
    while (currentDate <= endDate) {
      // Skip to preferred day if we have a preference
      if (patientPreference.dayOfWeek !== null && 
          currentDate.getDay() !== patientPreference.dayOfWeek) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      // Default working hours: 9 AM to 5 PM
      let workStart = 9; 
      let workEnd = 17;
      
      // Adjust based on preferred time of day
      if (patientPreference.timeOfDay === 'morning') {
        workStart = 9;
        workEnd = 12;
      } else if (patientPreference.timeOfDay === 'afternoon') {
        workStart = 12;
        workEnd = 17;
      } else if (patientPreference.timeOfDay === 'evening') {
        workStart = 17;
        workEnd = 19;
      }
      
      // Format the date string for the current day
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check for available slots on this day
      for (let hour = workStart; hour < workEnd; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
          
          // Skip past slots
          if (slotStart <= new Date()) continue;
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotStart.getMinutes() + 30);
          
          // Check if the slot conflicts with any existing appointment
          const isConflicting = doctorAppointments.some(appt => {
            const apptStart = new Date(appt.startTime);
            const apptEnd = new Date(appt.endTime);
            return (
              (slotStart >= apptStart && slotStart < apptEnd) || 
              (slotEnd > apptStart && slotEnd <= apptEnd) ||
              (slotStart <= apptStart && slotEnd >= apptEnd)
            );
          });
          
          if (!isConflicting) {
            suggestedSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              doctor: {
                id: doctor._id,
                name: `${doctor.firstName} ${doctor.lastName}`,
                specialization: doctor.specialization
              }
            });
            
            // Limit to 5 suggestions
            if (suggestedSlots.length >= 5) {
              break;
            }
          }
        }
        
        if (suggestedSlots.length >= 5) {
          break;
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      
      // If we have enough slots, exit the loop
      if (suggestedSlots.length >= 5) {
        break;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        suggestedSlots,
        patientPreference: patientPreference.dayOfWeek !== null ? patientPreference : null
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
