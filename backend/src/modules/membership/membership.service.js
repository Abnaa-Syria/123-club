const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, createSlug, generateMemberId, addDays } = require('../../utils/helpers');

class MembershipService {
  // ====== PLANS ======

  async listPlans(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
    if (query.level) where.level = query.level;

    const [plans, total] = await Promise.all([
      prisma.membershipPlan.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
      prisma.membershipPlan.count({ where }),
    ]);

    return { plans, total, page, limit };
  }

  async getPlanById(id) {
    const plan = await prisma.membershipPlan.findUnique({ where: { id } });
    if (!plan) throw AppError.notFound('Membership plan not found');
    return plan;
  }

  async createPlan(data) {
    const slug = createSlug(data.name);
    return prisma.membershipPlan.create({
      data: { ...data, slug },
    });
  }

  async updatePlan(id, data) {
    await this.getPlanById(id);
    if (data.name) data.slug = createSlug(data.name);
    return prisma.membershipPlan.update({ where: { id }, data });
  }

  async deletePlan(id) {
    await this.getPlanById(id);
    await prisma.membershipPlan.delete({ where: { id } });
    return { message: 'Plan deleted successfully' };
  }

  // ====== CARDS ======

  async getUserMembership(userId) {
    const card = await prisma.membershipCard.findUnique({
      where: { userId },
      include: { plan: true },
    });
    if (!card) throw AppError.notFound('No membership card found');
    return card;
  }

  async assignMembership(userId, planId) {
    const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
    if (!plan) throw AppError.notFound('Plan not found');

    const existing = await prisma.membershipCard.findUnique({ where: { userId } });

    if (existing) {
      return prisma.membershipCard.update({
        where: { userId },
        data: {
          planId,
          level: plan.level,
          startDate: new Date(),
          endDate: addDays(new Date(), plan.durationDays),
          isActive: true,
        },
      });
    }

    return prisma.membershipCard.create({
      data: {
        userId,
        planId,
        memberId: generateMemberId(),
        level: plan.level,
        startDate: new Date(),
        endDate: addDays(new Date(), plan.durationDays),
      },
    });
  }
}

module.exports = new MembershipService();

