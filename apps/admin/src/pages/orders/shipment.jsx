import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view.jsx";
import { Link, useParams } from "react-router";
import {
  useCustom,
  useNavigation,
  useNotification,
  useShow,
} from "@refinedev/core";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ghnSchema } from "@mint-boutique/zod-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, TriangleAlert, Truck } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { cn } from "@/lib/utils.js";
import { Spinner } from "@/components/ui/spinner.jsx";

export function Shipment() {
  const { id } = useParams();
  const { push } = useNavigation();
  const { open: notify } = useNotification();

  const [fee, setFee] = useState(0);
  const [feeError, setFeeError] = useState(null);

  const {
    query: { isLoading, data },
  } = useShow({
    resource: "orders",
    id,
  });
  const order = data?.data;

  if (order && order?.status !== "PROCESSING") {
    push("/orders");
  }

  const form = useForm({
    resolver: zodResolver(ghnSchema),
    defaultValues: {
      id: "",
      width: "",
      height: "",
      length: "",
      weight: "",
    },
  });

  const formValues = useWatch({ control: form.control });
  const { width, height, length, weight } = formValues;

  useEffect(() => {
    if (order?.id) {
      form.setValue("id", order.id);
    }
  }, [order]);

  const {
    query: { isFetching: isFeeLoading, refetch: getFee },
  } = useCustom({
    url: "/shipment/fee",
    method: "get",
    config: {
      query: {
        ...formValues,
        orderId: order?.id,
        wardName: order?.shippingAddress.ward,
        districtName: order?.shippingAddress.district,
      },
    },
    queryOptions: {
      enabled: false,
      retry: false,
    },
  });

  useEffect(() => {
    if (width && height && length && weight) {
      getFee()
        .then((res) => {
          const data = res.data;
          if (Object.keys(data).length) {
            if (Number.isFinite(data?.data)) {
              setFee(data.data);
              setFeeError(null);
            } else {
              setFeeError(data?.message ?? "Something went wrong");
            }
          }
        })
        .catch((err) => console.log(err));
    }
  }, [width, height, length, weight]);

  const {
    query: { isFetching: isCreatingDeliver, refetch: deliver },
  } = useCustom({
    url: "/shipment/create",
    method: "post",
    config: {
      payload: formValues,
    },
    queryOptions: {
      enabled: false,
      retry: false,
    },
  });

  const isAllLoading = isLoading || isCreatingDeliver;

  return (
    <ListView>
      <ListViewHeader title="Shipment" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() =>
            deliver().then((res) => {
              const data = res.data;
              if (data?.message) {
                notify?.({
                  type: "error",
                  message: "Error while creating parcel",
                  description: data.message,
                });
              } else {
                notify?.({
                  type: "success",
                  message: "Package is being shipped",
                  description: `Expected delivery time: ${format(data?.data?.expectedDeliveryTime, "dd/MM/yyyy HH:mm")}`,
                });
                push("/orders");
              }
            }),
          )}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/orders">
                <ArrowLeft />
              </Link>
            </Button>
            <Button type="submit" disabled={isAllLoading}>
              {isAllLoading ? <Spinner /> : <Truck />} Dispatch
            </Button>
          </div>
          <div className="grid @xl:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="id"
              disabled={true}
              render={({ field }) => (
                <FormItem className="@xl:col-span-2">
                  <FormLabel>Order ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Loading..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="width"
              disabled={isAllLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
                  <FormControl>
                    <Input placeholder="<200 cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              disabled={isAllLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input placeholder="<200 cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              disabled={isAllLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <FormControl>
                    <Input placeholder="<200 cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              disabled={isAllLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input placeholder="<50,000 g" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-sm">Estimated shipping fee</span>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "border rounded w-max py-2 px-4 flex items-center gap-2",
                  feeError &&
                    "text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
                )}
              >
                {feeError ? (
                  <>
                    <TriangleAlert className="size-5" /> {feeError}
                  </>
                ) : (
                  longCurrencyFormatter.format(fee)
                )}
              </span>
              {isFeeLoading && <Spinner />}
            </div>
          </div>
        </form>
      </Form>
    </ListView>
  );
}
