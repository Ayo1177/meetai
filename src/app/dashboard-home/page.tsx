"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Page = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await authClient.getSession();
        
        if (session) {
          // User is authenticated, redirect to meetings
          router.push("/meetings");
        } else {
          // User is not authenticated, redirect to sign-in
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, redirect to sign-in
        router.push("/auth/sign-in");
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Page;