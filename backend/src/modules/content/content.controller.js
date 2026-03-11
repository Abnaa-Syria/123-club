const contentService = require('./content.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class ContentController {
  list = catchAsync(async (req, res) => {
    const { items, total, page, limit } = await contentService.list(req.query);
    return ApiResponse.paginated(res, { data: items, page, limit, total });
  });

  listPublic = catchAsync(async (req, res) => {
    req.query._public = true;
    const { items, total, page, limit } = await contentService.list(req.query);
    return ApiResponse.paginated(res, { data: items, page, limit, total });
  });

  getById = catchAsync(async (req, res) => {
    const item = await contentService.getById(req.params.id);
    return ApiResponse.success(res, { data: item });
  });

  getFeatured = catchAsync(async (req, res) => {
    const items = await contentService.getFeatured(parseInt(req.query.limit, 10) || 10);
    return ApiResponse.success(res, { data: items });
  });

  getRecommended = catchAsync(async (req, res) => {
    const items = await contentService.getRecommended(parseInt(req.query.limit, 10) || 10);
    return ApiResponse.success(res, { data: items });
  });

  create = catchAsync(async (req, res) => {
    const thumbnailUrl = req.file ? `content/${req.file.filename}` : req.body.thumbnailUrl;
    const data = { ...req.body, thumbnailUrl };
    const item = await contentService.create(data);
    return ApiResponse.created(res, { data: item });
  });

  update = catchAsync(async (req, res) => {
    const thumbnailUrl = req.file ? `content/${req.file.filename}` : req.body.thumbnailUrl;
    const data = { ...req.body };
    if (thumbnailUrl) data.thumbnailUrl = thumbnailUrl;
    const item = await contentService.update(req.params.id, data);
    return ApiResponse.success(res, { data: item, message: 'Content updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await contentService.delete(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new ContentController();

