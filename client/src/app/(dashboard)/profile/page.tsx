"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/api/auth.services";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/api/axiosClient";
import { API_PATHS } from "@/api/apiPaths";
import { logger } from "@/lib/logger";
import { useProfile } from "@/features/dashboard/hooks/useProfile";
import Image from "next/image";
import { Edit } from "lucide-react";

const profile_default = "https://placehold.co/400"

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const { profile, isLoading, isError } = useProfile();

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Failed to load profile</p>;

  logger("info", profile);

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
    <div className="w-full px-4 sm:px-6 md:px-10">
      <div className="max-w-[90rem]">
        {/* Navbar */}
        <div className="flex justify-between items-center py-8 ">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <Separator />

        {/* Profile Card */}
        <div className="py-6 flex flex-col gap-6">
          <h1 className="text-sm sm:text-lg text-primary/95">
            Welcome, {user?.name}
          </h1>

          <div className="border rounded-2xl p-8 grid grid-rows-1 sm:grid-cols-4 gap-6">
            {/* left : profile pic */}
            <div className="col-span-1 relative">
              <Image
                src={profile_default}
                width={400}
                height={400}
                alt="Profile Pic"
                className="border-2 rounded-full overflow-clip"
                unoptimized
              />

              <Button variant={`outline`} size={`icon`} className="absolute bottom-0 right-0 rounded-full">
                <Edit className="size-4" />
              </Button>
            </div>

            {/* right: profile details */}
            <div className="col-span-3">
              <p>Name: {profile?.fullName}</p>
              <p>Role: {profile?.role}</p>
              <p>Email: {profile?.email} </p>
              <p>Address: 
                <ul>
                  <li>Line 1: {profile?.address?.line1}</li>
                  <li>City: {profile?.address?.city}</li>
                  <li>State: {profile?.address?.state}</li>
                  <li>Pincode: {profile?.address?.pincode}</li>
                </ul>
              </p>
            </div>
          </div>
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
    </div>
  );
};

export default DashboardPage;
