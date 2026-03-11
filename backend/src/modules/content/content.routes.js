const express = require('express');
const router = express.Router();
const contentController = require('./content.controller');
const { authenticate, authorize, optionalAuth } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /content:
 *   get:
 *     tags: [Content]
 *     summary: List content items (public - published only)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [VIDEO, BOOK_STORY, SONG, GAME] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: ageGroup
 *         schema: { type: integer }
 *       - in: query
 *         name: isFeatured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Content items list
 */
router.get('/', contentController.listPublic);

/**
 * @swagger
 * /content/featured:
 *   get:
 *     tags: [Content]
 *     summary: Get featured content
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Featured content
 */
router.get('/featured', contentController.getFeatured);

/**
 * @swagger
 * /content/recommended:
 *   get:
 *     tags: [Content]
 *     summary: Get recommended content
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Recommended content
 */
router.get('/recommended', contentController.getRecommended);

/**
 * @swagger
 * /content/admin:
 *   get:
 *     tags: [Content]
 *     summary: List all content items (Admin - includes drafts)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [VIDEO, BOOK_STORY, SONG, GAME] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: All content items
 */
router.get('/admin', authenticate, authorize('SUPER_ADMIN'), contentController.list);

/**
 * @swagger
 * /content/{id}:
 *   get:
 *     tags: [Content]
 *     summary: Get content details
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Content details
 */
router.get('/:id', contentController.getById);

/**
 * @swagger
 * /content:
 *   post:
 *     tags: [Content]
 *     summary: Create content item (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, title, type]
 *             properties:
 *               categoryId: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               thumbnailUrl: { type: string }
 *               mediaUrl: { type: string }
 *               type: { type: string, enum: [VIDEO, BOOK_STORY, SONG, GAME] }
 *               status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *               ageGroupMin: { type: integer }
 *               ageGroupMax: { type: integer }
 *               duration: { type: integer }
 *               author: { type: string }
 *               isFeatured: { type: boolean }
 *               isRecommended: { type: boolean }
 *     responses:
 *       201:
 *         description: Content created
 */
router.post('/', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('content', 'thumbnail'), contentController.create);

/**
 * @swagger
 * /content/{id}:
 *   put:
 *     tags: [Content]
 *     summary: Update content item (Admin)
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
 *               categoryId: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               thumbnail: { type: string, format: binary }
 *               mediaUrl: { type: string }
 *               type: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Content updated
 */
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('content', 'thumbnail'), contentController.update);

/**
 * @swagger
 * /content/{id}:
 *   delete:
 *     tags: [Content]
 *     summary: Delete content item (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Content deleted
 */
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), contentController.delete);

module.exports = router;

