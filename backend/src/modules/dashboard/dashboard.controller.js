const dashboardService = require('./dashboard.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class DashboardController {
  getOverview = catchAsync(async (req, res) => {
    const stats = await dashboardService.getOverviewStats();
    return ApiResponse.success(res, { data: stats, message: 'Dashboard overview' });
  });

  getRecentRegistrations = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const users = await dashboardService.getRecentRegistrations(limit);
    return ApiResponse.success(res, { data: users });
  });

  getRecentOrders = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const orders = await dashboardService.getRecentOrders(limit);
    return ApiResponse.success(res, { data: orders });
  });

  getRecentActivities = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const activities = await dashboardService.getRecentActivities(limit);
    return ApiResponse.success(res, { data: activities });
  });
}

module.exports = new DashboardController();

