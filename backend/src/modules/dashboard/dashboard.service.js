const prisma = require('../../config/database');

class DashboardService {
  async getOverviewStats() {
    const [
      totalUsers,
      usersByRole,
      activeUsers,
      suspendedUsers,
      activeMemberships,
      totalOrders,
      ordersByStatus,
      totalProducts,
      totalContentItems,
      totalPointsIssued,
      totalPointsRedeemed,
      totalReferrals,
    ] = await Promise.all([
      prisma.user.count({ where: { status: { not: 'DELETED' } } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
        where: { status: { not: 'DELETED' } },
      }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.membershipCard.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.contentItem.count({ where: { status: 'PUBLISHED' } }),
      prisma.pointsWallet.aggregate({ _sum: { totalEarned: true } }),
      prisma.pointsWallet.aggregate({ _sum: { totalRedeemed: true } }),
      prisma.referral.count({ where: { isUsed: true } }),
    ]);

    // Format usersByRole
    const rolesMap = {};
    usersByRole.forEach((item) => { rolesMap[item.role] = item._count.id; });

    // Format ordersByStatus
    const ordersStatusMap = {};
    ordersByStatus.forEach((item) => { ordersStatusMap[item.status] = item._count.id; });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        byRole: rolesMap,
      },
      memberships: {
        active: activeMemberships,
      },
      points: {
        totalIssued: totalPointsIssued._sum.totalEarned || 0,
        totalRedeemed: totalPointsRedeemed._sum.totalRedeemed || 0,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersStatusMap,
      },
      products: {
        total: totalProducts,
      },
      content: {
        total: totalContentItems,
      },
      referrals: {
        total: totalReferrals,
      },
    };
  }

  async getRecentRegistrations(limit = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        profile: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });
  }

  async getRecentOrders(limit = 10) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true, email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { items: true } },
      },
    });
  }

  async getRecentActivities(limit = 20) {
    return prisma.adminActivityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
        },
      },
    });
  }

  async logActivity(userId, action, entity = null, entityId = null, details = null, ipAddress = null) {
    return prisma.adminActivityLog.create({
      data: { userId, action, entity, entityId, details, ipAddress },
    });
  }
}

module.exports = new DashboardService();

