import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@mint-boutique/zod-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      axios.post("/auth/login", {
        email,
        password,
        rememberMe,
      }),
    onSuccess: () => queryClient.invalidateQueries(["profile"]),
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
      <div>
        <img src="https://placehold.co/1000x1200" />
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit((values) => mutate(values))}>
            <div>
              <label>
                Email: <input {...register("email")} />
              </label>
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
              <label>
                Password: <input {...register("password")} />
              </label>
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div>
              <label>
                <input {...register("rememberMe")} type="checkbox" /> Remember me
              </label>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
