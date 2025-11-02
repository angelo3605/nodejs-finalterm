import { Link, useNavigate } from "react-router";
import { FaArrowRightFromBracket, FaArrowRightToBracket, FaCartShopping, FaCircleUser, FaGaugeHigh, FaMagnifyingGlass, FaUser } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useSelect } from "downshift";
import Logo from "@mint-boutique/assets/logo.svg?react";
import { Image } from "@/components/Image";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";

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
      <ul className="popover origin-[75%_0%]! menu absolute top-12 right-0 min-w-50" {...getMenuProps()}>
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
  const { data: items } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data?.data),
  });

  const { getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
    items: items ?? [],
  });

  return (
    <div className="relative">
      <button {...getToggleButtonProps()}>Catalog</button>
      <div className="popover text-black shadow-lg absolute left-1/2 -translate-x-1/2 p-4 space-y-2 rounded-lg top-10 bg-white z-50" {...getMenuProps()}>
        <p className="font-bold">All categories</p>
        <ul className="flex justify-center">
          {items?.map((item, index) => (
            <li key={index} {...getItemProps({ item, index })}>
              <Link to={`/category/${item.slug}`} className="flex flex-col justify-center items-center gap-2 w-[72px] px-2 pt-2 pb-1 cursor-pointer hover:bg-black/5 rounded-lg">
                <Image src={item.imageUrl} className="aspect-square w-full rounded-full" />
                <span className="truncate">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
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
          <nav className="flex gap-4 [&>a,&_button]:py-2 [&>a,&_button]:font-bold [&>a,&_button]:not-hover:opacity-75 [&>a,&_button]:cursor-pointer">
            <Link to="/">Home</Link>
            <Link to="/all">All</Link>
            <CatalogMenu />
            <Link to="/about">About</Link>
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
          </div>
        </div>
      </header>
    </>
  );
}
