const crypto = require('crypto');
const slugify = require('slugify');
const config = require('../config');

/**
 * Generate a unique member ID (e.g., CLB-00001234)
 */
function generateMemberId() {
  const num = Math.floor(Math.random() * 99999999);
  return `CLB-${num.toString().padStart(8, '0')}`;
}

/**
 * Generate referral code
 */
function generateReferralCode(length = 8) {
  return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
}

/**
 * Generate order number
 */
function generateOrderNumber() {
  const date = new Date();
  const prefix = 'ORD';
  const timestamp = date.getFullYear().toString().slice(-2) +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Create a URL-friendly slug
 */
function createSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

/**
 * Parse pagination params from query
 */
function parsePagination(query) {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || config.pagination.defaultPageSize;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > config.pagination.maxPageSize) limit = config.pagination.maxPageSize;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Parse sorting params from query
 */
function parseSorting(query, allowedFields = ['createdAt']) {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
  return { [sortBy]: sortOrder };
}

/**
 * Remove undefined/null fields from an object
 */
function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  );
}

/**
 * Calculate expiry date from duration in days
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = {
  generateMemberId,
  generateReferralCode,
  generateOrderNumber,
  createSlug,
  parsePagination,
  parseSorting,
  cleanObject,
  addDays,
};

