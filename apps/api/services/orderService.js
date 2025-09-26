import prisma from "../prisma/prismaClient.js";
import { generateRandomString } from "../utils/randomStr.js";
import { updateLoyaltyPoints } from "./userService.js";

// Hàm cập nhật các thứ sau khi tạo order (tách riêng)
export const postOrderUpdates = async (db, userId, loyaltyPointsToUse, totalAmount, discountRecord, cartItemIds) => {
  if (loyaltyPointsToUse > 0) {
    await db.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: {
          decrement: loyaltyPointsToUse,
        },
      },
    });
  }

  await updateLoyaltyPoints(userId, totalAmount);

  if (discountRecord) {
    await db.discountCode.update({
      where: { id: discountRecord.id },
      data: {
        numOfUsage: { increment: 1 },
      },
    });
  }

  await db.cartItem.deleteMany({
    where: { id: { in: cartItemIds } },
  });
};

export const checkoutGuestService = async (shippingInfo, discountCode, loyaltyPointsToUse = 0, cartItems = []) => {
  const order = await prisma.$transaction(async (tx) => {
    // 1. Tạo guest user
    const guestUser = await tx.user.create({
      data: {
        fullName: `Guest ${Date.now()}`,
        email: `guest_${Date.now()}_${generateRandomString(6)}@example.com`,
        password: generateRandomString(10),
      },
    });

    // 2. Tạo shipping address
    const shippingAddress = await tx.shippingAddress.create({
      data: {
        userId: guestUser.id,
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        phoneNumber: shippingInfo.phoneNumber,
      },
    });

    // 3. Tạo cart ACTIVE cho guestUser
    const guestCart = await tx.cart.create({
      data: {
        userId: guestUser.id,
        sumAmount: 0,
        status: "ACTIVE",
      },
    });

    // 4. Tạo cartItems liên kết với guestCart
    const cartItemIds = [];
    for (const item of cartItems) {
      const cartItem = await tx.cartItem.create({
        data: {
          cartId: guestCart.id,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      });
      cartItemIds.push(cartItem.id);
    }

    // 5. Gọi checkoutService có tx (nên thêm tham số tx vào hàm checkoutService)
    const order = await checkoutService(tx, guestUser.id, shippingAddress.id, discountCode, loyaltyPointsToUse, cartItemIds);

    // 6. Cập nhật email cho dễ nhớ
    await tx.user.update({
      where: { id: guestUser.id },
      data: {
        email: `guest_${order.id}@example.com`,
      },
    });

    return { order, userId: guestUser.id, cartItemIds, discountCodeId: order.discountCodeId, totalAmount: order.sumAmount };
  });

  return order;
};

// Thanh toán giỏ hàng của người dùng
// Với tx: dùng cho guest (trong transaction)
// Không tx: dùng cho logged-in user
export const checkoutService = async (txOrNull, userId, shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = []) => {
  const db = txOrNull || prisma;

  const shippingAddressRecord = await db.shippingAddress.findUnique({
    where: { id: shippingAddressId },
  });

  if (!shippingAddressRecord || shippingAddressRecord.userId !== userId) {
    throw new Error("Địa chỉ giao hàng không hợp lệ.");
  }

  const shippingInfo = {
    fullName: shippingAddressRecord.fullName,
    phoneNumber: shippingAddressRecord.phoneNumber,
    street: shippingAddressRecord.address,
  };

  const cartItems = await db.cartItem.findMany({
    where: {
      id: { in: cartItemIds },
      cart: { userId, status: "ACTIVE" },
    },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  });

  if (cartItems.length === 0) {
    throw new Error("Không tìm thấy sản phẩm nào trong giỏ hàng.");
  }

  let totalAmount = 0;
  const orderItems = cartItems.map((item) => {
    const itemTotal = item.variant.price * item.quantity;
    totalAmount += itemTotal;

    return {
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.variant.price,
      sumAmount: itemTotal,
      productName: item.variant.product.name,
      variantName: item.variant.name,
    };
  });

  let discountAmount = 0;
  let discountRecord = null;

  if (discountCode) {
    discountRecord = await db.discountCode.findUnique({
      where: { code: discountCode },
    });

    if (!discountRecord) throw new Error("Mã giảm giá không hợp lệ.");
    if (discountRecord.usageLimit && discountRecord.numOfUsage >= discountRecord.usageLimit) {
      throw new Error("Mã giảm giá đã được sử dụng hết.");
    }

    discountAmount = discountRecord.type === "PERCENTAGE" ? totalAmount * (discountRecord.value / 100) : discountRecord.value;
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  const availablePoints = user?.loyaltyPoints || 0;

  if (loyaltyPointsToUse > availablePoints) {
    throw new Error(`Bạn chỉ có ${availablePoints} điểm thưởng.`);
  }

  let finalAmount = totalAmount - discountAmount - loyaltyPointsToUse;
  if (finalAmount < 0) finalAmount = 0;

  const order = await db.order.create({
    data: {
      sumAmount: totalAmount,
      totalAmount: finalAmount,
      status: "PENDING",
      userId: userId,
      shippingAddress: shippingInfo,
      discountCodeId: discountRecord?.id,
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      orderItems: true,
    },
  });
  return order;
};

// Lấy danh sách đơn hàng

export const getAllOrdersService = async (userId) => {
  try {
    const listOrders = await prisma.order.findMany({
      where: { userId: userId },
      select: {
        id: true,
        status: true,
        totalAmount: true,
      },
      include: {
        orderItems: true,
        // payments: true, hiện tại chưa có payment nên không hiển thị
      },
    });
    return listOrders;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const orderDetailService = async (orderId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        createdAt: true,
        sumAmount: true,
        totalAmount: true,
        status: true,
        discountCodeId: true,
        shippingAddress: true, 
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            unitPrice: true,
            sumAmount: true,
            productName: true,
            variantName: true,
          },
        },
      },
    });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
