const express = require('express');
const router = express.Router();
const profilesController = require('./profiles.controller');
const { authenticate } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /profiles/me:
 *   get:
 *     tags: [Profiles]
 *     summary: Get current user's full profile
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/me', authenticate, profilesController.getMyProfile);

/**
 * @swagger
 * /profiles/me:
 *   put:
 *     tags: [Profiles]
 *     summary: Update current user's base profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               displayName: { type: string }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               birthDate: { type: string, format: date }
 *               country: { type: string }
 *               city: { type: string }
 *               bio: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/me', authenticate, profilesController.updateMyProfile);

/**
 * @swagger
 * /profiles/me/role-profile:
 *   put:
 *     tags: [Profiles]
 *     summary: Update role-specific profile fields
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Role profile updated
 */
router.put('/me/role-profile', authenticate, profilesController.updateMyRoleProfile);

/**
 * @swagger
 * /profiles/me/avatar:
 *   post:
 *     tags: [Profiles]
 *     summary: Upload profile avatar image
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 */
router.post('/me/avatar', authenticate, createUploadMiddleware('avatars', 'avatar'), profilesController.uploadAvatar);

module.exports = router;

