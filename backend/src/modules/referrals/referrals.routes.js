const express = require('express');
const router = express.Router();
const controller = require('./referrals.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /referrals/my-code:
 *   get:
 *     tags: [Referrals]
 *     summary: Get my referral code
 *     responses:
 *       200:
 *         description: Referral code
 */
router.get('/my-code', authenticate, controller.getMyReferralCode);

/**
 * @swagger
 * /referrals/my-referrals:
 *   get:
 *     tags: [Referrals]
 *     summary: Get list of my referrals
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Referrals list
 */
router.get('/my-referrals', authenticate, controller.getMyReferrals);

/**
 * @swagger
 * /referrals/admin:
 *   get:
 *     tags: [Referrals]
 *     summary: List all referrals (Admin)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: isUsed
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: All referrals
 */
router.get('/admin', authenticate, authorize('SUPER_ADMIN'), controller.adminListReferrals);

module.exports = router;

