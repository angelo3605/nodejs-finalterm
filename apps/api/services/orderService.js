import prisma from "../prisma/prismaClient.js";
import { generateObjectId } from "../utils/generateId.js";
import { getDiscountDetailsService } from "./discountCodeService.js";
import { updateLoyaltyPoints } from "./userService.js";

// Thanh toán giỏ hàng của người dùng
export const checkoutService = async (userId, shippingInfo, discountCode, loyaltyPointsToUse, cartItems) => {
  try {
    // 1. Nếu không có userId (khách vãng lai), tạo user tạm thời
    if (!userId) {
      const guestUser = await prisma.user.create({
        data: {
          id: generateObjectId(),
          name: `Guest ${Date.now()}`,
        },
      });
      userId = guestUser.id;
    }

    // 2. Kiểm tra và tạo giỏ hàng tạm thời cho khách vãng lai nếu chưa có
    let cart = await prisma.cart.findFirst({
      where: { userId: userId, status: "ACTIVE" },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
          status: "ACTIVE",
        },
      });
    }

    // 3. Xử lý các mặt hàng từ cartItems (mảng các mặt hàng khách chọn)
    let totalAmount = 0;
    const cartItemsToCreate = [];

    for (const item of cartItems) {
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant) {
        throw new Error(`Sản phẩm không tồn tại.`);
      }

      const itemTotal = variant.price * item.quantity;
      totalAmount += itemTotal;

      cartItemsToCreate.push({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: variant.price,
        sumAmount: itemTotal,
      });
    }

    // 4. Kiểm tra mã giảm giá (nếu có)
    let discount = null;
    if (discountCode) {
      discount = await prisma.discountCode.findUnique({ where: { code: discountCode } });
      if (!discount) {
        throw new Error("Mã giảm giá không hợp lệ");
      }
    }

    let discountAmount = 0;
    if (discount) {
      discountAmount = discount.type === "PERCENTAGE" ? totalAmount * (discount.value / 100) : discount.value;
    }

    let finalAmount = totalAmount - discountAmount;

    // 5. Kiểm tra và sử dụng điểm thưởng (nếu có)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const pointsAvailable = user?.loyaltyPoints || 0;

    if (loyaltyPointsToUse > pointsAvailable) {
      throw new Error(`Số điểm tín dụng không đủ. Bạn chỉ có ${pointsAvailable} điểm.`);
    }

    // Giảm số tiền nếu có sử dụng điểm
    if (loyaltyPointsToUse > 0) {
      finalAmount -= loyaltyPointsToUse;
    }

    // 6. Tạo đơn hàng
    const order = await prisma.order.create({
      data: {
        sumAmount: totalAmount,
        totalAmount: finalAmount,
        status: "PENDING",
        userId: userId, // Dù là user tạm thời, vẫn dùng userId để tạo đơn hàng
        shippingAddress: shippingInfo,
        orderItems: {
          create: cartItemsToCreate,
        },
      },
    });

    // 7. Cập nhật giỏ hàng thành "CHECKED_OUT"
    await prisma.cart.update({
      where: { userId: userId, status: "ACTIVE" },
      data: { status: "CHECKED_OUT" },
    });

    // 8. Cập nhật lại điểm tín dụng
    if (loyaltyPointsToUse > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { loyaltyPoints: { decrement: loyaltyPointsToUse } },
      });
    }

    // 9. Cập nhật số lần sử dụng mã giảm giá
    if (discount) {
      await prisma.discountCode.update({
        where: { id: discount.id },
        data: { numOfUsage: { increment: 1 } },
      });
    }

    // Trả về đơn hàng
    return order;
  } catch (error) {
    throw new Error(error.message);
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
