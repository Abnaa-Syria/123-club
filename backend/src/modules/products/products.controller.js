const productsService = require('./products.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class ProductsController {
  list = catchAsync(async (req, res) => {
    const { products, total, page, limit } = await productsService.list(req.query);
    return ApiResponse.paginated(res, { data: products, page, limit, total });
  });

  getById = catchAsync(async (req, res) => {
    const product = await productsService.getById(req.params.id);
    return ApiResponse.success(res, { data: product });
  });

  create = catchAsync(async (req, res) => {
    const imageUrl = req.file ? `products/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body, imageUrl };
    const product = await productsService.create(data);
    return ApiResponse.created(res, { data: product });
  });

  update = catchAsync(async (req, res) => {
    const imageUrl = req.file ? `products/${req.file.filename}` : req.body.imageUrl;
    const data = { ...req.body };
    if (imageUrl) data.imageUrl = imageUrl;
    const product = await productsService.update(req.params.id, data);
    return ApiResponse.success(res, { data: product, message: 'Product updated' });
  });

  delete = catchAsync(async (req, res) => {
    const result = await productsService.delete(req.params.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new ProductsController();

