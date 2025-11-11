import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useForm, useWatch } from "react-hook-form";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { useDebounce } from "react-use";
import { handleError } from "@/utils/errorHandler";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import clsx from "clsx";
import { FaCaretDown, FaCircleInfo, FaCreditCard, FaMinus, FaPlus, FaSpinner } from "react-icons/fa6";
import { useSelect } from "downshift";
import parsePhoneNumber from "libphonenumber-js";
import { Image } from "@/components/Image";

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

  const { data: addresses, isPending: isAddressPending } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/profile/shipping-addresses").then((res) => res.data?.data),
    enabled: !!user,
  });

  const {
    register,
    control,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { discountCode, loyaltyPointsToUse, shippingAddressId } = useWatch({ control });

  const { refetch } = useQuery({
    queryKey: ["discount-codes", discountCode],
    queryFn: () => api.get(`/discount-codes/${discountCode}`).then((res) => res.data?.data),
    enabled: false,
  });

  useDebounce(
    () => {
      setDiscountValue(0);
      clearErrors("discountCode");

      if (discountCode) {
        refetch().then(({ isError, error, data }) => {
          if (isError) {
            handleError(error);
          } else if (data) {
            if (data.numOfUsage === data.usageLimit) {
              setError("discountCode", { message: "Discount code not available" });
            } else {
              setDiscountValue(data.type === "PERCENTAGE" ? (data.value * (cart?.sumAmount ?? 0)) / 100 : Math.min(data.value, cart?.sumAmount ?? 0));
              clearErrors("discountCode");
            }
          } else if (discountCode) {
            setError("discountCode", { message: "Discount code not found" });
          }
        });
      }
    },
    500,
    [discountCode],
  );

  useEffect(() => {
    if (loyaltyPointsToUse > user?.loyaltyPoints ?? 0) {
      setError("loyaltyPointsToUse", { message: "Not enough Loyalty points" });
    } else {
      clearErrors("loyaltyPointsToUse");
    }
  }, [loyaltyPointsToUse]);

  const finalLoyaltyPoints = errors.loyaltyPointsToUse ? 0 : loyaltyPointsToUse || 0;
  const finalAmount = (cart?.sumAmount ?? 0) - discountValue - finalLoyaltyPoints;

  const { getToggleButtonProps, getLabelProps, getMenuProps, getItemProps, selectedItem } = useSelect({
    items: addresses ?? [],
    selectedItem: addresses?.find((address) => address.id === shippingAddressId),
    onSelectedItemChange: ({ selectedItem }) => setValue("shippingAddressId", selectedItem.id),
  });

  useEffect(() => {
    const defaultAddress = addresses?.find((address) => address.isDefault);
    if (defaultAddress && !shippingAddressId) {
      setValue("shippingAddressId", defaultAddress.id);
    }
  }, [addresses]);

  return (
    <main className="mx-auto w-[min(1200px,92%)] py-10 space-y-5">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">Your cart</h1>
      <div className="grid grid-cols-[auto_400px] gap-4">
        <ul className="bg-white dark:bg-gray-800 shadow-lg rounded-lg h-max">
          {cart?.cartItems.map((item, i) => (
            <li key={i} className="flex items-center gap-4 p-4 not-last:border-b border-gray-200 dark:border-gray-700">
              <Image className="shrink-0 size-20 rounded-lg" />
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center gap-2">
                  <span>
                    {item.variant.product.name} &mdash; {item.variant.name}
                  </span>
                  <button className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:underline py-0.5">Remove</button>
                </div>
                <span className="opacity-75 text-sm mb-1">{longCurrencyFormatter.format(item.variant.price)} / item</span>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 w-max rounded-lg">
                    <button className="btn h-8! px-2.5!">
                      <FaMinus className="size-3" />
                    </button>
                    <input className="outline-none w-12 h-8 text-center" value={item.quantity} />
                    <button className="btn h-8! px-2.5!">
                      <FaPlus className="size-3" />
                    </button>
                  </div>
                  {false && <FaSpinner className="animate-spin ml-2" />}
                  <span className="text-emerald-800 dark:text-emerald-400 ml-auto">{longCurrencyFormatter.format(item.variant.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <form className="space-y-4" onSubmit={handleSubmit((values) => console.log(values))}>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-4">
            <h3 className="text-xl font-bold">Summary</h3>
            <label className="floating-label mb-2">
              <input {...register("discountCode")} placeholder="" className="floating-label__input" />
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
                    <input {...register("loyaltyPointsToUse")} placeholder="" className="floating-label__input" />
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
