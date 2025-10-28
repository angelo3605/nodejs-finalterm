import { Pie, PieChart, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

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

export function OrderStatusPieChart({ data }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="font-normal">Order statuses</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart margin={{ top: 0 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={data.map((order) => ({
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
                          {
                            data.find(({ status }) => status === "PENDING")
                              .count
                          }
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
      </CardContent>
    </Card>
  );
}
