const { upload, UPLOAD_TYPES } = require('../../middlewares/upload');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');

class UploadController {
  /**
   * Upload a single image
   * POST /upload/:type
   * Types: avatars, products, banners, content, categories
   */
  uploadImage = catchAsync(async (req, res) => {
    const { type } = req.params;

    if (!UPLOAD_TYPES[type]) {
      throw AppError.badRequest(`Invalid upload type. Allowed types: ${Object.keys(UPLOAD_TYPES).join(', ')}`);
    }

    if (!req.file) {
      throw AppError.badRequest('No file uploaded');
    }

    // Return relative path (e.g., "avatars/uuid.jpg")
    const imagePath = `${UPLOAD_TYPES[type]}/${req.file.filename}`;

    return ApiResponse.success(res, {
      data: {
        path: imagePath,
        url: `/uploads/${imagePath}`,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      message: 'Image uploaded successfully',
    });
  });
}

module.exports = new UploadController();

