const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination } = require('../../utils/helpers');

class NotificationsService {
  async getUserNotifications(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const where = { userId };
    if (query.isRead !== undefined) where.isRead = query.isRead === 'true';
    if (query.type) where.type = query.type;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, page, limit, unreadCount };
  }

  async markAsRead(userId, notificationId) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!notification) throw AppError.notFound('Notification not found');

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'All notifications marked as read' };
  }

  async sendNotification(data) {
    return prisma.notification.create({ data });
  }

  async sendBulkNotification(userIds, title, body, type = 'SYSTEM', data = null) {
    const notifications = userIds.map((userId) => ({
      userId,
      type,
      title,
      body,
      data,
    }));

    await prisma.notification.createMany({ data: notifications });
    return { message: `Notification sent to ${userIds.length} users` };
  }

  async adminSendToAll(title, body, type = 'SYSTEM', roleFilter = null) {
    const where = { status: 'ACTIVE' };
    if (roleFilter) where.role = roleFilter;

    const users = await prisma.user.findMany({
      where,
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);
    return this.sendBulkNotification(userIds, title, body, type);
  }

  async deleteNotification(userId, notificationId) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!notification) throw AppError.notFound('Notification not found');

    await prisma.notification.delete({ where: { id: notificationId } });
    return { message: 'Notification deleted' };
  }
}

module.exports = new NotificationsService();

