import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useForm, useWatch } from "react-hook-form";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import clsx from "clsx";
import { FaCaretDown, FaCircleInfo, FaCreditCard, FaMinus, FaPlus, FaSpinner, FaTrash } from "react-icons/fa6";
import { useSelect } from "downshift";
import parsePhoneNumber from "libphonenumber-js";
import { Image } from "@/components/Image";
import { useDebounce } from "react-use";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";

function CartItemInput({ cartItem }) {
  const { register, control, setValue } = useForm();
  const { quantity } = useWatch({ control });

  useEffect(() => setValue("quantity", cartItem.quantity), [cartItem.quantity]);

  const queryClient = useQueryClient();
  const { mutate: addOrSubtract, isPending } = useMutation({
    mutationFn: ({ variantId, amount, deleteItem = false }) => api.post("/cart", { variantId, amount, deleteItem }),
    onSuccess: ({ data: { data: cart } = {} }) =>
      queryClient
        .invalidateQueries({
          queryKey: ["cart"],
        })
        .then(() => {
          toast.success("Update successfully");
        }),
    onError: handleError,
  });

  useDebounce(
    () => {
      const amount = quantity - cartItem.quantity;
      if (amount !== 0) {
        addOrSubtract({
          variantId: cartItem.variant.id,
          amount,
        });
      }
    },
    500,
    [quantity],
  );

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex items-center border border-gray-300 dark:border-gray-600 w-max rounded-lg">
        <button className="btn h-8! px-2.5!" onClick={() => setValue("quantity", quantity - 1)}>
          <FaMinus className="size-3" />
        </button>
        <input
          {...register("quantity", {
            valueAsNumber: true,
          })}
          className="outline-none w-12 h-8 text-center disabled:opacity-50"
        />
        <button className="btn h-8! px-2.5!" onClick={() => setValue("quantity", quantity + 1)}>
          <FaPlus className="size-3" />
        </button>
      </div>
      <button
        className="btn h-8! px-2! *:size-4 text-rose-500"
        onClick={() =>
          addOrSubtract({
            variantId: cartItem.variant.id,
            deleteItem: true,
          })
        }
      >
        <FaTrash />
      </button>
      {isPending && <FaSpinner className="animate-spin ml-auto mr-2 opacity-50 size-5" />}
    </div>
  );
}

