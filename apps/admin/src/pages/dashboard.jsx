import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { OrderStatusPieChart } from "@/components/charts/order-statuses";
import { OrdersOverTimeLineChart } from "@/components/charts/orders-over-time";
import { NumericCard } from "@/components/charts/numeric-card";
import { useMemo } from "react";

// TODO: add real data
const dashboardData = {
  totalOrders: 50,
  totalRevenue: 5_250_000,
  averageOrderValue: 500_000,
  orderStatuses: [
    { status: "PENDING", count: 10 },
    { status: "PROCESSING", count: 5 },
    { status: "DELIVERING", count: 8 },
    { status: "DELIVERED", count: 25 },
    { status: "CANCELLED", count: 2 },
  ],
  dailyOrders: [
    { day: "Mon", orders: 12, revenue: 1250000 },
    { day: "Tue", orders: 18, revenue: 1800000 },
    { day: "Wed", orders: 9, revenue: 900000 },
    { day: "Thu", orders: 15, revenue: 1500000 },
    { day: "Fri", orders: 22, revenue: 2200000 },
    { day: "Sat", orders: 30, revenue: 3000000 },
    { day: "Sun", orders: 25, revenue: 2500000 },
  ],
  monthlyOrders: [
    { month: "May", orders: 120, revenue: 12500000 },
    { month: "Jun", orders: 150, revenue: 15000000 },
    { month: "Jul", orders: 130, revenue: 13000000 },
    { month: "Aug", orders: 170, revenue: 17000000 },
    { month: "Sep", orders: 200, revenue: 20000000 },
    { month: "Oct", orders: 220, revenue: 22000000 },
  ],
};

export function Dashboard() {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [],
  );

  return (
    <ListView>
      <ListViewHeader title="Dashboard" />
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_3fr] gap-2">
          <OrderStatusPieChart
            data={dashboardData.orderStatuses}
            totalOrders={dashboardData.totalOrders}
          />
          <OrdersOverTimeLineChart
            dailyData={dashboardData.dailyOrders}
            monthlyData={dashboardData.monthlyOrders}
          />
        </div>
        <div className="grid gap-2">
          <div className="space-y-2">
            <NumericCard
              title="Total revenue"
              value={formatter.format(dashboardData.totalRevenue)}
            />
            <NumericCard
              title="Average order value"
              value={formatter.format(dashboardData.averageOrderValue)}
            />
          </div>
        </div>
      </div>
    </ListView>
  );
}
