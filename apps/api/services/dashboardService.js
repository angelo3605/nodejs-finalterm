import prisma from "../prisma/client.js";

export const getShopStatisticsService = async () => {
  const [pendingOrders, usersCount, productsCount, lowStockVariants] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.productVariant.count({
      where: {
        stockQuantity: { lt: 5 },
        isDeleted: false,
      },
    }),
  ]);

  return {
    pendingOrders,
    usersCount,
    productsCount,
    lowStockVariants,
  };
};

export const getShopHighlightsService = async ({ startDate, endDate }) => {
  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required");
  }

  const [totalRevenue, ordersByMonth, topProducts, newUsers] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    }),

    prisma.order.findMany({
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),

    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      take: 5,
    }),

    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    ordersByMonth,
    topProducts,
    userGrowth: newUsers.length,
  };
};
