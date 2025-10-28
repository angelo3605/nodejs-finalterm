import prisma from "../prisma/client.js";
import dayjs from "dayjs";

export const getDashboardDataService = async () => {
  const [userCount, orderCount, revenueSum] = await Promise.all([prisma.user.count(), prisma.order.count(), prisma.order.aggregate({ _sum: { totalAmount: true } })]);

  const totalRevenue = revenueSum._sum.totalAmount || 0;
  const avgOrderValue = orderCount ? Math.round(totalRevenue / orderCount) : 0;

  const orderStatuses = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const startDate = dayjs().subtract(29, "day");
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
  });
  const dailyOrdersRaw = orders.reduce((acc, o) => {
    const date = dayjs(o.createdAt).format("YYYY-MM-DD");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const dailyOrders = Array.from({ length: 30 }, (_, i) => {
    const date = startDate.add(i, "day").format("YYYY-MM-DD");
    return { date, count: dailyOrdersRaw[date] || 0 };
  });

  const monthStart = dayjs().subtract(11, "month").startOf("month").toDate();
  const monthlyRaw = await prisma.order.findMany({
    where: { createdAt: { gte: monthStart } },
    select: { totalAmount: true, createdAt: true },
  });

  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const monthDate = dayjs().subtract(11 - i, "month");
    const monthSum = monthlyRaw.filter((o) => dayjs(o.createdAt).isSame(monthDate, "month")).reduce((acc, o) => acc + o.totalAmount, 0);
    return {
      date: monthDate.startOf("month").format("YYYY-MM-DD"),
      amount: Math.round(monthSum),
    };
  });

  return {
    totals: {
      users: userCount,
      orders: orderCount,
      revenue: totalRevenue,
      averageOrderValue: avgOrderValue,
    },
    orders: {
      statusBreakdown: orderStatuses.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      daily: dailyOrders,
    },
    revenue: { monthly: monthlyRevenue },
  };
};
