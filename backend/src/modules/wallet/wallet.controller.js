const walletService = require('./wallet.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class WalletController {
  getMyWallet = catchAsync(async (req, res) => {
    const wallet = await walletService.getWalletSummary(req.user.id);
    return ApiResponse.success(res, { data: wallet, message: 'Wallet fetched' });
  });

  getMyPointsHistory = catchAsync(async (req, res) => {
    const { transactions, total, page, limit } = await walletService.getPointsHistory(req.user.id, req.query);
    return ApiResponse.paginated(res, { data: transactions, page, limit, total });
  });

  adminAddPoints = catchAsync(async (req, res) => {
    const { amount, description } = req.body;
    const wallet = await walletService.addPoints(req.params.userId, amount, description);
    return ApiResponse.success(res, { data: wallet, message: 'Points added' });
  });

  adminDeductPoints = catchAsync(async (req, res) => {
    const { amount, description } = req.body;
    const wallet = await walletService.deductPoints(req.params.userId, amount, description);
    return ApiResponse.success(res, { data: wallet, message: 'Points deducted' });
  });

  adminGetWallet = catchAsync(async (req, res) => {
    const { wallet } = await walletService.getWalletByUserId(req.params.userId, {});

    const summary = {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.currentBalance,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalRedeemed,
      totalExpired: wallet.totalExpired,
    };

    return ApiResponse.success(res, { data: summary, message: 'Wallet fetched' });
  });

  adminGetTransactions = catchAsync(async (req, res) => {
    const result = await walletService.getWalletByUserId(req.params.userId, req.query);
    return ApiResponse.paginated(res, {
      data: result.transactions,
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  });

  adminGetWalletByMemberId = catchAsync(async (req, res) => {
    const { wallet } = await walletService.getWalletByMemberId(req.params.memberId, {});

    const summary = {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.currentBalance,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalRedeemed,
      totalExpired: wallet.totalExpired,
    };

    return ApiResponse.success(res, { data: summary, message: 'Wallet fetched' });
  });

  adminGetTransactionsByMemberId = catchAsync(async (req, res) => {
    const result = await walletService.getWalletByMemberId(req.params.memberId, req.query);
    return ApiResponse.paginated(res, {
      data: result.transactions,
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  });
}

module.exports = new WalletController();

