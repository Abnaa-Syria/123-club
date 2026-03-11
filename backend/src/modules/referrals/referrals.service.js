const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, generateReferralCode } = require('../../utils/helpers');

class ReferralsService {
  async getMyReferralCode(userId) {
    let referral = await prisma.referral.findFirst({
      where: { referrerId: userId, isUsed: false, referredId: null },
    });

    if (!referral) {
      referral = await prisma.referral.create({
        data: {
          referrerId: userId,
          referralCode: generateReferralCode(),
          rewardPoints: 50,
        },
      });
    }

    return referral;
  }

  async getMyReferrals(userId, query) {
    const { page, limit, skip } = parsePagination(query);

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where: { referrerId: userId, isUsed: true },
        skip, take: limit,
        orderBy: { usedAt: 'desc' },
        include: {
          referred: {
            select: {
              id: true, email: true,
              profile: { select: { firstName: true, lastName: true } },
            },
          },
        },
      }),
      prisma.referral.count({ where: { referrerId: userId, isUsed: true } }),
    ]);

    return { referrals, total, page, limit };
  }

  // Admin
  async listAllReferrals(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.isUsed !== undefined) where.isUsed = query.isUsed === 'true';

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          referrer: {
            select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
          },
          referred: {
            select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
          },
        },
      }),
      prisma.referral.count({ where }),
    ]);

    return { referrals, total, page, limit };
  }
}

module.exports = new ReferralsService();

