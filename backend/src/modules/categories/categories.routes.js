const express = require('express');
const router = express.Router();
const categoriesController = require('./categories.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /content-categories:
 *   get:
 *     tags: [Content Categories]
 *     summary: List content categories
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [VIDEO, BOOK_STORY, SONG, GAME] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Categories list
 */
router.get('/', categoriesController.list);

/**
 * @swagger
 * /content-categories/{id}:
 *   get:
 *     tags: [Content Categories]
 *     summary: Get category details
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category details
 */
router.get('/:id', categoriesController.getById);

/**
 * @swagger
 * /content-categories:
 *   post:
 *     tags: [Content Categories]
 *     summary: Create content category (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *               type: { type: string, enum: [VIDEO, BOOK_STORY, SONG, GAME] }
 *               isActive: { type: boolean }
 *               sortOrder: { type: integer }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('categories', 'image'), categoriesController.create);

/**
 * @swagger
 * /content-categories/{id}:
 *   put:
 *     tags: [Content Categories]
 *     summary: Update content category (Admin)
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
 *               description: { type: string }
 *               image: { type: string, format: binary }
 *               type: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('categories', 'image'), categoriesController.update);

/**
 * @swagger
 * /content-categories/{id}:
 *   delete:
 *     tags: [Content Categories]
 *     summary: Delete content category (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), categoriesController.delete);

module.exports = router;

