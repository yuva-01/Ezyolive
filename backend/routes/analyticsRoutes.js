const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Restrict all analytics routes to admins and doctors only
router.use(authMiddleware.restrictTo('admin', 'doctor'));

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Returns dashboard analytics data
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @swagger
 * /api/analytics/appointments:
 *   get:
 *     summary: Get appointment analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *     responses:
 *       200:
 *         description: Returns appointment analytics data
 */
router.get('/appointments', analyticsController.getAppointmentStats);

/**
 * @swagger
 * /api/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *     responses:
 *       200:
 *         description: Returns revenue analytics data
 */
router.get('/revenue', analyticsController.getRevenueStats);

/**
 * @swagger
 * /api/analytics/patients:
 *   get:
 *     summary: Get patient analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [age, gender, location, condition]
 *     responses:
 *       200:
 *         description: Returns patient analytics data
 */
router.get('/patients', analyticsController.getPatientStats);

/**
 * @swagger
 * /api/analytics/doctors:
 *   get:
 *     summary: Get doctor performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: doctorId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns doctor performance analytics data
 */
router.get(
  '/doctors',
  authMiddleware.restrictTo('admin'),
  analyticsController.getDoctorPerformanceStats
);

/**
 * @swagger
 * /api/analytics/telehealth:
 *   get:
 *     summary: Get telehealth usage analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: doctorId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns telehealth usage analytics data
 */
router.get('/telehealth', analyticsController.getTelehealthStats);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get healthcare trends analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: trend
 *         schema:
 *           type: string
 *           enum: [diagnoses, medications, procedures]
 *     responses:
 *       200:
 *         description: Returns healthcare trends analytics data
 */
router.get('/trends', analyticsController.getHealthcareTrendsStats);

/**
 * @swagger
 * /api/analytics/ai-insights:
 *   get:
 *     summary: Get AI-generated insights from practice data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [operational, clinical, financial]
 *     responses:
 *       200:
 *         description: Returns AI-generated insights
 */
router.get('/ai-insights', analyticsController.getAIInsights);

/**
 * @swagger
 * /api/analytics/reports:
 *   get:
 *     summary: Get list of available reports
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of available reports
 */
router.get('/reports', analyticsController.getAvailableReports);

/**
 * @swagger
 * /api/analytics/reports/{reportId}:
 *   get:
 *     summary: Generate a specific report
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
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
 *     responses:
 *       200:
 *         description: Returns the requested report
 *       404:
 *         description: Report not found
 */
router.get('/reports/:reportId', analyticsController.generateReport);

module.exports = router;
