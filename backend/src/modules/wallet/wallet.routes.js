const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /wallet/me:
 *   get:
 *     tags: [Wallet]
 *     summary: Get my wallet summary
 *     responses:
 *       200:
 *         description: Wallet summary
 */
router.get('/me', authenticate, walletController.getMyWallet);

/**
 * @swagger
 * /wallet/me/history:
 *   get:
 *     tags: [Wallet]
 *     summary: Get my points transaction history
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [EARNED, REDEEMED, EXPIRED, ADMIN_ADD, ADMIN_DEDUCT, REFERRAL_BONUS, SIGNUP_BONUS] }
 *     responses:
 *       200:
 *         description: Points history
 */
router.get('/me/history', authenticate, walletController.getMyPointsHistory);

/**
 * @swagger
 * /wallet/admin/{userId}:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet details for a user (Admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Wallet details
 */
router.get('/admin/:userId', authenticate, authorize('SUPER_ADMIN'), walletController.adminGetWallet);

/**
 * @swagger
 * /wallet/admin/{userId}/transactions:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet transactions for a user (Admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Transactions list
 */
router.get('/admin/:userId/transactions', authenticate, authorize('SUPER_ADMIN'), walletController.adminGetTransactions);

/**
 * @swagger
 * /wallet/admin/by-member/{memberId}:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet details using membership card ID (Admin)
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Wallet details
 */
router.get('/admin/by-member/:memberId', authenticate, authorize('SUPER_ADMIN'), walletController.adminGetWalletByMemberId);

/**
 * @swagger
 * /wallet/admin/by-member/{memberId}/transactions:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet transactions using membership card ID (Admin)
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Transactions list
 */
router.get('/admin/by-member/:memberId/transactions', authenticate, authorize('SUPER_ADMIN'), walletController.adminGetTransactionsByMemberId);

/**
 * @swagger
 * /wallet/admin/{userId}/add:
 *   post:
 *     tags: [Wallet]
 *     summary: Add points to a user (Admin)
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
 *             required: [amount]
 *             properties:
 *               amount: { type: integer, minimum: 1 }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Points added
 */
router.post('/admin/:userId/add', authenticate, authorize('SUPER_ADMIN'), walletController.adminAddPoints);

/**
 * @swagger
 * /wallet/admin/{userId}/deduct:
 *   post:
 *     tags: [Wallet]
 *     summary: Deduct points from a user (Admin)
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
 *             required: [amount]
 *             properties:
 *               amount: { type: integer, minimum: 1 }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Points deducted
 */
router.post('/admin/:userId/deduct', authenticate, authorize('SUPER_ADMIN'), walletController.adminDeductPoints);

module.exports = router;

