const membershipService = require('./membership.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class MembershipController {
  // ====== PLANS ======

  listPlans = catchAsync(async (req, res) => {
    const { plans, total, page, limit } = await membershipService.listPlans(req.query);
    return ApiResponse.paginated(res, { data: plans, page, limit, total, message: 'Plans fetched' });
  });

  getPlanById = catchAsync(async (req, res) => {
    const plan = await membershipService.getPlanById(req.params.id);
    return ApiResponse.success(res, { data: plan });
  });

  createPlan = catchAsync(async (req, res) => {
    const plan = await membershipService.createPlan(req.body);
    return ApiResponse.created(res, { data: plan, message: 'Plan created' });
  });

  updatePlan = catchAsync(async (req, res) => {
    const plan = await membershipService.updatePlan(req.params.id, req.body);
    return ApiResponse.success(res, { data: plan, message: 'Plan updated' });
  });

  deletePlan = catchAsync(async (req, res) => {
    const result = await membershipService.deletePlan(req.params.id);
    return ApiResponse.success(res, { data: result });
  });

  // ====== CARDS ======

  getMyMembership = catchAsync(async (req, res) => {
    const card = await membershipService.getUserMembership(req.user.id);
    return ApiResponse.success(res, { data: card });
  });

  assignMembership = catchAsync(async (req, res) => {
    const card = await membershipService.assignMembership(req.params.userId, req.body.planId);
    return ApiResponse.success(res, { data: card, message: 'Membership assigned' });
  });
}

module.exports = new MembershipController();

