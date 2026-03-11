const bannersService = require('./banners.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class BannersController {
  list = catchAsync(async (req, res) => {
    const { banners, total, page, limit } = await bannersService.list(req.query);
    return ApiResponse.paginated(res, { data: banners, page, limit, total });
  });

  getActiveBanners = catchAsync(async (req, res) => {
    const banners = await bannersService.getActiveBanners(req.query.type);
    return ApiResponse.success(res, { data: banners });
  });

  getById = catchAsync(async (req, res) => {
    const banner = await bannersService.getById(req.params.id);
    return ApiResponse.success(res, { data: banner });
  });

  create = catchAsync(async (req, res) => {
    const imageUrl = req.file ? `banners/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body, imageUrl };
    const banner = await bannersService.create(data);
    return ApiResponse.created(res, { data: banner });
  });

  update = catchAsync(async (req, res) => {
    const imageUrl = req.file ? `banners/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body };
    if (imageUrl) data.imageUrl = imageUrl;
    const banner = await bannersService.update(req.params.id, data);
    return ApiResponse.success(res, { data: banner, message: 'Banner updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await bannersService.delete(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new BannersController();

