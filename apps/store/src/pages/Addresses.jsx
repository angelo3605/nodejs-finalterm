import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { FaPencil, FaPlus, FaSpinner, FaTrash, FaTriangleExclamation, FaXmark } from "react-icons/fa6";
import parsePhoneNumber from "libphonenumber-js";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@mint-boutique/zod-schemas";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";
import Modal from "react-modal";
import { AddressForm } from "@/components/AddressForm";
import { formatAddress } from "@/utils/formatAddress";

function AddressCard({ address, onEdit, onDelete }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col gap-1">
      <div className="flex justify-between items-center gap-2 h-7">
        {address ? <span className="truncate font-bold">{address.fullName}</span> : <div className="placeholder w-30 my-1"></div>}
        {address?.isDefault && <span className="text-sm px-3 py-1 bg-gray-300 dark:bg-gray-500 rounded-lg">Default</span>}
      </div>
      <div className="flex flex-col gap-1">
        {address ? <span>{formatAddress(address)}</span> : <div className="placeholder w-40 my-1"></div>}
        {address ? <span>{parsePhoneNumber(address.phoneNumber, "VN").formatNational()}</span> : <div className="placeholder w-40 my-1"></div>}
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-2 mt-auto *:h-9!">
        <button type="button" className="btn btn-outline-dark dark:btn-outline-light" onClick={onEdit}>
          <FaPencil /> Edit
        </button>
        <button type="button" className="btn btn-outline-dark dark:btn-outline-light" onClick={onDelete}>
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}

export function Addresses() {
  const [mode, setMode] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const queryClient = useQueryClient();
  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get("/profile/shipping-addresses").then((res) => res.data?.data),
  });

  const { mutate: updateOrCreateAddress, isPending: isUpdateOrCreatePending } = useMutation({
    mutationFn: ({ address, province, district, ward, fullName, phoneNumber, isDefault }) =>
      mode === "edit"
        ? api.patch(`/profile/shipping-addresses/${editAddress.id}`, { address, province, district, ward, fullName, phoneNumber, isDefault })
        : api.post("/profile/shipping-addresses", { address, province, district, ward, fullName, phoneNumber, isDefault }),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["addresses"],
        })
        .then(() => {
          setMode(null);
          toast.success(`${mode === "edit" ? "Update" : "Create"} successfully`);
        }),
    onError: handleError,
  });

  const {
    mutate: deleteAddress,
    isPending: isDeletePending,
    isSuccess,
  } = useMutation({
    mutationFn: () => api.delete(`/profile/shipping-addresses/${deleteId}`),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["addresses"],
        })
        .then(() => {
          setDeleteId(null);
          toast.success("Delete successfully");
        }),
    onError: handleError,
  });

  const form = useForm({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: "",
      address: "",
      phoneNumber: "",
      ward: "",
      province: "",
      district: "",
      isDefault: false,
    },
  });
  const { setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (mode === "edit") {
      for (const key of ["address", "province", "district", "ward", "fullName", "phoneNumber", "isDefault"]) {
        if (editAddress?.[key] !== undefined) {
          setValue(key, editAddress[key]);
        }
      }
    } else {
      reset();
    }
  }, [editAddress, mode]);

  return (
    <>
      <button className="btn btn-primary ml-auto" onClick={() => setMode("create")}>
        <FaPlus /> New address
      </button>
      <form onSubmit={handleSubmit((values) => updateOrCreateAddress(values))} className={clsx("animate-in fade-in fill-mode-forwards slide-in-from-top-8 space-y-4", mode || "hidden")}>
        <AddressForm form={form} className="@xl:grid-cols-3 @xl:[&>:first-child]:col-span-2 @xl:[&>:last-child]:col-span-3" />
        <div className="flex items-center gap-2">
          <button type="submit" className="btn btn-primary" disabled={isUpdateOrCreatePending}>
            {isUpdateOrCreatePending && <FaSpinner className="animate-spin" />}
            Save changes
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setMode(null)}>
            Cancel
          </button>
        </div>
      </form>
      <div className="grid @xl:grid-cols-2 gap-4">
        {addresses
          ? addresses.map((address, i) => (
              <AddressCard
                key={i}
                address={address}
                onEdit={() => {
                  setEditAddress(address);
                  setMode("edit");
                }}
                onDelete={() => setDeleteId(address.id)}
              />
            ))
          : Array.from({ length: 4 }, (_, i) => <AddressCard key={i} />)}
      </div>
      <Modal
        isOpen={!!deleteId}
        onRequestClose={() => setDeleteId(null)}
        className="modal"
        overlayClassName="modal__overlay"
        style={{
          content: {},
          overlay: {},
        }}
      >
        <div className="modal__header">
          <h2 className="modal__title">Confirmation</h2>
          <button className="modal__close" onClick={() => setDeleteId(null)}>
            <FaXmark />
          </button>
        </div>
        <div className="modal__message">
          <FaTriangleExclamation className="modal__message__icon text-yellow-600" />
          <p className="modal__desc">Are you sure you want to delete this address? This action cannot be undone.</p>
        </div>
        <div className="modal__actions">
          <button className="btn btn-primary" disabled={isDeletePending} onClick={() => deleteAddress()}>
            {isDeletePending && <FaSpinner className="animate-spin" />}
            Delete
          </button>
          <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
