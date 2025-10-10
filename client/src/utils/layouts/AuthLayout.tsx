"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface AuthLayoutProps {
    children: React.ReactNode;
  }

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated()) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Redirecting to dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            {children}
        </div>
    );
}
