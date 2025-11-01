import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@mint-boutique/zod-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { api } from "@mint-boutique/axios-client";
import { FaSpinner } from "react-icons/fa6";
import AuthLayout from "../layouts/AuthLayout";

export default function Register() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ fullName, email, password }) =>
      api.post("/auth/register", {
        fullName,
        email,
        password,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      })
      navigate("/login");
    },
    onError: (err) => {
      alert(err);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defauktValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  return (
    <AuthLayout title="Register" desc="Create an account to get the most out of our site." backTitle="Back to login" backUrl="/login">
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
        <div className="space-y-2">
          <label className="floating-label">
            <input {...register("fullName")} placeholder="" className="floating-label__input" />
            <span className="floating-label__label">Full name</span>
          </label>
          {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="floating-label">
            <input {...register("email")} placeholder="" className="floating-label__input" />
            <span className="floating-label__label">Email</span>
          </label>
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="floating-label">
            <input {...register("password")} placeholder="" type="password" className="floating-label__input" />
            <span className="floating-label__label">Password</span>
          </label>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending && <FaSpinner className="animate-spin" />}
          Register
        </button>
      </form>
    </AuthLayout>
  );
}
