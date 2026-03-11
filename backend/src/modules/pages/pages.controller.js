const pagesService = require('./pages.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class PagesController {
  list = catchAsync(async (req, res) => {
    const { pages, total, page, limit } = await pagesService.list(req.query);
    return ApiResponse.paginated(res, { data: pages, page, limit, total });
  });

  getBySlug = catchAsync(async (req, res) => {
    const page = await pagesService.getBySlug(req.params.slug);
    return ApiResponse.success(res, { data: page });
  });

  getById = catchAsync(async (req, res) => {
    const page = await pagesService.getById(req.params.id);
    return ApiResponse.success(res, { data: page });
  });

  create = catchAsync(async (req, res) => {
    const page = await pagesService.create(req.body);
    return ApiResponse.created(res, { data: page });
  });

  update = catchAsync(async (req, res) => {
    const page = await pagesService.update(req.params.id, req.body);
    return ApiResponse.success(res, { data: page, message: 'Page updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await pagesService.delete(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new PagesController();

