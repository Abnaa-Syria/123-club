const express = require('express');
const router = express.Router();

// Module routes
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/users.routes');
const profileRoutes = require('../modules/profiles/profiles.routes');
const membershipRoutes = require('../modules/membership/membership.routes');
const avatarRoutes = require('../modules/avatars/avatars.routes');
const walletRoutes = require('../modules/wallet/wallet.routes');
const contentCategoryRoutes = require('../modules/categories/categories.routes');
const contentRoutes = require('../modules/content/content.routes');
const bannerRoutes = require('../modules/banners/banners.routes');
const productCategoryRoutes = require('../modules/products/productCategories.routes');
const productRoutes = require('../modules/products/products.routes');
const cartRoutes = require('../modules/cart/cart.routes');
const orderRoutes = require('../modules/orders/orders.routes');
const notificationRoutes = require('../modules/notifications/notifications.routes');
const referralRoutes = require('../modules/referrals/referrals.routes');
const pageRoutes = require('../modules/pages/pages.routes');
const faqRoutes = require('../modules/pages/faq.routes');
const settingsRoutes = require('../modules/settings/settings.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const uploadRoutes = require('../modules/upload/upload.routes');

// ============================================
// Register Routes
// ============================================
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/membership', membershipRoutes);
router.use('/avatars', avatarRoutes);
router.use('/wallet', walletRoutes);
router.use('/content-categories', contentCategoryRoutes);
router.use('/content', contentRoutes);
router.use('/banners', bannerRoutes);
router.use('/product-categories', productCategoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/notifications', notificationRoutes);
router.use('/referrals', referralRoutes);
router.use('/pages', pageRoutes);
router.use('/faqs', faqRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;

