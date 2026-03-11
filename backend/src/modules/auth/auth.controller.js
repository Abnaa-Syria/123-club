const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, {
      data: result,
      message: 'Registration successful',
    });
  });

  /**
   * POST /api/v1/auth/login
   */
  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return ApiResponse.success(res, {
      data: result,
      message: 'Login successful',
    });
  });

  /**
   * POST /api/v1/auth/refresh-token
   */
  refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    return ApiResponse.success(res, {
      data: tokens,
      message: 'Token refreshed successfully',
    });
  });

  /**
   * POST /api/v1/auth/logout
   */
  logout = catchAsync(async (req, res) => {
    await authService.logout(req.user.id, req.body.refreshToken);
    return ApiResponse.success(res, { message: 'Logged out successfully' });
  });

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword = catchAsync(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    return ApiResponse.success(res, { data: result });
  });

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return ApiResponse.success(res, { data: result });
  });

  /**
   * POST /api/v1/auth/change-password
   */
  changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    return ApiResponse.success(res, { data: result });
  });

  /**
   * GET /api/v1/auth/me
   */
  getMe = catchAsync(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);
    return ApiResponse.success(res, {
      data: user,
      message: 'Profile fetched successfully',
    });
  });

  /**
   * PUT /api/v1/auth/profile
   */
  updateProfile = catchAsync(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, {
      data: user,
      message: 'Profile updated successfully',
    });
  });
}

module.exports = new AuthController();

