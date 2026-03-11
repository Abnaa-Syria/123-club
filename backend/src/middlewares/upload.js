const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const AppError = require('../utils/AppError');

// Allowed upload types and their directories
const UPLOAD_TYPES = {
  avatars: 'avatars',
  products: 'products',
  banners: 'banners',
  content: 'content',
  categories: 'categories',
  'product-categories': 'categories', // Alias for product categories
};

/**
 * Create upload middleware for a specific type
 * @param {string} type - Upload type (avatars, products, banners, content, categories)
 * @param {string} fieldName - Form field name (default: 'image')
 * @returns {Function} Multer middleware
 */
const createUploadMiddleware = (type, fieldName = 'image') => {
  const uploadDir = UPLOAD_TYPES[type];
  if (!uploadDir) {
    throw new Error(`Invalid upload type: ${type}. Allowed types: ${Object.keys(UPLOAD_TYPES).join(', ')}`);
  }

  const fullPath = path.join(__dirname, '../../', config.upload.dir, uploadDir);

  // Ensure directory exists
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });

  // File filter
  const fileFilter = (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed', 400), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  }).single(fieldName);
};

/**
 * Generic upload middleware - determines type from route parameter
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const type = req.params.type || 'general';
      const uploadDir = UPLOAD_TYPES[type] || 'general';
      const fullPath = path.join(__dirname, '../../', config.upload.dir, uploadDir);
      
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed', 400), false);
    }
  },
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

module.exports = {
  upload,
  createUploadMiddleware,
  UPLOAD_TYPES,
};

