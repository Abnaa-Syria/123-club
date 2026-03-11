/**
 * Standard API Response Helper
 */
class ApiResponse {
  /**
   * Success response
   */
  static success(res, { data = null, message = 'Success', meta = null, statusCode = 200 } = {}) {
    const response = {
      success: true,
      message,
    };
    if (data !== null) response.data = data;
    if (meta !== null) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  /**
   * Created response
   */
  static created(res, { data = null, message = 'Created successfully' } = {}) {
    return ApiResponse.success(res, { data, message, statusCode: 201 });
  }

  /**
   * Error response
   */
  static error(res, { message = 'Something went wrong', errors = null, statusCode = 500 } = {}) {
    const response = {
      success: false,
      message,
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   */
  static validationError(res, errors, message = 'Validation failed') {
    return ApiResponse.error(res, { message, errors, statusCode: 422 });
  }

  /**
   * Not found response
   */
  static notFound(res, message = 'Resource not found') {
    return ApiResponse.error(res, { message, statusCode: 404 });
  }

  /**
   * Unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized') {
    return ApiResponse.error(res, { message, statusCode: 401 });
  }

  /**
   * Forbidden response
   */
  static forbidden(res, message = 'Forbidden') {
    return ApiResponse.error(res, { message, statusCode: 403 });
  }

  /**
   * Paginated response
   */
  static paginated(res, { data, page, limit, total, message = 'Data fetched successfully' }) {
    const totalPages = Math.ceil(total / limit);
    return ApiResponse.success(res, {
      data,
      message,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

module.exports = ApiResponse;

