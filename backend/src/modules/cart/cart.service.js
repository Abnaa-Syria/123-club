const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');

class CartService {
  async getCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true, pointsCost: true, stockQuantity: true, isActive: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    // Calculate summary
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPoints = cart.items.reduce((sum, item) => sum + (item.product.pointsCost * item.quantity), 0);

    return { ...cart, totalItems, totalPoints };
  }

  async addItem(userId, productId, quantity = 1) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw AppError.notFound('Product not found');
    if (!product.isActive) throw AppError.badRequest('Product is not available');
    if (product.stockQuantity < quantity) throw AppError.badRequest('Insufficient stock');

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId, itemId, quantity) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw AppError.notFound('Cart item not found');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (item.product.stockQuantity < quantity) {
        throw AppError.badRequest('Insufficient stock');
      }
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw AppError.notFound('Cart item not found');
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { message: 'Cart cleared' };
  }
}

module.exports = new CartService();

