const express = require('express');
const router = express.Router();
const controller = require('./productCategories.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /product-categories:
 *   get:
 *     tags: [Product Categories]
 *     summary: List product categories
 *     security: []
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
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product categories list
 */
router.get('/', controller.list);

router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('product-categories', 'image'), controller.create);
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('product-categories', 'image'), controller.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), controller.delete);

module.exports = router;

