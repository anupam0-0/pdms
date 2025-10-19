import { AuthApiErrorData } from "@/api/types";
import { AxiosError } from "axios";
import { toast } from "sonner";


export function extractErrorInfo(error: unknown): {
    message: string;
    status?: number;
    data?: AuthApiErrorData;
  } {
    if (
      error &&
      typeof error === "object" &&
      "isAxiosError" in error &&
      (error as AxiosError).isAxiosError
    ) {
      const axiosError = error as AxiosError<AuthApiErrorData>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An unexpected error occurred. Please try again.";
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;
      return { message, status, data };
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }