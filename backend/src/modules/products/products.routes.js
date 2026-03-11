const express = require('express');
const router = express.Router();
const productsController = require('./products.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { createUploadMiddleware } = require('../../middlewares/upload');

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products
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
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: isFeatured
 *         schema: { type: boolean }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Products list
 */
router.get('/', productsController.list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product details
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', productsController.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create product (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, name, pointsCost]
 *             properties:
 *               categoryId: { type: string }
 *               name: { type: string }
 *               description: { type: string }
 *               imageUrl: { type: string }
 *               pointsCost: { type: integer }
 *               stockQuantity: { type: integer }
 *               isActive: { type: boolean }
 *               isFeatured: { type: boolean }
 *               isRecommended: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('products', 'image'), productsController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (Admin)
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
 *               name: { type: string }
 *               description: { type: string }
 *               image: { type: string, format: binary }
 *               pointsCost: { type: integer }
 *               stockQuantity: { type: integer }
 *               isActive: { type: boolean }
 *               isFeatured: { type: boolean }
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), createUploadMiddleware('products', 'image'), productsController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), productsController.delete);

module.exports = router;

