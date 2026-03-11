const express = require('express');
const router = express.Router();
const bannersController = require('./banners.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /banners:
 *   get:
 *     tags: [Banners]
 *     summary: Get active banners (public)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [HOME, PROMO, SEASONAL, CAMPAIGN] }
 *     responses:
 *       200:
 *         description: Active banners
 */
router.get('/', bannersController.getActiveBanners);

/**
 * @swagger
 * /banners/admin:
 *   get:
 *     tags: [Banners]
 *     summary: List all banners (Admin)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: All banners
 */
router.get('/admin', authenticate, authorize('SUPER_ADMIN'), bannersController.list);

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     tags: [Banners]
 *     summary: Get banner details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Banner details
 */
router.get('/:id', bannersController.getById);

/**
 * @swagger
 * /banners:
 *   post:
 *     tags: [Banners]
 *     summary: Create banner (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, imageUrl]
 *             properties:
 *               title: { type: string }
 *               imageUrl: { type: string }
 *               linkUrl: { type: string }
 *               type: { type: string, enum: [HOME, PROMO, SEASONAL, CAMPAIGN] }
 *               isActive: { type: boolean }
 *               sortOrder: { type: integer }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Banner created
 */
router.post('/', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('banners', 'image'), bannersController.create);

/**
 * @swagger
 * /banners/{id}:
 *   put:
 *     tags: [Banners]
 *     summary: Update banner (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               image: { type: string, format: binary }
 *               linkUrl: { type: string }
 *               type: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Banner updated
 */
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('banners', 'image'), bannersController.update);

/**
 * @swagger
 * /banners/{id}:
 *   delete:
 *     tags: [Banners]
 *     summary: Delete banner (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Banner deleted
 */
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), bannersController.delete);

module.exports = router;

