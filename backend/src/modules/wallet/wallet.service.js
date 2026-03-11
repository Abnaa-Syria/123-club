const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination } = require('../../utils/helpers');

class WalletService {
  /**
   * Get wallet summary for a user
   */
  async getWalletSummary(userId) {
    let wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.pointsWallet.create({
        data: { userId, currentBalance: 0, totalEarned: 0, totalRedeemed: 0 },
      });
    }
    return wallet;
  }

  /**
   * Get points transaction history
   */
  async getPointsHistory(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) throw AppError.notFound('Wallet not found');

    const where = { walletId: wallet.id };
    if (query.type) where.type = query.type;

    const [transactions, total] = await Promise.all([
      prisma.pointsTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pointsTransaction.count({ where }),
    ]);

    return { transactions, total, page, limit };
  }

  /**
   * Admin: Add points to a user
   */
  async addPoints(userId, amount, description = 'Admin added points') {
    const wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) throw AppError.notFound('Wallet not found');

    const updated = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.pointsWallet.update({
        where: { id: wallet.id },
        data: {
          currentBalance: { increment: amount },
          totalEarned: { increment: amount },
        },
      });

      await tx.pointsTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'ADMIN_ADD',
          amount,
          balanceAfter: updatedWallet.currentBalance,
          description,
        },
      });

      return updatedWallet;
    });

    return updated;
  }

  /**
   * Admin: Deduct points from a user
   */
  async deductPoints(userId, amount, description = 'Admin deducted points') {
    const wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) throw AppError.notFound('Wallet not found');

    if (wallet.currentBalance < amount) {
      throw AppError.badRequest('Insufficient points balance');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.pointsWallet.update({
        where: { id: wallet.id },
        data: {
          currentBalance: { decrement: amount },
          totalRedeemed: { increment: amount },
        },
      });

      await tx.pointsTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'ADMIN_DEDUCT',
          amount: -amount,
          balanceAfter: updatedWallet.currentBalance,
          description,
        },
      });

      return updatedWallet;
    });

    return updated;
  }

  /**
   * Admin: Get wallet details for any user
   */
  async getWalletByUserId(userId, query) {
    const wallet = await prisma.pointsWallet.findUnique({ where: { userId } });
    if (!wallet) throw AppError.notFound('Wallet not found');

    const { page, limit, skip } = parsePagination(query);
    const where = { walletId: wallet.id };

    const [transactions, total] = await Promise.all([
      prisma.pointsTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pointsTransaction.count({ where }),
    ]);

    return { wallet, transactions, total, page, limit };
  }

  /**
   * Admin: Get wallet by membership card memberId (CLB-...)
   */
  async getWalletByMemberId(memberId, query) {
    const card = await prisma.membershipCard.findUnique({ where: { memberId } });
    if (!card) throw AppError.notFound('Membership card not found');
    return this.getWalletByUserId(card.userId, query);
  }
}

module.exports = new WalletService();

