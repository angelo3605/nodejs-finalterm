import { registerService } from "./authService.js";
import { getOrCreateCartService, markCartAsCheckedOutService } from "./cartService.js";
import { getDiscountCodeByCodeService, updateDiscountCodeService } from "./discountCodeService.js";
import { createOrderService } from "./orderService.js";
import { addShippingAddressService, getShippingAddressByIdService } from "./shippingAddressService.js";
import { getUserByIdService, updateUserService } from "./userService.js";
import { customAlphabet } from "nanoid";
import prisma from "../prisma/client.js";
import { updateVariantService } from "./variantService.js";

const generatePassword = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 20);

export const checkoutService = async ({ userId, guestId, shippingAddressId, discountCode, loyaltyPointsToUse = 0 }) => {
  const [shippingAddress, user, cart] = await Promise.all([
    await getShippingAddressByIdService(shippingAddressId),
    await getUserByIdService(userId),
    await getOrCreateCartService(guestId ? { guestId } : { userId }),
  ]);

  if (cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  let subTotal = 0;
  const orderItems = cart.cartItems.map((item) => {
    const sum = item.variant.price * item.quantity;
    subTotal += sum;
    return {
      quantity: item.quantity,
      unitPrice: item.variant.price,
      sumAmount: sum,
      productName: item.variant.product.name,
      variantName: item.variant.name,
    };
  });

  let discountAmount = 0;
  let discountRecord = null;
  if (discountCode) {
    discountRecord = await getDiscountCodeByCodeService(discountCode);
    if (discountRecord.numOfUsage >= discountRecord.usageLimit) {
      throw new Error("Discount code not available");
    }
    discountAmount = discountRecord.type === "PERCENTAGE" ? subTotal * (discountRecord.value / 100.0) : discountRecord.value;
  }

  if (loyaltyPointsToUse > user.loyaltyPoints) {
    throw new Error("Not enough loyalty points");
  }

  const total = Math.max(subTotal - discountAmount - loyaltyPointsToUse, 0.0);
  const order = await createOrderService({
    userId: user.id,
    sumAmount: subTotal,
    totalAmount: total,
    shippingAddress: {
      address: shippingAddress.address,
      phoneNumber: shippingAddress.phoneNumber,
      fullName: user.fullName,
    },
    discountCode,
    orderItems,
  });

  await Promise.all([
    updateUserService(user.id, {
      loyaltyPoints: user.loyaltyPoints - loyaltyPointsToUse + Math.floor(total / 1000.0),
    }),
    markCartAsCheckedOutService({ userId: user.id }),
    discountCode &&
      updateDiscountCodeService(discountCode, {
        numOfUsage: discountRecord.numOfUsage + 1,
      }),
    cart.cartItems.map((item) =>
      updateVariantService(item.variant.id, {
        stockQuantity: item.variant.stockQuantity - item.quantity,
      }),
    ),
  ]);

  // TODO: send email (preferrably Mailpit for local development)

  return order;
};

export const guestCheckoutService = async ({ guestId, email, fullName, address, phoneNumber, discountCode }) => {
  if (
    await prisma.user.findUnique({
      where: { email },
    })
  ) {
    throw new Error("Email already exists");
  }

  const guestUser = await registerService(email, generatePassword(), fullName);
  const shippingAddress = await addShippingAddressService({
    userId: guestUser.id,
    fullName,
    address,
    phoneNumber,
  });

  const order = await checkoutService({
    userId: guestUser.id,
    guestId,
    shippingAddressId: shippingAddress.id,
    discountCode,
  });

  // TODO: send password via email

  return order;
};
