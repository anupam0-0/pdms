"use client";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoading, error, isAuthenticated } = useAuth();
  if (isLoading) return <div className="p-10">loading...</div>;
  logger("log", user);
  if (user?.role !== "admin") router.push("/profile");
  else return <div>{children}</div>;
}
