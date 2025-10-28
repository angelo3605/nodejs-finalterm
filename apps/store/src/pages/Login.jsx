import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@mint-boutique/zod-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { api } from "@mint-boutique/axios-client";
import { FaSpinner } from "react-icons/fa6";

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

  return (
    <>
      <div className="grid lg:grid-cols-[auto_500px]">
        <img src="https://placehold.co/1000x1200" className="max-lg:aspect-video size-full lg:h-screen object-cover" />
        <div className="flex flex-col justify-center gap-4 p-8">
          <h1 className="text-3xl font-bold">Mint Boutique</h1>
          <p className="opacity-75">Please login to continue.</p>
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
            <div className="space-y-2">
              <label className="space-x-4">
                <input {...register("rememberMe")} type="checkbox" />
                <span>Remember me</span>
              </label>
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
        </div>
      </div>
    </>
  );
}
