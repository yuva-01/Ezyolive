const express = require('express');
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');
const Billing = require('../models/billingModel');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/billing:
 *   get:
 *     summary: Get all billings for the current user
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending, paid, overdue, cancelled, refunded]
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
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
 *         description: Returns list of billings
 */
router.get('/', billingController.getAllBillings);

/**
 * @swagger
 * /api/billing/anomalies:
 *   get:
 *     summary: Detect anomalies in billing
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns detected anomalies
 */
router.get(
  '/anomalies',
  authMiddleware.restrictTo('admin', 'doctor'),
  billingController.detectBillingAnomalies
);

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Create a new billing
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient
 *               - doctor
 *               - items
 *             properties:
 *               patient:
 *                 type: string
 *               doctor:
 *                 type: string
 *               appointment:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                     description:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *                     discount:
 *                       type: number
 *                     tax:
 *                       type: number
 *                     total:
 *                       type: number
 *               tax:
 *                 type: number
 *               discount:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Billing created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 */
router.post(
  '/',
  authMiddleware.restrictTo('admin', 'doctor'),
  billingController.createBilling
);

/**
 * @swagger
 * /api/billing/{id}:
 *   get:
 *     summary: Get a billing by ID
 *     tags: [Billing]
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
 *         description: Returns the billing
 *       404:
 *         description: Billing not found
 */
router.get(
  '/:id',
  authMiddleware.checkOwnership(Billing),
  billingController.getBilling
);

/**
 * @swagger
 * /api/billing/{id}:
 *   patch:
 *     summary: Update a billing
 *     tags: [Billing]
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
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               tax:
 *                 type: number
 *               discount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [draft, pending, paid, overdue, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Billing updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Billing not found
 */
router.patch(
  '/:id',
  authMiddleware.restrictTo('admin', 'doctor'),
  billingController.updateBilling
);

/**
 * @swagger
 * /api/billing/{id}:
 *   delete:
 *     summary: Delete a billing (set status to cancelled)
 *     tags: [Billing]
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
 *         description: Billing cancelled successfully
 *       404:
 *         description: Billing not found
 */
router.delete(
  '/:id',
  authMiddleware.restrictTo('admin'),
  billingController.deleteBilling
);

/**
 * @swagger
 * /api/billing/{id}/process-payment:
 *   post:
 *     summary: Process a payment for a billing
 *     tags: [Billing]
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
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, cash, insurance, bank_transfer, other]
 *               transactionId:
 *                 type: string
 *               cardLast4:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Billing not found
 */
router.post(
  '/:id/process-payment',
  authMiddleware.checkOwnership(Billing),
  billingController.processPayment
);

/**
 * @swagger
 * /api/billing/{id}/generate-invoice:
 *   get:
 *     summary: Generate invoice PDF
 *     tags: [Billing]
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
 *         description: Returns invoice PDF URL
 *       404:
 *         description: Billing not found
 */
router.get(
  '/:id/generate-invoice',
  authMiddleware.checkOwnership(Billing),
  billingController.generateInvoicePDF
);

module.exports = router;
