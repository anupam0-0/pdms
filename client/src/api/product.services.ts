import axiosClient from "./axiosClient";
import {
  GET_ITEMS,
  SEARCH_STORE,
  GET_ITEMS_BY_ID,
  CREATE_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
  REGISTER_PATH,
} from "./apiPaths";
import { AuthResponse } from "@/features/auth/types";
import { extractErrorInfo } from "@/lib/extractErrorInfo";
import { AuthApiError } from "./types";


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

export async function getProducts() {
  try {
    const response = await axiosClient.get<AuthResponse>(GET_ITEMS);
    return response;
  } catch (error) {
    const { message, status, data } = extractErrorInfo(error);
    console.error("Registration Error:", message, error);
    throw new AuthApiError(message, status, data);
  }
}


// export async function 