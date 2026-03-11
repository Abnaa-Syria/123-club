const express = require('express');
const router = express.Router();
const controller = require('./pages.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /pages:
 *   get:
 *     tags: [Static Pages]
 *     summary: List static pages
 *     security: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Pages list
 */
router.get('/', controller.list);

/**
 * @swagger
 * /pages/slug/{slug}:
 *   get:
 *     tags: [Static Pages]
 *     summary: Get page by slug
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Page details
 */
router.get('/slug/:slug', controller.getBySlug);

/**
 * @swagger
 * /pages/{id}:
 *   get:
 *     tags: [Static Pages]
 *     summary: Get page by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Page details
 */
router.get('/:id', controller.getById);

router.post('/', authenticate, authorize('SUPER_ADMIN'), controller.create);
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), controller.delete);

module.exports = router;

