const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, parseSorting, createSlug } = require('../../utils/helpers');

class ProductsService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSorting(query, ['createdAt', 'name', 'pointsCost', 'sortOrder']);

    const where = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
    if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured === 'true';
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: limit, orderBy,
        include: { category: { select: { id: true, name: true } } },
      }),
      prisma.product.count({ where }),
    ]);
    return { products, total, page, limit };
  }

  async getById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw AppError.notFound('Product not found');
    return product;
  }

  async create(data) {
    const slug = createSlug(data.name);
    return prisma.product.create({
      data: { ...data, slug },
      include: { category: true },
    });
  }

  async update(id, data) {
    await this.getById(id);
    
    // Clean data - remove fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, category, cartItems, orderItems, ...cleanData } = data;
    
    // Generate slug if name changed
    if (cleanData.name) {
      cleanData.slug = createSlug(cleanData.name);
    }
    
    return prisma.product.update({
      where: { id },
      data: cleanData,
      include: { category: true },
    });
  }

  async delete(id) {
    await this.getById(id);
    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted' };
  }
}

module.exports = new ProductsService();

