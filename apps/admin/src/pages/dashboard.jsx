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

export function Dashboard() {
  const {
    result: { data },
    query: { isLoading },
  } = useCustom({
    url: "/dashboard",
    method: "get",
  });

  return (
    <ListView>
      <ListViewHeader title="Dashboard" />
      <LoadingOverlay loading={isLoading} className="h-[300px]">
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
