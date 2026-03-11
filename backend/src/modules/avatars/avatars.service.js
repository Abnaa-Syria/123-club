const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination } = require('../../utils/helpers');

class AvatarsService {
  async listAvatars(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    const [avatars, total] = await Promise.all([
      prisma.avatar.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
      prisma.avatar.count({ where }),
    ]);
    return { avatars, total, page, limit };
  }

  async getAvatarById(id) {
    const avatar = await prisma.avatar.findUnique({ where: { id } });
    if (!avatar) throw AppError.notFound('Avatar not found');
    return avatar;
  }

  async createAvatar(data) {
    return prisma.avatar.create({ data });
  }

  async updateAvatar(id, data) {
    await this.getAvatarById(id);
    // Clean data - remove fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, userAvatars, ...cleanData } = data;
    return prisma.avatar.update({ where: { id }, data: cleanData });
  }

  async deleteAvatar(id) {
    await this.getAvatarById(id);
    await prisma.avatar.delete({ where: { id } });
    return { message: 'Avatar deleted' };
  }

  async selectAvatar(userId, avatarId) {
    await this.getAvatarById(avatarId);
    const existing = await prisma.userAvatar.findUnique({ where: { userId } });

    if (existing) {
      return prisma.userAvatar.update({
        where: { userId },
        data: { avatarId },
      });
    }

    return prisma.userAvatar.create({
      data: { userId, avatarId },
    });
  }

  async getMyAvatar(userId) {
    const userAvatar = await prisma.userAvatar.findUnique({
      where: { userId },
      include: { avatar: true },
    });
    return userAvatar;
  }
}

module.exports = new AvatarsService();

