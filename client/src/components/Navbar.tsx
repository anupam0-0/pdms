import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { logout } from "@/api/auth.services";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Heart, ShoppingBag, User } from "lucide-react";
import { logger } from "@/lib/logger";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      logger("error", error);
      // Still clear user and redirect even if logout fails
      // router.replace("/login");
    }
  };

  return (
    <div className="w-full border-b-2 mb-4 py-6 px-4 sm:px-6 md:px-10 ">
      <div className="max-w-[90rem] flex justify-between mx-auto ">
        <Link href="/" className="text-4xl font-bold text-primary/90">
          <span className="block md:hidden">PMS</span>
          <span className="md:block hidden">Pharmacy Management System</span>
        </Link>
        <div className="flex items-center gap-2 text-primary/90 text-xs  sm:text-lg">
          <Button
            className="text-base"
            variant={`ghost`}
            onClick={() => router.push("/profile")}
          >
            <User className="size-5" />
          </Button>
          {/* <Button variant={`ghost`} onClick={() => router.push("/wishlist")}>
            <Heart className="size-5" />
          </Button>
          <Button variant={`ghost`} onClick={() => router.push("/cart")}>
            <ShoppingBag className="size-5" />
          </Button> */}
          <Button
            className="ml-3 text-base font-medium"
            onClick={handleLogout}
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
