import {
  Pie,
  PieChart,
  Label,
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  LabelList,
  YAxis,
} from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

const chartConfig = {
  orders: {
    label: "Orders",
  },
  revenue: {
    label: "Revenue",
  },
};

export function OrdersOverTimeLineChart({ dailyData, monthlyData }) {
  const [xkey, setXKey] = useState("day");
  const [ykey, setYKey] = useState("orders");

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
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Orders over time</CardTitle>
        <CardDescription>
          {xkey === "day" ? "Last 7 days" : "Last 6 months"}
        </CardDescription>
        <CardAction className="flex flex-wrap gap-2">
          <Select value={ykey} onValueChange={(value) => setYKey(value)}>
            <SelectTrigger>
              <SelectValue placeholder="View..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="revenue">Revenue (100k)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={xkey} onValueChange={(value) => setXKey(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Period..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">7 days</SelectItem>
              <SelectItem value="month">6 months</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig} className="w-full max-h-[200px]">
          <LineChart
            accessibilityLayer
            data={xkey === "day" ? dailyData : monthlyData}
            margin={{ top: 30 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xkey}
              tickLine={false}
              axisLine={false}
              interval={0}
              padding={{ left: 40, right: 40 }}
            />
            <YAxis
              dataKey={ykey}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                ykey === "revenue" ? (value / 100_000).toFixed(2) : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey={xkey}
                  formatter={(value, name, props) => (
                    <>
                      <p className="font-bold w-full">{props.payload[xkey]}</p>
                      <div className="flex items-center w-full justify-between gap-4">
                        <span>{chartConfig[name]?.label ?? name}</span>
                        <span>
                          {ykey === "revenue" ? formatter.format(value) : value}
                        </span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Line
              dataKey={ykey}
              type="natural"
              stroke="var(--chart-1)"
              strokeWidth={2}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                formatter={(value) =>
                  ykey === "revenue" ? (value / 100_000).toFixed(2) : value
                }
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
