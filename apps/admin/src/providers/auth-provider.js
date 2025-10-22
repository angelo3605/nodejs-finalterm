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
      const { message } = err.response?.data;
      return {
        success: false,
        error: {
          message: "Login Error",
          name: message ?? err.message ?? "Something went wrong",
        },
      };
    }
  },

  logout: async () => {},

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
      const { message } = err.response?.data;
      return {
        authenticated: false,
        error: {
          message: "Authentication Failed",
          name: message ?? err.message ?? "Not logged in",
        },
      };
    }
  },

  getIdentity: async () => {
    const { data } = await api.get("/profile");
    return data.user;
  },
};
