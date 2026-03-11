const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, createSlug } = require('../../utils/helpers');

class CategoriesService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.type) where.type = query.type;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
    if (query.search) where.name = { contains: query.search };

    const [categories, total] = await Promise.all([
      prisma.contentCategory.findMany({
        where, skip, take: limit,
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { contentItems: true } } },
      }),
      prisma.contentCategory.count({ where }),
    ]);
    return { categories, total, page, limit };
  }

  async getById(id) {
    const category = await prisma.contentCategory.findUnique({
      where: { id },
      include: { _count: { select: { contentItems: true } } },
    });
    if (!category) throw AppError.notFound('Category not found');
    return category;
  }

  async create(data) {
    const slug = createSlug(data.name);
    return prisma.contentCategory.create({ data: { ...data, slug } });
  }

  async update(id, data) {
    await this.getById(id);
    // Clean data - remove fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, contentItems, _count, ...cleanData } = data;
    
    // Generate slug if name changed
    if (cleanData.name) {
      cleanData.slug = createSlug(cleanData.name);
    }
    
    return prisma.contentCategory.update({ where: { id }, data: cleanData });
  }

  async delete(id) {
    await this.getById(id);
    await prisma.contentCategory.delete({ where: { id } });
    return { message: 'Category deleted' };
  }
}

module.exports = new CategoriesService();

