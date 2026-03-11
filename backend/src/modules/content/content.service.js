const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, parseSorting, createSlug } = require('../../utils/helpers');

class ContentService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSorting(query, ['createdAt', 'title', 'viewCount', 'sortOrder']);

    const where = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured === 'true';
    if (query.isRecommended !== undefined) where.isRecommended = query.isRecommended === 'true';
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { author: { contains: query.search } },
      ];
    }
    if (query.ageGroup) {
      const age = parseInt(query.ageGroup, 10);
      where.ageGroupMin = { lte: age };
      where.ageGroupMax = { gte: age };
    }

    // For public API, only show published content
    if (query._public) {
      where.status = 'PUBLISHED';
    }

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where, skip, take: limit, orderBy,
        include: { category: { select: { id: true, name: true, type: true } } },
      }),
      prisma.contentItem.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getById(id) {
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) throw AppError.notFound('Content not found');

    // Increment view count
    await prisma.contentItem.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return item;
  }

  async getFeatured(limit = 10) {
    return prisma.contentItem.findMany({
      where: { isFeatured: true, status: 'PUBLISHED' },
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: { category: { select: { id: true, name: true, type: true } } },
    });
  }

  async getRecommended(limit = 10) {
    return prisma.contentItem.findMany({
      where: { isRecommended: true, status: 'PUBLISHED' },
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: { category: { select: { id: true, name: true, type: true } } },
    });
  }

  async create(data) {
    const slug = createSlug(data.title);
    return prisma.contentItem.create({
      data: { ...data, slug },
      include: { category: true },
    });
  }

  async update(id, data) {
    await this.getById(id);
    // Clean data - remove fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, category, viewCount, publishedAt, ...cleanData } = data;
    
    // Generate slug if title changed
    if (cleanData.title) {
      cleanData.slug = createSlug(cleanData.title);
    }
    
    return prisma.contentItem.update({
      where: { id },
      data: cleanData,
      include: { category: true },
    });
  }

  async delete(id) {
    await prisma.contentItem.findUnique({ where: { id } });
    await prisma.contentItem.delete({ where: { id } });
    return { message: 'Content deleted' };
  }
}

module.exports = new ContentService();

