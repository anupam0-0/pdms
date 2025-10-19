import axiosClient from "./axiosClient";
import { API_PATHS } from "./apiPaths";
import { AuthResponse } from "@/features/auth/types";
import { AuthApiError } from "./types";
import { extractErrorInfo } from "@/lib/extractErrorInfo";

// Api paths used
const REGISTER = API_PATHS.AUTH.REGISTER;
const LOGIN = API_PATHS.AUTH.LOGIN;
const LOGOUT = API_PATHS.AUTH.LOGOUT;
const GETME = API_PATHS.AUTH.GETME;

export async function register(payload: {
  fullName: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axiosClient.post<AuthResponse>(REGISTER, payload);
    return response;
  } catch (error: unknown) {
    const { message, status, data } = extractErrorInfo(error);
    console.error("Registration Error:", message, error);
    throw new AuthApiError(message, status, data);
  }
}

export async function login(payload: { email: string; password: string }) {
  try {
    const response = await axiosClient.post<AuthResponse>(LOGIN, payload);
    return response;
  } catch (error: unknown) {
    const { message, status, data } = extractErrorInfo(error);
    console.error("Login Error:", message, error);
    throw new AuthApiError(message, status, data);
  }
}

export async function logout() {
  try {
    const response = await axiosClient.post(LOGOUT);
    return response;
  } catch (error) {
    // handled by axios interceptor
  }
}

export async function me() {
  try {
    const response = await axiosClient.get<AuthResponse>(GETME);
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
