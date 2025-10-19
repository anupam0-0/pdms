// src/api/handleAxiosError.ts
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

interface AxiosErrorWithResponse {
  response?: {
    status: number;
    data: ErrorResponse;
    statusText: string;
    headers: Record<string, string>;
    config: Record<string, unknown>;
  };
  request?: unknown;
  message: string;
  isAxiosError: boolean;
}

export function handleAxiosError(error: unknown): Promise<never> {
  const axiosError = error as AxiosErrorWithResponse;

  // Network error (no response from server)
  if (axiosError.request && !axiosError.response) {
    toast.error("No response from server. Check your network connection.");
    return Promise.reject(axiosError);
  }

  // Server responded with error status
  if (axiosError.response) {
    const { status, data } = axiosError.response;
    const message = data?.message || `Request failed with status ${status}`;
    const errors = data?.errors;

    switch (status) {
      case 400:
        if (errors && typeof errors === "object") {
          // Handle validation errors
          const errorMessages = Object.entries(errors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
          toast.error(`Validation failed:\n${errorMessages}`);
        } else {
          toast.error(message || "Bad request. Please check your input.");
        }
        break;

      case 401:
        toast.error("Session expired. Please log in again.");
        // Clear auth data
        if (typeof window !== "undefined") {
          // !TODO : write clear cookie()
          // Redirect to login
          window.location.href = "/login";
        }
        break;

      case 403:
        toast.error(
          "Access denied. You don't have permission to perform this action."
        );
        break;

      case 404:
        toast.error(message || "Resource not found.");
        break;

      case 409:
        toast.error(
          message || "Conflict. The resource already exists or is in use."
        );
        break;

      case 422:
        if (errors && typeof errors === "object") {
          const errorMessages = Object.entries(errors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
          toast.error(`Validation failed:\n${errorMessages}`);
        } else {
          toast.error(message || "Invalid data provided.");
        }
        break;

      case 429:
        toast.error("Too many requests. Please wait a moment and try again.");
        break;

      case 500:
        toast.error("Internal server error. Please try again later.");
        break;

      case 502:
        toast.error("Bad gateway. The server is temporarily unavailable.");
        break;

      case 503:
        toast.error(
          "Service unavailable. The server is temporarily down for maintenance."
        );
        break;

      case 504:
        toast.error("Gateway timeout. The request took too long to process.");
        break;

      default:
        if (status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(message || `Request failed with status ${status}`);
        }
    }
  } else {
    // Other errors (e.g., request setup errors)
    toast.error("Something went wrong. Please try again.");
  }

  return Promise.reject(axiosError);
}

// Utility function for custom error handling
export function handleCustomError(
  type: "error" | "warning" | "info" = "error",
  message: string
) {
  switch (type) {
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "info":
      toast.info(message);
      break;
  }
}

// Utility function for success messages
export function handleSuccess(message: string) {
  toast.success(message);
}
