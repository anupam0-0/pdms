"use client";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, setUser, clearUser, isAuthenticated } = useAuthStore();
  return { user, setUser, clearUser, isAuthenticated };
}
