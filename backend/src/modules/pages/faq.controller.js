const faqService = require('./faq.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class FAQController {
  list = catchAsync(async (req, res) => {
    const { faqs, total, page, limit } = await faqService.list(req.query);
    return ApiResponse.paginated(res, { data: faqs, page, limit, total });
  });

  getById = catchAsync(async (req, res) => {
    const faq = await faqService.getById(req.params.id);
    return ApiResponse.success(res, { data: faq });
  });

  create = catchAsync(async (req, res) => {
    const faq = await faqService.create(req.body);
    return ApiResponse.created(res, { data: faq });
  });

  update = catchAsync(async (req, res) => {
    const faq = await faqService.update(req.params.id, req.body);
    return ApiResponse.success(res, { data: faq, message: 'FAQ updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await faqService.delete(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new FAQController();

