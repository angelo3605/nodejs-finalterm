import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { Link } from "react-router";
import { FaChevronLeft, FaChevronRight, FaUpRightFromSquare } from "react-icons/fa6";
import { format } from "date-fns";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { useEffect, useState } from "react";

function OrderCard({ order }) {
  return (
    <Link to={order ? `/profile/orders/${order.id}` : "#"} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:brightness-95 cursor-pointer flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        {order ? (
          <span
            className="text-sm text-white dark:text-black px-2 py-0.5 rounded-lg"
            style={{
              background: `var(--status-${order.status.toLowerCase()})`,
            }}
          >
            {order.status[0] + order.status.slice(1).toLowerCase()}
          </span>
        ) : (
          <div className="placeholder w-20 h-6! rounded-lg!"></div>
        )}
        <strong>Order</strong>
        <pre className="mt-0.5">{order ? order.id.slice(-6) : <div className="placeholder w-20 my-1"></div>}</pre>
        <FaUpRightFromSquare className="opacity-50 ml-auto" />
      </div>
      <span className="inline-flex gap-2 items-center">
        <span className="font-medium">Created at:</span> {order ? format(order.createdAt, "dd/MM/yyyy HH:mm") : <div className="placeholder w-30"></div>}
      </span>
      <span className="inline-flex gap-2 items-center">
        <span className="font-medium">Total amount:</span> {order ? longCurrencyFormatter.format(order.totalAmount) : <div className="placeholder w-20"></div>}
      </span>
    </Link>
  );
}

export function Orders() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [numOfPages, setNumOfPages] = useState(null);

  const { data: orders, isPending } = useQuery({
    queryKey: ["orders", page, pageSize],
    queryFn: () => api.get(`/orders/me?page=${page}&pageSize=${pageSize}`).then((res) => res.data),
  });

  useEffect(() => {
    if (orders?.total) {
      setNumOfPages(Math.ceil(orders.total / 6));
    }
  }, [orders?.total]);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {isPending ? Array.from({ length: pageSize }, (_, i) => <OrderCard key={i} />) : orders.data.map((order, i) => <OrderCard key={i} order={order} />)}
      </div>
      <div className="flex justify-end items-center mt-auto">
        <span className="mr-4 inline-flex">
          Page {page} of {numOfPages === null ? <div className="placeholder my-1 ml-1.5"></div> : numOfPages}
        </span>
        <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <FaChevronLeft />
        </button>
        <button className="btn" disabled={page === numOfPages || numOfPages === null} onClick={() => setPage(page + 1)}>
          <FaChevronRight />
        </button>
      </div>
    </>
  );
}
