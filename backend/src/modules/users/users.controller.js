const usersService = require('./users.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class UsersController {
  /**
   * GET /api/v1/users
   */
  listUsers = catchAsync(async (req, res) => {
    const { users, total, page, limit } = await usersService.listUsers(req.query);
    return ApiResponse.paginated(res, {
      data: users,
      page,
      limit,
      total,
      message: 'Users fetched successfully',
    });
  });

  /**
   * GET /api/v1/users/:id
   */
  getUserById = catchAsync(async (req, res) => {
    const user = await usersService.getUserById(req.params.id);
    return ApiResponse.success(res, {
      data: user,
      message: 'User fetched successfully',
    });
  });

  /**
   * PATCH /api/v1/users/:id/suspend
   */
  suspendUser = catchAsync(async (req, res) => {
    const result = await usersService.suspendUser(req.params.id);
    return ApiResponse.success(res, { data: result });
  });

  /**
   * PATCH /api/v1/users/:id/activate
   */
  activateUser = catchAsync(async (req, res) => {
    const result = await usersService.activateUser(req.params.id);
    return ApiResponse.success(res, { data: result });
  });

  /**
   * DELETE /api/v1/users/:id
   */
  deleteUser = catchAsync(async (req, res) => {
    const result = await usersService.deleteUser(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new UsersController();

