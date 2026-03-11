const express = require('express');
const router = express.Router();
const membershipController = require('./membership.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /membership/plans:
 *   get:
 *     tags: [Membership]
 *     summary: List membership plans
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: level
 *         schema: { type: string, enum: [BRONZE, SILVER, GOLD, PLATINUM] }
 *     responses:
 *       200:
 *         description: Plans list
 */
router.get('/plans', membershipController.listPlans);

/**
 * @swagger
 * /membership/plans/{id}:
 *   get:
 *     tags: [Membership]
 *     summary: Get plan details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Plan details
 */
router.get('/plans/:id', membershipController.getPlanById);

/**
 * @swagger
 * /membership/plans:
 *   post:
 *     tags: [Membership]
 *     summary: Create membership plan (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, level]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               level: { type: string, enum: [BRONZE, SILVER, GOLD, PLATINUM] }
 *               price: { type: number }
 *               durationDays: { type: integer }
 *               benefits: { type: string }
 *               pointsBonus: { type: integer }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Plan created
 */
router.post('/plans', authenticate, authorize('SUPER_ADMIN'), membershipController.createPlan);

/**
 * @swagger
 * /membership/plans/{id}:
 *   put:
 *     tags: [Membership]
 *     summary: Update membership plan (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Plan updated
 */
router.put('/plans/:id', authenticate, authorize('SUPER_ADMIN'), membershipController.updatePlan);

/**
 * @swagger
 * /membership/plans/{id}:
 *   delete:
 *     tags: [Membership]
 *     summary: Delete membership plan (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Plan deleted
 */
router.delete('/plans/:id', authenticate, authorize('SUPER_ADMIN'), membershipController.deletePlan);

/**
 * @swagger
 * /membership/my-card:
 *   get:
 *     tags: [Membership]
 *     summary: Get my membership card
 *     responses:
 *       200:
 *         description: Membership card info
 */
router.get('/my-card', authenticate, membershipController.getMyMembership);

/**
 * @swagger
 * /membership/assign/{userId}:
 *   post:
 *     tags: [Membership]
 *     summary: Assign/update membership for a user (Admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planId]
 *             properties:
 *               planId: { type: string }
 *     responses:
 *       200:
 *         description: Membership assigned
 */
router.post('/assign/:userId', authenticate, authorize('SUPER_ADMIN'), membershipController.assignMembership);

module.exports = router;

