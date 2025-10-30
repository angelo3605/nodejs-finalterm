import { BarChart, CartesianGrid, Bar, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";

const chartConfig = {};

export function DailyOrdersBarChart({ data }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="font-normal">No. of orders</CardTitle>
        <CardDescription>
          {data[0].date} &rarr; {data.at(-1).date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[200px]">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveStart"
            />
            <YAxis
              dataKey="count"
              orientation="right"
              width={40}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <Bar dataKey="count" radius={2} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
