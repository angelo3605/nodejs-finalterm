import prisma from "../prisma/prismaClient.js";

export const addToCartService = async (userId, variantId, quantity) => {
  try {
    // Tìm giỏ hàng ACTIVE của user
    let cart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, sumAmount: 0, status: "ACTIVE" },
      });
    }

    // Kiểm tra có item trong giỏ với variantId chưa
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    if (existingCartItem) {
      // Cập nhật số lượng
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Tạo mới cartItem
      await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      });
    }

    return await existingCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCartService = async (userId, cartItemId, quantity) => {
  try {
    // Có thể kiểm tra cartItem thuộc userId không (bảo mật), nếu cần

    const updateCart = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return await updateCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeFromCartService = async (userId, cartItemId) => {
  try {
    // Có thể kiểm tra cartItem thuộc userId không (bảo mật), nếu cần

    const removeCart = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return await removeCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCartSummaryService = async (userId) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: {
        cartItems: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    if (!cart) {
      return { items: [], totalAmount: 0 };
    }

    let totalAmount = 0;
    const items = cart.cartItems.map((item) => {
      const itemAmount = item.variant.price * item.quantity;
      totalAmount += itemAmount;
      return {
        productName: item.variant.product.name,
        variantName: item.variant.name,
        quantity: item.quantity,
        price: item.variant.price,
        totalAmount: itemAmount,
      };
    });

    return {
      items,
      totalAmount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
