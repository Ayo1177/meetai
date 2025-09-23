"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Page = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await authClient.getSession();
        
        if (session) {
          // User is authenticated, redirect to meetings
          router.push("/meetings");
        } else {
          // User is not authenticated, show welcome page
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, show welcome page
        setIsChecking(false);
      } finally {
        setHasChecked(true);
      }
    };

    // Only check auth once when component mounts
    if (!hasChecked) {
      checkAuth();
    }
  }, [router, hasChecked]);

  // Show loading only briefly while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show welcome page for unauthenticated users
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MeetAI</h1>
          <p className="text-gray-600 mb-6">
            Your AI-powered meeting assistant for smarter, more productive meetings.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/auth/sign-in")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/auth/sign-up")}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;