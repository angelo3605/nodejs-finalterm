import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import toast from "react-hot-toast";
import { handleError } from "@/utils/errorHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, passwordSchema } from "@mint-boutique/zod-schemas";
import { FaSpinner } from "react-icons/fa6";

export function Password() {
  const { register, reset, handleSubmit } = useForm({
    resolver: zodResolver(
      changePasswordSchema.extend({
        confirmNewPassword: passwordSchema,
      }),
    ),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }) => api.post("/profile/change-password", { currentPassword, newPassword }),
    onSuccess: () => {
      reset();
      toast.success("Update successfully");
    },
    onError: handleError,
  });

  const onSubmit = (values) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("New passwords do not match");
    } else {
      mutate(values);
    }
  };

  return (
    <>
      <form className="space-y-8" onSubmit={handleSubmit((values) => onSubmit(values))}>
        <div className="grid @xl:grid-cols-2 gap-4">
          <label className="floating-label @xl:col-span-2">
            <input {...register("currentPassword")} type="password" autoComplete="current-password" placeholder="" className="floating-label__input" />
            <span className="floating-label__label dark:bg-gray-800!">Current password</span>
          </label>
          <label className="floating-label">
            <input {...register("newPassword")} type="password" autoComplete="new-password" placeholder="" className="floating-label__input" />
            <span className="floating-label__label dark:bg-gray-800!">New password</span>
          </label>
          <label className="floating-label">
            <input {...register("confirmNewPassword")} type="password" autoComplete="new-password" placeholder="" className="floating-label__input" />
            <span className="floating-label__label dark:bg-gray-800!">Confirm new password</span>
          </label>
        </div>
        <button type="sumit" className="btn btn-primary" disabled={isPending}>
          {isPending && <FaSpinner className="animate-spin" />}
          Update password
        </button>
      </form>
    </>
  );
}
