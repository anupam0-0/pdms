import axiosClient from "./axiosClient";
import { API_BASE, CHECK_HEALTH } from "./apiEndpoints";
import { HealthResponse } from "@/features/health/types";

export async function checkHealth() {
	const { data } = await axiosClient.get(CHECK_HEALTH);
	return data;
}
