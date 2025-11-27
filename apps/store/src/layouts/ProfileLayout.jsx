import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { FaBagShopping, FaKey, FaLocationDot, FaUser } from "react-icons/fa6";
import { NavLink, Outlet, useLocation } from "react-router";
import clsx from "clsx";
import Cat from "@mint-boutique/assets/easter-eggs/cat.svg?react";
import { format } from "date-fns";

const tabs = [
  {
    to: "/profile",
    label: "Your Info",
    Icon: FaUser,
    color: "text-sky-700 dark:text-sky-300",
  },
  {
    to: "/profile/addresses",
    label: "Addresses",
    Icon: FaLocationDot,
    color: "text-rose-700 dark:text-rose-300",
  },
  {
    to: "/profile/orders",
    label: "Orders",
    Icon: FaBagShopping,
    color: "text-lime-700 dark:text-lime-300",
  },
  {
    to: "/profile/password",
    label: "Password",
    Icon: FaKey,
    color: "text-yellow-700 dark:text-yellow-300",
  },
];

export function ProfileLayout() {
  const location = useLocation();
  const activeTab = tabs.find((tab) => tab.to === location.pathname);

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders/me").then((res) => res.data),
  });

  const profileInfo = {
    Email: user?.email,
    "Joined at": user ? format(user.createdAt, "dd MMM yyyy") : undefined,
  };

  const infoCards = {
    Orders: orders?.total,
    "Loyalty points": user ? new Intl.NumberFormat("vi-VN").format(user.loyaltyPoints) : undefined,
  };

  return (
    <main className="mx-auto w-[min(1200px,92%)]">
      <div className="grid lg:grid-cols-[300px_auto] mt-10 gap-4">
        <div className="*:w-full flex flex-col sm:flex-row lg:flex-col gap-4">
          <div className="p-6 flex flex-col items-center gap-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="size-24 flex items-center justify-center text-3xl font-bold bg-sky-200 text-sky-800 dark:bg-sky-700 dark:text-sky-100 rounded-full">
              {user?.fullName.replace(" ", "").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col items-center">
              <h2 className="font-bold text-xl">{user?.fullName ?? <div className="placeholder w-20 h-5! my-1"></div>}</h2>
              {user ? (
                <p className={clsx(user.role === "BLOCKED" && "text-rose-700 dark:text-rose-400")}>{user.role[0] + user.role.slice(1).toLowerCase()}</p>
              ) : (
                <div className="placeholder w-10 my-1"></div>
              )}
            </div>
            <div className="flex gap-2 w-full">
              {Object.entries(infoCards)?.map(([key, value]) => (
                <div key={key} className="flex-1/2 flex flex-col items-center text-xl p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {value ?? <div className="placeholder w-20 h-5! my-1"></div>}
                  <span className="opacity-75 text-sm truncate font-bold">{key}</span>
                </div>
              ))}
            </div>
            <div className="w-full space-y-1">
              {Object.entries(profileInfo)?.map(([key, value]) => (
                <div key={key} className="flex flex-wrap space-x-4 justify-between">
                  <span className="font-bold opacity-75">{key}:</span>
                  {<span className="truncate">{value}</span> ?? <div className="placeholder w-40"></div>}
                </div>
              ))}
            </div>
          </div>
          <nav className="bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2">
            {tabs.map(({ Icon, ...tab }, i) => (
              <NavLink end key={i} to={tab.to} className={({ isActive }) => clsx("flex items-center gap-4 px-4 h-12 hover:bg-gray-100 dark:hover:bg-gray-700", isActive && "btn-secondary")}>
                <Icon className={clsx("size-6", tab.color)} /> {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div>
          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg min-h-[600px] p-6 space-y-6 @container flex flex-col">
            {activeTab && <h2 className="text-xl font-bold">{activeTab.label}</h2>}
            <Outlet />
          </section>
          <Cat className="ml-auto mt-5 -mb-2.5 size-20" />
        </div>
      </div>
    </main>
  );
}
