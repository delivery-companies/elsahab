import { refreshTokenService } from "@/services/refreshToken";
import { authStore } from "@/store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_DEV_BASE_URL as string;
export const IMAGE_BASE_URL = import.meta.env.VITE_DEV_IMAGE_BASE_URL as string;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response?.status === 401) {
      const isRefreshTokenRequest =
        originalRequest?.url?.includes("refresh-token");

      if (isRefreshTokenRequest) {
        authStore.getState().logout();
        toast.error("تم انتهاء الجلسة");
        return Promise.reject(error);
      }

      if (!isRefreshTokenRequest && refreshToken) {
        try {
          const response = await refreshTokenService(refreshToken);
          const newToken = response.token;
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return await api(originalRequest);
        } catch (e) {
          authStore.getState().logout();
          toast.error("تم انتهاء الجلسة");
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);
