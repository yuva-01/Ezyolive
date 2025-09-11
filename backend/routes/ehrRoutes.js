const express = require('express');
const ehrController = require('../controllers/ehrController');
const authMiddleware = require('../middleware/authMiddleware');
const EHR = require('../models/ehrModel');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/ehr:
 *   get:
 *     summary: Get all EHRs for the current user
 *     tags: [EHR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
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
 *         description: Returns list of EHRs
 */
router.get('/', ehrController.getAllEHRs);

/**
 * @swagger
 * /api/ehr/patient/{patientId}:
 *   get:
 *     summary: Get all EHRs for a specific patient
 *     tags: [EHR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
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
 *         description: Returns list of EHRs for the patient
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Patient not found
 */
router.get('/patient/:patientId', ehrController.getPatientEHRs);

/**
 * @swagger
 * /api/ehr:
 *   post:
 *     summary: Create a new EHR
 *     tags: [EHR]
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
 *               - chiefComplaint
 *               - treatment
 *             properties:
 *               patient:
 *                 type: string
 *               appointment:
 *                 type: string
 *               chiefComplaint:
 *                 type: string
 *               vitalSigns:
 *                 type: object
 *               diagnosis:
 *                 type: array
 *                 items:
 *                   type: object
 *               treatment:
 *                 type: string
 *               notes:
 *                 type: string
 *               prescriptions:
 *                 type: array
 *                 items:
 *                   type: object
 *               followUp:
 *                 type: object
 *     responses:
 *       201:
 *         description: EHR created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 */
router.post('/', authMiddleware.restrictTo('doctor'), ehrController.createEHR);

/**
 * @swagger
 * /api/ehr/{id}:
 *   get:
 *     summary: Get an EHR by ID
 *     tags: [EHR]
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
 *         description: Returns the EHR
 *       404:
 *         description: EHR not found
 */
router.get(
  '/:id',
  authMiddleware.checkOwnership(EHR),
  ehrController.getEHR
);

/**
 * @swagger
 * /api/ehr/{id}:
 *   patch:
 *     summary: Update an EHR
 *     tags: [EHR]
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
 *               chiefComplaint:
 *                 type: string
 *               vitalSigns:
 *                 type: object
 *               diagnosis:
 *                 type: array
 *                 items:
 *                   type: object
 *               treatment:
 *                 type: string
 *               notes:
 *                 type: string
 *               followUp:
 *                 type: object
 *     responses:
 *       200:
 *         description: EHR updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 *       404:
 *         description: EHR not found
 */
router.patch(
  '/:id',
  authMiddleware.restrictTo('doctor'),
  ehrController.updateEHR
);

/**
 * @swagger
 * /api/ehr/{id}/prescription:
 *   post:
 *     summary: Add a prescription to an EHR
 *     tags: [EHR]
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
 *               - medication
 *             properties:
 *               medication:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   dosage:
 *                     type: string
 *                   frequency:
 *                     type: string
 *                   duration:
 *                     type: string
 *               instructions:
 *                 type: string
 *               dispenseAmount:
 *                 type: string
 *               refills:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Prescription added successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 *       404:
 *         description: EHR not found
 */
router.post(
  '/:id/prescription',
  authMiddleware.restrictTo('doctor'),
  ehrController.addPrescription
);

/**
 * @swagger
 * /api/ehr/{id}/lab-test:
 *   post:
 *     summary: Add a lab test to an EHR
 *     tags: [EHR]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lab test added successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 *       404:
 *         description: EHR not found
 */
router.post(
  '/:id/lab-test',
  authMiddleware.restrictTo('doctor'),
  ehrController.addLabTest
);

/**
 * @swagger
 * /api/ehr/{ehrId}/lab-test/{testId}/results:
 *   patch:
 *     summary: Update lab test results
 *     tags: [EHR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ehrId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: testId
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
 *               value:
 *                 type: string
 *               unit:
 *                 type: string
 *               normalRange:
 *                 type: string
 *               isAbnormal:
 *                 type: boolean
 *               notes:
 *                 type: string
 *               documentUrl:
 *                 type: string
 *               resultDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Lab test results updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 *       404:
 *         description: EHR or lab test not found
 */
router.patch(
  '/:ehrId/lab-test/:testId/results',
  authMiddleware.restrictTo('doctor'),
  ehrController.updateLabTestResults
);

module.exports = router;
