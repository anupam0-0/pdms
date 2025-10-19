"use client";

import useSWR from "swr";
import axiosClient from "@/api/axiosClient";
import type { AuthResponse } from "@/features/auth/types";
import type { AxiosError } from "axios";


const GETME_PATH = "/auth/me";
const fetcher = (url: string) =>
  axiosClient.get<AuthResponse>(url).then((res) => res.data);
// const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export function useAuth() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    AuthResponse,
    AxiosError
  >(GETME_PATH, fetcher, {
    // Don't spam retries on auth errors
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // console.log(data);

  return {
    user: data?.data ?? null,
    isLoading,
    isValidating,
    error,
    mutate,
    isAuthenticated: Boolean(data),
  };
}
