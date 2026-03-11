const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // Prisma known request errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Joi validation errors
  if (err.isJoi) {
    statusCode = 422;
    message = 'Validation failed';
    errors = {};
    err.details.forEach((detail) => {
      const key = detail.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(detail.message);
    });
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, { stack: err.stack, url: req.originalUrl });
  } else {
    logger.warn(`${statusCode} - ${message}`, { url: req.originalUrl });
  }

  const response = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

