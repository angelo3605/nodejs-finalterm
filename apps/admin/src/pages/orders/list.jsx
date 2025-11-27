import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useTable } from "@refinedev/react-table";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotification, useUpdate } from "@refinedev/core";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Package2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { format } from "date-fns";
import parsePhoneNumber from "libphonenumber-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Link } from "react-router";

const statusColors = {
  PENDING: "bg-chart-5/10! *:text-chart-5!",
  PROCESSING: "bg-chart-2/10! *:text-chart-2!",
  DELIVERING: "bg-chart-4/10! *:text-chart-4!",
  DELIVERED: "bg-chart-1/10! *:text-chart-1!",
  CANCELLED: "bg-chart-3/10! *:text-chart-3!",
};

export function ListOrders() {
  const { open } = useNotification();

  const columns = useMemo(() => [
    {
      id: "expander",
      header: "",
      size: 80,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </Button>
      ),
    },
    {
      id: "id",
      header: "Order ID",
      size: 80,
      cell: ({ row: { original: order } }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="cursor-pointer hover:underline"
              onClick={async () => {
                await navigator.clipboard.writeText(order.id);
                open?.({
                  type: "success",
                  message: "Success",
                  description: "Copied to clipboard",
                });
              }}
            >
              <pre>{order.id.slice(-6)}</pre>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <pre>{order.id}</pre>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "createdAt",
      header: "Date of Purchase",
      size: 200,
      cell: ({ row: { original: order } }) =>
        format(new Date(order.createdAt), "dd/MM/yyyy HH:mm"),
    },
    {
      id: "customer",
      header: "Customer",
      size: 240,
      cell: ({ row: { original: order } }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {order.user.fullName.replace(" ", "").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {order.user.fullName} {`<${order.user.email}>`}
        </div>
      ),
    },
    {
      id: "totalAmount",
      header: "Total Amount",
      size: 120,
      cell: ({ row: { original: order } }) =>
        longCurrencyFormatter.format(order.totalAmount),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row: { original: order } }) => {
        const {
          mutate,
          mutation: { isPending },
        } = useUpdate({
          resource: "orders",
        });

        return (
          <div className="flex items-center gap-2 p-1">
            <Select
              value={order.status}
              onValueChange={(status) =>
                mutate({ id: order.id, values: { status } })
              }
              disabled={isPending}
            >
              <SelectTrigger
                className={cn(
                  "w-32 border-none shadow-none rounded-full h-8!",
                  statusColors[order.status],
                )}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="DELIVERING">Delivering</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Spinner className={isPending || "opacity-0"} />
          </div>
        );
      },
    },
  ]);

  const table = useTable({
    columns,
    getRowCanExpand: () => true,
  });

  const OrderInfo = ({ title, children }) => (
    <div>
      <span className="text-muted-foreground text-sm">{title}</span>
      <p className="pt-1 text-wrap">{children}</p>
    </div>
  );

  const OrderDetailEntry = ({ left, right, isMuted }) => (
    <div className="flex justify-between">
      <span className={cn(isMuted && "text-muted-foreground")}>{left}</span>
      <span>{right}</span>
    </div>
  );

  const renderSubComponent = ({ row: { original: order } }) => (
    <div className="space-y-6 p-6 @container">
      <div className="grid grid-cols-3 gap-8">
        <OrderInfo title="Date of Purchase">
          {format(new Date(order.createdAt), "dd MMM yyyy")}
          <br />
          at {format(new Date(order.createdAt), "HH:mm")}
        </OrderInfo>
        <OrderInfo title="Shipping Info">
          {order.shippingAddress.fullName} (
          {parsePhoneNumber(
            order.shippingAddress.phoneNumber,
            "VN",
          ).formatNational()}
          )
          <br />
          {["address", "ward", "district", "province"]
            .map((k) => order.shippingAddress[k])
            .filter(Boolean)
            .join(", ")}
        </OrderInfo>
        <OrderInfo title="Payment Method">
          {order.payment ? (
            <>
              {order.payment.cardType} ({order.payment.bankCode})
              <br />
              {format(order.payment.payDate, "dd/MM/yyyy HH:mm")}
            </>
          ) : (
            "None"
          )}
        </OrderInfo>
      </div>
      <div className="grid grid-cols-2 border min-h-[300px]">
        <div className="border-r p-4 flex flex-col gap-4">
          <h6 className="font-bold">Order details</h6>
          <div className="space-y-1">
            {order.orderItems.map((item) => (
              <OrderDetailEntry
                left={`${item.quantity} \u00d7 ${item.productName} (${item.variantName})`}
                right={longCurrencyFormatter.format(item.sumAmount)}
              />
            ))}
          </div>
          <hr className="border-dotted border-t-2 w-full mt-auto" />
          <div className="space-y-1">
            <OrderDetailEntry
              left="Subtotal"
              right={longCurrencyFormatter.format(order.sumAmount)}
              isMuted={true}
            />
            <OrderDetailEntry
              left={`Discount code (${order.discountCode || "None"})`}
              right={longCurrencyFormatter.format(-order.discountValue)}
              isMuted={true}
            />
            <OrderDetailEntry
              left={`Used loyalty points (${order.loyaltyPointsUsed})`}
              right={longCurrencyFormatter.format(
                order.loyaltyPointsUsed * -1_000,
              )}
              isMuted={true}
            />
            <OrderDetailEntry
              left="Discounted Total"
              right={
                <span className="text-red-600 dark:text-red-400 font-bold">
                  {longCurrencyFormatter.format(order.totalAmount)}
                </span>
              }
              isMuted={true}
            />
          </div>
        </div>
        <div className="p-4 flex flex-col space-y-4">
          <h6 className="font-bold">Status</h6>
          {order.OrderLog.length ? (
            <div className="flex flex-col">
              {order.OrderLog.map((log, i) => {
                const isNotLast = i < order.OrderLog.length - 1;
                return (
                  <div
                    key={i}
                    className="*:grid *:grid-cols-[20px_auto] *:gap-4 group"
                  >
                    <div>
                      <div
                        className={cn(
                          "h-full aspect-square rounded-full",
                          isNotLast ? "bg-foreground/25" : "bg-primary",
                        )}
                      ></div>
                      <span>{format(log.createdAt, "dd/MM/yyyy HH:mm")}</span>
                    </div>
                    <div>
                      <Separator
                        orientation="vertical"
                        className={cn("mx-2.5", isNotLast || "opacity-0")}
                      />
                      <div className="grid grid-cols-[max-content_max-content] space-x-8 *:odd:text-muted-foreground mt-2 group-not-last:mb-6">
                        <span>Status</span>
                        <div
                          className={cn(
                            statusColors[log.newStatus],
                            "w-max px-1.5 py-0.5 rounded-sm",
                          )}
                        >
                          <span>{log.newStatus}</span>
                        </div>
                        <span>Changed by</span>
                        <span>{log.userId ? "Administrator" : "System"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex justify-center items-center text-muted-foreground">
              Emptiness...
            </div>
          )}
          <Link
            to={
              order.status === "PROCESSING"
                ? `/orders/shipment/${order.id}`
                : "#"
            }
            className="mt-auto"
          >
            <Button
              disabled={order.status !== "PROCESSING"}
              className=" w-full"
            >
              {order.status.includes("DELIVER") ? (
                <>
                  <CheckCircle /> Already delivering
                </>
              ) : order.status === "PROCESSING" ? (
                <>
                  <Package2 /> Start delivery
                </>
              ) : (
                <>
                  <TriangleAlert /> Cannot deliver
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} renderSubComponent={renderSubComponent} />
    </ListView>
  );
}
