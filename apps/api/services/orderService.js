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

export const getAllOrdersService = async ({ userId }, { page, pageSize }) => {
  const [total, data] = await Promise.all([
    prisma.order.count({
      where: { userId },
    }),
    prisma.order.findMany({
      where: { userId },
      select: orderSelect,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { data, total };
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

export const createOrderService = async ({ userId }, data) => {
  return await prisma.order.create({
    data: {
      userId,
      ...data,
      status: "PENDING",
      orderItems: {
        create: data.orderItems,
      },
    },
    select: orderSelect,
  });
};

export const updateOrderStatusService = async (id, { status }) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
    select: orderSelect,
  });
};
