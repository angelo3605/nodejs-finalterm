import axios from "axios";

let accessToken = null;

export const setAccessToken = (newAccessToken) => (accessToken = newAccessToken);

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "/auth/refresh",
          {},
          {
            baseURL: api.defaults.baseURL,
            withCredentials: true,
          }
        );

        setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (requestErr) {
        setAccessToken(null);
        return Promise.reject(requestErr);
      }
    }

    return Promise.reject(err);
  }
);
