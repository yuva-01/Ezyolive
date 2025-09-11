const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const EHR = require('../models/ehrModel');
const Billing = require('../models/billingModel');
const Log = require('../models/logModel');

// Placeholder controller methods for routes that still need implementation
exports.getAppointmentStats = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Appointment stats feature coming soon'
  });
};

exports.getRevenueStats = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Revenue stats feature coming soon'
  });
};

exports.getPatientStats = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Patient stats feature coming soon'
  });
};

exports.getDoctorPerformanceStats = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Doctor performance stats feature coming soon'
  });
};

exports.getTelehealthStats = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Telehealth stats feature coming soon'
  });
};

exports.getHealthcareTrendsStats = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Healthcare trends stats feature coming soon'
  });
};

exports.getAIInsights = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI insights feature coming soon'
  });
};

exports.getAvailableReports = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Reports feature coming soon'
  });
};

exports.generateReport = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Report generation feature coming soon',
    reportId: req.params.reportId
  });
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Different stats based on user role
    let stats = {};

    // Common stats for all roles - get current date for reference
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Role-specific stats
    if (req.user.role === 'admin') {
      // Admin gets overall system stats
      const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        upcomingAppointments,
        recentBillings,
        monthlyRevenue,
        yearlyRevenue
      ] = await Promise.all([
        User.countDocuments({ role: 'patient', active: true }),
        User.countDocuments({ role: 'doctor', active: true }),
        Appointment.countDocuments(),
        Appointment.countDocuments({
          startTime: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) }
        }),
        Appointment.countDocuments({
          startTime: { $gte: today },
          status: { $nin: ['cancelled', 'no-show'] }
        }),
        Billing.find().sort({ date: -1 }).limit(10),
        Billing.aggregate([
          {
            $match: {
              date: { $gte: startOfMonth },
              status: { $in: ['paid', 'pending'] }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
              collected: { $sum: '$amountPaid' }
            }
          }
        ]),
        Billing.aggregate([
          {
            $match: {
              date: { $gte: startOfYear },
              status: { $in: ['paid', 'pending'] }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
              collected: { $sum: '$amountPaid' }
            }
          }
        ])
      ]);

      // Get monthly revenue trend for the last 12 months
      const revenueTrend = await Billing.aggregate([
        {
          $match: {
            date: { $gte: new Date(today.getFullYear() - 1, today.getMonth(), 1) }
          }
        },
        {
          $group: {
            _id: { 
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            total: { $sum: '$total' },
            collected: { $sum: '$amountPaid' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      // Get appointment status distribution
      const appointmentStatusDistribution = await Appointment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      stats = {
        users: {
          patients: totalPatients,
          doctors: totalDoctors,
        },
        appointments: {
          total: totalAppointments,
          today: todayAppointments,
          upcoming: upcomingAppointments,
          statusDistribution: appointmentStatusDistribution
        },
        financials: {
          monthlyRevenue: monthlyRevenue[0] ? monthlyRevenue[0] : { total: 0, collected: 0 },
          yearlyRevenue: yearlyRevenue[0] ? yearlyRevenue[0] : { total: 0, collected: 0 },
          recentBillings,
          revenueTrend
        }
      };
    } else if (req.user.role === 'doctor') {
      // Doctor gets their patient and appointment stats
      const [
        totalPatients,
        todayAppointments,
        thisWeekAppointments,
        upcomingAppointments,
        recentEHRs,
        monthlyRevenue
      ] = await Promise.all([
        Appointment.aggregate([
          {
            $match: {
              doctor: req.user._id
            }
          },
          {
            $group: {
              _id: '$patient'
            }
          },
          {
            $count: 'total'
          }
        ]),
        Appointment.find({
          doctor: req.user._id,
          startTime: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) }
        }).populate('patient'),
        Appointment.countDocuments({
          doctor: req.user._id,
          startTime: { $gte: startOfWeek, $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000) }
        }),
        Appointment.find({
          doctor: req.user._id,
          startTime: { $gte: today },
          status: { $nin: ['cancelled', 'no-show'] }
        }).sort({ startTime: 1 }).limit(10).populate('patient'),
        EHR.find({
          doctor: req.user._id
        }).sort({ createdAt: -1 }).limit(5),
        Billing.aggregate([
          {
            $match: {
              doctor: req.user._id,
              date: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
              collected: { $sum: '$amountPaid' }
            }
          }
        ])
      ]);

      // Get appointment type distribution
      const appointmentTypeDistribution = await Appointment.aggregate([
        {
          $match: {
            doctor: req.user._id
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      stats = {
        patients: {
          total: totalPatients.length > 0 ? totalPatients[0].total : 0
        },
        appointments: {
          today: todayAppointments,
          thisWeek: thisWeekAppointments,
          upcoming: upcomingAppointments,
          typeDistribution: appointmentTypeDistribution
        },
        medicalRecords: {
          recentEHRs
        },
        financials: {
          monthlyRevenue: monthlyRevenue[0] ? monthlyRevenue[0] : { total: 0, collected: 0 }
        }
      };
    } else if (req.user.role === 'patient') {
      // Patient gets their appointment and medical history
      const [
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        recentEHRs,
        totalBillings,
        pendingBillings
      ] = await Promise.all([
        Appointment.countDocuments({ patient: req.user._id }),
        Appointment.countDocuments({
          patient: req.user._id,
          status: 'completed'
        }),
        Appointment.find({
          patient: req.user._id,
          startTime: { $gte: today },
          status: { $nin: ['cancelled', 'no-show'] }
        }).sort({ startTime: 1 }).limit(5).populate('doctor'),
        EHR.find({
          patient: req.user._id
        }).sort({ createdAt: -1 }).limit(5).populate('doctor'),
        Billing.countDocuments({
          patient: req.user._id
        }),
        Billing.find({
          patient: req.user._id,
          status: { $in: ['pending', 'overdue'] }
        }).sort({ dueDate: 1 }).limit(5)
      ]);

      stats = {
        appointments: {
          total: totalAppointments,
          completed: completedAppointments,
          upcoming: upcomingAppointments
        },
        medicalRecords: {
          recentEHRs
        },
        financials: {
          totalBillings,
          pendingBillings
        }
      };
    }

    // Log analytics access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'analytics',
      description: 'Accessed dashboard analytics',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        role: req.user.role,
        stats
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getAppointmentAnalytics = async (req, res) => {
  try {
    // Authorization check - only admin and doctors can access detailed analytics
    if (req.user.role === 'patient') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource'
      });
    }

    // Date range filter
    let dateFilter = {};
    
    if (req.query.startDate) {
      dateFilter.startTime = { $gte: new Date(req.query.startDate) };
    }
    
    if (req.query.endDate) {
      if (!dateFilter.startTime) dateFilter.startTime = {};
      dateFilter.startTime.$lte = new Date(req.query.endDate);
    }

    // User filter based on role
    let userFilter = {};
    if (req.user.role === 'doctor') {
      userFilter.doctor = req.user._id;
    }

    // Combine filters
    const filter = {
      ...dateFilter,
      ...userFilter
    };

    // Get appointment metrics
    const [
      appointmentsByStatus,
      appointmentsByType,
      appointmentsByDay,
      appointmentsByHour,
      noShowRate,
      averageDuration
    ] = await Promise.all([
      // Appointments by status
      Appointment.aggregate([
        {
          $match: filter
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      // Appointments by type
      Appointment.aggregate([
        {
          $match: filter
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),
      // Appointments by day of week
      Appointment.aggregate([
        {
          $match: filter
        },
        {
          $addFields: {
            dayOfWeek: { $dayOfWeek: '$startTime' } // 1 for Sunday, 2 for Monday, etc.
          }
        },
        {
          $group: {
            _id: '$dayOfWeek',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),
      // Appointments by hour of day
      Appointment.aggregate([
        {
          $match: filter
        },
        {
          $addFields: {
            hourOfDay: { $hour: { date: '$startTime', timezone: 'UTC' } }
          }
        },
        {
          $group: {
            _id: '$hourOfDay',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),
      // No-show rate
      Appointment.aggregate([
        {
          $match: {
            ...filter,
            startTime: { $lt: new Date() } // Only past appointments
          }
        },
        {
          $group: {
            _id: null,
            totalPast: { $sum: 1 },
            noShows: {
              $sum: {
                $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalPast: 1,
            noShows: 1,
            rate: {
              $cond: [
                { $eq: ['$totalPast', 0] },
                0,
                { $multiply: [{ $divide: ['$noShows', '$totalPast'] }, 100] }
              ]
            }
          }
        }
      ]),
      // Average appointment duration
      Appointment.aggregate([
        {
          $match: filter
        },
        {
          $addFields: {
            durationMinutes: {
              $divide: [
                { $subtract: ['$endTime', '$startTime'] },
                60000 // Convert ms to minutes
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$durationMinutes' }
          }
        }
      ])
    ]);

    // Process data for API response
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const appointmentsByDayFormatted = Array(7).fill(0);
    
    appointmentsByDay.forEach(day => {
      // dayOfWeek is 1-7 (Sunday-Saturday), we need 0-6
      const index = day._id - 1;
      appointmentsByDayFormatted[index] = day.count;
    });

    const appointmentsByHourFormatted = Array(24).fill(0);
    appointmentsByHour.forEach(hour => {
      appointmentsByHourFormatted[hour._id] = hour.count;
    });

    // Log analytics access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'analytics',
      description: 'Accessed appointment analytics',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        byStatus: appointmentsByStatus,
        byType: appointmentsByType,
        byDayOfWeek: {
          labels: dayNames,
          data: appointmentsByDayFormatted
        },
        byHourOfDay: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          data: appointmentsByHourFormatted
        },
        noShowRate: noShowRate.length > 0 ? noShowRate[0] : { rate: 0 },
        averageDuration: averageDuration.length > 0 ? Math.round(averageDuration[0].avgDuration) : 0
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getFinancialAnalytics = async (req, res) => {
  try {
    // Only admins and doctors can access financial analytics
    if (req.user.role === 'patient') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this resource'
      });
    }

    // Date range filter
    let dateFilter = {};
    
    if (req.query.startDate) {
      dateFilter.date = { $gte: new Date(req.query.startDate) };
    } else {
      // Default to last 12 months
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      dateFilter.date = { $gte: lastYear };
    }
    
    if (req.query.endDate) {
      if (!dateFilter.date) dateFilter.date = {};
      dateFilter.date.$lte = new Date(req.query.endDate);
    }

    // User filter based on role
    let userFilter = {};
    if (req.user.role === 'doctor') {
      userFilter.doctor = req.user._id;
    }

    // Combine filters
    const filter = {
      ...dateFilter,
      ...userFilter
    };

    // Get financial metrics
    const [
      monthlyRevenue,
      billingsByStatus,
      averageInvoiceAmount,
      paymentMethodDistribution,
      outstandingBalances
    ] = await Promise.all([
      // Monthly revenue
      Billing.aggregate([
        {
          $match: filter
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            billed: { $sum: '$total' },
            collected: { $sum: '$amountPaid' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]),
      // Billings by status
      Billing.aggregate([
        {
          $match: filter
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            amount: { $sum: '$total' }
          }
        }
      ]),
      // Average invoice amount
      Billing.aggregate([
        {
          $match: filter
        },
        {
          $group: {
            _id: null,
            avgAmount: { $avg: '$total' }
          }
        }
      ]),
      // Payment method distribution
      Billing.aggregate([
        {
          $match: {
            ...filter,
            paymentMethod: { $exists: true, $ne: null },
            status: 'paid'
          }
        },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            amount: { $sum: '$amountPaid' }
          }
        }
      ]),
      // Outstanding balances
      Billing.aggregate([
        {
          $match: {
            ...filter,
            status: { $in: ['pending', 'overdue'] }
          }
        },
        {
          $group: {
            _id: '$status',
            totalOutstanding: { $sum: '$balance' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Format monthly revenue for charting
    const monthlyRevenueFormatted = monthlyRevenue.map(month => {
      return {
        label: `${month._id.year}-${month._id.month.toString().padStart(2, '0')}`,
        billed: month.billed,
        collected: month.collected,
        outstanding: month.billed - month.collected
      };
    });

    // Calculate total outstanding balance
    let totalOutstanding = 0;
    outstandingBalances.forEach(status => {
      totalOutstanding += status.totalOutstanding;
    });

    // Log analytics access
    await Log.createLog({
      user: req.user._id,
      action: 'read',
      resourceType: 'analytics',
      description: 'Accessed financial analytics',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      status: 'success',
      data: {
        monthlyRevenue: monthlyRevenueFormatted,
        billingsByStatus,
        averageInvoiceAmount: averageInvoiceAmount.length > 0 ? 
          parseFloat(averageInvoiceAmount[0].avgAmount.toFixed(2)) : 0,
        paymentMethodDistribution,
        outstandingBalance: {
          total: parseFloat(totalOutstanding.toFixed(2)),
          byStatus: outstandingBalances
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
