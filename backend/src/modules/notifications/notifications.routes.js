const express = require('express');
const router = express.Router();
const controller = require('./notifications.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get my notifications
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: isRead
 *         schema: { type: boolean }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [ORDER_UPDATE, POINTS_UPDATE, NEW_CONTENT, SYSTEM, PROMO, REFERRAL] }
 *     responses:
 *       200:
 *         description: Notifications list
 */
router.get('/', authenticate, controller.getMyNotifications);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     responses:
 *       200:
 *         description: All marked as read
 */
router.patch('/mark-all-read', authenticate, controller.markAllAsRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Marked as read
 */
router.patch('/:id/read', authenticate, controller.markAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', authenticate, controller.deleteNotification);

/**
 * @swagger
 * /notifications/admin/send:
 *   post:
 *     tags: [Notifications]
 *     summary: Send notification to a specific user (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title, body]
 *             properties:
 *               userId: { type: string }
 *               title: { type: string }
 *               body: { type: string }
 *               type: { type: string, enum: [ORDER_UPDATE, POINTS_UPDATE, NEW_CONTENT, SYSTEM, PROMO, REFERRAL] }
 *     responses:
 *       201:
 *         description: Notification sent
 */
router.post('/admin/send', authenticate, authorize('SUPER_ADMIN'), controller.adminSendNotification);

/**
 * @swagger
 * /notifications/admin/send-all:
 *   post:
 *     tags: [Notifications]
 *     summary: Send notification to all users (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, body]
 *             properties:
 *               title: { type: string }
 *               body: { type: string }
 *               type: { type: string }
 *               roleFilter: { type: string, enum: [CHILD, PARENT, TEACHER, SCHOOL] }
 *     responses:
 *       200:
 *         description: Notifications sent
 */
router.post('/admin/send-all', authenticate, authorize('SUPER_ADMIN'), controller.adminSendToAll);

module.exports = router;

