const express = require('express');
const telehealthController = require('../controllers/telehealthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/telehealth/sessions:
 *   get:
 *     summary: Get all telehealth sessions for the current user
 *     tags: [Telehealth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, in-progress, completed, cancelled]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
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
 *         description: Returns list of telehealth sessions
 */
router.get('/sessions', telehealthController.getAllSessions);

/**
 * @swagger
 * /api/telehealth/sessions:
 *   post:
 *     summary: Create a new telehealth session
 *     tags: [Telehealth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - startTime
 *               - duration
 *             properties:
 *               appointmentId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *               notes:
 *                 type: string
 *               meetingPlatform:
 *                 type: string
 *                 enum: [zoom, google-meet, microsoft-teams, in-app, other]
 *     responses:
 *       201:
 *         description: Telehealth session created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/sessions',
  authMiddleware.restrictTo('admin', 'doctor'),
  telehealthController.createSession
);

/**
 * @swagger
 * /api/telehealth/sessions/{id}:
 *   get:
 *     summary: Get a telehealth session by ID
 *     tags: [Telehealth]
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
 *         description: Returns the telehealth session
 *       404:
 *         description: Telehealth session not found
 */
router.get('/sessions/:id', telehealthController.getSession);

/**
 * @swagger
 * /api/telehealth/sessions/{id}:
 *   patch:
 *     summary: Update a telehealth session
 *     tags: [Telehealth]
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
 *               duration:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [scheduled, in-progress, completed, cancelled]
 *               notes:
 *                 type: string
 *               meetingPlatform:
 *                 type: string
 *                 enum: [zoom, google-meet, microsoft-teams, in-app, other]
 *               meetingUrl:
 *                 type: string
 *               meetingId:
 *                 type: string
 *               meetingPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Telehealth session updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Telehealth session not found
 */
router.patch(
  '/sessions/:id',
  authMiddleware.restrictTo('admin', 'doctor'),
  telehealthController.updateSession
);

/**
 * @swagger
 * /api/telehealth/sessions/{id}:
 *   delete:
 *     summary: Cancel a telehealth session
 *     tags: [Telehealth]
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
 *         description: Telehealth session cancelled successfully
 *       404:
 *         description: Telehealth session not found
 */
router.delete(
  '/sessions/:id',
  authMiddleware.restrictTo('admin', 'doctor'),
  telehealthController.cancelSession
);

/**
 * @swagger
 * /api/telehealth/sessions/{id}/join:
 *   post:
 *     summary: Join a telehealth session
 *     tags: [Telehealth]
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
 *         description: Returns session connection details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Telehealth session not found
 */
router.post('/sessions/:id/join', telehealthController.joinSession);

/**
 * @swagger
 * /api/telehealth/sessions/{id}/end:
 *   post:
 *     summary: End a telehealth session
 *     tags: [Telehealth]
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
 *               notes:
 *                 type: string
 *               followupNeeded:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Session ended successfully
 *       404:
 *         description: Telehealth session not found
 */
router.post(
  '/sessions/:id/end',
  authMiddleware.restrictTo('admin', 'doctor'),
  telehealthController.endSession
);

/**
 * @swagger
 * /api/telehealth/recordings:
 *   get:
 *     summary: Get all telehealth recordings
 *     tags: [Telehealth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns list of telehealth recordings
 */
router.get(
  '/recordings',
  authMiddleware.restrictTo('admin', 'doctor'),
  telehealthController.getAllRecordings
);

/**
 * @swagger
 * /api/telehealth/recordings/{id}:
 *   get:
 *     summary: Get a telehealth recording by ID
 *     tags: [Telehealth]
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
 *         description: Returns the telehealth recording
 *       404:
 *         description: Recording not found
 */
router.get(
  '/recordings/:id',
  authMiddleware.restrictTo('admin', 'doctor'),
  telehealthController.getRecording
);

module.exports = router;
