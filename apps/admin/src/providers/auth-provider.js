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
      return { authenticated: data.user.role === "ADMIN" };
    } catch (err) {
      return { authenticated: false };
    }
  },

  getIdentity: async () => {
    const { data } = await api.get("/profile");
    return data.user;
  },
};