function ShippingAddressSelect({ user, form }) {
  const { control, setValue } = form;
  const { shippingAddressId } = useWatch({ control });

  const { data: addresses, isPending: isAddressPending } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/profile/shipping-addresses").then((res) => res.data?.data),
    enabled: !!user,
  });

  const { getToggleButtonProps, getLabelProps, getMenuProps, getItemProps, selectedItem, selectItem } = useSelect({
    items: addresses ?? [],
    onSelectedItemChange: ({ selectedItem }) => setValue("shippingAddressId", selectedItem.id),
  });

  useEffect(() => {
    const defaultAddress = addresses?.find((address) => address.isDefault);
    if (defaultAddress && !shippingAddressId) {
      setValue("shippingAddressId", defaultAddress.id);
      selectItem(defaultAddress);
    }
  }, [addresses]);

  return (
    <>
      <div className="relative">
        <label className="floating-label w-full h-12 group" {...getToggleButtonProps()}>
          <button type="button" className="floating-label__input text-left" disabled={isAddressPending} {...getLabelProps()}>
            {selectedItem?.address ?? ""}
          </button>
          <span className="floating-label__label dark:bg-gray-800!">Shipping address</span>
          <FaCaretDown className="floating-label__icon floating-label__icon--right group-aria-[expanded=true]:rotate-180 transition" />
        </label>
        <ul className="popover menu absolute top-full right-0 w-full" {...getMenuProps()}>
          {addresses?.map((item, index) => (
            <li key={index} className="menu-item h-auto! py-2" {...getItemProps({ item, index })}>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold">{item.fullName}</span>
                  {item.isDefault && <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-lg">Default</span>}
                </div>
                <span>{item.address}</span>
                <span>+84 {parsePhoneNumber(item.phoneNumber, "VN").formatNational()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-1 [&>li]:flex [&>li]:justify-between [&>li]:gap-2 [&_span]:first:font-bold [&_span]:first:opacity-75">
        <li>
          <span>Address:</span> {selectedItem?.address ?? "None"}
        </li>
        <li>
          <span>Full name:</span> {selectedItem?.fullName ?? "None"}
        </li>
        <li>
          <span>Phone number:</span> {selectedItem ? "+84 " + parsePhoneNumber(selectedItem.phoneNumber, "VN").formatNational() : "None"}
        </li>
      </ul>
    </>
  );
}

export function Cart() {
  const [discountValue, setDiscountValue] = useState(0);

  const { data: user, isPending: isUserPending } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  const { data: cart, isPending: isCartPending } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get("/cart").then((res) => res.data?.data),
  });

  const form = useForm({
    reValidateMode: "onSubmit",
  });
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    trigger,
    clearErrors,
  } = form;
  const { discountCode, loyaltyPointsToUse } = useWatch({ control });

  const { refetch } = useQuery({
    queryKey: ["discount-codes", discountCode],
    queryFn: () => api.get(`/discount-codes/${discountCode}`).then((res) => res.data?.data),
    enabled: false,
  });

  useDebounce(
    () => {
      clearErrors("discountCode");
      setDiscountValue(0);
      if (discountCode) {
        trigger("discountCode");
      }
    },
    500,
    [discountCode],
  );

  useEffect(() => {
    clearErrors("loyaltyPointsToUse");
    if (loyaltyPointsToUse) {
      trigger("loyaltyPointsToUse");
    }
  }, [loyaltyPointsToUse]);

  const finalLoyaltyPoints = errors.loyaltyPointsToUse ? 0 : loyaltyPointsToUse || 0;
  const finalAmount = Math.max((cart?.sumAmount ?? 0) - discountValue - finalLoyaltyPoints, 0);

  return (
    <main className="mx-auto w-[min(1200px,92%)] py-10 space-y-5">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">Your cart</h1>
      <div className="grid lg:grid-cols-[auto_400px] gap-4">
        <ul className="bg-white dark:bg-gray-800 shadow-lg rounded-lg h-max">
          {cart?.cartItems.map((item, i) => (
            <li key={i} className="flex items-center gap-4 p-4 not-last:border-b border-gray-200 dark:border-gray-700">
              <Image src={item.variant.product.imageUrls?.[0]} className="shrink-0 size-20 rounded-lg" />
              <div className="flex flex-col w-full">
                <p className="flex items-center gap-2 justify-between">
                  <span>
                    {item.variant.product.name} &mdash; {item.variant.name}
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-400">{longCurrencyFormatter.format(item.variant.price * item.quantity)}</span>
                </p>
                <span className="opacity-75 text-sm mb-1">{longCurrencyFormatter.format(item.variant.price)} / item</span>
                <CartItemInput cartItem={item} />
              </div>
            </li>
          ))}
        </ul>
        <form className="space-y-4" onSubmit={handleSubmit(() => {})}>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-4">
            <h3 className="text-xl font-bold">Summary</h3>
            <label className="floating-label mb-2">
              <input
                {...register("discountCode", {
                  validate: async (value) => {
                    setDiscountValue(0);

                    if (!value) {
                      return true;
                    }

                    const { isError, error, data } = await refetch();

                    if (isError) {
                      handleError(error);
                      return "Something went wrong";
                    }

                    if (!data) {
                      return "Discount not found";
                    }
                    if (data.numOfUsage >= data.usageLimit) {
                      return "Discount not available";
                    }

                    setDiscountValue(data.type === "PERCENTAGE" ? (data.value * (cart?.sumAmount ?? 0)) / 100 : data.value);
                    return true;
                  },
                })}
                placeholder=""
                className="floating-label__input"
              />
              <span className="floating-label__label dark:bg-gray-800!">Discount code</span>
            </label>
            <p className="text-red-500 mb-4">{errors.discountCode?.message}</p>
            {isUserPending ? (
              <div className="flex justify-center items-center h-[76px]">
                <FaSpinner className="animate-spin size-5 opacity-50" />
              </div>
            ) : (
              user && (
                <>
                  <label className="floating-label mb-2">
                    <input
                      {...register("loyaltyPointsToUse", {
                        valueAsNumber: true,
                        validate: (value) => (value > (user?.loyaltyPoints ?? Number.MAX_SAFE_INTEGER) ? "Not enough loyalty points" : true),
                      })}
                      placeholder=""
                      className="floating-label__input"
                    />
                    <span className="floating-label__label dark:bg-gray-800!">Loyalty points</span>
                  </label>
                  <p className={clsx("text-sm flex items-center gap-2 opacity-75", errors.loyaltyPointsToUse && "text-red-500")}>
                    Available: {new Intl.NumberFormat("vi-VN").format(user.loyaltyPoints)} {errors.loyaltyPointsToUse && <FaExclamationTriangle className="size-4" />}
                  </p>
                </>
              )
            )}
            <hr className="border-dashed border-t-2 border-gray-300 dark:border-gray-600" />
            <ul className="space-y-1 [&>li]:flex [&>li]:justify-between [&>li]:gap-2 [&_span]:first:font-bold [&_span]:first:opacity-75">
              <li>
                <span>Subtotal:</span> {cart ? longCurrencyFormatter.format(cart.sumAmount) : <div className="placeholder w-20 my-1"></div>}
              </li>
              <li>
                <span>Discount:</span> {longCurrencyFormatter.format(-discountValue)}
              </li>
              <li>
                <span>Loyalty points:</span> {longCurrencyFormatter.format(-finalLoyaltyPoints)}
              </li>
              <hr className="border-dashed border-t-2 border-gray-300 dark:border-gray-600 my-4" />
              <li>
                <span className="text-rose-600 dark:text-rose-400">Final amount:</span> {cart ? longCurrencyFormatter.format(finalAmount) : <div className="placeholder w-20 my-1"></div>}
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-4">
            <h3 className="text-xl font-bold">Shipping Info</h3>
            {user ? (
              <ShippingAddressSelect user={user} form={form} />
            ) : (
              <>
                <label className="floating-label">
                  <input placeholder="" className="floating-label__input" />
                  <span className="floating-label__label dark:bg-gray-800!">Full name</span>
                </label>
                <label className="floating-label">
                  <input placeholder="" className="floating-label__input" />
                  <span className="floating-label__label dark:bg-gray-800!">Email</span>
                </label>
                <label className="floating-label">
                  <input placeholder="" className="floating-label__input" />
                  <span className="floating-label__label dark:bg-gray-800!">Address</span>
                </label>
                <label className="floating-label">
                  <input placeholder="" className="floating-label__input" />
                  <span className="floating-label__label dark:bg-gray-800!">Phone number</span>
                </label>
                <p className="opacity-75 text-sm flex items-center gap-2">
                  <FaCircleInfo className="size-4 text-blue-600" /> An account will be created to save these info.
                </p>
              </>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={false}>
            {false ? <FaSpinner className="animate-spin" /> : <FaCreditCard />}
            Checkout now!
          </button>
        </form>
      </div>
    </main>
  );
}
