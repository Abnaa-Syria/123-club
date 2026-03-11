const Joi = require('joi');

const register = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
    phone: Joi.string().allow(null, '').optional(),
    role: Joi.string().valid('CHILD', 'PARENT', 'TEACHER', 'SCHOOL').required().messages({
      'any.only': 'Role must be one of: CHILD, PARENT, TEACHER, SCHOOL',
      'any.required': 'Role is required',
    }),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    birthDate: Joi.date().iso().optional(),
    // Role-specific fields
    schoolName: Joi.string().max(200).optional(),
    grade: Joi.string().max(50).optional(),
    interests: Joi.string().optional(),
    parentId: Joi.string().uuid().optional(),
    numberOfChildren: Joi.number().integer().min(0).optional(),
    occupation: Joi.string().max(200).optional(),
    specialization: Joi.string().max(200).optional(),
    yearsOfExp: Joi.number().integer().min(0).optional(),
    contactPerson: Joi.string().max(200).optional(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().max(30).optional(),
    address: Joi.string().optional(),
    website: Joi.string().uri().optional().allow(''),
    studentsCount: Joi.number().integer().min(0).optional(),
    referralCode: Joi.string().max(20).optional(),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),
};

const refreshToken = {
  body: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).max(128).required(),
  }),
};

const changePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
  }),
};

module.exports = { register, login, refreshToken, forgotPassword, resetPassword, changePassword };

