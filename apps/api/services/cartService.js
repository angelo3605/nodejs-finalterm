import prisma from "../prisma/client.js";

const cartSelect = {
  id: true,
  sumAmount: true,
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  cartItems: {
    select: {
      id: true,
      quantity: true,
      variant: {
        select: {
          name: true,
          price: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
  createdAt: true,
  updatedAt: true,
};

export const getAllCartsService = async ({ userId, status }) => {
  return await prisma.cart.findMany({
    where: { userId, status },
    select: cartSelect,
  });
};

export const getCartByIdService = async (id) => {
  const cart = await prisma.cart.findUnique({
    where: { id },
    select: cartSelect,
  });
  if (!cart) {
    throw new Error("Cart not found");
  }
  return cart;
};

export const addCartService = async ({ userId }) => {
  return await prisma.cart.create({
    data: { userId },
    select: cartSelect,
  });
};

export const addOrSubtractToCartService = async (id, { variantId, amount = 1, forceDelete = false }) => {
  const cart = await getCartByIdService(id);
  if (cart.status !== "ACTIVE") {
    throw new Error("Cannot modify non-active cart");
  }

  const item = await prisma.cartItem.findUnique({
    where: { cartId: id, variantId },
  });
  if (!item && amount <= 0) {
    throw new Error("Invalid amount");
  }

  if (item && (item.quantity + amount <= 0 || forceDelete)) {
    await prisma.cartItem.delete({
      where: { cartId: id, variantId },
    });
  } else {
    await prisma.cartItem.upsert({
      where: { id, variantId },
      update: {
        quantity: { increment: amount },
      },
      create: {
        cartId: id,
        variantId,
        quantity: amount,
      },
    });
  }

  return await getCartByIdService(id);
};
