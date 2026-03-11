const ordersService = require('./orders.service');
const ApiResponse = require('../../utils/apiResponse');
const catchAsync = require('../../utils/catchAsync');

class OrdersController {
  createOrder = catchAsync(async (req, res) => {
    const order = await ordersService.createOrder(req.user.id, req.body.notes);
    return ApiResponse.created(res, { data: order, message: 'Order placed successfully' });
  });

  getMyOrders = catchAsync(async (req, res) => {
    const { orders, total, page, limit } = await ordersService.getUserOrders(req.user.id, req.query);
    return ApiResponse.paginated(res, { data: orders, page, limit, total });
  });

  getMyOrderById = catchAsync(async (req, res) => {
    const order = await ordersService.getOrderById(req.params.id, req.user.id);
    return ApiResponse.success(res, { data: order });
  });

  // Admin
  listAllOrders = catchAsync(async (req, res) => {
    const { orders, total, page, limit } = await ordersService.listAllOrders(req.query);
    return ApiResponse.paginated(res, { data: orders, page, limit, total });
  });

  getOrderById = catchAsync(async (req, res) => {
    const order = await ordersService.getOrderById(req.params.id);
    return ApiResponse.success(res, { data: order });
  });

  updateOrderStatus = catchAsync(async (req, res) => {
    const order = await ordersService.updateOrderStatus(req.params.id, req.body.status);
    return ApiResponse.success(res, { data: order, message: 'Order status updated' });
  });
}

module.exports = new OrdersController();

