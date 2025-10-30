import { Link } from "react-router";
import { FaMagnifyingGlass, FaCartShopping, FaUser, FaArrowRightFromBracket, FaArrowRightToBracket, FaCircleUser, FaGaugeHigh } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useSelect } from "downshift";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { clsx } from "clsx";
import { useNavigate } from "react-router";
import Logo from "@mint-boutique/assets/logo.svg?react";

export default function Header() {
  const {
    isError,
    isPending,
    data: user,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
    onError: (err) => {
      alert(err);
    },
  });

  const navigate = useNavigate();

  const items = useMemo(() =>
    [
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
    ].filter(Boolean),
  );

  const { isOpen, closeMenu, getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
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
    <header className="sticky top-0 z-10 bg-emerald-800 text-white shadow-xl/10">
      <div className="mx-auto w-[min(1200px,92%)] flex justify-between items-center py-2">
        <Link to="/" className="group flex items-center gap-4 hover:underline text-xl">
          <Logo className="size-8 group-hover:animate-spin" />
          <span className="font-brand">Mint Boutique</span>
        </Link>
        <nav className="flex gap-4 font-bold *:not-hover:opacity-75">
          <Link to="/">Home</Link>
          <Link to="/all">All</Link>
          <Link to="/all">Catalog</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="relative flex items-center gap-2">
          <button className="btn btn-outline-light btn-jump">
            <FaMagnifyingGlass className="size-5 text-yellow-200" />
          </button>
          <button className="btn btn-outline-light btn-jump">
            <FaCartShopping className="size-5 text-purple-200" />
          </button>
          {isPending ||
            (isError ? (
              <Link to="/login" className="btn btn-outline-light btn-jump">
                <FaArrowRightToBracket className="size-5 text-green-200" />
                Login
              </Link>
            ) : (
              <button {...getToggleButtonProps()} className="btn btn-outline-light btn-jump">
                <FaUser className="size-5 text-blue-200" />
                {user.fullName}
              </button>
            ))}
          <ul {...getMenuProps()} className={clsx("menu absolute top-12 right-0 min-w-50", isOpen || "hidden!")}>
            {items.map((item, index) => (
              <li {...getItemProps({ item, index })} className="menu-item">
                {item.icon} {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
