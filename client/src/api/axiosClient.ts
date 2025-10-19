import axios from "axios";
import { API_BASE } from "./apiPaths";
import { handleAxiosError } from "./handleAxiosError";

const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 1000,
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle auth errors gracefully
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => handleAxiosError(err) // ← calls our global helper
);

export default axiosClient;
