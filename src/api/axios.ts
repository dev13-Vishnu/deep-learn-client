import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../storage/token.storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// --------------------
// Request interceptor
// --------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

// --------------------
// Refresh control
// --------------------
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// --------------------
// Response interceptor
// --------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Only attempt a token refresh if the original request was authenticated
    // (had a Bearer token). Unauthenticated endpoints like /auth/login,
    // /auth/signup, /auth/verify-otp etc. all legitimately return 401 —
    // trying to refresh on those swallows the real error message and prevents
    // the form from showing it to the user.
    const hadToken = !!originalRequest?.headers?.Authorization;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      hadToken
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await apiClient.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;

        tokenStorage.set(newAccessToken);
        processQueue(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;