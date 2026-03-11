const profilesService = require('./profiles.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class ProfilesController {
  /**
   * GET /api/v1/profiles/me
   */
  getMyProfile = catchAsync(async (req, res) => {
    const profile = await profilesService.getProfile(req.user.id);
    return ApiResponse.success(res, {
      data: profile,
      message: 'Profile fetched successfully',
    });
  });

  /**
   * PUT /api/v1/profiles/me
   */
  updateMyProfile = catchAsync(async (req, res) => {
    const profile = await profilesService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, {
      data: profile,
      message: 'Profile updated successfully',
    });
  });

  /**
   * PUT /api/v1/profiles/me/role-profile
   */
  updateMyRoleProfile = catchAsync(async (req, res) => {
    const profile = await profilesService.updateRoleProfile(req.user.id, req.user.role, req.body);
    return ApiResponse.success(res, {
      data: profile,
      message: 'Role profile updated successfully',
    });
  });

  /**
   * POST /api/v1/profiles/me/avatar
   */
  uploadAvatar = catchAsync(async (req, res) => {
    if (!req.file) {
      return ApiResponse.error(res, { message: 'No file uploaded', statusCode: 400 });
    }
    // Use relative path (e.g., "avatars/uuid.jpg")
    const avatarPath = `avatars/${req.file.filename}`;
    const profile = await profilesService.updateAvatar(req.user.id, avatarPath);
    return ApiResponse.success(res, {
      data: { avatarUrl: profile.avatarUrl, path: avatarPath },
      message: 'Avatar uploaded successfully',
    });
  });
}

module.exports = new ProfilesController();

