import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useCustom, useGetIdentity } from "@refinedev/core";
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
  LabelList,
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
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { dashboardChartSchema } from "@mint-boutique/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/date-picker.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  CircleUserRound,
  Eraser,
  Minus,
  Package2,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { Separator } from "@/components/ui/separator.jsx";

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

function DashboardBarChart({ chartData, items, metric, interval }) {
  const rechartsData = chartData?.map((row) => {
    const obj = { interval: row.interval };
    items.forEach((name) => {
      obj[name] = row[name]?.[metric] || 0;
    });
    return obj;
  });

  const chartConfig = {};

  return (
    <ChartContainer config={chartConfig} className="w-full h-[250px]">
      <BarChart accessibilityLayer data={rechartsData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="interval"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(tick) => {
            switch (interval) {
              case "day":
              case "week":
                return format(tick, "MMM dd");
              case "month":
                return format(tick, "MMM yyyy");
              case "quarter":
                return format(tick, "QQQ yyyy");
              case "year":
                return format(tick, "yyyy");
            }
          }}
        />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        {items.map((name, i) => (
          <Bar
            key={name}
            dataKey={name}
            stackId="a"
            fill={`oklch(${60 + i * 10}% 0.12 ${strToOkLchHue(name)})`}
            // radius={getBarRadius(i, items.length, 8)}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function OrderStatusBarChart({ data, minPercentage = 0.1 }) {
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

  const min =
    Object.values(data).reduce((sum, value) => sum + value, 0) * minPercentage;
  const normalized = Object.fromEntries(
    Object.entries(data).map(([status, count]) => [
      status,
      Math.max(count, min),
    ]),
  );

  return (
    <ChartContainer config={chartConfig} className="w-[200px] h-[300px]">
      <BarChart
        data={[normalized]}
        barSize={25}
        margin={{ right: 170, top: 5, bottom: 5, left: 0 }}
      >
        {Object.keys(data).map((status, i) => (
          <Bar
            key={i}
            dataKey={status}
            stackId="a"
            fill={`var(--color-${status})`}
            stroke="var(--color-background)"
            strokeWidth={2}
            radius={getBarRadius(i, Object.keys(data).length, 8)}
          >
            <LabelList
              dataKey={status}
              content={({ x, y }) => (
                <g>
                  <line
                    x1={x + 40}
                    y1={y + 8}
                    x2={x + 200}
                    y2={y + 8}
                    stroke="var(--color-border)"
                  />
                  <text
                    x={x + 198}
                    y={y + 25}
                    fill="var(--color-foreground)"
                    fontSize={12}
                    textAnchor="end"
                  >
                    {chartConfig[status].label}&emsp;{data[status]}
                  </text>
                </g>
              )}
            />
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function SummaryCard({ color, value, title, Icon }) {
  return (
    <div className="h-max overflow-hidden border rounded-sm">
      <Card
        className="grid grid-cols-[auto_min-content] items-center border-0 border-l-8 shadow-none rounded-none gap-2 p-4 *:px-0"
        style={{ borderColor: color }}
      >
        <CardHeader>
          <CardTitle className="text-xl font-normal truncate" style={{ color }}>
            {value}
          </CardTitle>
          <CardDescription className="text-foreground truncate">
            {title}
          </CardDescription>
        </CardHeader>
        <CardFooter
          className="h-min p-3! rounded"
          style={{ background: color }}
        >
          <Icon className="text-foreground invert-100" />
        </CardFooter>
      </Card>
    </div>
  );
}

export function Dashboard() {
  const [groupBy, setGroupBy] = useState("category");
  const [metric, setMetric] = useState("revenue");
  const [interval, setInterval] = useState("month");

  const { control, watch, reset } = useForm({
    resolver: zodResolver(
      dashboardChartSchema.pick({
        startDate: true,
        endDate: true,
      }),
    ),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const {
    result: { data: chartData },
    query: { isLoading: isChartDataLoading },
  } = useCustom({
    url: "/dashboard/chart",
    method: "get",
    config: {
      query: { groupBy, interval, startDate, endDate },
    },
  });

  const {
    result: { data: orderStatusData },
    query: { isLoading: isOrderStatusDataLoading },
  } = useCustom({
    url: "/dashboard/order-statuses",
    method: "get",
  });

  const {
    result: { data: summaryData },
    query: { isLoading: isSummaryDataLoading },
  } = useCustom({
    url: "/dashboard/summary",
    method: "get",
  });

  const { data: user } = useGetIdentity();

  const loading =
    isChartDataLoading || isOrderStatusDataLoading || isSummaryDataLoading;

  return (
    <ListView>
      <ListViewHeader title="Dashboard" />
      <LoadingOverlay loading={loading} className="h-[300px]">
        {loading || (
          <div className="space-y-8">
            <h1 className="text-3xl mb-4">
              ✨&ensp;Good to see you again,{" "}
              <span className="text-primary">{user?.fullName}</span>!
            </h1>
            <p className="text-muted-foreground mb-8">
              A quick glance at your store's performance and order activity.
            </p>
            <div className="flex flex-col @lg:flex-row justify-center items-center gap-12">
              <OrderStatusBarChart data={orderStatusData} />
              <div className="grid @3xl:grid-cols-2 gap-2 items-center w-full">
                <SummaryCard
                  color="var(--chart-1)"
                  title="Revenue"
                  value={longCurrencyFormatter.format(summaryData.totalRevenue)}
                  Icon={WalletCards}
                />
                <SummaryCard
                  color="var(--chart-2)"
                  title="Avg. order value"
                  value={longCurrencyFormatter.format(
                    summaryData.averageOrderValue,
                  )}
                  Icon={ShoppingBag}
                />
                <SummaryCard
                  color="var(--chart-3)"
                  title="Products"
                  value={summaryData.totalProducts}
                  Icon={Package2}
                />
                <SummaryCard
                  color="var(--chart-4)"
                  title="Customers"
                  value={summaryData.totalUsers}
                  Icon={CircleUserRound}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={groupBy}
                  onValueChange={(value) => setGroupBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Group by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="category">Categories</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={metric}
                  onValueChange={(value) => setMetric(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="purchasedQuantity">Purchases</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={interval}
                  onValueChange={(value) => setInterval(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-6! mx-2" />
                <div className="flex items-center gap-2">
                  <DatePicker control={control} name="startDate" />
                  <Minus className="text-input" />
                  <DatePicker control={control} name="endDate" />
                  <Button variant="ghost" size="icon" onClick={() => reset()}>
                    <Eraser />
                  </Button>
                </div>
              </div>
              <DashboardBarChart
                {...chartData}
                metric={metric}
                interval={interval}
              />
            </div>
          </div>
        )}
      </LoadingOverlay>
    </ListView>
  );
}
