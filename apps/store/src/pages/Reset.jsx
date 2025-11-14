import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetSchema } from "@mint-boutique/zod-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { FaSpinner } from "react-icons/fa6";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate, useSearchParams } from "react-router";
import { handleError } from "@/utils/errorHandler";
import toast from "react-hot-toast";

export default function Reset() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
  }

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ password }) => api.post("/auth/reset", { token, password }),
    onSuccess: () =>
      queryClient
        .invalidateQueries({
          queryKey: ["profile"],
        })
        .then(() => {
          navigate("/login");
          toast.success("Reset successfully! Please login again");
        }),
    onError: handleError,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      resetSchema.pick({
        password: true,
      }),
    ),
    defauktValues: {
      password: "",
    },
  });

  return (
    <AuthLayout title="Reset password" desc="Choose a secure password to continue.">
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
        <div className="space-y-2">
          <label className="floating-label">
            <input {...register("password")} placeholder="" type="password" className="floating-label__input" />
            <span className="floating-label__label">Password</span>
          </label>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending && <FaSpinner className="animate-spin" />}
          Send
        </button>
      </form>
    </AuthLayout>
  );
}
