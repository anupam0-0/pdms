"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/api/auth.services";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user and redirect even if logout fails
      router.replace("/login");
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
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          You are successfully logged in to your dashboard.
        </p>
      </div>

      <div className="p-10">
        <Button variant={`default`} onClick={() => toast.info("Hello")}>
          Click Me
        </Button>
      </div>

      <div>
        <Link href="/drugs">Drugs</Link>
      </div>
    </div>
  );
};

export default DashboardPage;
