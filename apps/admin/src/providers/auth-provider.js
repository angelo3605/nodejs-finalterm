import { api, setAccessToken } from "@mint-boutique/axios-client";

let loggedIn = false;

export const authProvider = {
  login: async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.user.role !== "ADMIN") {
        return {
          success: false,
          error: {
            message: "Login Error",
            name: "Access denied",
          },
        };
      }

      setAccessToken(res.data.accessToken);
      loggedIn = true;

      return { success: true, redirectTo: "/" };
    } catch (err) {
      return {
        success: false,
        error: {
          message: "Login Error",
          name: "Incorrect email or password",
        },
      };
    }
  },

  logout: async () => {
    loggedIn = false;
    return { success: true };
  },

  check: async () => {
    return { authenticated: loggedIn };
  },

  getIdentity: async () => {
    try {
      const res = await api.get("/auth/me");
      return res.data;
    } catch {}
  },
};
