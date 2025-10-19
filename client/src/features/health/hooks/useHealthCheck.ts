"use client";

import { checkHealth } from "@/api/health.services";
import { useState, useCallback } from "react";

export function useHealthCheck() {
	const [data, setData] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);


	const fetchHealth = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await checkHealth();
            // {console.log(response)}
			setData(response);
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
		} finally {
			setLoading(false);
		}
	}, []);

	return { data, loading, error, fetchHealth };
}
