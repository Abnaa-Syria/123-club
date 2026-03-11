const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination } = require('../../utils/helpers');

class BannersService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.type) where.type = query.type;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
      prisma.banner.count({ where }),
    ]);
    return { banners, total, page, limit };
  }

  async getActiveBanners(type) {
    const where = { isActive: true };
    if (type) where.type = type;
    // Only show banners within valid date range
    const now = new Date();
    where.OR = [
      { startDate: null, endDate: null },
      { startDate: { lte: now }, endDate: null },
      { startDate: null, endDate: { gte: now } },
      { startDate: { lte: now }, endDate: { gte: now } },
    ];

    return prisma.banner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getById(id) {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw AppError.notFound('Banner not found');
    return banner;
  }

  async create(data) {
    return prisma.banner.create({ data });
  }

  async update(id, data) {
    await this.getById(id);
    // Clean data - remove fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, ...cleanData } = data;
    return prisma.banner.update({ where: { id }, data: cleanData });
  }

  async delete(id) {
    await this.getById(id);
    await prisma.banner.delete({ where: { id } });
    return { message: 'Banner deleted' };
  }
}

module.exports = new BannersService();

