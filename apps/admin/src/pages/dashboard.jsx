import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { OrderStatusPieChart } from "@/components/charts/order-status";
import { MonthlyBarChart } from "@/components/charts/monthly-orders";
import { NumericCard } from "@/components/charts/numeric-card";
import { useMemo } from "react";
import { ShoppingBag, TrendingUp, Users } from "lucide-react";

// TODO: add real data
const dashboardData = {
  totalUsers: 3,
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
  monthlyData: [
    { date: "2025-10-01", orders: 12, revenue: 1850000 },
    { date: "2025-10-02", orders: 18, revenue: 2750000 },
    { date: "2025-10-03", orders: 9, revenue: 1200000 },
    { date: "2025-10-04", orders: 22, revenue: 3600000 },
    { date: "2025-10-05", orders: 15, revenue: 2100000 },
    { date: "2025-10-06", orders: 17, revenue: 2550000 },
    { date: "2025-10-07", orders: 25, revenue: 4100000 },
    { date: "2025-10-08", orders: 10, revenue: 1450000 },
    { date: "2025-10-09", orders: 20, revenue: 3100000 },
    { date: "2025-10-10", orders: 14, revenue: 2000000 },
    { date: "2025-10-11", orders: 28, revenue: 4600000 },
    { date: "2025-10-12", orders: 16, revenue: 2400000 },
    { date: "2025-10-13", orders: 21, revenue: 3300000 },
    { date: "2025-10-14", orders: 19, revenue: 2950000 },
    { date: "2025-10-15", orders: 23, revenue: 3750000 },
    { date: "2025-10-16", orders: 8, revenue: 1150000 },
    { date: "2025-10-17", orders: 26, revenue: 4200000 },
    { date: "2025-10-18", orders: 13, revenue: 1900000 },
    { date: "2025-10-19", orders: 27, revenue: 4350000 },
    { date: "2025-10-20", orders: 15, revenue: 2200000 },
    { date: "2025-10-21", orders: 11, revenue: 1600000 },
    { date: "2025-10-22", orders: 29, revenue: 4800000 },
    { date: "2025-10-23", orders: 18, revenue: 2750000 },
    { date: "2025-10-24", orders: 24, revenue: 3900000 },
    { date: "2025-10-25", orders: 19, revenue: 3050000 },
    { date: "2025-10-26", orders: 14, revenue: 2050000 },
    { date: "2025-10-27", orders: 17, revenue: 2600000 },
    { date: "2025-10-28", orders: 30, revenue: 5000000 },
    { date: "2025-10-29", orders: 22, revenue: 3400000 },
    { date: "2025-10-30", orders: 25, revenue: 4100000 },
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
        <div className="grid grid-cols-3 gap-2">
          <NumericCard
            title="Revenue"
            value={formatter.format(dashboardData.totalRevenue)}
            Icon={TrendingUp}
            footer="All time"
          />
          <NumericCard
            title="Orders"
            value={dashboardData.totalOrders}
            Icon={ShoppingBag}
            footer="All time"
          />
          <NumericCard
            title="Users"
            value={dashboardData.totalUsers}
            Icon={Users}
            footer="All time"
          />
        </div>
        <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-2">
          <OrderStatusPieChart
            data={dashboardData.orderStatuses}
            totalOrders={dashboardData.totalOrders}
          />
          <MonthlyBarChart data={dashboardData.monthlyData} />
          <MonthlyBarChart data={dashboardData.monthlyData} />
        </div>
      </div>
    </ListView>
  );
}
