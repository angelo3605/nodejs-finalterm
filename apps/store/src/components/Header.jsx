import { Link, useNavigate } from "react-router";
import { FaAnglesRight, FaArrowRight, FaArrowRightFromBracket, FaArrowRightToBracket, FaCartShopping, FaCircleUser, FaGaugeHigh, FaMagnifyingGlass, FaUser } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useSelect } from "downshift";
import Logo from "@mint-boutique/assets/logo.svg?react";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Image } from "@/components/Image";

function UserMenu({ user }) {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["profile"],
        })
        .then(() => toast.success("Logout successfully")),
    onError: handleError,
  });

  const navigate = useNavigate();

  const items = [
    {
      label: "View profile",
      icon: <FaCircleUser />,
      action: () => navigate("/profile"),
    },
    user?.role === "ADMIN" && {
      label: "Go to dashboard",
      icon: <FaGaugeHigh />,
      action: () => (window.location.href = import.meta.env.VITE_ADMIN_URL),
    },
    {
      label: "Logout",
      icon: <FaArrowRightFromBracket />,
      action: () => logout(),
    },
  ].filter(Boolean);

  const { closeMenu, getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }
      selectedItem.action();
      closeMenu();
    },
  });

  return (
    <>
      <button className="btn btn-outline-light btn-jump" {...getToggleButtonProps()}>
        <FaUser className="size-5 text-blue-200" />
        {user?.fullName ?? <div className="placeholder w-20"></div>}
      </button>
      <ul className="popover origin-[75%_0%]! menu absolute top-12 right-12 min-w-50" {...getMenuProps()}>
        {items.map((item, index) => (
          <li key={index} className="menu-item" {...getItemProps({ item, index })}>
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
    </>
  );
}

function CatalogMenu() {
  const [category, setCategory] = useState(null);

  const { data: items } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data?.data),
  });

  const { getToggleButtonProps, getMenuProps, getItemProps, closeMenu } = useSelect({
    items: items ?? [],
  });

  return (
    <div class="lg:relative">
      <button {...getToggleButtonProps()} className="nav-item">
        Catalog
      </button>
      <div
        className="popover text-black shadow-lg absolute flex flex-col left-1/2 lg:left-full -translate-x-1/2 rounded-lg top-12 bg-white dark:bg-gray-800 dark:text-white z-50 overflow-hidden"
        {...getMenuProps()}
      >
        <div className="grid md:grid-cols-[40%_auto] w-screen max-w-[600px] min-h-[400px]">
          <div>
            <span className="block text-sm font-bold m-4">All categories</span>
            <ul>
              {items
                ? items.map((item, index) => (
                    <li key={index} onMouseOver={() => setCategory(item)} {...getItemProps({ item, index })}>
                      <Link
                        to={`/category/${item.slug}`}
                        className="flex justify-between items-center gap-2 px-4 py-2 data-[hovered=true]:text-emerald-700 dark:data-[hovered=true]:text-emerald-500 group transition hover:bg-black/5 dark:hover:bg-white/5"
                        data-hovered={item === category}
                      >
                        <span className="group-data-[hovered=true]:font-bold">{item.name}</span>
                        <FaAnglesRight className="fade-in slide-in-from-left fade-out slide-out-to-right animate-out fill-mode-forwards group-data-[hovered=true]:animate-in" />
                      </Link>
                    </li>
                  ))
                : Array.from({ length: 5 }, (_, i) => (
                    <li key={i} className="px-4 py-3">
                      <div className="placeholder w-40"></div>
                    </li>
                  ))}
            </ul>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700/50 flex flex-col">
            <Image src={category?.imageUrl} className="w-full h-25 object-cover" />
            <div className="inset-0 p-6 flex flex-col gap-2 h-full">
              <h3 className="font-bold text-xl">{category?.name || "Select a category"}</h3>
              <p>{!category ? "Hover a category to view the details." : category?.desc || "No description provided"}</p>
              <Link to={category ? `/category/${category.slug}` : "#"} aria-disabled={!category} className="btn btn-outline-dark dark:btn-outline-light mt-auto" onClick={() => closeMenu()}>
                View products <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get("/cart").then((res) => res.data?.data),
  });

  const { isError, data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  return (
    <>
      <header className="sticky top-0 bg-emerald-800 text-white shadow-xl/10 z-50">
        <div className="flex flex-wrap gap-x-4 gap-y-2 mx-auto w-[min(1200px,92%)] justify-between items-center py-2">
          <Link to="/" className="group flex items-center gap-4 hover:underline text-xl">
            <Logo className="size-8 group-hover:animate-spin" />
            <span className="font-brand">Mint Boutique</span>
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="nav-item">
              Home
            </Link>
            <Link to="/all" className="nav-item">
              All
            </Link>
            <CatalogMenu />
            <Link to="/about" className="nav-item">
              About
            </Link>
          </nav>
          <div className="relative flex items-center gap-2">
            <button className="btn btn-outline-light btn-jump">
              <FaMagnifyingGlass className="size-5 text-yellow-200" />
            </button>
            <button className="relative btn btn-outline-light btn-jump">
              <FaCartShopping className="size-5 text-purple-200" />
              {cart?.cartItems?.length > 0 && <span className="badge">{cart?.cartItems?.length}</span>}
            </button>
            {isError ? (
              <Link to="/login" className="btn btn-outline-light btn-jump">
                <FaArrowRightToBracket className="size-5 text-green-200" />
                Login
              </Link>
            ) : (
              <UserMenu user={user} />
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
