"use client";

import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { me } from "@/api/authApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated by calling the /me endpoint
        const response = await me();
        if (response?.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        // User is not authenticated, clear any stale data
        console.error('User Not Found! Please login')
        clearUser();
      }
    };

    initializeAuth();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
