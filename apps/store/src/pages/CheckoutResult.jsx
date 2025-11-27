import { Link, useNavigate, useSearchParams } from "react-router";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark, FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { format } from "date-fns";
import { vnpayMessages } from "@/utils/vnpayMessages";
import { useState } from "react";
import toast from "react-hot-toast";

export function CheckoutResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastOpen, setToastOpen] = useState(false);
  const navigate = useNavigate();

  const { isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  if (isError) {
    navigate("/login");
    if (!toastOpen) {
      setToastOpen(true);
      toast.success("To view order details, please login");
    }
  }

  const { data: order, isPending } = useQuery({
    queryKey: ["orders", searchParams.get("orderId")],
    queryFn: () => api.get(`/orders/${searchParams.get("orderId")}`).then((res) => res.data?.data),
  });

  const isSuccess = order?.payment?.responseCode === 0;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <FaSpinner className="animate-spin opacity-50 size-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col py-20 mx-auto w-[min(600px,92%)] gap-10 items-center">
      <div className="*:size-24 opacity-50">{isSuccess ? <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" /> : <FaCircleXmark className="text-rose-600 dark:text-rose-400" />}</div>
      <h1 className="text-3xl">{isSuccess ? "Payment Successful" : "Payment Failed"}</h1>
      <div className="w-full p-5 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <ul className="space-y-2 [&>li]:flex [&>li]:justify-between [&>li]:gap-4 [&>li]:text-right [&_span]:first:font-bold [&_span]:first:opacity-75 [&_span]:first:text-left">
          <li>
            <span>Order ID:</span>
            <pre>{searchParams.get("orderId")}</pre>
          </li>
          <li>
            <span>Pay date:</span>
            {format(order.payment?.payDate ?? new Date(), "dd/MM/yyyy HH:mm")}
          </li>
          <li>
            <span>Payment response:</span>
            {vnpayMessages[order.payment?.responseCode ?? 99]} ({String(order.payment?.responseCode ?? 99).padStart(2, "0")})
          </li>
          <li>
            <span>Bank code:</span>
            {order.payment?.bankCode ?? "Unknown"}
          </li>
          <li>
            <span>Card type:</span>
            {order.payment?.cardType ?? "Unknown"}
          </li>
          <div className="flex items-center gap-4 font-bold">
            <hr className="border-t-2 border-dashed opacity-25 flex-1" />
            <span className="opacity-50">Order details</span>
            <hr className="border-t-2 border-dashed opacity-25 flex-1" />
          </div>
          {order.orderItems.map((item, i) => (
            <li key={i}>
              <span>
                {item.productName} &mdash; {item.variantName}
              </span>
              {longCurrencyFormatter.format(item.sumAmount)}
            </li>
          ))}
          <hr className="border-t-2 border-dashed opacity-25 my-5" />
          <li>
            <span className="text-rose-600 dark:text-rose-400">Total amount:</span> {longCurrencyFormatter.format(order.totalAmount)}
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-4 *:flex-1 w-full">
        <Link className="btn btn-primary" to={`/profile/orders/${searchParams.get("orderId")}`}>
          View details
        </Link>
        <Link className="btn btn-secondary" to="/">
          Return to store
        </Link>
      </div>
    </div>
  );
}
