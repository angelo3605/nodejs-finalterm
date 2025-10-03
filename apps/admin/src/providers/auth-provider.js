import { api, setAccessToken } from "@mint-boutique/axios-client";

let isLoggedIn = false;

export const authProvider = {
  login: async ({ email, password }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.accessToken);
      isLoggedIn = true;
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: new Error("Incorrect email or password"),
      };
    }
  },

  logout: async () => (isLoggedIn = false),

  check: async () => isLoggedIn,

  getIdentity: async () => {
    return null;
  },
};
