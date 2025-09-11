const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const Appointment = require('../models/appointmentModel');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments for the current user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, completed, cancelled, no-show]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [in-person, telehealth]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns list of appointments
 */
router.get('/', appointmentController.getAllAppointments);

/**
 * @swagger
 * /api/appointments/doctor-availability:
 *   get:
 *     summary: Get a doctor's availability for a specific date
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Returns doctor's availability
 */
router.get(
  '/doctor-availability',
  appointmentController.getDoctorAvailability
);

/**
 * @swagger
 * /api/appointments/suggest-slots:
 *   get:
 *     summary: Get AI-suggested appointment slots
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns suggested appointment slots
 */
router.get('/suggest-slots', appointmentController.suggestAppointmentSlots);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - startTime
 *               - endTime
 *               - type
 *               - reason
 *             properties:
 *               patient:
 *                 type: string
 *               doctor:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [in-person, telehealth]
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', appointmentController.createAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the appointment
 *       404:
 *         description: Appointment not found
 */
router.get(
  '/:id',
  authMiddleware.checkOwnership(Appointment),
  appointmentController.getAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   patch:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [scheduled, confirmed, completed, cancelled, no-show]
 *               type:
 *                 type: string
 *                 enum: [in-person, telehealth]
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Appointment not found
 */
router.patch(
  '/:id',
  authMiddleware.checkOwnership(Appointment),
  appointmentController.updateAppointment
);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Appointment not found
 */
router.patch(
  '/:id/cancel',
  authMiddleware.checkOwnership(Appointment),
  appointmentController.cancelAppointment
);

module.exports = router;
