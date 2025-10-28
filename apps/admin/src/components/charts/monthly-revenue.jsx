import { CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { shortCurrencyFormatter } from "@mint-boutique/formatters";

const chartConfig = {};

export function MonthlyRevnueLineChart({ data }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="font-normal">Revenue</CardTitle>
        <CardDescription>
          {data[0].date} &rarr; {data.at(-1).date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[200px]">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveStart"
            />
            <YAxis
              dataKey="amount"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => shortCurrencyFormatter.format(value)}
            />
            <Line dataKey="amount" strokeWidth={2} stroke="var(--chart-1)" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
