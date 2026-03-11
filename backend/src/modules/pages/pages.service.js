const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, createSlug } = require('../../utils/helpers');

class PagesService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    const [pages, total] = await Promise.all([
      prisma.staticPage.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
      prisma.staticPage.count({ where }),
    ]);
    return { pages, total, page, limit };
  }

  async getBySlug(slug) {
    const page = await prisma.staticPage.findUnique({ where: { slug } });
    if (!page) throw AppError.notFound('Page not found');
    return page;
  }

  async getById(id) {
    const page = await prisma.staticPage.findUnique({ where: { id } });
    if (!page) throw AppError.notFound('Page not found');
    return page;
  }

  async create(data) {
    const slug = createSlug(data.title);
    return prisma.staticPage.create({ data: { ...data, slug } });
  }

  async update(id, data) {
    await this.getById(id);
    if (data.title) data.slug = createSlug(data.title);
    return prisma.staticPage.update({ where: { id }, data });
  }

  async delete(id) {
    await this.getById(id);
    await prisma.staticPage.delete({ where: { id } });
    return { message: 'Page deleted' };
  }
}

module.exports = new PagesService();

