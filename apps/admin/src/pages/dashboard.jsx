import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
// import { OrderStatusPieChart } from "@/components/charts/order-status";
// import { DailyOrdersBarChart } from "@/components/charts/daily-orders";
// import { NumericCard } from "@/components/charts/numeric-card";
// import { ReceiptText, ShoppingBag, TrendingUp, Users } from "lucide-react";
// import { longCurrencyFormatter } from "@mint-boutique/formatters";
// import { MonthlyRevnueLineChart } from "@/components/charts/monthly-revenue";
import { useCustom } from "@refinedev/core";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.jsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";

const mockDashboardData = {
  intervals: [
    "2025-10-31T17:00:00.000Z",
    "2025-11-07T17:00:00.000Z",
    "2025-11-14T17:00:00.000Z",
    "2025-11-21T17:00:00.000Z",
    "2025-11-28T17:00:00.000Z",
  ],
  items: ["Monstera", "Cornflower", "Rose"],
  chartData: [
    {
      interval: "2025-10-31T17:00:00.000Z",
      Monstera: { revenue: 0, purchasedQuantity: 0 },
      Cornflower: { revenue: 0, purchasedQuantity: 0 },
      Rose: { revenue: 0, purchasedQuantity: 0 },
    },
    {
      interval: "2025-11-07T17:00:00.000Z",
      Monstera: { revenue: 500000, purchasedQuantity: 2 },
      Cornflower: { revenue: 1000000, purchasedQuantity: 8 },
      Rose: { revenue: 300000, purchasedQuantity: 5 },
    },
    {
      interval: "2025-11-14T17:00:00.000Z",
      Monstera: { revenue: 200000, purchasedQuantity: 1 },
      Cornflower: { revenue: 400000, purchasedQuantity: 3 },
      Rose: { revenue: 250000, purchasedQuantity: 2 },
    },
    {
      interval: "2025-11-21T17:00:00.000Z",
      Monstera: { revenue: 0, purchasedQuantity: 0 },
      Cornflower: { revenue: 0, purchasedQuantity: 0 },
      Rose: { revenue: 0, purchasedQuantity: 0 },
    },
    {
      interval: "2025-11-28T17:00:00.000Z",
      Monstera: { revenue: 0, purchasedQuantity: 0 },
      Cornflower: { revenue: 0, purchasedQuantity: 0 },
      Rose: { revenue: 0, purchasedQuantity: 0 },
    },
  ],
};

function strToOkLchHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

const getBarRadius = (index, length, amount) => {
  if (length <= 1) {
    return [amount, amount, amount, amount];
  }
  if (index === 0) {
    return [0, 0, amount, amount];
  }
  if (index === length - 1) {
    return [amount, amount, 0, 0];
  }
  return [0, 0, 0, 0];
};

function DashboardBarChart({ chartData, items }) {
  const [metric, setMetric] = useState("revenue");

  const rechartsData = chartData.map((row) => {
    const obj = { interval: row.interval };
    items.forEach((name) => {
      obj[name] = row[name]?.[metric] || 0;
    });
    return obj;
  });

  const chartConfig = {};

  return (
    <div className="space-y-4">
      <Select value={metric} onValueChange={(value) => setMetric(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Metric" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="revenue">Revenue</SelectItem>
          <SelectItem value="purchasedQuantity">Purchases</SelectItem>
        </SelectContent>
      </Select>
      <ChartContainer config={chartConfig} className="w-full h-[250px]">
        <BarChart accessibilityLayer data={rechartsData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="interval"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          {items.map((name, i) => (
            <Bar
              key={name}
              dataKey={name}
              stackId="a"
              fill={`oklch(${60 + i * 10}% 0.12 ${strToOkLchHue(name)})`}
              radius={getBarRadius(i, items.length, 8)}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function OrderPieChart({ data }) {
  const chartConfig = {
    count: {
      label: "No. of orders",
    },
    PENDING: {
      label: "Pending",
      color: "var(--chart-5)",
    },
    PROCESSING: {
      label: "Processing",
      color: "var(--chart-2)",
    },
    DELIVERING: {
      label: "Delivering",
      color: "var(--chart-4)",
    },
    DELIVERED: {
      label: "Delivered",
      color: "var(--chart-1)",
    },
    CANCELLED: {
      label: "Cancelled",
      color: "var(--chart-3)",
    },
  };

  return (
    <div className="space-y-8">
      <h5>Order statuses</h5>
      <ChartContainer config={chartConfig}>
        <PieChart margin={{ top: 0 }}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={data?.map((order) => ({
              ...order,
              fill: `var(--color-${order.status})`,
            }))}
            dataKey="count"
            nameKey="status"
            innerRadius="85%"
            outerRadius="100%"
            paddingAngle={5}
            cornerRadius="25%"
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {data.find(({ status }) => status === "PENDING").count}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 32}
                        className="fill-muted-foreground text-sm"
                      >
                        PENDING
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

export function Dashboard() {
  const {
    result: { data },
    query: { isLoading },
  } = useCustom({
    url: "/dashboard/chart?groupBy=product&interval=week",
    method: "get",
  });

  const {
    result: { data: orderStatuses },
  } = useCustom({
    url: "/dashboard/order-statuses",
    method: "get",
  });

  return (
    <ListView>
      <ListViewHeader title="Dashboard" />
      <LoadingOverlay loading={isLoading} className="h-[300px]">
        {isLoading || (
          <div className="grid @xl:grid-cols-[67%_auto]">
            <DashboardBarChart {...mockDashboardData} />
            <OrderPieChart data={orderStatuses} />
          </div>
        )}
        {/*{!isLoading && (*/}
        {/*  <div className="space-y-2">*/}
        {/*    <div className="grid grid-cols-4 gap-2">*/}
        {/*      <NumericCard*/}
        {/*        title="Revenue"*/}
        {/*        value={longCurrencyFormatter.format(data.totals.revenue)}*/}
        {/*        Icon={TrendingUp}*/}
        {/*        footer="All time"*/}
        {/*      />*/}
        {/*      <NumericCard*/}
        {/*        title="Orders"*/}
        {/*        value={data.totals.orders}*/}
        {/*        Icon={ShoppingBag}*/}
        {/*        footer="All time"*/}
        {/*      />*/}
        {/*      <NumericCard*/}
        {/*        title="Avervage"*/}
        {/*        value={longCurrencyFormatter.format(*/}
        {/*          data.totals.averageOrderValue,*/}
        {/*        )}*/}
        {/*        Icon={ReceiptText}*/}
        {/*        footer="All time"*/}
        {/*      />*/}
        {/*      <NumericCard*/}
        {/*        title="Users"*/}
        {/*        value={data.totals.users}*/}
        {/*        Icon={Users}*/}
        {/*        footer="All time"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-2">*/}
        {/*      <OrderStatusPieChart data={data.orders.statusBreakdown} />*/}
        {/*      <DailyOrdersBarChart data={data.orders.daily} />*/}
        {/*      <MonthlyRevnueLineChart data={data.revenue.monthly} />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </LoadingOverlay>
    </ListView>
  );
}
