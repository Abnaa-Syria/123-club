const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, createSlug } = require('../../utils/helpers');

class ProductCategoriesService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
    if (query.search) where.name = { contains: query.search };

    const [categories, total] = await Promise.all([
      prisma.productCategory.findMany({
        where, skip, take: limit,
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.productCategory.count({ where }),
    ]);
    return { categories, total, page, limit };
  }

  async getById(id) {
    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw AppError.notFound('Product category not found');
    return category;
  }

  async create(data) {
    const slug = createSlug(data.name);
    return prisma.productCategory.create({ data: { ...data, slug } });
  }

  async update(id, data) {
    await this.getById(id);
    // Clean data - remove fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, products, _count, ...cleanData } = data;
    
    // Generate slug if name changed
    if (cleanData.name) {
      cleanData.slug = createSlug(cleanData.name);
    }
    
    return prisma.productCategory.update({ where: { id }, data: cleanData });
  }

  async delete(id) {
    await this.getById(id);
    await prisma.productCategory.delete({ where: { id } });
    return { message: 'Product category deleted' };
  }
}

module.exports = new ProductCategoriesService();

