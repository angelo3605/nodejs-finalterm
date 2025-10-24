import prisma from "../prisma/client.js";

export const addToCartService = async (userId, variantId, quantity) => {
  if (!userId || !variantId || quantity <= 0) throw new Error("Missing or invalid input");

  let cart = await prisma.cart.findFirst({ where: { userId, status: "ACTIVE" } });
  if (!cart) cart = await prisma.cart.create({ data: { userId, sumAmount: 0, status: "ACTIVE" } });

  const existingItem = await prisma.cartItem.findFirst({ where: { cartId: cart.id, variantId } });
  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return await prisma.cartItem.create({ data: { cartId: cart.id, variantId, quantity } });
};

export const updateCartItemService = async (userId, cartItemId, quantity) => {
  if (!userId || !cartItemId || quantity < 0) throw new Error("Missing or invalid input");

  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { cart: true } });
  if (!item || item.cart.userId !== userId) throw new Error("Unauthorized or item not found");

  return await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
};

export const removeItemFromCartService = async (userId, cartItemId) => {
  if (!userId || !cartItemId) throw new Error("Missing input");

  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { cart: true } });
  if (!item || item.cart.userId !== userId) throw new Error("Unauthorized or item not found");

  return await prisma.cartItem.delete({ where: { id: cartItemId } });
};

export const getCartSummaryService = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const cart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
    include: {
      cartItems: { include: { variant: { include: { product: true } } } },
    },
  });

  if (!cart) return { items: [], totalAmount: 0 };

  let totalAmount = 0;
  const items = cart.cartItems.map((item) => {
    const itemTotal = item.variant.price * item.quantity;
    totalAmount += itemTotal;

    return {
      productName: item.variant.product.name,
      variantName: item.variant.name,
      price: item.variant.price,
      quantity: item.quantity,
      totalAmount: itemTotal,
    };
  });

  return { items, totalAmount };
};
