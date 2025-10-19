// src/features/store/hooks/useProducts.ts
"use client";

import useSWR from "swr";
import axiosClient from "@/api/axiosClient";
import { API_PATHS } from "@/api/apiPaths";
import { Product } from "@/types/product";
import { logger } from "@/lib/logger";

const GET_ALL_ITEMS = API_PATHS.PRODUCTS.GET_ITEMS;

// SWR fetcher (generic)
const fetcher = async (url: string): Promise<Product[]> => {
  try {
    const response = await axiosClient.get(url);
    return response.data.data ?? [];
  } catch (error) {
    logger("error", error);
    throw error;
  }
};

// ✅ Custom Hook
export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    GET_ALL_ITEMS,
    fetcher
  );

  return {
    products: data ?? [],
    isLoading,
    isError: !!error,
    refetch: mutate, // revalidate manually if needed
  };
}
