import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@mint-boutique/zod-schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { handleError } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { FaPencil, FaSpinner } from "react-icons/fa6";

export function Info() {
  const [edit, setEdit] = useState(false);

  const queryClient = useQueryClient();
  const { data: user, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/profile").then((res) => res.data?.data),
    retry: false,
  });

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: ({ fullName, email }) => api.patch("/profile", { fullName, email }),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["profile"],
        })
        .then(() => {
          toast.success("Update successfully");
          setEdit(false);
        }),
    onError: handleError,
  });

  const { register, setValue, handleSubmit } = useForm({
    resolver: zodResolver(
      registerSchema.omit({
        password: true,
      }),
    ),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const resetForm = () => {
    setValue("fullName", user?.fullName ?? "");
    setValue("email", user?.email ?? "");
  };

  useEffect(() => resetForm(), [user]);

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit((values) => mutate(values))}>
        <div className="grid @xl:grid-cols-2 gap-4">
          <label className="floating-label">
            <input {...register("fullName")} placeholder="" className="floating-label__input" disabled={isPending || !edit} />
            <span className="floating-label__label dark:bg-gray-800!">Full name</span>
          </label>
          <label className="floating-label">
            <input {...register("email")} placeholder="" className="floating-label__input" disabled={isPending || !edit} />
            <span className="floating-label__label dark:bg-gray-800!">Email</span>
          </label>
        </div>
        <Link to="/profile/password" className="link">
          Looking to change password?
        </Link>
        <div className="flex items-center gap-2">
          {edit ? (
            <>
              <button key={edit ? "submit" : "notSubmit"} disabled={isSubmitting} type="submit" className="btn btn-primary">
                {isSubmitting && <FaSpinner className="animate-spin" />}
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEdit(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-outline-dark dark:btn-outline-light" onClick={() => setEdit(true)}>
              <FaPencil /> Edit
            </button>
          )}
        </div>
      </form>
    </>
  );
}
