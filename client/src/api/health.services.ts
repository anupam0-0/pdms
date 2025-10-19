import axiosClient from "./axiosClient";
import { CHECK_HEALTH } from "./apiPaths";
import { handleCustomError, handleSuccess } from "./handleAxiosError";

// Health check service with comprehensive monitoring
export async function checkHealth() {
  try {
    const response = await axiosClient.get(CHECK_HEALTH);
    handleSuccess(response.data);
    return response.data;
  } catch (error) {
    handleCustomError(
      "error",
      "Health check failed. Service may be unavailable."
    );

    throw error;
  }
}
