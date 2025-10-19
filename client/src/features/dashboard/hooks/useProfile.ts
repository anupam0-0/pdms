"use client";

import useSWR from "swr";
import axiosClient from "@/api/axiosClient";
import { API_PATHS } from "@/api/apiPaths";
import { logger } from "@/lib/logger";
import { User } from "@/types/user";

// Define the expected shape of the API response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// SWR fetcher function
const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await axiosClient.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch data");
    }
    return response.data.data as T;
  } catch (error) {
    logger("error", error);
    throw error;
  }
};

// Define the actual API response structure for the profile endpoint
interface ProfileResponse {
  profile: User;
}

// Custom Hook
export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<ProfileResponse>(
    API_PATHS.AUTH.PROFILE,
    fetcher
  );

  return {
    profile: data?.profile,
    isLoading,
    isError: Boolean(error),
    mutateProfile: mutate,
  };
}
