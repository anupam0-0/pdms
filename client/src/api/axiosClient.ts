import axios from "axios";
import { API_BASE } from "./apiEndpoints";
const { redirect } = await import("next/navigation");


const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // This ensures cookies are sent with requests
});


// Response interceptor to handle auth errors gracefully
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    try {
      if (err.response?.status === 401) {
        if (typeof window !== "undefined") {
          try {
            // Import the store dynamically to avoid circular dependency
            const { useAuthStore } = await import("@/store/authStore");
            useAuthStore.getState().clearUser();
          } catch (importErr) {
            // Log import error but don't crash the app
            console.error("Failed to import auth store for clearing user:", importErr);
          }
          // Use replace to avoid keeping the current page in history
          redirect("/login");
        }
      }
    } catch (interceptorErr) {
      // Log any unexpected errors in the interceptor itself
      console.error("Error in axios response interceptor:", interceptorErr);
    }
    // Always log the original error for debugging
    if (process.env.NODE_ENV !== "production") {
      console.error("Axios error:", err);
    }
    // Optionally, you could show a user-friendly notification here
    return Promise.reject(err);
  }
);

export default axiosClient;
