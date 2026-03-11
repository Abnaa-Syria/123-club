const referralsService = require('./referrals.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class ReferralsController {
  getMyReferralCode = catchAsync(async (req, res) => {
    const referral = await referralsService.getMyReferralCode(req.user.id);
    return ApiResponse.success(res, { data: referral });
  });

  getMyReferrals = catchAsync(async (req, res) => {
    const { referrals, total, page, limit } = await referralsService.getMyReferrals(req.user.id, req.query);
    return ApiResponse.paginated(res, { data: referrals, page, limit, total });
  });

  adminListReferrals = catchAsync(async (req, res) => {
    const { referrals, total, page, limit } = await referralsService.listAllReferrals(req.query);
    return ApiResponse.paginated(res, { data: referrals, page, limit, total });
  });
}

module.exports = new ReferralsController();

