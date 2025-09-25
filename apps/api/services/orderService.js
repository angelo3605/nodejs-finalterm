import prisma from "../prisma/prismaClient.js";
import { generateRandomString } from "../utils/randomStr.js";
import { updateLoyaltyPoints } from "./userService.js";

export const createEmailFromOrderId = async (userId, orderId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      email: `guest_${orderId}@example.com`,
      // làm như này để người dùng dễ nhớ được email của mình hơn (mà 24 char nên cx coi thử)
    },
  });
};

export const createGuestUser = async () => {
  const timestamp = Date.now();
  const emailRandom = generateRandomString(6);
  const passwordRandom = generateRandomString(10);
  return await prisma.user.create({
    data: {
      fullName: `Guest ${timestamp}`,
      email: `guest_${timestamp}_${emailRandom}@example.com`,
      password: `${passwordRandom}`,
    },
  });
};

// Thanh toán giỏ hàng của người dùng
export const checkoutService = async (userId, shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = []) => {
  try {
    console.log("shippingAddressId:", shippingAddressId);
    console.log("userId:", userId);
    // 1. Lấy thông tin địa chỉ giao hàng từ DB
    const shippingAddressRecord = await prisma.shippingAddress.findUnique({
      where: { id: shippingAddressId },
    });
    console.log("shippingAddressRecord:", shippingAddressRecord);

    if (!shippingAddressRecord || shippingAddressRecord.userId !== userId) {
      throw new Error("Địa chỉ giao hàng không hợp lệ.");
    }

    const shippingInfo = {
      fullName: shippingAddressRecord.fullName,
      phoneNumber: shippingAddressRecord.phoneNumber,
      street: shippingAddressRecord.address,
    };

    // 2. Lấy các cartItem đã chọn
    const cartItems = await prisma.cartItem.findMany({
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

    // 3. Tính tổng tiền
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

    // 4. Áp dụng mã giảm giá nếu có
    let discountAmount = 0;
    let discountRecord = null;

    if (discountCode) {
      discountRecord = await prisma.discountCode.findUnique({
        where: { code: discountCode },
      });

      if (!discountRecord) {
        throw new Error("Mã giảm giá không hợp lệ.");
      }

      if (discountRecord.usageLimit && discountRecord.numOfUsage >= discountRecord.usageLimit) {
        throw new Error("Mã giảm giá đã được sử dụng hết.");
      }

      discountAmount = discountRecord.type === "PERCENTAGE" ? totalAmount * (discountRecord.value / 100) : discountRecord.value;
    }

    // 5. Áp dụng điểm thưởng nếu có
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const availablePoints = user?.loyaltyPoints || 0;

    if (loyaltyPointsToUse > availablePoints) {
      throw new Error(`Bạn chỉ có ${availablePoints} điểm thưởng.`);
    }

    // 6. Tính tổng tiền cuối cùng
    let finalAmount = totalAmount - discountAmount - loyaltyPointsToUse;
    if (finalAmount < 0) finalAmount = 0;

    // 7. Tạo đơn hàng
    const order = await prisma.order.create({
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

    // 8. Trừ điểm thưởng đã dùng (nếu có)
    if (loyaltyPointsToUse > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: {
            decrement: loyaltyPointsToUse,
          },
        },
      });
    }

    // 9. Cộng điểm thưởng từ đơn hàng (ví dụ: 10k = 1 điểm)
    await updateLoyaltyPoints(userId, totalAmount);

    // 10. Cập nhật lượt sử dụng mã giảm giá
    if (discountRecord) {
      await prisma.discountCode.update({
        where: { id: discountRecord.id },
        data: {
          numOfUsage: { increment: 1 },
        },
      });
    }

    // 11. Xóa các cartItem đã checkout
    await prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIds } },
    });

    return order;
  } catch (error) {
    throw new Error(error.message || "Có lỗi xảy ra khi tạo đơn hàng.");
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
      },
    });

    return updatedOrder;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy danh sách đơn hàng
export const getAllOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
        payments: true,
      },
    });

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};
