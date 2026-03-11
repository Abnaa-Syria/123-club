const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from cart (redeem points)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', authenticate, ordersController.createOrder);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get my orders
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED] }
 *     responses:
 *       200:
 *         description: My orders
 */
router.get('/my-orders', authenticate, ordersController.getMyOrders);

/**
 * @swagger
 * /orders/my-orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get my order details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/my-orders/:id', authenticate, ordersController.getMyOrderById);

/**
 * @swagger
 * /orders/admin:
 *   get:
 *     tags: [Orders]
 *     summary: List all orders (Admin)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: All orders
 */
router.get('/admin', authenticate, authorize('SUPER_ADMIN'), ordersController.listAllOrders);

/**
 * @swagger
 * /orders/admin/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/admin/:id', authenticate, authorize('SUPER_ADMIN'), ordersController.getOrderById);

/**
 * @swagger
 * /orders/admin/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/admin/:id/status', authenticate, authorize('SUPER_ADMIN'), ordersController.updateOrderStatus);

module.exports = router;

