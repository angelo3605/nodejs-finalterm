import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear.js";
import isBetween from "dayjs/plugin/isBetween.js";
import prisma from "../prisma/client.js";

dayjs.extend(quarterOfYear);
dayjs.extend(isBetween);

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
      end = now.startOf("month");
      return [end.subtract(5, "month"), end];
    case "quarter":
      end = now.startOf("month");
      return [end.subtract(2, "year"), end];
    case "year":
      end = now.startOf("year");
      return [end.subtract(5, "year"), end];
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

export const getChartStatsService = async ({ startDate, endDate, interval = "month", groupBy = "product" }) => {
  const dateRange = getIntervalDateRange(startDate, endDate, interval);

  const rangeStart = dateRange[0].toDate();
  const rangeEnd = dateRange.at(-1).toDate();

  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: rangeStart, lte: rangeEnd },
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

    const itemDate = dayjs(item.order.createdAt).startOf(interval);
    const value = {
      revenue: item.quantity * item.unitPrice,
      purchasedQuantity: item.quantity,
    };

    chartData.forEach((row, idx) => {
      const intervalStart = dayjs(row.interval);
      const intervalEnd = dateRange[idx + 1] ? dayjs(dateRange[idx + 1]) : intervalStart.add(1, interval);

      if (itemDate.isBetween(intervalStart, intervalEnd, "day", "[)")) {
        row[name] = row[name] || {
          revenue: 0,
          purchasedQuantity: 0,
        };
        row[name].revenue += value.revenue;
        row[name].purchasedQuantity += value.purchasedQuantity;
      }
    });
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
      data.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
    );
