const notificationsService = require('./notifications.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class NotificationsController {
  getMyNotifications = catchAsync(async (req, res) => {
    const { notifications, total, page, limit, unreadCount } = await notificationsService.getUserNotifications(req.user.id, req.query);
    return ApiResponse.paginated(res, {
      data: { notifications, unreadCount },
      page, limit, total,
    });
  });

  markAsRead = catchAsync(async (req, res) => {
    const notification = await notificationsService.markAsRead(req.user.id, req.params.id);
    return ApiResponse.success(res, { data: notification });
  });

  markAllAsRead = catchAsync(async (req, res) => {
    const result = await notificationsService.markAllAsRead(req.user.id);
    return ApiResponse.success(res, { data: result });
  });

  deleteNotification = catchAsync(async (req, res) => {
    const result = await notificationsService.deleteNotification(req.user.id, req.params.id);
    return ApiResponse.success(res, { data: result });
  });

  // Admin
  adminSendNotification = catchAsync(async (req, res) => {
    const { userId, title, body, type } = req.body;
    const notification = await notificationsService.sendNotification({
      userId, title, body, type: type || 'SYSTEM',
    });
    return ApiResponse.created(res, { data: notification, message: 'Notification sent' });
  });

  adminSendToAll = catchAsync(async (req, res) => {
    const { title, body, type, roleFilter } = req.body;
    const result = await notificationsService.adminSendToAll(title, body, type, roleFilter);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new NotificationsController();

