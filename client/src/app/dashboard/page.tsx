"use client";

import React from 'react';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { logout } from "@/api/authApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { user, clearUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user and redirect even if logout fails
      clearUser();
      router.push("/login");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || user?.email}!</h2>
        <p className="text-gray-600">You are successfully logged in to your dashboard.</p>
      </div>
    </div>
  );
};

export default DashboardPage;