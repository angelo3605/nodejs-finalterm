import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { Link, useParams } from "react-router";
import { FaArrowLeft, FaCircleInfo, FaSpinner } from "react-icons/fa6";
import { format } from "date-fns";
import { formatAddress } from "@/utils/formatAddress";
import { parsePhoneNumber } from "libphonenumber-js";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import clsx from "clsx";

export function Order() {
  const { id } = useParams();

  const { data: order, isPending } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => api.get(`/orders/${id}`).then((res) => res.data?.data),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <FaSpinner className="animate-spin opacity-50 size-8" />
      </div>
    );
  }

  return (
    <>
      <div>
        <Link to="/profile/orders" className="link py-2 mb-2">
          <FaArrowLeft /> Back
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <h2 className="text-xl font-bold">
              Details of Order <code>{order.id.slice(-6)}</code>
            </h2>
            <p className="opacity-75">
              <code>{order.id}</code> &bull; {format(order.createdAt, "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div className="flex flex-col items-end *:w-max gap-2 ml-auto">
            <span className="opacity-75 leading-none">Current status</span>
            <span
              className="font-medium text-white dark:text-black px-2 py-0.5 rounded-lg w-max"
              style={{
                background: `var(--status-${order.status.toLowerCase()})`,
              }}
            >
              {order.status[0] + order.status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-5 flex-col md:flex-row">
        {order.OrderLog && (
          <ul className="flex flex-col shrink-0">
            <li className="font-bold mb-4">Status</li>
            {order.OrderLog.map((log, i) => {
              const isNotLast = i < order.OrderLog.length - 1;
              return (
                <li key={i} className="*:grid *:grid-cols-[20px_auto] *:gap-4 group">
                  <div>
                    <div className={clsx("h-full aspect-square rounded-full", isNotLast ? "bg-gray-300 dark:bg-gray-600" : "bg-emerald-600")}></div>
                    <span>{format(log.createdAt, "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  <div>
                    <div className={clsx("border-r-2 border-dotted h-full mx-3 border-gray-300 dark:border-gray-700", isNotLast || "opacity-0")}></div>
                    <div className="grid grid-cols-[max-content_max-content] *:odd:mr-12 *:odd:opacity-50 *:odd:font-medium mt-2 group-not-last:mb-6 items-center">
                      <span>Status</span>
                      <span
                        className="font-medium text-white dark:text-black px-2 py-0.5 rounded-lg w-max"
                        style={{
                          background: `var(--status-${log.newStatus.toLowerCase()})`,
                        }}
                      >
                        {log.newStatus[0] + log.newStatus.slice(1).toLowerCase()}
                      </span>
                      <span>Changed by</span>
                      <span>{log.userId ? "Administrator" : "System"}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex gap-4 [&>div]:bg-gray-100 [&>div]:dark:bg-gray-700 [&>div]:p-4 [&>div]:rounded-lg [&>div]:w-full flex-col flex-1">
          <div>
            <span className="font-bold mb-2 block">Shipping info</span>
            <p>
              {order.shippingAddress.fullName}
              <br />
              {formatAddress(order.shippingAddress)}
              <br />
              {order.user.email} &bull; {parsePhoneNumber(order.shippingAddress.phoneNumber, "VN").formatNational()}
            </p>
          </div>
          <div>
            <span className="font-bold mb-2 block">Payment</span>
            <ul className="[&>li]:flex [&>li]:justify-between [&>li]:gap-4 [&>li]:text-right [&_span]:first:font-medium [&_span]:first:opacity-75 [&_span]:first:text-left">
              <li>
                <span>Transaction ID:</span> <code>{Number(order.payment?.transactionId ?? 0) || "Unavailable"}</code>
              </li>
              <li>
                <span>Pay date:</span> {format(order.payment?.payDate ?? new Date(), "dd/MM/yyyy HH:mm")}
              </li>
              <li>
                <span>Response code:</span>
                {String(order.payment?.responseCode ?? 99).padStart(2, "0")}
              </li>
              <li>
                <span>Bank code:</span> {order.payment?.bankCode}
              </li>
              <li>
                <span>Card type:</span> {order.payment?.cardType}
              </li>
            </ul>
          </div>
          {order.shipment && (
            <>
              <div>
                <span className="font-bold mb-2 block">Shipment status</span>
                <ul className="[&>li]:flex [&>li]:justify-between [&>li]:gap-4 [&>li]:text-right [&_span]:first:font-medium [&_span]:first:opacity-75 [&_span]:first:text-left">
                  <li>
                    <span>Delivery order ID:</span> <code>{order.shipment.orderCode}</code>
                  </li>
                  <li>
                    <span>Expected delivery date:</span> {format(order.shipment.expectedDeliveryTime, "dd/MM/yyyy")}
                  </li>
                  <li>
                    <span>Transportation:</span> {order.shipment.transportation[0].toUpperCase() + order.shipment.transportation.slice(1)}
                  </li>
                  <li>
                    <span>Confirmed fee:</span> {longCurrencyFormatter.format(order.shipment.fee)}
                  </li>
                </ul>
              </div>
              <p className="opacity-75">
                <FaCircleInfo className="inline size-4 -mt-1 mr-2 text-blue-600" />
                If the confirmed fee differs from the estimate, no worries; you won't be charged extra!
              </p>
            </>
          )}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product name</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Sum</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, i) => (
            <tr key={i}>
              <td>
                {item.productName} &mdash; {item.variantName}
              </td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">{longCurrencyFormatter.format(item.sumAmount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="font-bold">
              Subtotal
            </td>
            <td className="text-right">{longCurrencyFormatter.format(order.sumAmount)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="font-bold">
              Shipping fee
            </td>
            <td className="text-right">{longCurrencyFormatter.format(order.initialShippingFee ?? 0)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="font-bold">
              Discount code ({order.discountCode ?? "None"})
            </td>
            <td className="text-right">{longCurrencyFormatter.format(-(order.discountValue ?? 0))}</td>
          </tr>
          <tr>
            <td colSpan={2} className="font-bold">
              Loyalty points ({new Intl.NumberFormat("vi-VN").format(order.loyaltyPointsUsed ?? 0)})
            </td>
            <td className="text-right">{longCurrencyFormatter.format((order.loyaltyPointsUsed ?? 0) * -1_000)}</td>
          </tr>
          <tr className="font-bold">
            <td colSpan={2}>Final total</td>
            <td className="text-right">{longCurrencyFormatter.format(order.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
