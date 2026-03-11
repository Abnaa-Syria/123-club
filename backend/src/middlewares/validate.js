const AppError = require('../utils/AppError');

/**
 * Validate request body/params/query against a Joi schema
 * @param {Object} schema - Joi schema object with optional body, params, query keys
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = {};

    ['body', 'params', 'query'].forEach((source) => {
      if (schema[source]) {
        const { error, value } = schema[source].validate(req[source], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          error.details.forEach((detail) => {
            const key = detail.path.join('.');
            if (!errors[key]) errors[key] = [];
            errors[key].push(detail.message.replace(/"/g, ''));
          });
        } else {
          req[source] = value;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      return next(AppError.validation(errors));
    }

    next();
  };
};

module.exports = validate;

