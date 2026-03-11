const express = require('express');
const router = express.Router();
const controller = require('./dashboard.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

// All dashboard routes require SUPER_ADMIN
router.use(authenticate, authorize('SUPER_ADMIN'));

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard overview statistics
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/overview', controller.getOverview);

/**
 * @swagger
 * /dashboard/recent-registrations:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent user registrations
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Recent registrations
 */
router.get('/recent-registrations', controller.getRecentRegistrations);

/**
 * @swagger
 * /dashboard/recent-orders:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent orders
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Recent orders
 */
router.get('/recent-orders', controller.getRecentOrders);

/**
 * @swagger
 * /dashboard/recent-activities:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent admin activities
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Recent activities
 */
router.get('/recent-activities', controller.getRecentActivities);

module.exports = router;

