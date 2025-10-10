import axiosClient from "./axiosClient";
import {
  GETME_PATH,
  LOGIN_PATH,
  LOGOUT_PATH,
  REGISTER_PATH,
} from "./apiEndpoints";
import { AuthResponse } from "@/features/auth/types";
import { AxiosError } from "axios";

interface AuthApiErrorData {
  message?: string;
  [key: string]: unknown;
}

class AuthApiError extends Error {
  status?: number;
  data?: AuthApiErrorData;
  constructor(message: string, status?: number, data?: AuthApiErrorData) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.data = data;
  }
}

function extractErrorInfo(error: unknown): {
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

export async function register(payload: {
  fullName: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axiosClient.post<AuthResponse>(
      REGISTER_PATH,
      payload
    );
    return response;
  } catch (error: unknown) {
    const { message, status, data } = extractErrorInfo(error);
    console.error("Registration Error:", message, error);
    throw new AuthApiError(message, status, data);
  }
}

export async function login(payload: { email: string; password: string }) {
  try {
    const response = await axiosClient.post<AuthResponse>(LOGIN_PATH, payload);
    return response;
  } catch (error: unknown) {
    const { message, status, data } = extractErrorInfo(error);
    console.error("Login Error:", message, error);
    throw new AuthApiError(message, status, data);
  }
}

export async function logout() {
  try {
    const response = await axiosClient.post(LOGOUT_PATH);
    return response;
  } catch (error: unknown) {
    const { message, status, data } = extractErrorInfo(error);
    console.error("Logout Error:", message, error);
    if (process.env.NODE_ENV !== "production") {
      throw new AuthApiError(message, status, data);
    }
  }
}

export async function me() {
  try {
    const response = await axiosClient.get<AuthResponse>(GETME_PATH);
    return response;
  } catch (error: unknown) {
    const { message, status, data } = extractErrorInfo(error);
    if (process.env.NODE_ENV !== "production") {
      console.error("Fetch User Error:", message, error);
      throw new AuthApiError(
        message || "Unable to fetch user information. Please login again.",
        status,
        data
      );
    }
  }
}
