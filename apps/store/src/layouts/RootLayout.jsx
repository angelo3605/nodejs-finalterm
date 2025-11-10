import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaArrowUp, FaCircleXmark, FaSpinner, FaXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Modal from "react-modal";
import { useStore } from "@tanstack/react-store";
import { blockStatus } from "@/stores/blockStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";

export default function RootLayout() {
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["profile"],
        })
        .then(() => {
          toast.success("Logout successfully");
          blockStatus.setState(false);
        }),
    onError: handleError,
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const blocked = useStore(blockStatus);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="z-5">
        <Outlet />
      </main>
      <Footer />
      <button onClick={scrollUp} className={clsx("btn btn-secondary shadow-lg/10 fixed bottom-8 right-8 h-12! transition z-50", show || "opacity-0")}>
        <FaArrowUp />
      </button>
      <Modal
        isOpen={blocked}
        onRequestClose={() => blockStatus.setState(false)}
        ariaHideApp={false}
        className="modal"
        overlayClassName="modal__overlay"
        style={{
          content: {},
          overlay: {},
        }}
      >
        <div className="modal__header">
          <h2 className="modal__title">Alert</h2>
          <button className="modal__close" onClick={() => blockStatus.setState(false)}>
            <FaXmark />
          </button>
        </div>
        <div className="modal__message">
          <FaCircleXmark className="modal__message__icon text-rose-600" />
          <p className="modal__desc">
            Unfortunately, your account has been blocked from performing any actions other than viewing.
            <br />
            <span className="inline-flex my-4">
              <span className="font-bold">Reason:&nbsp;</span>
              Spamming checkouts
            </span>
            <br />
            If this is a mistake, please reach out&mdash;we are happy to get things sorted out!
            <br />
            <span className="inline-flex my-4">
              <span className="font-bold">Support email:&nbsp;</span>
              <a href="mailto:support@mint.boutique" className="link">
                support@mint.boutique
              </a>
            </span>
            <br />
            (Actually, spamming checkouts does nothing but pollutes our logs, so you are totally fine. We just have to comply with the project requirements... sorry 😅)
          </p>
        </div>
        <div className="modal__actions">
          <button className="btn btn-primary" disabled={isPending} onClick={() => logout()}>
            {isPending && <FaSpinner className="animate-spin" />} Logout
          </button>
          <button className="btn btn-secondary" onClick={() => blockStatus.setState(false)}>
            Return to store
          </button>
        </div>
      </Modal>
    </div>
  );
}
