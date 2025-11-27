import prisma from "../prisma/client.js";

const orderSelect = {
  id: true,
  createdAt: true,
  sumAmount: true,
  totalAmount: true,
  status: true,
  discountCode: true,
  discountValue: true,
  shippingAddress: true,
  loyaltyPointsUsed: true,
  shipment: true,
  payment: true,
  initialShippingFee: true,
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      loyaltyPoints: true,
    },
  },
  orderItems: {
    select: {
      quantity: true,
      unitPrice: true,
      sumAmount: true,
      productName: true,
      variantName: true,
      weight: true,
      length: true,
      width: true,
      height: true,
    },
  },
};

export const getAllOrdersService = async ({ userId }, { page, pageSize }) => {
  const [total, data] = await Promise.all([
    prisma.order.count({
      where: { userId },
    }),
    prisma.order.findMany({
      where: { userId },
      select: {
        ...orderSelect,
        OrderLog: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return {
    data: data.map((item) => ({
      ...item,
      OrderLog: item.OrderLog.map((log) => ({
        ...log,
        userId: !!log.userId,
      })),
    })),
    total,
  };
};

export const getOrderByIdService = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      ...orderSelect,
      OrderLog: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return {
    ...order,
    OrderLog: order.OrderLog.map((log) => ({
      ...log,
      userId: !!log.userId,
    })),
  };
};

export const getOrderByIdAndUserService = async (id, { userId }) => {
  const order = await prisma.order.findUnique({
    where: { id, userId },
    select: {
      ...orderSelect,
      OrderLog: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return {
    ...order,
    OrderLog: order.OrderLog.map((log) => ({
      ...log,
      userId: !!log.userId,
    })),
  };
};

export const createOrderService = async ({ userId }, data) => {
  const order = await prisma.order.create({
    data: {
      userId,
      ...data,
      status: "PENDING",
      orderItems: {
        create: data.orderItems.map((item) => ({
          variant: {
            connect: { id: item.variantId },
          },
          product: {
            connect: { slug: item.productSlug },
          },
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          sumAmount: item.sumAmount,
          productName: item.productName,
          variantName: item.variantName,
        })),
      },
    },
    select: orderSelect,
  });
  await prisma.orderLog.create({
    data: {
      orderId: order.id,
      newStatus: order.status,
    },
  });
  return order;
};

export const updateOrderStatusService = async (id, { status }, { adminUserId }) => {
  const oldOrder = await getOrderByIdService(id);
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    select: orderSelect,
  });
  await prisma.orderLog.create({
    data: {
      orderId: order.id,
      oldStatus: oldOrder.status,
      newStatus: status,
      userId: adminUserId,
    },
  });
  return order;
};
