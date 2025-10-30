import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotSchema } from "@mint-boutique/zod-schemas";
import { useMutation } from "@tanstack/react-query";
import { api } from "@mint-boutique/axios-client";
import { FaSpinner } from "react-icons/fa6";
import AuthLayout from "../layouts/AuthLayout";

export default function Forgot() {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }) => api.post("/auth/forgot", { email }),
    onError: (err) => {
      alert(err);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defauktValues: {
      email: "",
    },
  });

  return (
    <AuthLayout title="Reset password" desc="Forgot your password? No worries, let's reset it." backTitle="Back to login" backUrl="/login">
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
        <div className="space-y-2">
          <label className="floating-label">
            <input {...register("email")} placeholder="" className="floating-label__input" />
            <span className="floating-label__label">Email address</span>
          </label>
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending && <FaSpinner className="animate-spin" />}
          Send
        </button>
      </form>
    </AuthLayout>
  );
}
