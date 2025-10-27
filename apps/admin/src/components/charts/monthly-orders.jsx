import {
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  LabelList,
  YAxis,
  Cell,
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

export function MonthlyBarChart({ data }) {
  const [ykey, setYKey] = useState("orders");

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        notation: "compact",
        maximumFractionDigits: 2,
      }),
    [],
  );

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="font-normal">Orders over time</CardTitle>
        <CardDescription>
          {new Date(data[0].date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </CardDescription>
        <CardAction className="flex flex-wrap gap-2">
          <Select value={ykey} onValueChange={(value) => setYKey(value)}>
            <SelectTrigger>
              <SelectValue placeholder="View..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig} className="w-full max-h-[200px]">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveStartEnd"
            />
            <YAxis
              dataKey={ykey}
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(v) =>
                ykey === "orders" ? v : formatter.format(v)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={ykey} radius={5} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
