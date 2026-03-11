const express = require('express');
const router = express.Router();
const avatarsController = require('./avatars.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /avatars:
 *   get:
 *     tags: [Avatars]
 *     summary: List available avatars
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
 *     responses:
 *       200:
 *         description: Avatars list
 */
router.get('/', avatarsController.listAvatars);

/**
 * @swagger
 * /avatars/my-avatar:
 *   get:
 *     tags: [Avatars]
 *     summary: Get my selected avatar
 *     responses:
 *       200:
 *         description: Selected avatar
 */
router.get('/my-avatar', authenticate, avatarsController.getMyAvatar);

/**
 * @swagger
 * /avatars/select:
 *   post:
 *     tags: [Avatars]
 *     summary: Select an avatar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [avatarId]
 *             properties:
 *               avatarId: { type: string }
 *     responses:
 *       200:
 *         description: Avatar selected
 */
router.post('/select', authenticate, avatarsController.selectAvatar);

/**
 * @swagger
 * /avatars/{id}:
 *   get:
 *     tags: [Avatars]
 *     summary: Get avatar details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Avatar details
 */
router.get('/:id', avatarsController.getAvatarById);

/**
 * @swagger
 * /avatars:
 *   post:
 *     tags: [Avatars]
 *     summary: Create avatar (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, imageUrl]
 *             properties:
 *               name: { type: string }
 *               imageUrl: { type: string }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *               sortOrder: { type: integer }
 *     responses:
 *       201:
 *         description: Avatar created
 */
router.post('/', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('avatars', 'image'), avatarsController.createAvatar);

/**
 * @swagger
 * /avatars/{id}:
 *   put:
 *     tags: [Avatars]
 *     summary: Update avatar (Admin)
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
 *               name: { type: string }
 *               image: { type: string, format: binary }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *               sortOrder: { type: integer }
 *     responses:
 *       200:
 *         description: Avatar updated
 */
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('avatars', 'image'), avatarsController.updateAvatar);

/**
 * @swagger
 * /avatars/{id}:
 *   delete:
 *     tags: [Avatars]
 *     summary: Delete avatar (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Avatar deleted
 */
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), avatarsController.deleteAvatar);

module.exports = router;

