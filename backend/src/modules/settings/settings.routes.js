const express = require('express');
const router = express.Router();
const controller = require('./settings.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get all app settings
 *     parameters:
 *       - in: query
 *         name: group
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Settings list
 */
router.get('/', authenticate, authorize('SUPER_ADMIN'), controller.getAll);

/**
 * @swagger
 * /settings/{key}:
 *   get:
 *     tags: [Settings]
 *     summary: Get setting by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Setting value
 */
router.get('/:key', authenticate, authorize('SUPER_ADMIN'), controller.getByKey);

/**
 * @swagger
 * /settings:
 *   post:
 *     tags: [Settings]
 *     summary: Create or update a setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, value]
 *             properties:
 *               key: { type: string }
 *               value: { type: string }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Setting saved
 */
router.post('/', authenticate, authorize('SUPER_ADMIN'), controller.upsert);

/**
 * @swagger
 * /settings/{key}:
 *   put:
 *     tags: [Settings]
 *     summary: Update a setting by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value: { type: string }
 *               group: { type: string }
 *     responses:
 *       200:
 *         description: Setting updated
 */
router.put('/:key', authenticate, authorize('SUPER_ADMIN'), controller.update);

/**
 * @swagger
 * /settings/bulk:
 *   put:
 *     tags: [Settings]
 *     summary: Bulk update settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [settings]
 *             properties:
 *               settings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key: { type: string }
 *                     value: { type: string }
 *                     group: { type: string }
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/bulk', authenticate, authorize('SUPER_ADMIN'), controller.bulkUpdate);

/**
 * @swagger
 * /settings/{key}:
 *   delete:
 *     tags: [Settings]
 *     summary: Delete a setting
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Setting deleted
 */
router.delete('/:key', authenticate, authorize('SUPER_ADMIN'), controller.delete);

module.exports = router;

