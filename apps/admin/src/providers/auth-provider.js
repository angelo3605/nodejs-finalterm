import { api } from "@mint-boutique/axios-client";

export const authProvider = {
  login: ({ email, password, rememberMe }) => {
    return api
      .post("/auth/login", { email, password, rememberMe })
      .then(() => ({
        success: true,
        redirectTo: "/",
      }))
      .catch((err) => ({
        success: false,
        error: {
          name: "Login Error",
          message:
            err.response.status === 401
              ? "Incorrect email or password"
              : (err.response.data?.message ??
                err.message ??
                "Something went wrong"),
        },
      }));
  },

  logout: () => {
    return api
      .post("/auth/logout")
      .then(() => ({
        success: true,
      }))
      .catch((err) => ({
        success: false,
        error: {
          name: "Logout Error",
          message:
            err.response.data?.message ?? err.message ?? "Something went wrong",
        },
      }));
  },

  check: () => {
    return api
      .get("/profile")
      .then((res) => {
        const { data: user } = res.data;
        if (user?.role !== "ADMIN") {
          return {
            authenticated: false,
            error: {
              name: "Authentication Failed",
              message: "Unauthorized",
            },
          };
        }
        return {
          authenticated: true,
        };
      })
      .catch((err) => ({
        authenticated: false,
        error: {
          name: "Authentication Failed",
          message: err.response.data?.message ?? "Not logged in",
        },
      }));
  },

  getIdentity: () => {
    return api.get("/profile").then((res) => res.data?.data);
  },
};
