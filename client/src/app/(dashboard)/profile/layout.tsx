"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoading, error, isAuthenticated } = useAuth();

  if (isLoading) return <div className="p-10 text-4xl">Loading...</div>;

  if (isAuthenticated && user && !error) {
    return <div>{children}</div>;
  } else {
    router.replace("/login");
    return <div className="p-10 text-4xl">redirecting...to login page</div>;
  }
}
