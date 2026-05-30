"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/utils";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on mount and redirect if not authenticated
    if (!authUtils.isAuthenticated()) {
      router.push("/login");
      return;
    }
  }, [router]);

  // If not authenticated, don't render children
  if (!authUtils.isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}