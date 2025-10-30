import prisma from "../prisma/client.js";
import { getVariantByIdService } from "./variantService.js";

const cartItemSelect = {
  id: true,
  quantity: true,
  variant: {
    select: {
      id: true,
      name: true,
      price: true,
      stockQuantity: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};
const cartSelect = {
  id: true,
  sumAmount: true,
  cartItems: {
    select: cartItemSelect,
  },
  createdAt: true,
  updatedAt: true,
};

export const getOrCreateCartService = async ({ userId, guestId }) => {
  const identifier = userId ? { userId } : { guestId };
  let cart = await prisma.cart.findFirst({
    where: {
      ...identifier,
      status: "ACTIVE",
    },
    select: cartSelect,
  });
  if (!cart) {
    return await prisma.cart.create({
      data: {
        ...identifier,
        status: "ACTIVE",
        sumAmount: 0,
      },
      select: cartSelect,
    });
  }
  return cart;
};

export const addOrSubtractToCartService = async ({ userId, guestId }, data) => {
  const { variantId, amount, deleteItem } = data;

  const variant = await getVariantByIdService(variantId);

  const cart = await getOrCreateCartService({ userId, guestId });
  const item = cart.cartItems.find((item) => item.variant.id === variantId);

  if (!item && amount <= 0) {
    throw new Error("Cannot find item to subtract");
  }

  const newQuantity = amount + (item?.quantity ?? 0);
  if (!deleteItem && newQuantity > variant.stockQuantity) {
    throw new Error("Not enough stock");
  }

  if (item && (newQuantity <= 0 || deleteItem)) {
    await prisma.cartItem.delete({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });
  } else {
    await prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: {
        quantity: newQuantity,
      },
      create: {
        cartId: cart.id,
        variantId,
        quantity: amount,
      },
    });
  }

  const newCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    select: cartSelect,
  });
  const sumAmount = newCart.cartItems.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);

  return await prisma.cart.update({
    where: { id: newCart.id },
    data: { sumAmount },
    select: cartSelect,
  });
};

export const markCartAsCheckedOutService = async ({ userId, guestId }) => {
  const identifier = userId ? { userId } : { guestId };
  return await prisma.cart.updateMany({
    where: {
      ...identifier,
      status: "ACTIVE",
    },
    data: {
      status: "CHECKED_OUT",
    },
  });
};
