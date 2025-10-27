import prisma from "../prisma/client.js";

const orderSelect = {
  id: true,
  createdAt: true,
  sumAmount: true,
  totalAmount: true,
  status: true,
  discountCode: true,
  shippingAddress: true,
  user: {
    select: {
      id: true,
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
};

export const getAllOrdersService = async ({ userId }) => {
  return await prisma.order.findMany({
    where: { userId },
    select: orderSelect,
  });
};

export const getOrderByIdService = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: orderSelect,
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

export const createOrderService = async ({ userId, sumAmount, totalAmount, shippingAddress, discountCode, orderItems }) => {
  return await prisma.order.create({
    data: {
      userId,
      sumAmount,
      totalAmount,
      status: "PENDING",
      shippingAddress,
      discountCode,
      orderItems: {
        create: orderItems,
      },
    },
    select: orderSelect,
  });
};

/* export const updateOrderStatusService = async ({ orderId, status }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Cannot find order");
  return await prisma.order.update({ where: { id: orderId }, data: { status } });
};

export const updateAfterOrderService = async ({ userId, loyaltyPointsToUse, totalAmount, discountCode, cartItemIds }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (loyaltyPointsToUse > 0) {
    if (loyaltyPointsToUse > user.loyaltyPoints) throw new Error("Not enough loyalty points");
    await prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { decrement: loyaltyPointsToUse } } });
  }

  await updateUserService(userId, undefined, undefined, totalAmount);

  if (discountCode) {
    await prisma.discountCode.update({ where: { id: discountCode.id }, data: { numOfUsage: { increment: 1 } } });
  }

  await prisma.cartItem.deleteMany({ where: { id: { in: cartItemIds } } });
};

export const sendOrderConfirmationEmailWithAccountToGuestService = async ({ email, password, orderId }) => {
  const subject = "Chào mừng bạn đến với Mint Boutique - Thông tin tài khoản & đơn hàng của bạn";
  const html = `
    <html><body>
      <p>Xin chào, tài khoản này được tạo cho bạn từ đơn hàng đầu tiên</p>
      <p>Cảm ơn bạn đã mua sắm tại <strong>Mint Boutique</strong>!</p>
      <h3>Thông tin tài khoản:</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mật khẩu tạm thời:</strong> ${password}</p>
      <p><a href="https://mintboutique.com/login">Đăng nhập ngay</a> và đổi mật khẩu để bảo mật.</p>
      <h3>Thông tin đơn hàng:</h3>
      <p><strong>Mã đơn hàng:</strong> #${orderId}</p>
      <p><a href="https://mintboutique.com/orders/${orderId}">Xem đơn hàng</a></p>
      <p>Liên hệ: <a href="mailto:support@mintboutique.com">support@mintboutique.com</a></p>
      <p>Trân trọng,<br><strong>Mint Boutique Team</strong></p>
    </body></html>
  `;
  await sendEmail(email, subject, html);
};

export const guestCheckoutService = async ({ email, shippingInfo, discountCode, loyaltyPointsToUse = 0, cartItems = [] }) => {
  return await prisma.$transaction(async (tx) => {
    if (await tx.user.findUnique({ where: { email } })) throw new Error("Email is already taken");

    const password = generateRandomString(32);
    const guestUser = await tx.user.create({
      data: { fullName: `Guest ${Date.now()}`, email, password },
    });

    const shippingAddress = await tx.shippingAddress.create({
      data: { userId: guestUser.id, fullName: shippingInfo.fullName, address: shippingInfo.address, phoneNumber: shippingInfo.phoneNumber },
    });

    const guestCart = await tx.cart.create({ data: { userId: guestUser.id, sumAmount: 0, status: "ACTIVE" } });

    const cartItemIds = [];
    for (const item of cartItems) {
      const cartItem = await tx.cartItem.create({ data: { cartId: guestCart.id, variantId: item.variantId, quantity: item.quantity } });
      cartItemIds.push(cartItem.id);
    }

    const order = await checkoutService({
      tx,
      userId: guestUser.id,
      shippingAddressId: shippingAddress.id,
      discountCode,
      loyaltyPointsToUse,
      cartItemIds,
    });

    return { order, userId: guestUser.id, password, cartItemIds, discountCodeId: order.discountCodeId, totalAmount: order.sumAmount };
  });
};

export const checkoutService = async ({ tx = null, userId, shippingAddressId, discountCode, loyaltyPointsToUse = 0, cartItemIds = [] }) => {
  const db = tx || prisma;

  const shippingAddress = await db.shippingAddress.findUnique({ where: { id: shippingAddressId } });
  if (!shippingAddress || shippingAddress.userId !== userId) throw new Error("Invalid shipping address");

  const cartItems = await db.cartItem.findMany({
    where: { id: { in: cartItemIds }, cart: { userId, status: "ACTIVE" } },
    include: { variant: { include: { product: true } } },
  });

  if (cartItems.length === 0) throw new Error("No items found in cart");

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
    discountRecord = await db.discountCode.findUnique({ where: { code: discountCode } });
    if (!discountRecord) throw new Error("Invalid discount code");
    if (discountRecord.usageLimit && discountRecord.numOfUsage >= discountRecord.usageLimit) throw new Error("Discount code has reached usage limit");

    discountAmount = discountRecord.type === "PERCENTAGE" ? totalAmount * (discountRecord.value / 100) : discountRecord.value;
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (loyaltyPointsToUse > (user.loyaltyPoints || 0)) throw new Error("Not enough loyalty points");

  let finalAmount = totalAmount - discountAmount - loyaltyPointsToUse;
  if (finalAmount < 0) finalAmount = 0;

  const order = await db.order.create({
    data: {
      sumAmount: totalAmount,
      totalAmount: finalAmount,
      status: "PENDING",
      userId,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phoneNumber: shippingAddress.phoneNumber,
        street: shippingAddress.address,
      },
      discountCodeId: discountRecord?.id,
      orderItems: { create: orderItems },
    },
    include: { orderItems: true },
  });

  const subject = `Your New Order for Mint Boutique`;
  const html = `
    <html><body>
      <p>Hi ${user.fullName},</p>
      <p>Thank you for shopping with Mint Boutique! We're excited to confirm your order has been received. Here's a summary of your order:</p>
      <h3>Shipping Information:</h3>
      <p><strong>Name:</strong> ${shippingAddress.fullName}</p>
      <p><strong>Phone:</strong> ${shippingAddress.phoneNumber}</p>
      <p><strong>Address:</strong> ${shippingAddress.address}</p>
      <h3>Order Summary:</h3>
      <ul>
        ${orderItems.map((item) => `<li><strong>${item.productName}</strong> (Size: ${item.variantName}) x ${item.quantity} - ${item.sumAmount.toFixed(2)} VND</li>`).join("")}
      </ul>
      <h3>Total Amount:</h3>
      <p><strong>Subtotal:</strong> ${totalAmount.toFixed(2)} VND</p>
      <p><strong>Discount:</strong> ${discountAmount.toFixed(2)} VND</p>
      <p><strong>Loyalty Points Applied:</strong> ${loyaltyPointsToUse} points</p>
      <p><strong>Total Payable:</strong> ${finalAmount.toFixed(2)} VND</p>
      <p>If you have any questions or need assistance, feel free to contact us at support@mintboutique.com.</p>
      <p>Best regards,<br>The Mint Boutique Team</p>
    </body></html>
  `;
  await sendEmail(user.email, subject, html);

  return order;
}; */
