const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { upload } = require('../../middlewares/upload');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /upload/{type}:
 *   post:
 *     tags: [Upload]
 *     summary: Upload an image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [avatars, products, banners, content, categories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     path: { type: string }
 *                     url: { type: string }
 *                     filename: { type: string }
 *                     size: { type: integer }
 *                     mimetype: { type: string }
 */
router.post('/:type', authenticate, upload.single('image'), uploadController.uploadImage);

module.exports = router;

