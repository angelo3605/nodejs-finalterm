import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import prisma from "../prisma/client.js";

dayjs.extend(isoWeek);

// function formatPeriod(date, interval) {
//   switch (interval) {
//     case "year":
//       return dayjs(date).format("YYYY");
//     case "quarter":
//       return `Q${Math.ceil((dayjs(date).month() + 1) / 3)}-${dayjs(date).year()}`;
//     case "month":
//       return dayjs(date).format("YYYY-MM");
//     case "week":
//       return `${dayjs(date).year()}-W${dayjs(date).isoWeek()}`;
//     default:
//       return dayjs(date).format("YYYY-MM-DD");
//   }
// }

const getSumAmountPerCategory = async ({ interval, rangeStart, rangeEnd, groupBy = "product" }) => {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: rangeStart, lte: rangeEnd },
        status: { notIn: ["PENDING", "CANCELLED"] },
      },
    },
    select: {
      productName: true,
      variantName: true,
      unitPrice: true,
      quantity: true,
      product: { select: { category: true } },
    },
  });
  console.log(orderItems);
};

export const getDashboardDataService = async ({ interval, startDate, endDate }) => {
  const getRange = (date) => (date ? dayjs(date) : dayjs().startOf("year")).toDate();

  const rangeStart = getRange(startDate);
  const rangeEnd = getRange(endDate);

  await getSumAmountPerCategory(rangeStart, rangeEnd);

  return {};
  // const rangeStart = startDate ? dayjs(startDate).toDate() : dayjs().startOf("year").toDate();
  // const rangeEnd = endDate ? dayjs(endDate).toDate() : dayjs().endOf("year").toDate();
  //
  // const orders = await prisma.order.findMany({
  //   where: {
  //     createdAt: { gte: rangeStart, lte: rangeEnd },
  //     status: { notIn: ["PENDING", "CANCELLED"] },
  //   },
  //   select: {
  //     id: true,
  //     createdAt: true,
  //     totalAmount: true,
  //   },
  // });
  //
  // const grouped = {};
  // for (const o of orders) {
  //   const key = formatPeriod(o.createdAt, interval);
  //   if (!grouped[key]) grouped[key] = { orders: 0, revenue: 0, profit: 0 };
  //   grouped[key].orders++;
  //   grouped[key].revenue += o.totalAmount;
  // }
  //
  // const breakdown = Object.entries(grouped).map(([period, val]) => ({
  //   period,
  //   ...val,
  // }));
  //
  // const totalOrders = breakdown.reduce((a, b) => a + b.orders, 0);
  // const totalRevenue = breakdown.reduce((a, b) => a + b.revenue, 0);
  // const totalProfit = breakdown.reduce((a, b) => a + b.profit, 0);
  //
  // const items = await prisma.orderItem.findMany({
  //   where: {
  //     order: { createdAt: { gte: rangeStart, lte: rangeEnd }, status: { notIn: ["PENDING", "CANCELLED"] } },
  //   },
  //   select: {
  //     quantity: true,
  //     product: { select: { category: { select: { name: true } } } },
  //   },
  // });
  //
  // const productStats = {};
  // for (const item of items) {
  //   const name = item.product.category.name;
  //   if (!productStats[name]) productStats[name] = 0;
  //   productStats[name] += item.quantity;
  // }
  //
  // const productTypes = Object.entries(productStats).map(([name, value]) => ({ name, value }));
  //
  // const comparison = {
  //   revenue: [{ period: "current", value: totalRevenue }],
  //   profit: [{ period: "current", value: totalProfit }],
  //   productsSold: [{ period: "current", value: totalOrders }],
  //   productTypes,
  // };
  //
  // return {
  //   interval,
  //   range: { start: rangeStart, end: rangeEnd },
  //   summary: { totalOrders, totalRevenue, totalProfit },
  //   breakdown,
  //   comparison,
  // };
};

// import prisma from "../prisma/client.js";
// import dayjs from "dayjs";
//
// export const getDashboardDataService = async () => {
//   const [userCount, orderCount, revenueSum] = await Promise.all([prisma.user.count(), prisma.order.count(), prisma.order.aggregate({ _sum: { totalAmount: true } })]);
//
//   const totalRevenue = revenueSum._sum.totalAmount || 0;
//   const avgOrderValue = orderCount ? Math.round(totalRevenue / orderCount) : 0;
//
//   const orderStatuses = await prisma.order.groupBy({
//     by: ["status"],
//     _count: { status: true },
//   });
//
//   const startDate = dayjs().subtract(29, "day");
//   const orders = await prisma.order.findMany({
//     where: { createdAt: { gte: startDate } },
//     select: { createdAt: true },
//   });
//   const dailyOrdersRaw = orders.reduce((acc, o) => {
//     const date = dayjs(o.createdAt).format("YYYY-MM-DD");
//     acc[date] = (acc[date] || 0) + 1;
//     return acc;
//   }, {});
//   const dailyOrders = Array.from({ length: 30 }, (_, i) => {
//     const date = startDate.add(i, "day").format("YYYY-MM-DD");
//     return { date, count: dailyOrdersRaw[date] || 0 };
//   });
//
//   const monthStart = dayjs().subtract(11, "month").startOf("month").toDate();
//   const monthlyRaw = await prisma.order.findMany({
//     where: { createdAt: { gte: monthStart } },
//     select: { totalAmount: true, createdAt: true },
//   });
//
//   const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
//     const monthDate = dayjs().subtract(11 - i, "month");
//     const monthSum = monthlyRaw.filter((o) => dayjs(o.createdAt).isSame(monthDate, "month")).reduce((acc, o) => acc + o.totalAmount, 0);
//     return {
//       date: monthDate.startOf("month").format("YYYY-MM-DD"),
//       amount: Math.round(monthSum),
//     };
//   });
//
//   return {
//     totals: {
//       users: userCount,
//       orders: orderCount,
//       revenue: totalRevenue,
//       averageOrderValue: avgOrderValue,
//     },
//     orders: {
//       statusBreakdown: orderStatuses.map((s) => ({
//         status: s.status,
//         count: s._count.status,
//       })),
//       daily: dailyOrders,
//     },
//     revenue: { monthly: monthlyRevenue },
//   };
// };
