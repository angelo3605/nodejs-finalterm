import prisma from "../prisma/prismaClient.js";

export const getDashboardStats = async () => {
  const [pendingOrders, usersCount, productsCount, lowStockVariants] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.productVariant.count({ where: { stockQuantity: { lt: 5 }, isDeleted: false } }),
  ]);

  return {
    pendingOrders,
    usersCount,
    productsCount,
    lowStockVariants,
  };
};

export const getHighDashboardStats = async (startDate, endDate) => {
  const [totalRevenue, ordersByMonth, topProducts, userGrowth] = await Promise.all([
    // Tổng doanh thu trong khoảng
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: "DELIVERED",
        createdAt: { gte: startDate, lte: endDate },
      },
    }),

    // Đơn hàng theo tháng (chỉ cần createdAt, frontend tự nhóm nếu muốn)
    prisma.order.findMany({
      where: {
        status: "DELIVERED",
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),

    // Top 5 sản phẩm bán chạy nhất
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      take: 5,
    }),

    // New user
    prisma.user.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    ordersByMonth, // frontend sẽ group theo tháng nếu cần
    topProducts,
    userGrowth: userGrowth.length,
  };
};
