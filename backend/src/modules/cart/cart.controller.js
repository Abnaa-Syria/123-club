const cartService = require('./cart.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class CartController {
  getCart = catchAsync(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    return ApiResponse.success(res, { data: cart });
  });

  addItem = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addItem(req.user.id, productId, quantity || 1);
    return ApiResponse.success(res, { data: cart, message: 'Item added to cart' });
  });

  updateItem = catchAsync(async (req, res) => {
    const { quantity } = req.body;
    const cart = await cartService.updateItemQuantity(req.user.id, req.params.itemId, quantity);
    return ApiResponse.success(res, { data: cart, message: 'Cart updated' });
  });

  removeItem = catchAsync(async (req, res) => {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    return ApiResponse.success(res, { data: cart, message: 'Item removed' });
  });

  clearCart = catchAsync(async (req, res) => {
    const result = await cartService.clearCart(req.user.id);
    return ApiResponse.success(res, { data: result });
  });
}

module.exports = new CartController();

