const bcrypt = require('bcryptjs');
const prisma = require('../../config/database');
const config = require('../../config');
const AppError = require('../../utils/AppError');
const { parsePagination, parseSorting } = require('../../utils/helpers');

class UsersService {
  /**
   * List all users with pagination, filtering, search
   */
  async listUsers(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSorting(query, ['createdAt', 'email']);

    const where = {};

    // Filter by role
    if (query.role) {
      where.role = query.role;
    }

    // Filter by status
    if (query.status) {
      where.status = query.status;
    }

    // Search by email or name
    if (query.search) {
      where.OR = [
        { email: { contains: query.search } },
        { profile: { firstName: { contains: query.search } } },
        { profile: { lastName: { contains: query.search } } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              avatarUrl: true,
              gender: true,
            },
          },
          membershipCard: {
            select: {
              memberId: true,
              level: true,
              isActive: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  /**
   * Get user by ID with full details
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        childProfile: true,
        parentProfile: true,
        teacherProfile: true,
        schoolProfile: true,
        membershipCard: { include: { plan: true } },
        pointsWallet: true,
        selectedAvatar: { include: { avatar: true } },
      },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Suspend user
   */
  async suspendUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');
    if (user.role === 'SUPER_ADMIN') throw AppError.forbidden('Cannot suspend admin');

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    });

    // Invalidate refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId } });

    return { message: 'User suspended successfully' };
  }

  /**
   * Activate user
   */
  async activateUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });

    return { message: 'User activated successfully' };
  }

  /**
   * Soft delete user
   */
  async deleteUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');
    if (user.role === 'SUPER_ADMIN') throw AppError.forbidden('Cannot delete admin');

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'DELETED' },
    });

    await prisma.refreshToken.deleteMany({ where: { userId } });

    return { message: 'User deleted successfully' };
  }
}

module.exports = new UsersService();

