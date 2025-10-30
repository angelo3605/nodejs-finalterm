import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@mint-boutique/zod-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { api } from "@mint-boutique/axios-client";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import FacebookLogo from "@mint-boutique/assets/oauth-icons/facebook.svg?react";
import GoogleLogo from "@mint-boutique/assets/oauth-icons/google.svg?react";
import AuthLayout from "../layouts/AuthLayout";

export default function Login() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      api.post("/auth/login", {
        email,
        password,
        rememberMe,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      navigate("/");
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
    resolver: zodResolver(loginSchema),
    defauktValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const oAuthLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  return (
    <AuthLayout title="Mint Boutique" desc="Welcome back! Let's get you started.">
      <button onClick={() => oAuthLogin("google")} className="btn btn-secondary">
        <GoogleLogo className="size-5" />
        Login with Google
      </button>
      <button onClick={() => oAuthLogin("facebook")} className="btn btn-secondary">
        <FacebookLogo className="size-5" />
        Login with Facebook
      </button>
      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        or
        <hr className="flex-1 border-gray-300" />
      </div>
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
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
        <div className="flex gap-2 items-center justify-between space-y-2">
          <label className="checkbox">
            <input {...register("rememberMe")} type="checkbox" className="checkbox__input" />
            <FaCheck className="checkbox__icon" />
            <span className="checkbox__label">Remember me</span>
          </label>
          <Link className="link" to="/forgot">
            Reset password
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending && <FaSpinner className="animate-spin" />}
            Login
          </button>
          <Link className="link" to="/register">
            Register?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
