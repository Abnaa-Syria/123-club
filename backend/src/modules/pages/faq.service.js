const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination } = require('../../utils/helpers');

class FAQService {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
    if (query.search) {
      where.OR = [
        { question: { contains: query.search } },
        { answer: { contains: query.search } },
      ];
    }

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
      prisma.fAQ.count({ where }),
    ]);
    return { faqs, total, page, limit };
  }

  async getById(id) {
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    if (!faq) throw AppError.notFound('FAQ not found');
    return faq;
  }

  async create(data) {
    return prisma.fAQ.create({ data });
  }

  async update(id, data) {
    await this.getById(id);
    return prisma.fAQ.update({ where: { id }, data });
  }

  async delete(id) {
    await this.getById(id);
    await prisma.fAQ.delete({ where: { id } });
    return { message: 'FAQ deleted' };
  }
}

module.exports = new FAQService();

