const express = require('express');
const router = express.Router();
const controller = require('./faq.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @swagger
 * /faqs:
 *   get:
 *     tags: [FAQ]
 *     summary: List FAQs
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: FAQs list
 */
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('SUPER_ADMIN'), controller.create);
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), controller.delete);

module.exports = router;

