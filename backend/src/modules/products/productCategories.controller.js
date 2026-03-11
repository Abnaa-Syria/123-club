const productCategoriesService = require('./productCategories.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class ProductCategoriesController {
  list = catchAsync(async (req, res) => {
    const { categories, total, page, limit } = await productCategoriesService.list(req.query);
    return ApiResponse.paginated(res, { data: categories, page, limit, total });
  });

  getById = catchAsync(async (req, res) => {
    const category = await productCategoriesService.getById(req.params.id);
    return ApiResponse.success(res, { data: category });
  });

  create = catchAsync(async (req, res) => {
    const imageUrl = req.file ? `categories/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body, imageUrl };
    const category = await productCategoriesService.create(data);
    return ApiResponse.created(res, { data: category });
  });

  update = catchAsync(async (req, res) => {
    const imageUrl = req.file ? `categories/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body };
    if (imageUrl) data.imageUrl = imageUrl;
    const category = await productCategoriesService.update(req.params.id, data);
    return ApiResponse.success(res, { data: category, message: 'Category updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await productCategoriesService.delete(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new ProductCategoriesController();

