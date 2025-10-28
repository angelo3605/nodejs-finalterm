import { Link } from "react-router";
import { FaMagnifyingGlass, FaCartShopping, FaUser, FaArrowRightFromBracket } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useFloating, autoUpdate, useClick, useInteractions } from "@floating-ui/react";
import { useState } from "react";

export default function Header() {
  const {
    isError,
    isPending,
    data: { user } = {},
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data),
    retry: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  return (
    <header className="sticky top-0 z-10 bg-emerald-800 text-white shadow-xl/10">
      <div className="mx-auto w-[min(1200px,92%)] flex justify-between items-center py-4">
        <Link to="/" className="hover:underline font-bold text-xl">
          <span className="brand-name">Mint Boutique</span>
        </Link>
        <nav className="flex gap-4 font-bold *:not-hover:opacity-75">
          <Link to="/">Home</Link>
          <Link to="/all">Catalog</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline-light btn-jump">
            <FaMagnifyingGlass className="size-5" />
          </button>
          <button className="btn btn-outline-light btn-jump">
            <FaCartShopping className="size-5" />
          </button>
          {isPending ||
            (isError ? (
              <Link to="/login" className="btn btn-outline-light btn-jump">
                <FaArrowRightFromBracket className="size-5" />
                Login
              </Link>
            ) : (
              <button className="btn btn-outline-light btn-jump" ref={refs.setReference} {...getReferenceProps()}>
                <FaUser className="size-5" />
                {user.fullName}
              </button>
            ))}
          {isOpen && (
            <div className="py-2 w-[200px] bg-white shadow-lg/10 rounded-lg text-black" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              <button className="btn hover:bg-black/10 rounded-none! w-full justify-start!">
                <FaUser /> View profile
              </button>
              <button className="btn hover:bg-black/10 rounded-none! w-full justify-start!">
                <FaArrowRightFromBracket /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
