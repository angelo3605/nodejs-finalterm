import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { Image } from "@/components/Image";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { FaCaretDown, FaCreditCard, FaGift, FaMinus, FaPlus, FaSpinner, FaTicket } from "react-icons/fa6";
import { useSelect } from "downshift";

export function Cart() {
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get("/cart").then((res) => res.data?.data),
  });

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/profile/shipping-addresses").then((res) => res.data?.data),
  });

  const { isOpen, selectedItem, getToggleButtonProps, getLabelProps, getMenuProps, highlightedIndex, getItemProps } = useSelect({
    items: addresses ?? [],
    itemToString: (item) => item.address,
  });

  const cartSummary = {
    Subtotal: cart ? longCurrencyFormatter.format(cart.sumAmount) : undefined,
    Discount: longCurrencyFormatter.format(0),
    "Loyalty points": new Intl.NumberFormat("vi-VN").format(0),
    "Discounted total": cart ? longCurrencyFormatter.format(cart.sumAmount) : undefined,
  };

  const shippingInfo = {
    Address: selectedItem?.address,
    "Full name": selectedItem?.fullName,
    "Phone number": selectedItem?.phoneNumber,
  };

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
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-2">
            <h3 className="text-xl font-bold">Summary</h3>
            <div className="flex items-end gap-2">
              <label className="floating-label w-full">
                <input placeholder="" className="floating-label__input" disabled={false} />
                <span className="floating-label__label dark:bg-gray-800!">Discount code</span>
              </label>
              <button type="submit" className="btn btn-primary h-12!" disabled={false}>
                {false ? <FaSpinner className="animate-spin" /> : <FaTicket />}
              </button>
            </div>
            <div className="flex items-end gap-2">
              <label className="floating-label w-full">
                <input placeholder="" className="floating-label__input" disabled={false} />
                <span className="floating-label__label dark:bg-gray-800!">Loyalty points</span>
              </label>
              <button type="submit" className="btn btn-primary h-12!" disabled={false}>
                {false ? <FaSpinner className="animate-spin" /> : <FaGift />}
              </button>
            </div>
            <p className="text-sm opacity-75">Available points: {Intl.NumberFormat("vi-VN").format(user?.loyaltyPoints ?? 0)}</p>
            <hr className="border-dashed border-t-2 border-gray-300 dark:border-gray-600 my-4" />
            <ul className="space-y-1">
              {Object.entries(cartSummary).map(([key, value], i) => (
                <>
                  <li key={i} className="flex justify-between gap-2 group">
                    <span className="opacity-75 font-bold group-last:text-rose-600 dark:group-last:text-rose-400">{key}:</span>
                    {value}
                  </li>
                  {i === Object.keys(cartSummary).length - 2 && <hr className="border-dashed border-t-2 border-gray-300 dark:border-gray-600 my-4" />}
                </>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-4">
            <h3 className="text-xl font-bold">Shipping Info</h3>
            <div className="relative">
              <label className="floating-label w-full h-12 group" {...getToggleButtonProps()}>
                <button className="floating-label__input text-left" disabled={false} {...getLabelProps()}>
                  {selectedItem?.address ?? ""}
                </button>
                <span className="floating-label__label dark:bg-gray-800!">Shipping address</span>
                <FaCaretDown className="floating-label__icon floating-label__icon--right group-aria-[expanded=true]:rotate-180 transition" />
              </label>
              <ul className="popover menu absolute top-full right-0 w-full" {...getMenuProps()}>
                {addresses?.map((item, index) => (
                  <li key={index} className="menu-item" {...getItemProps({ item, index })}>
                    {item.address}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="space-y-1">
              {Object.entries(shippingInfo).map(([key, value], i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="opacity-75 font-bold">{key}:</span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-primary mt-4 w-full" disabled={false}>
            {false ? <FaSpinner className="animate-spin" /> : <FaCreditCard />}
            Checkout!
          </button>
        </div>
      </div>
    </main>
  );
}
