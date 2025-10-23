import { api } from "@mint-boutique/axios-client";

export const authProvider = {
  login: async ({ email, password }) => {
    try {
      await api.post("/auth/login", { email, password });
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err) {
      const { status, data } = err.response;
      return {
        success: false,
        error: {
          name: "Login Error",
          message:
            status === 401
              ? "Incorrect email or password"
              : (data?.message ?? err.message ?? "Something went wrong"),
        },
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      return {
        success: true,
      };
    } catch (err) {
      const { data } = err.response;
      return {
        success: false,
        error: {
          name: "Logout Error",
          message: data?.message ?? err.message ?? "Something went wrong",
        },
      };
    }
  },

  check: async () => {
    try {
      const { data } = await api.get("/profile");
      if (data.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return {
        authenticated: true,
      };
    } catch (err) {
      const { data } = err.response;
      return {
        authenticated: false,
        error: {
          name: "Authentication Failed",
          message: data?.message ?? "Not logged in",
        },
      };
    }
  },

  getIdentity: async () => {
    const { data } = await api.get("/profile");
    return data.user;
  },
};
