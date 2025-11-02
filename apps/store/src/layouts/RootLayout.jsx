import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaArrowUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function RootLayout() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <button onClick={scrollUp} className={clsx("btn btn-secondary shadow-lg/10 fixed bottom-8 right-8 h-12! transition z-50", show || "opacity-0")}>
        <FaArrowUp />
      </button>
    </div>
  );
}
