import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useTable } from "@refinedev/react-table";
import { useMemo } from "react";

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
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import parsePhoneNumber from "libphonenumber-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";

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
      <p className="pt-1">{children}</p>
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
      <div className="grid grid-cols-3 gap-2">
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
          {order.shippingAddress.address}
        </OrderInfo>
        <OrderInfo title="Payment Method">None</OrderInfo>
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
              left={`Discount code (${order.discountCode})`}
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
        <div className="p-4">
          <h6 className="font-bold">Payment & shipping</h6>
        </div>
      </div>
      {/*<div className="grid grid-cols-2 gap-2">*/}
      {/*  {[*/}
      {/*    { label: "Full name", value: order.user.fullName },*/}
      {/*    { label: "Email address", value: order.user.email },*/}
      {/*    { label: "Phone number", value: order.shippingAddress.phoneNumber },*/}
      {/*    { label: "Shipping address", value: order.shippingAddress.address },*/}
      {/*  ].map(({ label, value }, i) => (*/}
      {/*    <span key={i}>*/}
      {/*      <strong>{label}:</strong> {value}*/}
      {/*    </span>*/}
      {/*  ))}*/}
      {/*</div>*/}
      {/*<Table className="border">*/}
      {/*  <TableHeader className="border-b">*/}
      {/*    <TableRow>*/}
      {/*      <TableHead>Product</TableHead>*/}
      {/*      <TableHead>Variant</TableHead>*/}
      {/*      <TableHead className="text-right">Quantity</TableHead>*/}
      {/*      <TableHead className="text-right">Unit price</TableHead>*/}
      {/*      <TableHead className="text-right">Sum</TableHead>*/}
      {/*    </TableRow>*/}
      {/*  </TableHeader>*/}
      {/*  <TableBody>*/}
      {/*    {order.orderItems.map((item, i) => (*/}
      {/*      <TableRow key={i}>*/}
      {/*        <TableCell>{item.productName}</TableCell>*/}
      {/*        <TableCell>{item.variantName}</TableCell>*/}
      {/*        <TableCell className="text-right">{item.quantity}</TableCell>*/}
      {/*        <TableCell className="text-right">*/}
      {/*          {longCurrencyFormatter.format(item.unitPrice)}*/}
      {/*        </TableCell>*/}
      {/*        <TableCell className="text-right">*/}
      {/*          {longCurrencyFormatter.format(item.sumAmount)}*/}
      {/*        </TableCell>*/}
      {/*      </TableRow>*/}
      {/*    ))}*/}
      {/*  </TableBody>*/}
      {/*  <TableFooter>*/}
      {/*    <TableRow>*/}
      {/*      <TableCell colSpan={4}>Total</TableCell>*/}
      {/*      <TableCell className="text-right">*/}
      {/*        {longCurrencyFormatter.format(order.sumAmount)}*/}
      {/*      </TableCell>*/}
      {/*    </TableRow>*/}
      {/*    <TableRow>*/}
      {/*      <TableCell colSpan={4}>*/}
      {/*        Discount code ({order.discountCode || "none"})*/}
      {/*      </TableCell>*/}
      {/*      <TableCell className="text-right">*/}
      {/*        {longCurrencyFormatter.format(order.discountValue * -1)}*/}
      {/*      </TableCell>*/}
      {/*    </TableRow>*/}
      {/*    <TableRow>*/}
      {/*      <TableCell colSpan={4}>Loyalty points</TableCell>*/}
      {/*      <TableCell className="text-right">*/}
      {/*        {order.loyaltyPointsUsed} &times;{" "}*/}
      {/*        {longCurrencyFormatter.format(-1000)}*/}
      {/*      </TableCell>*/}
      {/*    </TableRow>*/}
      {/*    <TableRow>*/}
      {/*      <TableCell colSpan={4}>Final</TableCell>*/}
      {/*      <TableCell className="text-right text-red-700 dark:text-red-400">*/}
      {/*        {longCurrencyFormatter.format(order.totalAmount)}*/}
      {/*      </TableCell>*/}
      {/*    </TableRow>*/}
      {/*  </TableFooter>*/}
      {/*</Table>*/}
    </div>
  );

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} renderSubComponent={renderSubComponent} />
    </ListView>
  );
}
