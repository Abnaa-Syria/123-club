const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, generateOrderNumber } = require('../../utils/helpers');

class OrdersService {
  /**
   * Create order from cart (transactional)
   */
  async createOrder(userId, notes) {
    return prisma.$transaction(async (tx) => {
      // Get user cart with items
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw AppError.badRequest('Cart is empty');
      }

      // Validate all items
      let totalPoints = 0;
      const orderItems = [];

      for (const item of cart.items) {
        if (!item.product.isActive) {
          throw AppError.badRequest(`Product "${item.product.name}" is no longer available`);
        }
        if (item.product.stockQuantity < item.quantity) {
          throw AppError.badRequest(`Insufficient stock for "${item.product.name}"`);
        }
        totalPoints += item.product.pointsCost * item.quantity;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          pointsCost: item.product.pointsCost * item.quantity,
        });
      }

      // Check wallet balance
      const wallet = await tx.pointsWallet.findUnique({ where: { userId } });
      if (!wallet || wallet.currentBalance < totalPoints) {
        throw AppError.badRequest('Insufficient points balance');
      }

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          status: 'PENDING',
          totalPoints,
          itemCount: orderItems.length,
          notes: notes || null,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      // Deduct points
      const updatedWallet = await tx.pointsWallet.update({
        where: { userId },
        data: {
          currentBalance: { decrement: totalPoints },
          totalRedeemed: { increment: totalPoints },
        },
      });

      // Record transaction
      await tx.pointsTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'REDEEMED',
          amount: -totalPoints,
          balanceAfter: updatedWallet.currentBalance,
          description: `Order ${order.orderNumber}`,
          referenceId: order.id,
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          type: 'ORDER_UPDATE',
          title: 'Order Placed',
          body: `Your order ${order.orderNumber} has been placed successfully.`,
          data: { orderId: order.id },
        },
      });

      return order;
    });
  }

  /**
   * List user's orders
   */
  async getUserOrders(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const where = { userId };
    if (query.status) where.status = query.status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: { select: { id: true, name: true, imageUrl: true, pointsCost: true } } },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  /**
   * Get order details
   */
  async getOrderById(orderId, userId = null) {
    const where = { id: orderId };
    if (userId) where.userId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        items: { include: { product: true } },
      },
    });

    if (!order) throw AppError.notFound('Order not found');
    return order;
  }

  /**
   * Admin: List all orders
   */
  async listAllOrders(query) {
    const { page, limit, skip } = parsePagination(query);
    const where = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;
    if (query.search) {
      where.orderNumber = { contains: query.search };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          _count: { select: { items: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  /**
   * Admin: Update order status
   */
  async updateOrderStatus(orderId, status) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw AppError.notFound('Order not found');

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true } } },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: 'ORDER_UPDATE',
        title: 'Order Status Updated',
        body: `Your order ${order.orderNumber} has been updated to ${status}.`,
        data: { orderId: order.id, status },
      },
    });

    // If cancelled, refund points
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      const wallet = await prisma.pointsWallet.findUnique({ where: { userId: order.userId } });
      if (wallet) {
        const updatedWallet = await prisma.pointsWallet.update({
          where: { id: wallet.id },
          data: {
            currentBalance: { increment: order.totalPoints },
            totalRedeemed: { decrement: order.totalPoints },
          },
        });

        await prisma.pointsTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'EARNED',
            amount: order.totalPoints,
            balanceAfter: updatedWallet.currentBalance,
            description: `Refund for cancelled order ${order.orderNumber}`,
            referenceId: order.id,
          },
        });
      }
    }

    return updated;
  }
}

module.exports = new OrdersService();

