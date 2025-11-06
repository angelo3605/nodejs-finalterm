import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import prisma from "../prisma/client.js";

dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrAfter);

const getDefaultDateRange = (interval) => {
  const now = dayjs();
  let start, end;

  switch (interval) {
    case "day":
      start = now.startOf("week").add(1, "day");
      return [start, start.add(6, "day")];
    case "week":
      return [now.startOf("month"), now.endOf("month")];
    case "month":
      const half = now.month() < 6 ? 0 : 6;
      return [now.month(half).startOf("month"), now.month(half + 5).endOf("month")];
    case "quarter":
      end = now.endOf("year");
      return [end.subtract(1, "year").startOf("year"), end];
    case "year":
      end = now.startOf("year");
      return [end.subtract(4, "year"), end];
  }
};

const getIntervalDateRange = (startDate, endDate, interval) => {
  const [start, end] = startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : getDefaultDateRange(interval);

  const ranges = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    ranges.push(current);
    switch (interval) {
      case "day":
        current = current.add(1, "day");
        break;
      case "week":
        current = current.add(1, "week");
        break;
      case "month":
        current = current.add(1, "month");
        break;
      case "quarter":
        current = current.add(3, "month");
        break;
      case "year":
        current = current.add(1, "year");
        break;
    }
  }

  return ranges;
};

export const getSummaryService = async () => {
  const totalRevenueAndAVO = await prisma.order.aggregate({
    where: {
      status: { notIn: ["PENDING", "CANCELLED"] },
    },
    _sum: { totalAmount: true },
    _avg : { totalAmount: true },
  });
  const totalProducts = await prisma.product.count({
    where: { isDeleted: false },
  });
  const totalUsers = await prisma.user.count({
    where: {
      role: { not: "BLOCKED" },
    }
  });
  return {
    totalProducts,
    totalUsers,
    totalRevenue: totalRevenueAndAVO._sum.totalAmount,
    averageOrderValue: totalRevenueAndAVO._avg.totalAmount,
  };
}

export const getChartStatsService = async ({ startDate, endDate, interval = "month", groupBy = "product" }) => {
  const dateRange = getIntervalDateRange(startDate, endDate, interval);

  const rangeStart = dateRange[0].toDate();
  const rangeEnd = dateRange.at(-1).add(1, interval).toDate();

  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: rangeStart, lt: rangeEnd },
        status: { notIn: ["PENDING", "CANCELLED"] },
      },
    },
    include: { product: { include: { category: true } }, order: true },
  });

  const productsSet = new Set();
  const chartData = dateRange.map((d) => ({ interval: d }));

  items.forEach((item) => {
    const name = groupBy === "category" ? item.product.category.name : item.productName;
    productsSet.add(name);

    const values = {
      revenue: item.quantity * item.unitPrice,
      purchasedQuantity: item.quantity,
    };

    for (let i = dateRange.length - 1; i >= 0; i--) {
      const intervalStart = dayjs(dateRange[i]);

      if (dayjs(item.order.createdAt).isSameOrAfter(intervalStart)) {
        if (!chartData[i][name]) {
          chartData[i][name] = { ...values };
        } else {
          chartData[i][name].revenue += values.revenue;
          chartData[i][name].purchasedQuantity += values.purchasedQuantity;
        }
        break;
      }
    }
  });

  return {
    intervals: dateRange,
    items: Array.from(productsSet),
    chartData,
  };
};

export const getOrderStatusesService = () =>
  prisma.order
    .groupBy({
      by: ["status"],
      _count: { id: true },
    })
    .then((data) =>
      data.reduce(
        (acc, item) => ({
          ...acc,
          [item.status]: item._count.id,
        }),
        {},
      ),
    );
